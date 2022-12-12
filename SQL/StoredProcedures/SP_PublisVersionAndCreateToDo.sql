CREATE PROCEDURE [dbo].[usp_PublishCCOComprehensiveAssessmentVersion] @compAssessmentId INT,                 
@documentversionid INT,                              
@reportedby INT,                            
@companyId INT ,                          
@customerCode varchar(100)                             
AS                              
BEGIN                              
IF(ISNULL(@compAssessmentId, -1) > 1                              
AND ISNULL(@documentversionid, -1) > 1)                              
BEGIN                              
UPDATE CCO_CompAssessmentVersioning                              
SET                              
DocumentStatus =                              
(                              
SELECT UDID                              
FROM s_UserDefinedOptions AS udo                              
LEFT JOIN s_UserDefinedCategories AS udc ON udo.UDCategoryID = udc.UDCategoryID                              
WHERE udo.UDDescription = 'Published'                              
),                              
VersionDate = GETDATE(),                              
LastModifiedBy = @reportedby,                              
LastModifiedOn = GETDATE()                              
WHERE CompAssessmentVersioningId = @documentversionid;                              
END;                              
SELECT                              
CA.ClientId,                              
CA.CompAssessmentVersioningId,                              
CA.CompAssessmentId,                              
CAV.DocumentVersion,                              
CAV.DocumentStatus AS DocumentStatusId,                              
udo.UDDescription AS DocumentStatus,                              
CAV.VersionDate                              
FROM CCO_CompAssessment AS CA                              
INNER JOIN CCO_CompAssessmentVersioning AS CAV ON CA.CompAssessmentVersioningId = CAV.CompAssessmentVersioningId                              
INNER JOIN s_UserDefinedOptions AS udo ON CAV.DocumentStatus = udo.UDID                              
WHERE CA.CompAssessmentVersioningId = @documentversionid;                              
                            
 --declare @customerCodetext varchar(100)='';                          
  --SELECT @customerCodetext=CASE WHEN @customerCode ='TCC' OR  @customerCode ='TCC_QA' OR  @customerCode ='TCC_UAT' THEN 'TCC' END                          
  IF  @customerCode <>'TCC' And @customerCode <>'TCC_QA' AND   @customerCode <>'TCC_UAT'                      
                      
  BEGIN                          
                          
 declare @LivingSituation int, @RepresentationStatus INT, @ClientId INT ;                            
                          
 DECLARE @nextThisDate DATE = getdate();                                                  
   SELECT @nextThisDate=DATEADD(day, 5, getdate() ) ;                            
select  @LivingSituation=LivingSituation,@RepresentationStatus=RepresentationStatus ,@ClientId =ClientId from CCO_CompAssessment where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                            
                            
if(@LivingSituation in(2) OR @LivingSituation in (4) or @LivingSituation in (5))                            
BEGIN                                                    
exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby,'Document Residential Person Centered Planning Information',null;                                                     
END;                            
if(@RepresentationStatus in (3) )                            
BEGIN                                                    
exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby,'Provide CAB representation options to member and/or family',@nextThisDate;                                                     
END;                            
                            
                            
---CCO_CircleofSupportSection-----                            
    
DECLARE  @tempCircleOfSupport TABLE(                    
ChangeToNewProvider INT)  ;                    
DECLARE @ChangeToNewProvider INT,@ChangeToNewProviderLength INT =0;                    
INSERT INTO @tempCircleOfSupport                    
(ChangeToNewProvider)                    
SELECT ChangeToNewProvider  from CCO_CircleofSupport where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                    
select @ChangeToNewProviderLength= Count(ChangeToNewProvider) from @tempCircleOfSupport where ChangeToNewProvider =1                    
                    
DECLARE @Counter INT                     
SET @Counter=1                          
WHILE ( @Counter <= @ChangeToNewProviderLength)                          
BEGIN                                                    
 exec usp_InsertModifyCCO_ToDo @companyId,@clientId,@reportedby,  'Discuss alternate providers for service',Null ;                                                    
   SET @Counter  = @Counter  + 1                         
END;                      
                    
                    
                    
                    
---CCCO_GuardianshipAnd Advocacy Section-----                            
                     
DECLARE  @tempGuardianshipProof TABLE(                    
GuardianshipProof INT)  ;                    
DECLARE @GuardianshipProofLength INT =0 ,@GuardianshipAndAdvocacyId INT,@GuardianshipProof INT;                    
SELECT @GuardianshipAndAdvocacyId = GuardianshipAndAdvocacyId FROM CCO_GuardianshipAndAdvocacy WHERE CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                     
                    
INSERT INTO @tempGuardianshipProof                    
(GuardianshipProof)                    
SELECT   GuardianshipProof  =GuardianshipProof from  CCO_GuardianshipAndAdvocacyGrid                       
WHERE  GuardianshipAndAdvocacyId=@GuardianshipAndAdvocacyId    AND (GuardianshipProof  IN (2,3))                          
                    
SELECT @GuardianshipProof =GuardianshipProof  FROM   @tempGuardianshipProof                     
                            
if(@GuardianshipProof  in (2) or @GuardianshipProof in (3))                            
BEGIN                                                    
exec usp_InsertModifyCCO_ToDo @companyId,@clientId,@reportedby,  'Obtain Proof of Guardianship', Null ;                                               
END;                            
                            
                            
---CCO_AdvancedDirectivesFuturePlanning Section-----                            
declare @MemLearnAdvancedHealthProxies INT ;                            
select  @MemLearnAdvancedHealthProxies=MemLearnAdvancedHealthProxies from CCO_AdvancedDirectivesFuturePlanning where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                            
                            
if(@MemLearnAdvancedHealthProxies in (1)  )                            
BEGIN                                                    
 exec usp_InsertModifyCCO_ToDo @companyId,@clientId,@reportedby,'Provide information and education on Advanced Directives and Health Care Proxies',Null ;                                                    
END;                            
                            
---CCO_IndependentLivingSkill Section-----                            
                            
