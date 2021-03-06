
ALTER PROCEDURE [dbo].[sp_GetApplicationPaymentDetail]	@applicationid AS INT, 
                                                        @languageid AS    INT, 
                                                        @userid AS        NVARCHAR(100), 
                                                        @stageActionId AS INT,
														@creatorName   NVARCHAR(100), 
														@orderNumber AS VARCHAR(50) OUTPUT, 
														@message AS VARCHAR(50) OUTPUT, 
														@services AS VARCHAR(500) OUTPUT, 
														@status AS VARCHAR(500) OUTPUT
AS
    BEGIN
        DECLARE @stageid AS INT, @stagestatusid AS INT, @applicationstageid AS INT, @applicationstageactionid AS INT,@orderid AS INT, @stagesettings AS NVARCHAR(500), @serviceId AS INT, @orderdate AS DateTime;
        DECLARE @paid AS INT, @currentdate AS DATETIME, @minute AS INT, @applicationNumber AS VARCHAR(50);
        DECLARE @openStageStatusId INT= 1, @closeStageStatusId INT= 2, @paymentStageTypeId INT= 2;
        DECLARE @uId INT;
		SET @message = 'New';
        EXEC @uId = sp_GetUserId 
             @userid,@creatorName;
        
		BEGIN TRY
            BEGIN TRAN;
			
				SELECT DISTINCT TOP 1 @applicationstageid = App_Stg.Id, 
									  @stageid = App_Stg.StageId, 
									  @stagestatusid = App_Stg.StageStatusId, 
									  @stagesettings = Stg.Settings, 
									  @serviceId = App.ServiceId,
									  @applicationNumber = App.ApplicationNumber,
									  @applicationstageactionid = App_Stg.LastAppActionId
				FROM		vw_ApplicationStagesOrderBy App_Stg
				INNER JOIN	application.applications App ON App.Id = App_Stg.ApplicationId
				INNER JOIN	service.Stages Stg ON Stg.Id = App_Stg.StageId
				INNER JOIN lookups.StageTypes Stg_Typ ON Stg_Typ.Id = Stg.StageTypeId
				WHERE	App.Id = @applicationid
				AND		Stg_Typ.Id = @paymentStageTypeId
				AND		App_Stg.StageStatusId = @openStageStatusId

				if(@applicationstageid is null)
				BEGIN
					SELECT	NULL AS Id, 
							500 AS STATUS, 
							'INVALIDSTATUS' AS ErrorMessage;
					RETURN
				END

				-- Prepare Service Codes List
				CREATE TABLE #tempTransactions
				(ServiceCode VARCHAR(50), 
				 Quantity    INT, 
				 Amount      VARCHAR(50)
				);
				INSERT INTO #tempTransactions
				(ServiceCode, 
				 Quantity, 
				 Amount
				)
				SELECT ServiceCode, Quantity, Amount from [custom].fn_GetPaymentServiceCodesDetails (@stageid, @stagestatusid,@applicationstageid, @stagesettings ,@serviceId, @applicationid )
				
				UPDATE #tempTransactions
				  SET 
					  Quantity = 1
				WHERE Quantity IS NULL;                        

				PRINT 'select * from [custom].fn_GetPaymentServiceCodesDetails ('+str(@stageid)+', '+str(@stagestatusid)+','+str(@applicationstageid)+','''+@stagesettings+''','+str(@serviceId)+','+str(@applicationid )+')'

				-- Check Previous Transactions
				SELECT @paid = Pay_Tran.Paid, 
					   @orderNumber = Pay_Tran.OrderNumber, 
					   @currentdate = Pay_Tran.CreatedDateTime
				FROM			application.PaymentTransactions Pay_Tran
					INNER JOIN	application.ApplicationStageActions App_Stg_Act on App_Stg_Act.Id = Pay_Tran.ApplicationStageActionId
				WHERE App_Stg_Act.ApplicationStageId = @applicationstageid
				ORDER BY Pay_Tran.OrderId;

				IF (@orderNumber IS NOT NULL)
				BEGIN
						SET @minute =
						(
							SELECT DATEDIFF(MINUTE, @currentdate, GETDATE())
						);

						IF(@paid IS NULL AND @minute <= 15)
								SET @message = 'Pending';

						ELSE IF(@paid IS NULL AND @minute >= 15)
								SET @message = 'Check';

						ELSE IF(@paid = 1)
								SET @message = 'Paid';

						ELSE IF(@paid = 0)
								SET @message = 'Failed';
				END;
				
				set @status = 'Ok';
				IF(@message = 'Failed' OR @message = 'New')
				--Generate new transaction
				BEGIN
					--Generate payment transaction
					set @orderNumber = 'ORD' + CAST(CAST(Datediff(s, '2000-01-01', getdate()) AS BIGINT)*1000 AS Varchar(100));
					INSERT INTO application.PaymentTransactions
					(	OrderNumber,  
						Paid, 
						ApplicationStageActionId, 
						TaxAmount, 
						EDirhamFeesAmount, 
						TotalAmount, 
						CreatedBy, 
						CreatedDateTime
					)
					VALUES
					(	@orderNumber, 
						NULL, 
						@applicationstageactionid, 
						NULL, 
						NULL, 
						NULL, 
						@uId, 
						GETDATE()
					);
					SET @orderid = SCOPE_IDENTITY();

					--Generate payment transaction details
					INSERT INTO [application].[PaymentTransactionDetails]
					(	OrderId, 
						ServiceCode, 
						Quantity, 
						Amount
					)
					SELECT @orderid, 
							ServiceCode, 
							Quantity, 
							Amount
					FROM #tempTransactions;
                            
					SET @services = (
						SELECT ServiceCode, 
								Quantity, 
								Amount
						FROM #tempTransactions FOR JSON AUTO, INCLUDE_NULL_VALUES
					);

				END;
				
            COMMIT TRANSACTION;
        END TRY
        BEGIN CATCH
            ROLLBACK TRANSACTION;
        END CATCH;
    END;