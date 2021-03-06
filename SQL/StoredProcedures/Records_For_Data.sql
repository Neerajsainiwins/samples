
ALTER PROCEDURE [dbo].[sp_UpdateEntityRecords]  
	@applicationid	INT

AS
BEGIN
	DECLARE @closestagestatusid AS INT= 2,
	        @entityFieldId INT,
			@value NVARCHAR(500), 
			@childrensJson NVARCHAR(max),
			@statusId	INT=1, 
			@parentId INT, 
			@recordId INT, 
			@entityId INT;

	PRINT 'sp_UpdateEntityRecords: Updateappvalues'
	-- Initialize values in declared variables
	
    SELECT 
	     @statusId = App_Stg.StageStatusId   
    FROM application.Applications App
		INNER JOIN service.Services Ser ON App.ServiceId = Ser.Id
		INNER JOIN application.ApplicationStages App_Stg ON App.CurrentApplicationStageId = App_Stg.Id    
    WHERE App.Id = @applicationId; 

	

	Select TOP 1 @entityId = EntityId From service.EntityFields Where Id IN (Select entityFieldId from application.ApplicationFieldValues Where ApplicationId = @applicationId AND ItemIndex = 0)
	Select @recordId = RecordId From application.ApplicationRecords Where AppId = @applicationid

	PRINT 'sp_UpdateEntityRecords: EntityId: ' + isnull(cast(@entityId as varchar(100)),'')

	--IF(@statusId = @closestagestatusid)    
	--BEGIN    
		BEGIN TRY    
			BEGIN TRAN;  
				IF(@recordId IS NULL)
				BEGIN
					PRINT 'sp_UpdateEntityRecords: Insert Records'
					
					INSERT INTO data.Records
					(
							EntityId,
							OwnerId,
							CreatedDate,
							CreatedBy,
							ModifiedDate,
							ModifiedBy
					)
					Select
							@entityId,
							CreatorId,
							GETDATE(),
							CreatorId,
							GETDATE(),
							CreatorId
					From application.Applications Where Id = @applicationid

					SET @recordId = SCOPE_IDENTITY();

					INSERT INTO application.ApplicationRecords
					(
							AppId,
							RecordId
					)
					VALUES
					(
							@applicationid,
							@recordId
					)
				END

				PRINT 'sp_UpdateEntityRecords: RecordId: ' + isnull(cast(@recordId as varchar(100)),'')
				
				Merge	data.RecordValues as target
				using	application.ApplicationFieldValues  as source
				on
						target.RecordId=@recordId AND target.EntityFieIdId = source.EntityFieldId AND target.ItemIndex = source.ItemIndex AND Source.ApplicationId = @applicationId
				When matched 
				Then
					update 
					set target.value=source.value
				When not matched by Target AND Source.ApplicationId = @applicationId AND Source.ItemIndex = 0 Then
					INSERT (RecordId, EntityFieIdId, ItemIndex, ParentId, Value) VALUES (@recordId, EntityFieldId, ItemIndex, NULL, Value);
				
				INSERT INTO data.RecordValues (RecordId, EntityFieIdId, ItemIndex, ParentId, Value)
					SELECT	@recordId, EntityFieldId, App_Val.ItemIndex, 
							(
								SELECT	Id FROM data.RecordValues
								WHERE	RecordId = @recordId 
								AND		EntityFieIdId = 
										(
											SELECT	EntityFieldId From application.ApplicationFieldValues
											WHERE	ID = App_Val.ParentId
										)
								AND		ItemIndex = 0
							) ParentId
							, App_Val.Value
					FROM		application.applicationFieldValues App_Val
					LEFT JOIN	data.RecordValues Rec_Val ON Rec_Val.RecordId=@recordId AND Rec_Val.EntityFieIdId = App_Val.EntityFieldId AND Rec_Val.ItemIndex = App_Val.ItemIndex
					WHERE		App_Val.ApplicationId = @applicationId AND App_Val.ItemIndex > 0 AND Rec_Val.Id IS NULL
            COMMIT TRANSACTION;    
        END TRY    
        BEGIN CATCH    
            ROLLBACK TRANSACTION; 
			SELECT	500 AS Status,     
				ERROR_MESSAGE() AS ErrorMessage;  
        END CATCH;    
	--END
END