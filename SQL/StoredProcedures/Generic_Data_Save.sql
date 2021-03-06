
ALTER PROCEDURE [dbo].[sp_UpdateApplicationValues]
	@stageActionId		INT,    
    @data			NVARCHAR(MAX),
	@applicationid	INT,
	@currentApplicationStageId INT,
	@appStageActionId INT
AS
BEGIN
	DECLARE @closestagestatusid AS INT= 2,@entityFieldId INT, @value NVARCHAR(500), @childrensJson NVARCHAR(max),
	@statusId	INT=1, @parentId INT;
	PRINT 'sp_UpdateApplicationValues started'
	-- Initialize values in declared variables                                            
    SELECT TOP 1 @statusId = App_Stg.StageStatusId    
    FROM vw_ApplicationStagesOrderBy App_Stg    
            INNER JOIN application.Applications App ON App.Id = App_Stg.ApplicationId    
    WHERE App_Stg.ApplicationId = @applicationId; 


	DECLARE @ApplicationValues Table
	(
		entityFieldId INT,     
		value         NVARCHAR(1000),     
		childrens     NVARCHAR(MAX)    
    ); 

	IF(@statusId <> @closestagestatusid)    
	BEGIN    
		BEGIN TRY    
			BEGIN TRAN;   
				PRINT 'Updating application values'
		
				INSERT INTO @ApplicationValues    
				(
					entityFieldId,     
					value,     
					childrens    
				)    
				SELECT	entityFieldId,     
						value,     
						childrens    
				FROM	OPENJSON(@data) WITH(entityFieldId INT, value NVARCHAR(1000), childrens NVARCHAR(MAX) AS JSON); 
				
   
				-- Add update table Application Field Values data                            
				MERGE application.ApplicationFieldValues AS TARGET    
				USING @ApplicationValues AS SOURCE    
				ON
				(
					TARGET.EntityFieldId = SOURCE.entityFieldId    
				AND TARGET.ApplicationId = @applicationid
				)    
				WHEN	MATCHED    
				AND		TARGET.Value <> SOURCE.value    
				THEN UPDATE SET 
						TARGET.Value = SOURCE.value,
						TARGET.AppActionId = @appStageActionId,
						TARGET.ModifiedDate = getdate()
                    
				WHEN	NOT MATCHED BY TARGET 
				THEN INSERT
				(
					[ApplicationId],     
					[EntityFieldId],     
					[Value],     
					[ParentId],     
					[ItemIndex],
					[AppActionId],
					[ModifiedDate]
				)    
				VALUES    
				(
					@applicationId,     
					entityFieldId,     
					value,     
					NULL,     
					0,
					@appStageActionId,
					getdate()
				);
				
				PRINT 'Cursor for children'
				DECLARE reference_form_cursor CURSOR READ_ONLY    
				FOR SELECT entityFieldId,     
							value,     
							childrens    
					FROM @ApplicationValues    
					WHERE childrens IS NOT NULL;    
    
				--OPEN CURSOR.                                                  
				OPEN reference_form_cursor;    
    
				--FETCH THE RECORD INTO THE VARIABLES.                                                  
				FETCH NEXT FROM reference_form_cursor INTO @entityFieldId, @value, @childrensJson;    
    
				--LOOP UNTIL RECORDS ARE AVAILABLE.                                                 
				WHILE @@FETCH_STATUS = 0    
				BEGIN
					SET @parentId = (
						SELECT Id 
						from	application.ApplicationFieldValues 
						where	ApplicationId = @applicationId
						AND		EntityFieldId = @entityFieldId
					);
						
					DECLARE @ChildApplicationValues TABLE    
					(
						[EntityFieldId] INT,     
						[Value]         NVARCHAR(1000),     
						[ParentId]      INT,     
						[itemIndex]     INT    
					); 
					INSERT INTO @ChildApplicationValues    
					(	[EntityFieldId],     
						[Value],     
						[ParentId],     
						[itemIndex]  
					)    
					SELECT	entityFieldId,     
							value,     
							@parentId,     
							itemIndex    
					FROM OPENJSON(@childrensJson) WITH(entityFieldId INT, value NVARCHAR(500), itemIndex INT);    
				
					MERGE application.ApplicationFieldValues AS TARGET    
					USING @ChildApplicationValues AS SOURCE    
					ON
					(
						TARGET.EntityFieldId = SOURCE.entityFieldId    
					AND TARGET.ApplicationId = @applicationId
					AND TARGET.ItemIndex = SOURCE.itemIndex
					AND TARGET.ParentId = SOURCE.ParentId
					)    
					WHEN	MATCHED     
					AND		TARGET.Value <> SOURCE.value    
					THEN UPDATE SET 
						TARGET.Value = SOURCE.value,
						TARGET.AppActionId = @appStageActionId,
						TARGET.ModifiedDate = getdate()   
                    
					WHEN	NOT MATCHED BY TARGET 
					THEN INSERT
					(
						[ApplicationId],     
						[EntityFieldId],     
						[Value],     
						[ParentId],     
						[ItemIndex],
						[AppActionId],
						[ModifiedDate]  
					)    
					VALUES    
					(
						@applicationId,     
						entityFieldId,     
						[Value],     
						@parentId,     
						itemIndex,
						@appStageActionId,
						getdate()   
					)
					;

					DELETE FROM application.ApplicationFieldValues 
					WHERE	ApplicationId = @applicationId
					AND		ParentId = @parentId
					AND		ItemIndex NOT IN (SELECT itemIndex from @ChildApplicationValues)
                            
					FETCH NEXT FROM reference_form_cursor INTO @entityFieldId, @value, @childrensJson;    
				END;    
    
				--CLOSE THE CURSOR.                                                  
				CLOSE reference_form_cursor;    
				DEALLOCATE reference_form_cursor;   
			PRINT 'sp_UpdateApplicationValues ended'
			--SET @successMessage = 'Success';
			--SET @status = 200;
			--	SELECT @status,     
			--			@successMessage,
			--			@errorMessage;  

            COMMIT TRANSACTION;    
        END TRY    
        BEGIN CATCH    
            PRINT 'sp_UpdateApplicationValues error'
			ROLLBACK TRANSACTION; 
			SELECT	
				'500',
				ERROR_MESSAGE(); 
        END CATCH;    
	END
END