declare @NoneOfTheAbove INT,@IndvExperForConstipationDiarrheaVomitingInLastMonths INT ,@HowManyTimeMemberFallenInPast INT,@SwallowingEvaluationNeed INT,                            
@IndvWorriedAboutFoodInPast INT,@IndvRanOutOfFoodInPast INT,@IndvElecGasOilWaterThreatedInPast INT,@IndvDifficultyRememberingThings INT,@IndvHaveInfoAboutFireStartStoppedEtc INT,                            
@IsBackupPlanWhenNoHCBSProvider INT ,                          
@IndvAbilityAdministerMedication INT,                             
@LevelOfPersonalHygiene INT,                
@LevelOfSupportForToiletingNeed INT,                               
@SupportNoConcernsAtThisTime BIT,                                  
@LevelOfSuppHandFaceWash INT,                                 
@DentalOralCareNoConcernsatThisTime BIT,                           
@LevelOfSuppTrimNails INT,                                 
@LevelOfSuppSneezeCough INT,                                 
@LevelOfSuppPPEMask INT,                                  
@LevelOfSuppMoveSafely INT,                          
@NoConcernForSkinIntegrity BIT,                                  
@NoConcernForNutritionalNeed BIT,                       
 @IndvCurrentLevelOfHousingStability INT,                  
 @ChokingAspirationNoConcernsAtThisTime BIT,                  
 @AcidRefluxNoConcernsAtThisTime BIT,                  
 @SupptNeedForMealPreparation INT,                  
 @SupptNeedForMealPlanning INT,                  
 @LevelOfSupptForCleaning INT,                  
 @NeedOfMemberIndependent BIT,                  
 @MemLearnToManageOwnMoney INT,                  
 @TakingMedicationAsPrescribed INT,                  
 @IndvRefuseForMedication INT,                  
 @IndvAbleToCallEmergency INT,                  
 @IndvCallApplicableContactInPhone INT,                  
 @IndvLearnToDrive INT,                  
 @IndvWantVehicleOwnership INT,                  
 @IndvIndependentUsingTransportation INT,                  
 @IndvCommunicateHealthConcern INT,                  
 @IndvAttendAllHealthService INT,                  
 @IndvHaveFireSafetyNeed INT,                  
 @IndvEvacuateDuringFire INT,                  
 @SupervisionNeedOfTheMemberInCommunity INT,                  
 @SupervisionNeedOfTheMemberAtHome INT,                  
 @SupervisionNeedOfTheMemberAtNight INT;                          
select                  
@IndvCurrentLevelOfHousingStability =IndvCurrentLevelOfHousingStability,                  
@ChokingAspirationNoConcernsAtThisTime=ChokingAspirationNoConcernsAtThisTime,                  
@AcidRefluxNoConcernsAtThisTime =AcidRefluxNoConcernsAtThisTime,                  
@SupptNeedForMealPreparation=SupptNeedForMealPreparation,                  
@SupptNeedForMealPlanning =SupptNeedForMealPlanning,                  
@LevelOfSupptForCleaning =LevelOfSupptForCleaning,                  
@NeedOfMemberIndependent=NeedOfMemberIndependent,                  
@MemLearnToManageOwnMoney=MemLearnToManageOwnMoney,                  
@TakingMedicationAsPrescribed=TakingMedicationAsPrescribed,                  
@IndvRefuseForMedication=IndvRefuseForMedication,                  
@IndvAbleToCallEmergency=IndvAbleToCallEmergency,                  
@IndvCallApplicableContactInPhone=IndvCallApplicableContactInPhone,                  
@IndvLearnToDrive=IndvLearnToDrive,                  
@IndvWantVehicleOwnership=IndvWantVehicleOwnership,                  
@IndvIndependentUsingTransportation=IndvIndependentUsingTransportation,                  
@IndvCommunicateHealthConcern =IndvCommunicateHealthConcern,                  
@IndvAttendAllHealthService=IndvAttendAllHealthService,                  
@IndvHaveFireSafetyNeed=IndvHaveFireSafetyNeed,                  
@IndvEvacuateDuringFire=IndvEvacuateDuringFire,                  
@SupervisionNeedOfTheMemberInCommunity=SupervisionNeedOfTheMemberInCommunity,                  
 @SupervisionNeedOfTheMemberAtHome  = SupervisionNeedOfTheMemberAtHome ,                  
 @SupervisionNeedOfTheMemberAtNight = SupervisionNeedOfTheMemberAtNight,                  
