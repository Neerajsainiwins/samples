
ALTER PROCEDURE [dbo].[sp_GetUserApplicationCertificateCategories]     
	@userId NVARCHAR(100),    
	@creatorName   NVARCHAR(100),   
	@start AS       DATETIME, 
	@end AS         DATETIME, 
	@search AS      VARCHAR(100)  = NULL, 
	@mode nvarchar(50),  
	@role AS NVARCHAR(100),
	@assignedUsers AS     NVARCHAR(100)
             
AS        
BEGIN        
 DECLARE @serviceTranslationKeyId INT = 11,  @certificateTranslationKeyId INT = 20;        
    
 DECLARE @uId int;    
    
 EXEC @uId = sp_GetUserId  @userId,@creatorName;      
    
 DECLARE @Statistics TABLE(ServiceId int, CertificateId int, CertificateCount int)      
    
 IF @mode='MyCertificates'    
 INSERT INTO @Statistics     
 SELECT * FROM dbo.fn_MyCertificateCategories(@uId,@start,@end,@search);    
    
 IF @mode='OtherCertificates'    
 INSERT INTO @Statistics     
 SELECT * FROM dbo.fn_OtherCertificateCategories(@uId, @role,@start,@end,@search) AS OtherCertificates;     
  
 DECLARE @certificateCategories NVARCHAR(MAX);        
 SET @certificateCategories =        
 (      
 SELECT * FROM    
 (    
 SELECT Svc.Id AS serviceId,         
  Svc.name,         
  dbo.fn_multiLingualName(Svc.Id, @serviceTranslationKeyId) AS serviceName,  
  (       
    SELECT      
     dbo.fn_multiLingualName(CertificateId, @certificateTranslationKeyId) AS certificateTranslations,    
     CertificateCount    
    From @Statistics
	Where ServiceId = Svc.Id     
    FOR JSON PATH        
   ) AS certificateDetail    
          
 FROM service.Services Svc      
 ) Svc    
 WHERE certificateDetail is not null     
 FOR JSON PATH        
 );        
    
      
 SELECT '200' AS STATUS, @certificateCategories AS CertificateCategories;     
    END;