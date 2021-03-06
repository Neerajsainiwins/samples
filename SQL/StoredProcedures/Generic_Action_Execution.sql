
ALTER PROCEDURE [dbo].[sp_ExecuteAction]  @applicationId INT,     
                                          @stageActionId INT,     
                                          @userId        NVARCHAR(100),     
                                          @data          NVARCHAR(MAX),     
                                          @comments      NVARCHAR(MAX),     
                                          @creatorName   NVARCHAR(100),     
                                          @users         NVARCHAR(4000),
										  @currentApplicationStageId INT,
										  @lastApplicationStageActionId INT,
										  @languageId    INT    
AS    
    BEGIN    

        -- Get userid from sp_GetUserId function by passing user authenticated token                                            
        DECLARE  @uId INT, @assignedUserList NVARCHAR(MAX);    
        EXEC     @uId = sp_GetUserId     
				 @userId,     
				 @creatorName;    
    
        -- Declaration of stage, service, status, parentid, entityfield id's and main, child json variables                                            
        DECLARE @stageid AS INT, 
		        @serviceid AS INT, 
				@statusId AS INT, 
				@stagestatusid AS INT, 
				@parentId AS INT, 
				@entityFieldId AS INT, 
				@value AS NVARCHAR(1000), 
				@childrensJson AS NVARCHAR(MAX), 
				@applicationstageid AS INT, 
                @appStageActionId INT, 
				@attachmentActionTypeId INT, 
				@attachmentAppStageId INT, 
				@actiontypeid INT, 
				@TostageId INT, 
				@applicationstatusid INT, 
				@certificateId AS INT, 
				@paymentActionTypeId INT = 3 ;    
	
		-- Declare parameters payment url returned values
		DECLARE @orderNumber AS VARCHAR(50), @paymentMessage AS VARCHAR(50), @paymentServices AS NVARCHAR(500), @paymentStatus as VARCHAR(500), @applicationNumber nvarchar(50);

		--DECLARE @hTMLTemplate AS NVARCHAR(MAX), @css NVARCHAR(MAX), @createdcertificateid INT;
		DECLARE @certificateHTMLTemplate NVARCHAR(MAX), @certificateCss NVARCHAR(MAX), @certificateCreatedcertificateid INT
		
		DECLARE @status AS INT, @successMessage AS NVARCHAR(MAX), @errorMessage  AS NVARCHAR(MAX);
        -- Declaration of lookups              
        DECLARE @openstagestatusid AS INT= 1, @closestagestatusid AS INT= 2, @submitstageactiontypeid AS INT= 2, @rejectactiontypeid AS INT= 5, @returnactiontypeid AS INT= 6, @modificationstagestatusid AS INT= 5, @returnstagestatusid AS INT= 4, @rejectedstagestatusid AS INT= 3, @assigntouseractiontypeid AS INT= 8, @newstagestatusid AS INT, @silentSaveStatusActionId INT = 2, @saveActionType INT = 1;    
        SELECT	@actiontypeid = ActionTypeId,
				@applicationstatusid = (CASE    
                                            WHEN ActionTypeId = @rejectactiontypeid    
                                            THEN @rejectedstagestatusid    
                                            WHEN ActionTypeId = @returnactiontypeid    
                                            THEN @returnstagestatusid    
                                            ELSE @closestagestatusid    
                                        END),     
				@newstagestatusid =		(CASE    
											WHEN ActionTypeId = @returnactiontypeid    
											THEN @modificationstagestatusid    
											ELSE @openstagestatusid    
										END),
				@TostageId = ToStageID
        FROM service.StageActions    
        WHERE Id = @stageActionId;   
		
        SELECT @attachmentAppStageId = AppStageId,     
               @attachmentActionTypeId = ActionTypeId    
        FROM application.ActionAttachments    
        WHERE AppId = @applicationId;    
    
        -- Initialize values in declared variables                                            
        SELECT TOP 1 @applicationstageid = App_Stg.Id,     
                     @stageid = App_Stg.StageId,     
                     @serviceid = App.ServiceId,     
                     @statusId = App_Stg.StageStatusId,
					 @applicationNumber = App.ApplicationNumber
        FROM vw_ApplicationStagesOrderBy App_Stg    
             INNER JOIN application.Applications App ON App.Id = App_Stg.ApplicationId    
        WHERE App_Stg.ApplicationId = @applicationId; 
   
		PRINT 'Started sp_ExecuteAction'
		SET @certificateId =      
        (      
            SELECT dbo.fn_certificateExists(@stageActionId)      
        );   

		PRINT '@certificateId: ' + cast(@certificateId as varchar(100))

        BEGIN TRY    
			BEGIN TRAN;    
				IF(@statusId <> @closestagestatusid)    
                BEGIN 
				PRINT 'Add application stage action'
					-- Add data to application stage action table in respect to performed action..                                      
                    INSERT INTO	application.ApplicationStageActions    
                    ([ApplicationStageId],     
                     [StageActionId],     
                     [CreatedOn],     
                     [UserId],     
                     [Data],     
                     [Comments]    
                    )    
                    VALUES    
                    (    
						@applicationstageid,     
						@stageActionId,     
						GETDATE(),     
						@uId,     
						@data,     
						@comments    
                    );   

                    SET @appStageActionId = SCOPE_IDENTITY();
					PRINT  'sp_UpdateApplicationValues '+CAST(@stageActionId AS VARCHAR(10))+','''+@data+''','+CAST(@applicationId AS VARCHAR(10))+','+CAST(@currentApplicationStageId AS VARCHAR(10))+','+CAST(@appStageActionId AS VARCHAR(10))+''

					exec [dbo].[sp_UpdateApplicationValues] @stageActionId,@data,@applicationid,@currentApplicationStageId,@appStageActionId
					
					IF(@actiontypeid = @assigntouseractiontypeid)    
                        BEGIN   
						PRINT  'assignedusers' 
                            DECLARE @tempUser TABLE(UserId NVARCHAR(500));    
                            INSERT INTO @tempUser(UserId)    
                                   SELECT Item    
                                   FROM SplitString(@users, ',');    
                            INSERT INTO application.ActionAssignedUsers    
                            ([ApplicationStageActionId],     
                             [UserId]    
							)    
                            SELECT @appStageActionId,     
                                    AU.Id    
                            FROM @tempUser temp    
                                INNER JOIN application.Users AU ON AU.ExternalId = temp.UserId;    
                    END; 

                    IF(@stageid = @attachmentAppStageId    
                       AND @actiontypeid = @attachmentActionTypeId)    
                        BEGIN   
						PRINT  'ActionAttachments'
                            UPDATE application.ActionAttachments    
                              SET     
                                  AppStageActionId = @appStageActionId    
                            WHERE	AppStageId = @attachmentAppStageId    
							AND		ActionTypeId = @attachmentActionTypeId
							AND     AppStageActionId IS NULL;
                    END;    
					
							-- Check if action is payment then eexcute payment SP to fetch payment url with detail
					IF(@actiontypeid = @paymentActionTypeId)
						BEGIN
							print 'EXEC sp_GetApplicationPaymentDetail '+cast(@applicationId as varchar(1000))+',1,'''+@userid +''','+cast(@stageActionId as varchar(1000))+','''+@creatorName+''''

							EXEC sp_GetApplicationPaymentDetail @applicationId,@languageId,@userId,@stageActionId,@creatorName, @orderNumber OUTPUT, @paymentMessage OUTPUT, @paymentServices OUTPUT, @paymentStatus OUTPUT

							Select  @stageActionId AS Id,
							        @applicationstageid AS Applicationstageid, 
									@applicationNumber AS ApplicationNumber, 
									@orderNumber AS OrderNumber, 
									@paymentServices AS Services,
									@paymentStatus AS PaymentStatus, 
									@paymentMessage AS Message, 
									200 AS Status,     
									null AS ErrorMessage,  
									NULL AS CertificateHtml,       
									NULL AS CertificateCSS,      
									0 AS ApplicationCertificateId,      
									NULL AS ApplicationFieldData,
									NULL AS ApplicationUserList
						END  
                    ELSE
						BEGIN
							PRINT 'DECLARE @certificateHTMLTemplate nvarchar(max), @certificateCss nvarchar(max), @certificateCreatedcertificateid INT;'
							PRINT 'exec sp_CloseApplicationStage @certificateId='+isnull(cast(@certificateId as varchar(100)),'null')+', @applicationstageid='+cast(isnull(@applicationstageid,'') as varchar(100))+', @uId=17, @appStageActionId='+cast(isnull(@appStageActionId,'') as varchar(100))+',@toStageId='+isnull(cast(@toStageId as varchar(100)),'null')+',@stageid='+cast(isnull(@stageid,'') as varchar(100))+',@stageActionId='+cast(isnull(@stageActionId,'') as varchar(100))+',@newstagestatusid='+cast(isnull(@newstagestatusid,'') as varchar(100))+',@applicationId='+cast(isnull(@applicationId,'') as varchar(100))+', @certificateHTMLTemplate=NULL , @certificateCss =NULL, @certificateCreatedcertificateid =NULL'
							PRINT 'exec sp_GetApplicationAssignedUserList '+CAST(@applicationid AS Varchar(10))
						        exec sp_CloseApplicationStage     @certificateId,
																  @applicationstageid,
																  @uId,   
															      @appStageActionId,
															      @TostageId,
															      @stageid,
															      @stageActionId,
															      @newstagestatusid,
															      @applicationId,
																  @certificateHTMLTemplate OUTPUT,
															      @certificateCss OUTPUT,
															      @certificateCreatedcertificateid OUTPUT

								exec  sp_GetApplicationAssignedUserList @applicationid	, @assignedUserList OUTPUT 

								          			SELECT      @stageActionId AS Id,
																NULL AS Applicationstageid,
																NULL AS ApplicationNumber,
																NULL AS OrderNumber,
																NULL AS Services,
																NULL AS PaymentStatus,
																NULL AS Message
																,200 AS Status
																,'Success' AS SuccessMessage
																,@certificateHTMLTemplate AS CertificateHtml
																,@certificateCss AS CertificateCSS
																,@certificateCreatedcertificateid AS ApplicationCertificateId
																,JSON_QUERY(dbo.fn_GetCertificateApplicationFieldDetail(@applicationId, @appStageActionId)) AS ApplicationFieldData,
																CASE WHEN @actiontypeid NOT IN ( @silentSaveStatusActionId, @saveActionType)
																THEN 
																@assignedUserList
																ELSE NULL
																END 
																AS ApplicationUserList


					END		
				END   

            COMMIT TRANSACTION;    
        END TRY    
        BEGIN CATCH    
            ROLLBACK TRANSACTION;    
			SELECT	@stageActionId AS Id, 
					NULL AS Applicationstageid,
					NULL AS ApplicationNumber,
					NULL AS OrderNumber,
					NULL AS Services,
					NULL AS PaymentStatus,
					NULL AS Message,
					500 AS Status,     
					ERROR_MESSAGE() AS ErrorMessage,  
					NULL AS CertificateHtml,       
					NULL AS CertificateCSS,      
					0 AS ApplicationCertificateId,      
					NULL AS ApplicationFieldData,
					NULL AS ApplicationUserList;  
        END CATCH;    
    END;