@NoneOfTheAbove = NoneOfTheAbove,                        
@IndvExperForConstipationDiarrheaVomitingInLastMonths =IndvExperForConstipationDiarrheaVomitingInLastMonths ,                        
@HowManyTimeMemberFallenInPast =HowManyTimeMemberFallenInPast,                        
@SwallowingEvaluationNeed =SwallowingEvaluationNeed,                            
@IndvWorriedAboutFoodInPast =IndvWorriedAboutFoodInPast,                        
@IndvRanOutOfFoodInPast =IndvRanOutOfFoodInPast,                        @IndvElecGasOilWaterThreatedInPast =IndvElecGasOilWaterThreatedInPast,                        
@IndvDifficultyRememberingThings =IndvDifficultyRememberingThings,                        
@IndvHaveInfoAboutFireStartStoppedEtc =IndvHaveInfoAboutFireStartStoppedEtc,                        
@IsBackupPlanWhenNoHCBSProvider=IsBackupPlanWhenNoHCBSProvider ,              
@IndvAbilityAdministerMedication=IndvAbilityAdministerMedication,                        
@LevelOfPersonalHygiene=LevelOfPersonalHygiene,                                  
@LevelOfSupportForToiletingNeed=LevelOfSupportForToiletingNeed,                        
@SupportNoConcernsAtThisTime=SupportNoConcernsAtThisTime,                                  
@LevelOfSuppHandFaceWash=LevelOfSuppHandFaceWash,                        
@DentalOralCareNoConcernsatThisTime=DentalOralCareNoConcernsatThisTime,                        
@LevelOfSuppTrimNails=LevelOfSuppTrimNails,                                  
     @LevelOfSuppSneezeCough=LevelOfSuppSneezeCough,                        
     @LevelOfSuppPPEMask=LevelOfSuppPPEMask,                        
     @LevelOfSuppMoveSafely=LevelOfSuppMoveSafely,                                  
     @NoConcernForSkinIntegrity=NoConcernForSkinIntegrity,                        
     @NoConcernForNutritionalNeed=NoConcernForNutritionalNeed                           
 from CCO_IndependentLivingSkill where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid              
   IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND NoneOfTheAbove IN(0)) AND (        
Pest  IN(1)OR        
Mold IN(1)OR        
LeadPaint IN(1)OR        
LackOfHeat IN(1)OR        
Oven IN(1) OR        
SmokeDetectorMissing IN(1) OR        
WaterLeakes IN(1)         
) )                                      
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide support with safe living environment',NULL;                                               
               END;                                                       
      IF   ( @IndvExperForConstipationDiarrheaVomitingInLastMonths IN(2,3)   )                                              
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Discuss concerns with constipation, diarrhea and/or vomiting',NULL;                                               
               END;                                            
      IF   (@HowManyTimeMemberFallenInPast IN(2,3,4)    )                                              
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Discuss mobility concerns',NULL;                                               
               END;                                            
      IF   (@SwallowingEvaluationNeed =1 )                                              
         BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Discuss possible referral for Swallowing Evaluation',NULL;                                               
               END;                                            
      IF   (@IndvWorriedAboutFoodInPast IN(1,2) )                                              
               BEGIN                           
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Provide support with food stability',NULL;                                               
               END;                                                
      IF   (@IndvRanOutOfFoodInPast IN(1,2)   )                                              
               BEGIN                    
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Provide support with food stability',NULL ;                                               
               END;                                            
      IF   ( @IndvElecGasOilWaterThreatedInPast IN(1,3)  )                                              
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Provide support with housing utilities',NULL ;                                               
               END;                                            
      IF   ( @IndvDifficultyRememberingThings IN(1,3) )                                              
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Discuss memory concerns',NULL;                                               
               END;                                          
      IF   ( @IndvHaveInfoAboutFireStartStoppedEtc IN(2,3)    )                                              
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Provide information and education on fire safety',NULL;                                               
               END;                                                   
      IF   ( @IsBackupPlanWhenNoHCBSProvider IN(2,3)   )                                              
               BEGIN                                             
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Coordinate and develop back up plan with HCBS provider(s)',NULL ;                                               
               END;                                 
                           
  If @IndvAbilityAdministerMedication IN(2,3,4)                                   
 BEGIN                                    
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with taking my medications',null,@compAssessmentId,@documentversionid                            
 END;                                  
 If @LevelOfPersonalHygiene IN(2,3,4)                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with personal hygiene',null,@compAssessmentId,@documentversionid                                   
 END;                                  
 If @LevelOfSupportForToiletingNeed IN(2,3,4)                                 
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with toileting',null,@compAssessmentId,@documentversionid                                   
 END;                                  
IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND SupportNoConcernsAtThisTime IN(0)) AND (        
SupportBowelTrackingProtocol  IN(1)OR        
SupportBowelmanagementProtocol IN(1)OR        
SupportNoBowelTrackingManagementProtocol IN(1)         
) )                                
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with toileting (Bowel Management)',null,@compAssessmentId,@documentversionid                                   
 END;                                   
 If @LevelOfSuppHandFaceWash IN(2,3,4)                               
 BEGIN                              
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with washing hand/face',null,@compAssessmentId,@documentversionid                                   
 END;                                   
IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND DentalOralCareNoConcernsatThisTime IN(0)) AND (        
DentalOralHygieneSupport  IN(1)OR        
DentalOralPreSedation IN(1)OR        
DentalOralDentures IN(1)OR        
DentalOralMedicalImmobilization IN(1)OR        
DentalOralOther IN(1)        
) )                                 
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with oral health/care',null,@compAssessmentId,@documentversionid                                   
 END;                               
 If @LevelOfSuppTrimNails IN(2,3,4)                                
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with trimming nails',null,@compAssessmentId,@documentversionid                                   
 END;                                   
 If @LevelOfSuppSneezeCough IN(2,3,4)                                 
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with wiping nose/mouth',null,@compAssessmentId,@documentversionid                                   
 END;                                   
 If @LevelOfSuppPPEMask IN(2,3,4,5)                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with following health guidelines',null,@compAssessmentId,@documentversionid                                   
 END;                                   
 If @LevelOfSuppMoveSafely IN(2,3,4)                                  
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with moving safely',null,@compAssessmentId,@documentversionid                                   
 END;                                   
 IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND NoConcernForSkinIntegrity IN(0)) AND (        
ReqPositioningSchedule  IN(1)OR        
ReqDailySkinInspection IN(1)OR        
ReqAdaptiveEquipment IN(1)OR        
ReqSkinBarrierCream IN(1)OR        
ProvideEducationWhereAppropriate IN(1)        
) )                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with skin integrity concerns/conditions',null,@compAssessmentId,@documentversionid                                   
 END;                                   
IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND NoConcernForNutritionalNeed IN(0)) AND (        
ReqConsistencyFood  IN(1)OR        
ReqConsistencyFluid IN(1)OR        
ReqReduceCalorieDiet IN(1)OR        
ReqHighCalorieDiet IN(1)OR        
ReqFiberCalciumElementToDiet IN(1)OR        
ReqSweetSaltFatElementRemove  IN(1)OR        
RestrictedFluid IN(1)OR        
EnteralNutrition IN(1)OR        
ReqDietarySupplement IN(1)OR        
ReqAssitMealPreparation IN(1)OR        
ReqEducation  IN(1)OR        
ReqAssitMealPlanning IN(1)OR        
ReqSupervisionDuringMeal IN(1)OR        
AdapEquDuringMeal IN(1)OR        
IndvMaintAdequateDiet IN(1)        
) )                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with nutritional needs',null,@compAssessmentId,@documentversionid                                   
 END;                 
                   
 If (@IndvCurrentLevelOfHousingStability IN(2,3,4))                               
BEGIN                    
DECLARE @UDIDDLivingSituation INT;                                      
Select @UDIDDLivingSituation=UDID from s_UserDefinedOptions where UDDescription='People Experience Continuity and Security'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDDLivingSituation,'To change/improve my living situation',@compAssessmentId,@documentversionid                               
   END;                  
IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND ChokingAspirationNoConcernsAtThisTime IN(0)) AND (        
ChokingAspirationModifiedConsistency  IN(1)OR        
ChokingAspirationConsistencyLiquids IN(1)OR        
ChokingAspirationAvoidRisk IN(1)OR        
ChokingAspirationSupervision IN(1)OR        
ChokingAspirationFormalTraining IN(1)        
) )                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with eating and drinking safely',null,@compAssessmentId,@documentversionid                                   
 END;                  
  IF EXISTS(        
SELECT  1        
FROM CCO_IndependentLivingSkill WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
AND AcidRefluxNoConcernsAtThisTime IN(0)) AND (        
AcidRefluxRemainingMinutes  IN(1)OR        
AcidRefluxElevateHead IN(1)OR        
AcidRefluxModifiedDiet IN(1)OR        
AcidRefluxMedicationNeeded IN(1)OR        
AcidRefluxEncourageWeightLoss IN(1)        
) )                             
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with acid reflux (GERD)',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @SupptNeedForMealPreparation IN(2,3,4)                             
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with meal preperation',null,@compAssessmentId,@documentversionid                                   
 END;                  
  If @SupptNeedForMealPlanning IN(2,3,4)                           
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide Support with meal planning',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @IndvWorriedAboutFoodInPast IN(1,2)                                 
BEGIN                 
DECLARE @UDIDDSecurity INT;                                      
Select @UDIDDSecurity=UDID from s_UserDefinedOptions where UDDescription='People Experience Continuity and Security'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDDSecurity,'To have enough food',@compAssessmentId,@documentversionid                               
   END;                  
   If @IndvRanOutOfFoodInPast IN(1,2)                                 
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with food stability',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @LevelOfSupptForCleaning IN(2,3,4)                           
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with cleaning/housekeeping',null,@compAssessmentId,@documentversionid                                   
 END;                   
 If @NeedOfMemberIndependent IN(2,3,4)                                
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with budgeting/money management',null,@compAssessmentId,@documentversionid                                   
 END;                  
  If @MemLearnToManageOwnMoney = 1                                  
BEGIN       
Declare @UDIDOwnMoney  int;                                 
Select @UDIDOwnMoney=UDID from s_UserDefinedOptions where UDDescription='People Choose Personal Goals'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDOwnMoney,'To improve/maintain my money management skills',@compAssessmentId,@documentversionid                               
   END;                  
   If @TakingMedicationAsPrescribed IN(2,3)                                
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with taking medications as prescribed',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @IndvRefuseForMedication IN(2,3,4)        
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support/education with medication adherence',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @IndvAbleToCallEmergency IN(1,2,3)                              
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with calling for help',null,@compAssessmentId,@documentversionid                                   
 END;                  
  If @IndvCallApplicableContactInPhone IN(2,3)                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with phone usage',null,@compAssessmentId,@documentversionid               
 END;                  
  If @IndvLearnToDrive = 1                                   
BEGIN                    
DECLARE @UDIDDCommunity INT;                                                        
Select @UDIDDCommunity=UDID from s_UserDefinedOptions where UDDescription='People Participate In The Life Of The Community'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDDCommunity,'To learn how to drive',@compAssessmentId,@documentversionid                               
   END;                 
                   
   If @IndvWantVehicleOwnership =1                                
 BEGIN                   
 DECLARE @UDIDDPersonalGoals INT;                                                                           
Select @UDIDDPersonalGoals=UDID from s_UserDefinedOptions where UDDescription='People Choose Personal Goals'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDDPersonalGoals,'To own/maintain a vehicle',@compAssessmentId,@documentversionid                               
   END;                  
                
   If @IndvIndependentUsingTransportation =1                                
 BEGIN                     
  DECLARE @UDIDDtransportation INT;                                                                                            
Select @UDIDDtransportation=UDID from s_UserDefinedOptions where UDDescription='People Participate In The Life Of The Community'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDDtransportation,'To be more independent with using transportation',@compAssessmentId,@documentversionid                               
   END;                  
 If @IndvCommunicateHealthConcern IN(2,3)                                
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with communicating health concerns',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @IndvAttendAllHealthService IN(2,3)                               
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with medical appointments',null,@compAssessmentId,@documentversionid                                  
 END;                  
  If @IndvHaveFireSafetyNeed IN(1,2,3)                              
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with fire safety',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @IndvEvacuateDuringFire IN(2,3)                              
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with fire evacuation',null,@compAssessmentId,@documentversionid                                   
 END;                  
  If @SupervisionNeedOfTheMemberInCommunity IN(2,3,4,5)                             
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide the following supervision in the community',null,@compAssessmentId,@documentversionid                                   
 END;                  
  If @SupervisionNeedOfTheMemberAtHome IN(2,3,4,5)                             
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide the following supervision at home',null,@compAssessmentId,@documentversionid                                   
 END;                  
 If @SupervisionNeedOfTheMemberAtNight IN(2,3,4,5)                             
 BEGIN                                   
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide the following supervision during the night',null,@compAssessmentId,@documentversionid                                   
 END;                  
                  
                          
---CCO_SocialServiceNeed Section-----                            
DECLARE @IndvRepresentativePay INT,@MemInvolCriminalJusticeSystem INT,@MemNeedLegalAid INT,@MemCurrOnProbation INT,@CrimJustSystemImpactHousing INT,@CrimJustSystemImpactEmployment INT;                            
SELECT @IndvRepresentativePay =IndvRepresentativePay,@MemInvolCriminalJusticeSystem =MemInvolCriminalJusticeSystem,@MemNeedLegalAid =MemNeedLegalAid,@MemCurrOnProbation =MemCurrOnProbation,@CrimJustSystemImpactHousing =CrimJustSystemImpactHousing,       
  
    
      
        
           
           
              
               
@CrimJustSystemImpactEmployment =CrimJustSystemImpactEmployment from CCO_SocialServiceNeed where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                            
  IF   ( @IndvRepresentativePay IN(2,3) )                                                
               BEGIN                                               
               EXEC usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Discuss need for Representative Payee',NULL;                                                          END;                                          
        IF   ( @MemInvolCriminalJusticeSystem IN(1,2,4) )                                      
               BEGIN                                               
               EXEC usp_InsertModifyCCO_ToDo @companyId, @ClientId,@reportedby ,'Provide support with Criminal Justice system involvement',NULL;                                                 
               END;                                          
    IF   ( @MemNeedLegalAid IN(1,3) )                                                
 BEGIN                                               
               EXEC usp_InsertModifyCCO_ToDo @companyId, @ClientId,@reportedby ,'Discuss referral to legal aid',NULL ;                                                 
               END;                                               
       IF   (@MemCurrOnProbation IN(1,2,3) )                                                
               BEGIN                                               
               exec usp_InsertModifyCCO_ToDo @companyId, @ClientId,@reportedby ,'Provide support with Parole and/or Probation',NULL;                                                 
               END;                                            
      IF   ( @CrimJustSystemImpactHousing IN(1,3) )                                                
               BEGIN                                               
               exec usp_InsertModifyCCO_ToDo @companyId, @ClientId,@reportedby ,'Provide support with housing needs due to criminal justice system involvement',NULL ;                                                 
               END;                                            
      IF   (@CrimJustSystemImpactEmployment IN(1,3) )                                                
               BEGIN                                               
               exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide support with employment needs due to criminal justice system involvement',NULL ;                                                 
               END;               
                                            
