
ALTER FUNCTION [dbo].[fn_formFieldsValues]
(
@formId INT,
@applicationid INT,
@ChildForm bit,
@isOwner bit
)
RETURNS NVARCHAR(MAX)
AS
BEGIN

	DECLARE @FormSectionFields AS NVARCHAR(MAX), 
	        @fieldTranslationKeyId INT= 1, 
			@instructionTranslationKeyId INT= 4, 
			@formSectionFieldConstraintTranslationKeyId INT= 10,
			@relationTypeFieldTypeId INT= 7, 
			@permissionData NVARCHAR(MAX), 
			@serviceId INT,
			@statusEntityFieldId INT = 138,
			@attachmentTemplateNameTranslationKeyId INT = 24;

	Select @serviceId = ServiceId From application.Applications Where Id = @applicationid

	DECLARE @fieldsTable TABLE
	(
		formSectionFieldValue NVARCHAR(4000),
		itemIndex INT,
		entityFieldId INT
	)
	
	INSERT INTO     @fieldsTable
		SELECT          
			(
				CASE
				WHEN App_Fld_Val.Value IS NULL
				THEN ''
				ELSE App_Fld_Val.Value
				END
			) AS formSectionFieldValue,
			(CASE
				WHEN App_Fld_Val.ItemIndex IS NULL
				THEN ''
				ELSE App_Fld_Val.ItemIndex
				END) AS itemIndex, 
			Ent_Fld.Id AS entityFieldId
			FROM		service.FormSections Frm_Sect
			INNER JOIN	service.FormSectionFields Frm_Sect_Fld ON Frm_Sect.Id = Frm_Sect_Fld.FormSectionId
			INNER JOIN	service.EntityFields Ent_Fld ON Ent_Fld.Id = Frm_Sect_Fld.EntityFieldId
			INNER JOIN	application.ApplicationFieldValues App_Fld_Val ON App_Fld_Val.EntityFieldId = Frm_Sect_Fld.EntityFieldId AND App_Fld_Val.ApplicationId = @applicationid
			WHERE		Frm_Sect.FormId = @formId
			
SET @permissionData = (Select formSectionFieldValue ,itemIndex ,entityFieldId From @fieldsTable FOR JSON PATH)

		IF(@ChildForm = 1)
			BEGIN
				SET @FormSectionFields =
				(
					SELECT 
							ItemIndex,
							(Select 
								formSectionFieldValue,
								itemIndex,
								entityFieldId
							from @fieldsTable 
							Where itemIndex = FieldsTable.itemIndex 
							FOR JSON PATH) Fields,
							(custom.fn_DeleteChildDetailPermission(@serviceId, ItemIndex, @permissionData, @isOwner))AS canDelete,
							(custom.fn_EditChildDetailPermission(@serviceId, ItemIndex, @permissionData, @isOwner)) AS canEdit
					FROM @fieldsTable FieldsTable
					GROUP BY ItemIndex
					ORDER BY ItemIndex
					FOR JSON PATH		
				)
			END
			ELSE
			BEGIN
				SET @FormSectionFields =( 
					Select
							formSectionFieldValue,
							itemIndex,
							entityFieldId
					from @fieldsTable 
					FOR JSON PATH
				);
			END
	RETURN @FormSectionFields
END;