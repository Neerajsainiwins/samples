   
ALTER PROCEDURE [dbo].[sp_GetApplicationActivityLogs] @ApplicationId INT,   
                                                      @UserId        NVARCHAR(100),   
                                                      @creatorName   NVARCHAR(100)  
AS  
    BEGIN  
        DECLARE @uId INT;  
        EXEC @uId = sp_GetUserId   
             @UserId,   
             @creatorName;  
        DECLARE @serviceTranslationKeyId INT= 11, @stageTranslationKeyId INT= 12, @statusesTranslationKeyId INT= 13, @stageActionsTranslationKeyId INT= 7, @certificateTranslationKeyId INT= 20, @silentSaveActionType INT = 2;  
        DECLARE @ActivityLogs NVARCHAR(MAX);  
        SET @ActivityLogs =  
        (  
            SELECT DISTINCT   
                   App.Id AS ApplicationId,   
                   App.ApplicationNumber AS ApplicationNumber,   
                   Svc.Name AS ServiceName,   
                   JSON_QUERY(dbo.fn_multiLingualName(Svc.Id, @serviceTranslationKeyId)) AS ServicesName,   
            (  
                SELECT App_Stg.StageId,   
                       Stg.Name AS StageName,   
                       Stg.StageTypeId,   
                       JSON_QUERY(dbo.fn_multiLingualName(Stg.Id, @stageTranslationKeyId)) AS StagesName,
					   Stg_Status.Id AS StageStatusId,
                       Stg_Status.Name AS StatusName,   
                       JSON_QUERY(dbo.fn_multiLingualName(Stg_Status.Id, @statusesTranslationKeyId)) AS StatusesName,   
                (  
                    SELECT DISTINCT   
                           App_Stg_Act.Id,   
                           App_Stg_Act.CreatedOn AS PerformedDate,   
                           Act_User.UserName AS CreatedBy,  
						   App_Stg_Act.UserId AS CreatorId,   
                           Stg_Act.Name AS ActionName,   
                           JSON_QUERY(dbo.fn_multiLingualName(Stg_Act.Id, @stageActionsTranslationKeyId)) AS StagesActionName,   
                           Act_Typ.Id AS ActionTypeId,
						   Act_Typ.Name AS ActionTypeName,   
                           App_Stg_Act.Comments,   
                    (  
                        SELECT Act_Attach.Id,   
                               Act_Attach.Extension,   
                               Act_Attach.Size,   
                               Act_Attach.FileName  
                        FROM application.ActionAttachments Act_Attach  
                        WHERE Act_Attach.AppId = @ApplicationId  
                              AND Act_Attach.AppStageActionId = App_Stg_Act.Id  
                              AND Act_Attach.IsDeleted = 0 FOR JSON PATH  
                    ) AS ActionAttachment,   
                    (  
                        SELECT Txn.OrderNumber,   
                               Txn.OrderId,   
                               Txn.CreatedDateTime,  
                               CASE  
                                   WHEN Txn.Paid IS NULL  
                                   THEN 'Pending'  
                                   WHEN Txn.Paid = 0  
                                   THEN 'Failed'  
                                   ELSE 'Paid'  
                               END PaymentStatus  
                        FROM application.PaymentTransactions Txn  
                        WHERE Txn.ApplicationStageActionId = App_Stg_Act.Id  
                        ORDER BY Txn.CreatedDateTime DESC FOR JSON PATH  
                    ) AS TransactionDetail,   
                    (  
                        SELECT Assign_Users.ApplicationStageActionId,   
                               Assign_Users.UserId,   
                               Users.UserName  
                        FROM application.ActionAssignedUsers Assign_Users  
                             INNER JOIN application.Users Users ON Assign_Users.UserId = Users.Id  
                        WHERE Assign_Users.ApplicationStageActionId = App_Stg_Act.Id FOR JSON PATH  
                    ) AS AssignedUsers,   
                    (  
                        SELECT App_Cert.ApplicationId,   
								App_Cert.CertificateId,
								App_Cert.Id AS ApplicationcertificateId,   
                               App_Cert.CertificateNumber,   
                               Cer.CertificateName,   
                               JSON_QUERY(dbo.fn_multiLingualName(Cer.Id, @certificateTranslationKeyId)) AS CertifcateTranslatedName  
                        FROM application.ApplicationCertificates App_Cert  
                             INNER JOIN service.Certificates Cer ON Cer.Id = App_Cert.CertificateId  
                        WHERE App_Cert.ApplicationStageActionId = App_Stg_Act.Id FOR JSON PATH  
                    ) AS ApplicationCertificates  
                    FROM application.ApplicationStageActions App_Stg_Act  
                         INNER JOIN service.StageActions Stg_Act ON Stg_Act.Id = App_Stg_Act.StageActionId  
                         INNER JOIN lookups.ActionTypes Act_Typ ON Act_Typ.Id = Stg_Act.ActionTypeId  
                         INNER JOIN application.Users Act_User ON Act_User.Id = App_Stg_Act.UserId  
                    WHERE App_Stg_Act.ApplicationStageId = App_Stg.Id AND Stg_Act.ActionTypeId != @silentSaveActionType
					--WHERE App_Stg_Act.Id =  App_Stg.LastAppActionId  
                    ORDER BY App_Stg_Act.CreatedOn ASC FOR JSON PATH  
                ) AS Actions  
                FROM service.Stages Stg  
                     INNER JOIN application.ApplicationStages App_Stg ON App_Stg.StageId = Stg.Id  
                     INNER JOIN lookups.StageStatuses Stg_Status ON Stg_Status.Id = App_Stg.StageStatusId  
                WHERE Stg.ServiceId = App.ServiceId  
                      AND App_Stg.ApplicationId = App_Stg_Top.ApplicationId FOR JSON PATH  
            ) AS Stages  
            FROM application.ApplicationStages App_Stg_Top  
                 INNER JOIN application.Applications App ON App.Id = App_Stg_Top.ApplicationId  
                 INNER JOIN service.Services Svc ON Svc.Id = App.ServiceId  
            WHERE App_Stg_Top.ApplicationId = @ApplicationId FOR JSON PATH  
        );  
        SELECT @ActivityLogs AS ActivityLogs;  
    END;