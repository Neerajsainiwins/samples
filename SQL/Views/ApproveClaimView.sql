/****** Object:  View [dbo].[ApproveClaimView]    ******/
IF  EXISTS (SELECT * FROM sys.views WHERE object_id = OBJECT_ID(N'[dbo].[ApproveClaimView]'))
DROP VIEW [dbo].[ApproveClaimView]
GO

/****** Object:  View [dbo].[ApproveClaimView]    ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

create view [dbo].[ApproveClaimView] 
as
select CL.claimlineid,
CASE
WHEN ISNULL(C.ClientType, 'I') = 'I'      
       THEN ISNULL(C.firstname, '') + ' ' +  ISNULL(C.lastname, '')
       ELSE ISNULL(C.OrganizationName, '')      
       End  as "Member_Name",G.codename as "Status",
P.providername,S.sitename,CL.RenderingProviderName,
CL.ClaimedAmount,CL.claimid,CL.procedurecode,CL.revenuecode,CL.units,convert(varchar(10), CL.Fromdate, 101) as Fromdate,
convert(varchar(10), CL.todate, 101) as todate 
from claimlines CL Join claims CLM On CLM.claimid = CL.claimid 
Join clients C On CLM.clientid = C.clientid 
Join sites S On CLM.siteid = S.siteid 
Join providers P On  S.providerid = P.providerid
Join globalcodes G On  CL.status = G.globalcodeid 
where 
 isnull(G.recorddeleted,'N') = 'N'
GO


