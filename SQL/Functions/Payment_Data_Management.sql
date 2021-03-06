                   
ALTER FUNCTION [dbo].[fn_GetUpdatedTransactionDetail]      
(  
@OrderNumber NVARCHAR(50)      
)      
RETURNS NVARCHAR(MAX)      
AS      
     BEGIN      
            
         DECLARE @transactionDetail AS NVARCHAR(MAX), @stageActionsTranslationKeyId INT= 7, @saveactiontypeid INT= 1, @submitactiontypeid INT= 2, @serviceTranslationKeyId INT= 11, @englanguageid INT= 1, @arabiclanguageid INT= 2;      
         SET @transactionDetail =      
         (                SELECT DISTINCT                                    
                               dbo.fn_multiLingualName(SS.Id, @serviceTranslationKeyId) AS ServiceName,   
                               AA.ApplicationNumber AS ApplicationNumber,   
                               SSS.Name AS StageName,   
                               APT1.OrderNumber AS OrderNumber,   
                               APT1.URN AS URN,   
                               APT1.CreatedDateTime AS PaymentDate,   
                               APT1.TaxAmount AS TaxAmount,   
                               APT1.EDirhamFeesAmount AS EDirhamFeesAmount,   
                               APT1.TotalAmount AS TotalAmount,   
                        (  
                            SELECT APTD1.ServiceCode AS ServiceCode,   
                            (  
                                SELECT '[' +  
                                (  
                                    SELECT @englanguageid AS langId,   
                                           ServiceDescriptionInEnglish AS [value]  
                                    FROM service.ServiceCodes  
                                    WHERE ServiceCode = APTD1.ServiceCode FOR JSON PATH, WITHOUT_ARRAY_WRAPPER  
                                ) + ',' +  
                                (  
                                    SELECT @arabiclanguageid AS langId,   
                                           ServiceDescriptionInArabic AS [value]  
                                    FROM service.ServiceCodes  
                                    WHERE ServiceCode = APTD1.ServiceCode FOR JSON PATH, WITHOUT_ARRAY_WRAPPER  
                                ) + ']'  
                            ) AS ServiceCodeDescription,   
                                   APTD1.Quantity AS Quantity,   
                                   APTD1.Amount AS Amount  
                            FROM application.PaymentTransactionDetails APTD1  
                                 LEFT JOIN service.ServiceCodes SSC ON SSC.ServiceCode = APTD1.ServiceCode  
                            WHERE APTD1.OrderId = APT1.OrderId FOR JSON PATH  
                        ) AS Services,   
                               AAS.ApplicationId AS ApplicationId,   
                               (CASE  
                                    WHEN APT1.Paid IS NULL  
                                    THEN 'Pending'  
                                    WHEN APT1.Paid = 0  
                                    THEN 'Failed'  
                                    ELSE 'Paid'  
                                END) AS PaymentStatus  
                        FROM application.PaymentTransactions APT1  
                             INNER JOIN application.PaymentTransactionDetails APTD ON APTD.OrderId = APT1.OrderId  
                             INNER JOIN application.ApplicationStageActions App_Stg_Act ON App_Stg_Act.Id = APT1.ApplicationStageActionId  
                             INNER JOIN application.ApplicationStages AAS ON AAS.Id = App_Stg_Act.ApplicationStageId  
                             INNER JOIN application.Applications AA ON AA.Id = AAS.ApplicationId  
                             INNER JOIN service.Services SS ON SS.Id = AA.ServiceId  
                             INNER JOIN service.Stages SSS ON SSS.Id = AAS.StageId  
                        WHERE APT1.OrderNumber = @OrderNumber FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);      
         RETURN @transactionDetail;      
     END;