---CCO_MedicalHealth Section---                       
DECLARE @MemSymptomsGottenWorse INT,@MemNewSymptoms INT,@MemFinacTranspOtherBarriers INT,@IndvAbilityToDailyLiving INT ,@tempMedicalHealthAllAllergies INT , @MemHaveSeizureSupptOnSeizureMonitoringPlan AS BIT,                                    
    @MemHaveSupptOnSeizureRequiresSeizureProtocol AS BIT,@MedicalHealthId INT;                     
 SELECT  @MedicalHealthId=MedicalHealthId from CCO_MedicalHealth  where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                      
           
 DECLARE  @MedicalHealthDiagnosisTable TABLE(                    
MemSymptomsGottenWorse INT,                    
MemNewSymptoms INT,                    
MemFinacTranspOtherBarriers INT,                    
IndvAbilityToDailyLiving INT)  ;                    
INSERT INTO @MedicalHealthDiagnosisTable                    
(MemSymptomsGottenWorse,                    
MemNewSymptoms,                    
MemFinacTranspOtherBarriers,                    
IndvAbilityToDailyLiving)                    
SELECT                     
 MemSymptomsGottenWorse,MemNewSymptoms,MemFinacTranspOtherBarriers,IndvAbilityToDailyLiving                    
FROM CCO_MedicalHealthDiagnosis WHERE MedicalHealthId=@MedicalHealthId                     
                    
                     
 SELECT @MemSymptomsGottenWorse=COUNT(MemSymptomsGottenWorse) FROM @MedicalHealthDiagnosisTable WHERE MemSymptomsGottenWorse IN(1,3);                    
 SELECT @MemNewSymptoms=COUNT(MemNewSymptoms) FROM @MedicalHealthDiagnosisTable WHERE MemNewSymptoms IN(1,3);                    
 SELECT @MemFinacTranspOtherBarriers=COUNT(MemFinacTranspOtherBarriers) FROM @MedicalHealthDiagnosisTable WHERE MemFinacTranspOtherBarriers IN (2,3,4);                    
 SELECT @IndvAbilityToDailyLiving=COUNT(IndvAbilityToDailyLiving) FROM @MedicalHealthDiagnosisTable WHERE IndvAbilityToDailyLiving  in(1,3)  ;                    
                    
                    
  DECLARE @CounterMemSymptomsGottenWorse INT                     
SET @CounterMemSymptomsGottenWorse=1                    WHILE ( @CounterMemSymptomsGottenWorse <= @MemSymptomsGottenWorse)                       
               BEGIN                                       
               exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby,  'Discuss worsening symptoms',NULL ;                     
       SET @CounterMemSymptomsGottenWorse  = @CounterMemSymptomsGottenWorse  + 1                                         
               END;                      
                            
 DECLARE @CounterMemNewSymptoms INT                     
SET @CounterMemNewSymptoms=1                          
WHILE ( @CounterMemNewSymptoms <= @MemNewSymptoms)                                          
               BEGIN                                       
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby,  'Discuss new symptoms',NULL ;                     
               SET @CounterMemNewSymptoms  = @CounterMemNewSymptoms  + 1                                                             
               END;                     
                    
DECLARE @CounterMemFinacTranspOtherBarriers INT                     
SET @CounterMemFinacTranspOtherBarriers=1        WHILE ( @CounterMemFinacTranspOtherBarriers <= @MemFinacTranspOtherBarriers)                                   
 BEGIN                                       
 exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby,  'Discuss financial, transportation, or other barriers to follow medical physician recommendations',NULL ;                                         
 SET @CounterMemFinacTranspOtherBarriers=@CounterMemFinacTranspOtherBarriers+1                    
 END;                     
                    
DECLARE @CounterIndvAbilityToDailyLiving INT                     
SET @CounterIndvAbilityToDailyLiving=1                          
WHILE ( @CounterIndvAbilityToDailyLiving <= @IndvAbilityToDailyLiving)      
               BEGIN                                       
               exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby,  'Discuss how the condition interferes with activities of daily living',NULL;                                         
               SET @CounterIndvAbilityToDailyLiving=@CounterIndvAbilityToDailyLiving+1                    
      END;                    
                     
  IF  EXISTS (SELECT 1  FROM CCO_MedicalHealthAllAllergies WHERE MedicalHealthId=@MedicalHealthId)                                      
               BEGIN                                       
               exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby,  'Review/Verify allergies and reflect within Life Plan as applicable',NULL;                                         
               END;                              
                            
---CCO_HealthPromotion Section---                            
  DECLARE @ThisDate DATE = getdate()                                                      
         SELECT  @ThisDate =DATEADD(YEAR, -1, DATEADD(MONTH, DATEDIFF(MONTH, GETDATE() , @ThisDate), GETDATE()))                            
