
ALTER FUNCTION [dbo].[fn_formSectionFields]
(
@Id INT,
@applicationid INT,
@ChildForm BIT,
@formsectionfieldid INT,
@isOwner bit
)
RETURNS NVARCHAR(MAX)
AS
BEGIN

	DECLARE @FormSectionFields AS NVARCHAR(MAX), 
	        @fieldTranslationKeyId INT= 1, 
			@instructionTranslationKeyId INT= 4, 
			@formSectionFieldConstraintTranslationKeyId INT= 10,
			@formid INT, 
			@relationTypeFieldTypeId INT= 7, 
			@permissionData NVARCHAR(MAX), 
			@serviceId INT,
			@statusEntityFieldId INT = 138,
			@attachmentTemplateNameTranslationKeyId INT = 24,
			@childTranslationKeyId INT = 35,
			@parentTranslationKeyId INT = 34;

	SELECT @formid = FormId FROM service.FormSections WHERE Id = @Id;
	Select @serviceId = ServiceId From application.Applications Where Id = @applicationid

	DECLARE @fieldsTable TABLE
	(
		formSectionFieldValue NVARCHAR(4000),
		itemIndex INT,
		entityFieldId INT,
		Settings NVARCHAR(4000),
		formSectionFieldNameKey NVARCHAR(1000),
		entityRelationships NVARCHAR(4000),
		instructions NVARCHAR(4000),
		relationType NVARCHAR(4000),
		relationShipName NVARCHAR(4000),
		relationShipNameTranslation NVARCHAR(4000),
		formSectionFieldName NVARCHAR(max),
		formSectionFieldid INT,
		formSectionFieldOrder INT,
		constraints NVARCHAR(4000),
		formSectionFieldSettings NVARCHAR(4000),
		fieldModeId INT,
		showOnMainForm NVARCHAR(100),
		fieldTypeId INT,
		formSectionFieldTypeName NVARCHAR(4000),
		orderNumber INT,
		Width INT,
		fieldTemplates NVARCHAR(MAX)
	)
	
	INSERT INTO     @fieldsTable
		SELECT          
			(
				CASE
				WHEN LTRIM(RTRIM(App_Fld_Val.Value)) = '' OR App_Fld_Val.Value IS NULL
				THEN Frm_Sect_Fld.DefaultValue
				ELSE App_Fld_Val.Value
				END
			) AS formSectionFieldValue,
			(CASE
				WHEN App_Fld_Val.ItemIndex IS NULL
				THEN ''
				ELSE App_Fld_Val.ItemIndex
				END) AS itemIndex, 
			Ent_Fld.Id AS entityFieldId,
			Ent_Fld.Settings,
			Ent_Fld.Name AS formSectionFieldNameKey,
			JSON_QUERY(dbo.fn_entityRelationships(Ent_Fld.Id)) AS entityRelationships,
			JSON_QUERY(dbo.fn_multiLingualName(Ent_Fld.Id, @instructionTranslationKeyId)) AS instructions,
				(CASE
				WHEN Ent_Fld.FieldTypeId = @relationTypeFieldTypeId
				THEN(dbo.fn_FormFieldEntityExist(@formid, Ent_Fld.Id))
				ELSE NULL
				END) AS relationType,
			(CASE 
			WHEN Ent_Fld.FieldTypeId = @relationTypeFieldTypeId
			THEN	
			(CASE WHEN (SELECT dbo.fn_FormFieldEntityExist(@formid, Ent_Fld.Id)) = 'Multiple' THEN Ent_Rel.ChildRelationName ELSE Ent_Rel.ParentRelationName END)
			ELSE 
			NULL	
			END)	AS relationShipName,
			(CASE 
			WHEN Ent_Fld.FieldTypeId = @relationTypeFieldTypeId
			THEN	
			(CASE WHEN (SELECT dbo.fn_FormFieldEntityExist(@formid, Ent_Fld.Id)) = 'Multiple' THEN JSON_QUERY(dbo.fn_multiLingualName(Ent_Rel.Id, @childTranslationKeyId)) ELSE JSON_QUERY(dbo.fn_multiLingualName(Ent_Rel.Id, @parentTranslationKeyId)) END)
			ELSE 
			NULL	
			END)	AS relationShipNameTranslation,
			JSON_QUERY(dbo.fn_multiLingualName(Ent_Fld.Id, @fieldTranslationKeyId)) AS formSectionFieldName,
			Frm_Sect_Fld.Id AS formSectionFieldid,
			Frm_Sect_Fld.OrderNumber AS formSectionFieldOrder,
			JSON_QUERY(custom.fn_formSectionFieldConstraints(Frm_Sect_Fld.Id, @applicationid, Ent_Fld.Id, @isOwner)) AS constraints,
			Frm_Sect_Fld.Settings AS formSectionFieldSettings,
			Frm_Sect_Fld.ModeId AS fieldModeId,
				CASE WHEN ISNULL(Frm_Sect_Fld.ShowOnMainForm, 0) = 0
				THEN 'Hide'
				ELSE 'Show'
				END AS showOnMainForm ,
			Fld_Typ.Id AS fieldTypeId,
			Fld_Typ.Name AS formSectionFieldTypeName,
			Frm_Sect_Fld.OrderNumber,
			Frm_Sect_Fld.Width AS Width,
			JSON_QUERY(dbo.fn_AttachmentsTemplatesByFormSectionFieldId(Frm_Sect_Fld.Id)) AS fieldTemplates
			FROM service.FormSectionFields Frm_Sect_Fld
			INNER JOIN service.EntityFields Ent_Fld ON Ent_Fld.Id = Frm_Sect_Fld.EntityFieldId
			INNER JOIN lookups.FieldTypes Fld_Typ ON Fld_Typ.Id = Ent_Fld.FieldTypeId
			LEFT OUTER JOIN service.EntityRelationships Ent_Rel ON Ent_Rel.EntityFieldId = Ent_Fld.Id
			LEFT OUTER JOIN application.ApplicationFieldValues App_Fld_Val ON App_Fld_Val.EntityFieldId = Frm_Sect_Fld.EntityFieldId AND App_Fld_Val.ApplicationId = @applicationid and @ChildForm = 0
			LEFT OUTER JOIN service.FormSectionFields Frm_Sect_Fld_Parent on Frm_Sect_Fld_Parent.Id = Frm_Sect_Fld.FormSectionParentId
			WHERE
			(
				(
					@ChildForm = 1 AND 
					(	
						Frm_Sect_Fld.FormSectionParentId = @formsectionfieldid
					AND 
						Frm_Sect_Fld.FormSectionParentId IS NOT NULL 
					)
					AND Frm_Sect_Fld_Parent.FormId IS NULL
				)
				OR
				(	@ChildForm = 0 AND (Frm_Sect_Fld.FormSectionId = @Id)
				)
			)

		IF(@ChildForm = 1)
			BEGIN
				SET @FormSectionFields =
				(
					Select 
						entityFieldId,
						Settings,
						formSectionFieldNameKey,
						json_query(entityRelationships) AS entityRelationships,
						instructions,
						relationType,
						relationShipName,
						relationShipNameTranslation,
						formSectionFieldName,
						formSectionFieldid,
						formSectionFieldOrder,
						json_query(constraints) AS constraints,
						formSectionFieldSettings,
						fieldModeId,
						showOnMainForm,
						fieldTypeId,
						formSectionFieldTypeName,
						Width,
						json_query(fieldTemplates) AS fieldTemplates,
						(custom.fn_AddRelationPermission(@serviceId, ItemIndex, @permissionData, @isOwner))AS canAdd
					from @fieldsTable 
					Order by orderNumber
					FOR JSON PATH
				)
			END
			ELSE
			BEGIN
				SET @FormSectionFields =( 
					Select
							ISNULL(formSectionFieldValue, '') AS formSectionFieldValue,
							itemIndex,
							entityFieldId,
							Settings,
							formSectionFieldNameKey,
							json_query(entityRelationships) AS entityRelationships,
							instructions,
							relationType,
							relationShipName,
							relationShipNameTranslation,
							formSectionFieldName,
							formSectionFieldid,
							formSectionFieldOrder,
							json_query(constraints) AS constraints,
							formSectionFieldSettings,
							fieldModeId,
							showOnMainForm,
							fieldTypeId,
							formSectionFieldTypeName,
							Width,
							json_query(fieldTemplates) AS fieldTemplates,
							(custom.fn_AddRelationPermission(@serviceId, ItemIndex, @permissionData, @isOwner))AS canAdd
					from @fieldsTable 
					Order by orderNumber
					FOR JSON PATH
				);
			END
	RETURN @FormSectionFields
END;