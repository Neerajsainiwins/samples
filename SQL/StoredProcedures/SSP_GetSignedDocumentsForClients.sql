

/****** Object:  StoredProcedure [dbo].[SSP_GetSignedDocumentsForClients]   ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SSP_GetSignedDocumentsForClients]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[SSP_GetSignedDocumentsForClients]
GO



/****** Object:  StoredProcedure [dbo].[SSP_GetSignedDocumentsForClients]     ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[SSP_GetSignedDocumentsForClients] (
	@ClientId INT 
	,@WidgetId INT 
	,@RefreshData CHAR(1) = NULL
	)
AS
BEGIN
	BEGIN TRY 
			DECLARE @query NVARCHAR(MAX)
			DECLARE @ResultSet TABLE (
			TableName VARCHAR(250)
			,FieldName VARCHAR(250)
			,DocumentCodeId INT
			,DocumentName VARCHAR(250)
			,DisplayMode Varchar(250)
			)

			INSERT INTO @ResultSet (
			TableName
			,FieldName
			,DocumentCodeId
			,DocumentName
			,DisplayMode
			)
			SELECT DISTINCT WBDF.TableName
			,WBDF.FieldName
			,WBD.DocumentCodeId
			,DC.DocumentName
			,GC.CodeName AS DisplayMode
			FROM WidgetBuilderDocumentFields AS WBDF
			JOIN WidgetBuilderDocuments AS WBD ON WBDF.WidgetBuilderDocumentId = WBD.WidgetBuilderDocumentId
			JOIN DocumentCodes DC ON DC.DocumentCodeId = WBD.DocumentCodeId
			LEFT JOIN GlobalCodes GC ON GC.GlobalCodeId = WBD.DisplayMode
			WHERE WBD.WidgetId = @WidgetId

			CREATE TABLE #ResultSet1 (
			TableName VARCHAR(250)
			,FieldName VARCHAR(250)
			,DocumentCodeId INT
			,FieldValue VARCHAR(250)
			,EffectiveDate DATETIME
			,DocumentVersionId INT
			)

			DECLARE @TableName VARCHAR(250)
			,@FieldName VARCHAR(250)
			,@DocumentCodeId INT

			DECLARE db_cursor CURSOR
			FOR
			SELECT TableName
			,FieldName
			,DocumentCodeId
			FROM @ResultSet

			OPEN db_cursor

			FETCH NEXT
			FROM db_cursor
			INTO @TableName
			,@FieldName
			,@DocumentCodeId

			WHILE @@FETCH_STATUS = 0
			BEGIN
			INSERT INTO #ResultSet1 (
			TableName
			,FieldName
			,DocumentCodeId
			,EffectiveDate
			,DocumentVersionId
			)

				SELECT TOP 3 @TableName
				,@FieldName
				,@DocumentCodeId
				,D.EffectiveDate
				,D.CurrentDocumentVersionId
				FROM Documents D
				JOIN DocumentCodes DC ON D.DocumentCodeId=DC.DocumentCodeId 
				JOIN DocumentVersions DV ON D.DocumentId = DV.DocumentId
				WHERE D.DocumentCodeId = @DocumentCodeId
				AND  D.[Status]=22 AND D.ClientId = @ClientId
				AND ISNULL(D.RecordDeleted, 'N') = 'N'
				AND ISNULL(DV.RecordDeleted, 'N') = 'N'
				ORDER BY D.EffectiveDate DESC
				,D.ModifiedDate

				SET @query = 'UPDATE a
							  SET FieldValue=ISNULL((SELECT ' + @FieldName + ' FROM ' + @TableName + ' WHERE DocumentVersionId=a.DocumentVersionId ),0)
							  FROM #ResultSet1 a
							  WHERE TableName= ''' + @TableName + '''
							  and FieldName= ''' + @FieldName + '''
							  '


				EXECUTE (@query)

				SET @query = NULL

				FETCH NEXT
				FROM db_cursor
				INTO @TableName
				,@FieldName
				,@DocumentCodeId
				END

				CLOSE db_cursor

				DEALLOCATE db_cursor

				SELECT * FROM @ResultSet

				 SELECT EffectiveDate
						  FROM   #ResultSet1
						  GROUP  BY EffectiveDate
						  ORDER  BY EffectiveDate ASC  

				DECLARE @cols NVARCHAR(MAX)
				,@query1 NVARCHAR(MAX);

				SET @cols = STUFF((
				SELECT ',' + QUOTENAME(c.EffectiveDate)
				FROM #ResultSet1 c 
				GROUP BY c.EffectiveDate 
				ORDER BY c.EffectiveDate ASC 
				FOR XML PATH('')
				,TYPE
				).value('.', 'nvarchar(max)'), 1, 1, '');
				SET @query1 = 'SELECT [FieldName], ' + @cols + 'from (SELECT [FieldName],
				FieldValue,
				[EffectiveDate] AS [category]
				FROM #ResultSet1
				)x pivot (max(FieldValue) for category in (' + @cols + ')) p
				';

				EXECUTE (@query1);

				DROP TABLE #ResultSet1
	END TRY

	BEGIN CATCH
		DECLARE @Error VARCHAR(8000)

		SET @Error = CONVERT(VARCHAR, ERROR_NUMBER()) + '*****' + CONVERT(VARCHAR(4000), ERROR_MESSAGE()) + '*****' + ISNULL(CONVERT(VARCHAR, ERROR_PROCEDURE()), 'SSP_GetSignedDocumentsForClients') + '*****' + CONVERT(VARCHAR, ERROR_LINE()) + '*****' + CONVERT(VARCHAR, ERROR_SEVERITY()) + '*****' + CONVERT(VARCHAR, ERROR_STATE())

		RAISERROR (
				@Error
				,-- Message text.                                                   
				16
				,-- Severity.                                                                
				1 -- State.                                                             
				);

		RETURN (1)
	END CATCH

	RETURN (0)
END

GO