DECLARE @MemHadEyeExam int ,@MemHadAnnualPhysicalExam int,@MemHadDentalExam int,@NoBirthControl Bit,@unknown bit,    
@MemLastAnnualPhysicalExam Date ,@MemLastDentalExam Date,@MemLastEyeExam date,@MemHadColonoscopy INT,@MemHadMammogram INT,@MemHadProstateExam INT,@MemHadCervicalCancerExam  INT,@MemDementiaInPastMonths INT,      
@MemConcernAboutSleep  INT,@MemHadDiabeticScreening INT,  @MemBloodTestForLeadPoisoning INT,@BirthControlOral  INT,@MemHIVPositive  INT, @MemLastHIVAppointment  Date;                            
 SELECT     
 @NoBirthControl=NoBirthControl,  
 @unknown=Unknown,  
 @MemHadAnnualPhysicalExam=MemHadAnnualPhysicalExam,    
 @MemHadEyeExam=MemHadEyeExam,    
 @MemHadDentalExam=MemHadDentalExam,    
  @MemLastAnnualPhysicalExam =MemLastAnnualPhysicalExam,@MemLastDentalExam =MemLastDentalExam,@MemLastEyeExam =MemLastEyeExam,@MemHadColonoscopy =MemHadColonoscopy,@MemHadMammogram =MemHadMammogram,@MemHadProstateExam =MemHadProstateExam,              
 @MemHadCervicalCancerExam=MemHadCervicalCancerExam,@MemDementiaInPastMonths=MemDementiaInPastMonths,@MemConcernAboutSleep=MemConcernAboutSleep,@MemHadDiabeticScreening=MemHadDiabeticScreening,               
@MemBloodTestForLeadPoisoning=MemBloodTestForLeadPoisoning,@BirthControlOral=BirthControlOral,@MemHIVPositive=MemHIVPositive,@MemLastHIVAppointment=MemLastHIVAppointment                            
from CCO_HealthPromotion                             
where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid   
 IF (@NoBirthControl in (1)) or (@unknown in (1))   
  BEGIN    
                 EXEC usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide information/education on contraceptive(s)',NULL;    
  END  ;                            
  IF (@MemHadAnnualPhysicalExam in (2,3))      
  BEGIN    
                 EXEC usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Discuss scheduling an annual physical exam',NULL;                                                     
  END  ;      
    IF (@MemHadEyeExam in (2,3))      
  BEGIN    
                 EXEC usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Discuss scheduling an eye exam',NULL;                                                     
  END  ;     
   IF (@MemHadDentalExam in (2,3))      
  BEGIN    
                 EXEC usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Discuss scheduling a dental exam',NULL;                                                     
  END  ;                    
IF  ( @MemLastAnnualPhysicalExam < @ThisDate)                                                    
               BEGIN                                                 
               EXEC usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Discuss scheduling an annual physical exam',NULL;                                                     
  END;                                                  
  IF  (@MemLastDentalExam < @ThisDate)                                                    
               BEGIN                                                 
               EXEC usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling a dental exam',NULL;                             
               END;                                                  
      IF   ( @MemLastEyeExam < @ThisDate    )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling an eye exam',NULL;                                                     
               END;                                                
       IF   ( @MemHadColonoscopy   IN (2,3)                                                
               )                                                    
               BEGIN                                      
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling colonoscopy',NULL ;                                 
               END;                                                
       IF   ( @MemHadMammogram IN (2,3)  )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling mammogram',NULL;                                                     
               END;                                                
                                                
      IF   (  @MemHadCervicalCancerExam  IN (2,3)     )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@clientId,@reportedby ,'Discuss scheduling Cervical Cancer Screening',NULL;                                                     
               END;                   
    IF   (     @MemHadProstateExam IN (2,3)    )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby ,'Discuss scheduling Prostate Exam Referral',NULL;                                                     
         END;                                            
  IF   (      @MemDementiaInPastMonths   IN (2,3)   )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling Dementia screening',NULL;                     
               END;                                                
      IF   ( @MemConcernAboutSleep IN (2,3)       )                                                    
               BEGIN                                                 
             exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby ,'Discuss sleep concerns/refer to primary care physician',NULL;                                                     
               END;                                                
   IF   ( @MemHadDiabeticScreening   IN (2,3)    )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling diabetic screening',NULL;                                                     
               END;                                       
   IF   ( @MemBloodTestForLeadPoisoning   IN (2,3) )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling blood test for lead poisoning',NULL;                                                     
               END;                                                
   IF   (  @BirthControlOral  IN (5,4)   )                     
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Provide information/education on contraceptive(s)',NULL ;                                                     
               END;                                                
      IF   ( @MemHIVPositive IN (3) )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss HIV/referral to primary care physician',NULL;                                                     
               END;                                                
  IF   (  @MemHIVPositive IN (1)                                                
               )                                                    
               BEGIN                                                 
               exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Complete HIV/AIDS supplemental assessment questionnaire',NULL;                         
               END;                                                
    IF  @MemLastHIVAppointment < @ThisDate                                               
               BEGIN                                                 
         exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss scheduling appointment for HIV/AIDS monitoring',NULL ;                                                     
              END;                                
 --      If @MemHaveSeizureSupptOnSeizureMonitoringPlan=1 OR @MemHaveSupptOnSeizureRequiresSeizureProtocol=1                                  
 --BEGIN                                    
 --Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy (Seizure Disorder)',null,@compAssessmentId,@documentversionid                             
 --   END;                     
                     
--Lifeplan records Health Promotion                    
DECLARE  @HealthRelatedConcernsNotAddressed AS INT, @SupptOnSeizureNoConcernsAtThisTime AS INT,@NoConcernForDiabetes AS INT,@NoRespiratoryConcern AS INT,@NoConcernsForCholesterol AS INT,                    
@NoConcernForHighBloodPressure AS INT,@MemInterestedIncPhysicalActivity AS INT;                      
SELECT @HealthRelatedConcernsNotAddressed=HealthRelatedConcernsNotAddressed,@SupptOnSeizureNoConcernsAtThisTime=SupptOnSeizureNoConcernsAtThisTime,                    
@NoConcernForDiabetes=NoConcernForDiabetes,@NoRespiratoryConcern=NoRespiratoryConcern,@NoConcernsForCholesterol=NoConcernsForCholesterol,                    
@NoConcernForHighBloodPressure=NoConcernForHighBloodPressure,@MemInterestedIncPhysicalActivity=MemInterestedIncPhysicalActivity FROM CCO_HealthPromotion        
 WHERE CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid                    
         
               
If @HealthRelatedConcernsNotAddressed = 1                              
BEGIN                                     
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy',null,@compAssessmentId,@documentversionid                                   
END;                           
                    
IF EXISTS(        
 SELECT  1          
FROM CCO_HealthPromotion WHERE           
CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid           
AND SupptOnSeizureNoConcernsAtThisTime = 0 AND (          
SupptOnSeizureMonitoringPlan =1 OR          
SupptOnSeizureRequiresSeizureProtocol =1         
))                                
BEGIN                                     
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy (Seizure Disorder)',null,@compAssessmentId,@documentversionid                                   
END;                       
                        
IF EXISTS(        
SELECT  1        
FROM CCO_HealthPromotion WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid         
AND NoConcernForDiabetes IN(0)) AND (        
RequiredMedicationForDiabetes  IN(1)OR        
AssistanceWithDiabetesMonitoring IN(1) OR        
MedicationAdministration IN(1)OR        
DietaryModification IN (1)OR         
EducationTraining IN(1))        
)                                
BEGIN                                     
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy (Diabetes)',null,@compAssessmentId,@documentversionid                                   
END;                     
IF EXISTS(        
SELECT  1        
FROM CCO_HealthPromotion WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid AND NoRespiratoryConcern IN(0))        
 AND (RequiresMedicationForRespConcren  IN(1)OR UseCPAPMachine IN(1) OR UseNebulizer IN(1)OR UseOxygen IN (1)OR ExerciseRestrictions IN(1) OR  OtherTherapies IN(1))        
)                                
BEGIN                                     
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy (Respiratory Conditions/Concerns)',null,@compAssessmentId,@documentversionid                                   
END;                     
if Exists (        
SELECT  1        
FROM CCO_HealthPromotion WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
and NoConcernsForCholesterol IN(0)) and (ModifiedDiet  IN(1) OR ModifiedDiet IN(1)         
OR CholesterolLoweringMedications IN(1) OR IncreaseExercise IN(1)OR EncourageWeightLossForCholesterol IN (1)OR ProvideAssistanceWithMealPlanning IN(1) OR ProvideEducationToThePerson IN(1))        
)                                
BEGIN                                     
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy (High Cholesterol)',null,@compAssessmentId,@documentversionid                                   
END;                    
if Exists (        
SELECT NoConcernForHighBloodPressure,EncourageWeightLossForHighBloodPressure,BloodPressureMonitoringPlan,ReduceSaltIntake ,        
EncourageExercise,MedicationRequired        
FROM CCO_HealthPromotion WHERE         
(CompAssessmentId=@compAssessmentId AND CompAssessmentVersioningId=@documentversionid        
and NoConcernForHighBloodPressure IN(0)) and (EncourageWeightLossForHighBloodPressure IN(1) or BloodPressureMonitoringPlan  IN(1)         
or ReduceSaltIntake IN(1) or EncourageExercise IN(1) or MedicationRequired IN(1))        
)                                
BEGIN                                     
 Exec usp_InsertModifyIndividualPlanOfProtectionExported @ClientId,'Provide support with being healthy (High Blood Pressure)',null,@compAssessmentId,@documentversionid                                   
END;                    
If @MemInterestedIncPhysicalActivity = 1                                   
BEGIN                    
DECLARE @UDIDDPossibleHealth INT;                                      
Select @UDIDDPossibleHealth=UDID from s_UserDefinedOptions where UDDescription='People Have the Best Possible Health'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDDPossibleHealth,'To be physically active',@compAssessmentId,@documentversionid                               
   END;                                    
                                 
 ---CCO_BehavioralHealth Section---                              
     declare  @PsychiatricConditionInterfereWithMem INT,@MemMonitoredForSuicidalRisk INT,@MemMonitoredForSelfHarmRisk INT,@MemMedicationMonitoringPlan INT ,@MemPhysicallyHurtOthers INT ,@MemInsultOthers INT,                            
  @MemThreatenOthers INT,@MemScreamCurseOthers INT,@MemSmoke INT,@IndvDrinkAlcohol INT,@IndvUseRecreationalDrugs INT                              
                              
select   @PsychiatricConditionInterfereWithMem =PsychiatricConditionInterfereWithMem,@MemMonitoredForSuicidalRisk =MemMonitoredForSuicidalRisk,      
@MemMonitoredForSelfHarmRisk =MemMonitoredForSelfHarmRisk,@MemMedicationMonitoringPlan =MemMedicationMonitoringPlan ,      
@MemPhysicallyHurtOthers = MemPhysicallyHurtOthers ,@MemInsultOthers =MemInsultOthers,                            
  @MemThreatenOthers =MemThreatenOthers,@MemScreamCurseOthers =MemScreamCurseOthers,@MemSmoke =MemSmoke,      
  @IndvDrinkAlcohol =IndvDrinkAlcohol,@IndvUseRecreationalDrugs =IndvUseRecreationalDrugs                               
from CCO_BehavioralHealth                            
where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                             
      IF   (  @PsychiatricConditionInterfereWithMem IN (5) and @PsychiatricConditionInterfereWithMem IN(6)  and @PsychiatricConditionInterfereWithMem IN(7)  and @PsychiatricConditionInterfereWithMem IN(8)    )                                             
  
    
                             BEGIN                                       
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss psychiatric conditions interference with daily functioning/referral to physician/mental health care provider',NULL;                                    
  
    
      
              
                    END;                                              
    IF   (     @MemMonitoredForSuicidalRisk IN(2) )                                                  
                             BEGIN                               
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss referral for mental health support',NULL;                                                   
                    END;                                              
    IF   ( @MemMonitoredForSelfHarmRisk IN(2) )                                                  
                             BEGIN                                               
                                                           
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Discuss referral for mental health support',NULL;                                                   
                             END;                                              
    IF   (@MemMedicationMonitoringPlan   IN(1,3) )                                                  
                      BEGIN                                         
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Review/Verify Medication Monitoring Plan and reflect within Life Plan as applicable',NULL ;                                                   
         END;                                              
                                              
    IF   (  @MemPhysicallyHurtOthers   IN(2,3,4,5)        )                                                  
                             BEGIN                               
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Follow reporting protocol for physical harm',NULL;                                                   
                             END;                                              
    IF   (  @MemInsultOthers   IN(2,3,4,5)         )                                                  
                             BEGIN                                        
                                               
                exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Follow reporting protocol for verbal harm',NULL;                                                   
                             END;                                              
    IF   (  @MemThreatenOthers   IN(2,3,4,5)      )                                                  
                             BEGIN                             
     exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Follow reporting protocol for threats of harm',NULL;                                                   
                            END;                                            IF   ( @MemScreamCurseOthers   IN(2,3,4,5)       )                   
                             BEGIN                                         
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Follow reporting protocol for threats of harm',NULL;                                                   
                             END;                                              
    IF   ( @MemSmoke   IN(1,3)   )                                                  
                             BEGIN                                    
                   exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby ,'Provide information/education on the effects of smoking or vaping',NULL;                                                   
                         END;                                              
    IF   (@IndvDrinkAlcohol   IN(1,3)       )                                            
                             BEGIN                               
                             exec usp_InsertModifyCCO_ToDo   @companyId,@ClientId,@reportedby ,'Provide information/education on the effects of alcohol',NULL;                                   
                             END;                                              
    IF   ( @IndvUseRecreationalDrugs IN(1,3) )                                                  
         BEGIN                                         
  exec usp_InsertModifyCCO_ToDo  @companyId, @ClientId,@reportedby ,'Provide information/education on the effects of recreational drug use',NULL;                                                   
                             END;                                
                            
   --- CCO_ChallengingBehaviors Section---                                  
 declare  @RestrictiveEater INT ,@MemShowAggressiveOnMeals INT                            
 select  @RestrictiveEater=RestrictiveEater ,@MemShowAggressiveOnMeals =MemShowAggressiveOnMeals                             
 from CCO_ChallengingBehaviors                            
 IF   ( @RestrictiveEater in (1,3)   )                                        
                             BEGIN                                     
             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide support with nutrition/diet planning',NULL;                                         
                             END;                                    
    IF   ( @MemShowAggressiveOnMeals in (1,3)   )           
                             BEGIN                                     
                             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide support with aggressive or self-injurious behaviors during meals or snacks',NULL ;                                         
                             END;                               
                                    
                                    
                                    
  ---CCO_BehavioralSupportPlan Section---                              
  declare @MemHaveBehavioralSupportPlan INT;                            
                              
  select  @MemHaveBehavioralSupportPlan=MemHaveBehavioralSupportPlan from  CCO_BehavioralSupportPlan                            
  where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                             
    IF   ( @MemHaveBehavioralSupportPlan IN (1,3))                                        
                             BEGIN                                     
                             exec usp_InsertModifyCCO_ToDo @companyId, @ClientId,@reportedby ,'Review/Verify Behavioral Support Plan and reflect within Life Plan as applicable',NULL;                                         
                             END;                                
  ---CCO_Medications Section---                              
 declare @MemUnderstandMedication INT, @MemFeelMedicationEffective INT;                            
  select  @MemUnderstandMedication=MemUnderstandMedication,@MemFeelMedicationEffective=MemFeelMedicationEffective from  CCO_Medications             
  where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                             
   IF  ( @MemUnderstandMedication IN(2,3)  )                                            
                             BEGIN                                         
                             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide information/education regarding the use of each medication',NULL;                                             
                 END;                                       
                                        
               IF (  @MemFeelMedicationEffective   IN (2,3)  )                                            
                         BEGIN                                         
                             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby  ,'Refer to prescribing physician for discussion about medication effectiveness for condition',NULL;                                             
                             END;                                 
---CCO_CommunityParticipation Section---                              
   declare @MemWishSelfDirectSupportService INT;                            
  select  @MemWishSelfDirectSupportService=MemWishSelfDirectSupportService from CCO_CommunityParticipation                            
  where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                             
   IF   ( @MemWishSelfDirectSupportService =1       )                                     
                             BEGIN                                    
                             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Provide information/education about Self-Direction',NULL;                                           
                             END;                               
                            
                            
 --- CCO_Employment Section---                              
    declare @MemWishIncCurreLevelOfEmployment INT ,@MemWorkInIntegratedSetting INT;                            
 DECLARE @UDID AS INT;                          
  select  @MemWishIncCurreLevelOfEmployment=MemWishIncCurreLevelOfEmployment ,@MemWorkInIntegratedSetting=MemWorkInIntegratedSetting  from CCO_Employment                            
  where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                             
    IF   (  @MemWishIncCurreLevelOfEmployment IN(2,3) )                                            
                             BEGIN                                         
                             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Discuss member’s satisfaction with current employment setting',NULL;                                             
                 END;                           
                          
        If @MemWishIncCurreLevelOfEmployment=1                              
                     BEGIN                              
                     Select @UDID=UDID from s_UserDefinedOptions where UDDescription='People Choose Where They Work'                              
                     Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDID,'To obtain and maintain employment',@compAssessmentId,@documentversionid                              
                     END;                                            
                          
                          
---CCO_CommunityLanguage Section---                              
   declare @NoMeansOfExpressing_YesNo INT  , @ImproveCommunicate INT;                             
  select  @NoMeansOfExpressing_YesNo=NoMeansOfExpressing_YesNo,@ImproveCommunicate=MemWantToImproveCommunicate from CCO_Communication                        
  where CompAssessmentId=@compAssessmentId and CompAssessmentVersioningId = @documentversionid                             
 If (@ImproveCommunicate=1)                                
BEGIN                        
DECLARE @UDIDCommunicationSkill INT;                        
Select @UDIDCommunicationSkill=UDID from s_UserDefinedOptions where UDDescription='People Interact With Other Members of The Community'                                
Exec usp_InsertModifyOutcomes_SupportStrategiesExported @ClientID,@UDIDCommunicationSkill,'To improve/maintain my communication skills',@compAssessmentId,@documentversionid                               
END;                     
   IF   (@NoMeansOfExpressing_YesNo = 1)                                          
                             BEGIN                                       
                             exec usp_InsertModifyCCO_ToDo  @companyId,@ClientId,@reportedby ,'Possible Referral Needed for Augmentive and Alternative Communication Evaluation',NULL;                                           
                             END;                               
END;                
                                              
SELECT @ClientId=ClientId FROM CCO_CompAssessment where CompAssessmentId=@CompAssessmentId            
            
DECLARE @formid INT            
SELECT @formid = FormID                              
FROM s_Form                         
WHERE FormName = 'PATHS' AND CompanyID = 1;            
            
Exec [dbo].[CX360_USP_InsertClientChart]  @P_Action='Update',@P_ClientID =@ClientId,@P_FormId=@formid,@P_KeyFieldId=null,@P_UserId=@reportedby,@P_Description='N/A',@P_TableName='CCO_CompAssessmentVersioning'            
            
                        
END;       