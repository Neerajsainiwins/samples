using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using PeakSystem.Web.Common;
using System.Collections.Generic;

public partial class Admin_WorkFlowDetails : AdminBasePage
{

    private DataTable DataTableStepCriteriaFields = null;
    protected Int32 _WorkFlowId = -1;
    protected Int32 _WorkFlowEventId = -1;
    protected string _WorkFlowEventDescription = null;
    private CommonAdministration _CommonAdministrationObject = null;
    private int _WorkFlowCriteriaCompanyId = -1;
    private string _workFlowCriteriaPrograms = string.Empty;
    private string _workFlowCriteriaProgramsControl = string.Empty;
    private string _CurrentStepSQL = "";
    protected string _Mode = string.Empty;
    private DataSetWorkFlow.WorkflowsRow _WorkflowsRowTemp = null;
    private PeakSystem.ErrorLogging.ErrorLogging _errorLogging = PeakSystem.ErrorLogging.ErrorLogging.Getinstance;
    /// <summary>
    /// This propoerty will be used to get/set Typed DataSet Object from Session
    /// </summary>
    private DataSetWorkFlow DataSetWorkFlowObject
    {
        get { return (DataSetWorkFlow)Session["WorkFlowInstance"]; }
        set { Session["WorkFlowInstance"] = value; }
    }

    
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Request.Url.AbsoluteUri.ToLower().Contains("?") && Request.QueryString.Count == 0)
        {
            Response.Redirect("DesignWorkflow.aspx", false);
        }
        Master.InnerTitle = "Workflow Details";
        if (Request.QueryString["Mode"] == null || Request.QueryString["Mode"].ToString() == "")
            _Mode = "none";
        else
            _Mode = "block";
        if(!IsPostBack)
        {
            _CommonAdministrationObject = new CommonAdministration();
            DataSetWorkFlow DataSetWorkFlowTempObject = null;
            using (DataSetWorkFlowTempObject = new DataSetWorkFlow())
            {
                DataSetWorkFlowObject = DataSetWorkFlowTempObject;
            }
            BindWorkFlowControls();
            
        }
    }

    /// <summary>
    /// This method will be used to Bind the Grid by splitting the Fields String
    /// </summary>
    /// <param name="Fields"></param>

    private void GetFieldsCriteria(DataTable DataTableWorkFlowEventAssociatedColumns)
    {
        DataTableStepCriteriaFields = DataTableWorkFlowEventAssociatedColumns;
        DataRow DataRowTemp = null;
        try
        {
            
            for (Int16 Rows = 0; Rows < DataTableStepCriteriaFields.Rows.Count; Rows++)
            {
                DataRowTemp = DataTableStepCriteriaFields.Rows[Rows];
                DataRowTemp["Value"] = GetColumnValue(DataRowTemp["ColumnName"].ToString());
            }
            GridViewStepCriteria.DataSource = DataTableStepCriteriaFields;
            GridViewStepCriteria.DataBind();
            GridViewStepCriteria.Visible = true;
        }

        catch
        {

        }
        finally
        {
            ClientScript.RegisterStartupScript(GetType(), "Startup13", "<Script Language='Javascript'>FormatCriteriaFields();</Script>");

        }
    }
    protected void GridViewStepCriteria_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        try
        {
            if (e.Row.RowIndex > -1)
            {
                switch (e.Row.Cells[1].Text.ToString().ToUpper())
                {

                    case "INTEGER":
                        {
                            
                            string TableName = e.Row.Cells[5].Text.Substring(0, e.Row.Cells[5].Text.IndexOf("."));
                            string ColumnName = e.Row.Cells[5].Text.Substring(e.Row.Cells[5].Text.IndexOf(".") + 1);
                            if (IsReferenceColumn(TableName, ColumnName))
                            {
                                e.Row.Cells[3].Controls.Add(GetReferenceDropDown(TableName, ColumnName));

                                Control TempControl = e.Row.Cells[3].Controls[e.Row.Cells[3].Controls.Count - 1];
                                if (TempControl.GetType().ToString() == "System.Web.UI.WebControls.ListBox")
                                {
                                    HyperLink HTemp = new HyperLink();
                                    HTemp.Text = "Clear";
                                    HTemp.NavigateUrl = "Javascript:ClearList('" + e.Row.Cells[3].Controls[e.Row.Cells[3].Controls.Count - 1].ClientID.ToString() + "')";
                                    e.Row.Cells[3].Controls.Add(HTemp);

                                    if (((ListBox)TempControl).DataTextField == "Program")
                                    {
                                        e.Row.Cells[3].Attributes["Company"] = "True";
                                    }
                                }

                                e.Row.Cells[2].Controls.Add(GetOperator("String"));
                            }
                            else
                            {
                                e.Row.Cells[2].Controls.Add(GetOperator("Numeric"));
                                e.Row.Cells[3].Controls.Add(new TextBox());
                            }
                            break;
                        }
                    case "VARCHAR":
                        {
                            DataRowView dr = (DataRowView)e.Row.DataItem;
                            
                            e.Row.Cells[2].Controls.Add(GetOperator("String"));
                            if (!dr["ColumnName"].ToString().Equals("ClientSessionNotes.GroupCompleted"))
                            {
                                e.Row.Cells[3].Controls.Add(new TextBox());
                            }
                            else
                            {
                                DropDownList listBox = new DropDownList() { Items = { new ListItem { Text = "", Value = "-1" }, new ListItem { Text = "NO", Value = "'N'" }, new ListItem { Text = "YES", Value = "'Y'" } } };
                                listBox.Attributes.Add("data-type", "char");
                                e.Row.Cells[3].Controls.Add(listBox);

                            }
                            break;
                        }
                    case "TEXT":
                        {
                            e.Row.Cells[2].Controls.Add(GetOperator("String"));
                            e.Row.Cells[3].Controls.Add(new TextBox());
                            break;
                        }
                    case "DATETIME":
                        {
                            e.Row.Cells[2].Controls.Add(GetOperator("DATETIME"));
                            e.Row.Cells[3].Controls.Add(new TextBox());
                            Image ImageCalender = new Image();
                            ImageCalender.ImageUrl = "../App_Themes/Images/icons/icon_calendar.png";
                            ImageCalender.Attributes.Add("onmouseover", "CalShow(this,'" + e.Row.Cells[3].Controls[e.Row.Cells[3].Controls.Count - 1].ClientID + "');");
                            ImageCalender.AlternateText = e.Row.Cells[0].Text;
                            e.Row.Cells[3].Controls.Add(ImageCalender);
                            break;
                        }
                    case "GETDATE()":
                        {
                            e.Row.Cells[2].Controls.Add(GetOperator("DATETIME"));
                            e.Row.Cells[3].Controls.Add(GetOperator("Fields"));
                            e.Row.Cells[3].Controls.Add(GetOperator("GETDATE()"));
                            e.Row.Cells[3].Controls.Add(new TextBox());
                            break;
                        }

                }
                SetValue(e.Row, e.Row.Cells[4].Text);

                if (e.Row.Cells[0].Text == "Company")
                {
                    DropDownList dropCompany = (DropDownList)e.Row.Cells[3].Controls[e.Row.Cells[3].Controls.Count - 1];
                    dropCompany.Enabled = false;
                }
            }
        }
        catch
        {
            //throw Ex;
        }
    }

    private string GetColumnValue(string ColumnName)
    {
        if (_CurrentStepSQL.IndexOf(ColumnName) < 0) return "";
        string CurrentStepTempSQL = _CurrentStepSQL.Substring(_CurrentStepSQL.IndexOf("where", StringComparison.InvariantCultureIgnoreCase) + 5);
        string Value = "";
        int _IndexOfColumn = -1;
        int _LengthOfValue = -1;
        string SpecialOperator = "";
        string Operator = "";
       
        try
        {
            
            if ((ColumnName == "Programs.CompanyId" || ColumnName == "ClientMovements.Program_Entering" || ColumnName == "ClientProgramEnrollments.ProgramId") && CurrentStepTempSQL.IndexOf(ColumnName) < 0)
            {
                if (_CurrentStepSQL.IndexOf(ColumnName + " Not In ") > -1)
                    CurrentStepTempSQL += " And " + _CurrentStepSQL.Substring(_CurrentStepSQL.IndexOf(ColumnName + " Not In "), (_CurrentStepSQL.IndexOf(" ", _CurrentStepSQL.IndexOf(ColumnName + " Not In ") + ColumnName.Length + 8) - _CurrentStepSQL.IndexOf(ColumnName + " Not In ")));
                else if (_CurrentStepSQL.IndexOf(ColumnName + " In ") > -1)
                    CurrentStepTempSQL += " And " + _CurrentStepSQL.Substring(_CurrentStepSQL.IndexOf(ColumnName + " In "), (_CurrentStepSQL.IndexOf(" ", _CurrentStepSQL.IndexOf(ColumnName + " In ") + ColumnName.Length + 4) - _CurrentStepSQL.IndexOf(ColumnName + " In ")));
                
                else
                    CurrentStepTempSQL += " And " + _CurrentStepSQL.Substring(_CurrentStepSQL.IndexOf(ColumnName), (_CurrentStepSQL.IndexOf(" ", _CurrentStepSQL.IndexOf(ColumnName) + ColumnName.Length + 1) - _CurrentStepSQL.IndexOf(ColumnName)));
                
            }

            if (ColumnName == "[Current Date]")
            {
                _IndexOfColumn = CurrentStepTempSQL.LastIndexOf(ColumnName) + ColumnName.Length;
                _LengthOfValue = CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn) - _IndexOfColumn;
                SpecialOperator = CurrentStepTempSQL.Substring(CurrentStepTempSQL.IndexOf(ColumnName) + ColumnName.Length, 1);
            }

            else
            {
                SpecialOperator = "-";
                _IndexOfColumn = CurrentStepTempSQL.IndexOf(ColumnName) + ColumnName.Length;
                if (CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn) < 0)
                    _LengthOfValue = CurrentStepTempSQL.Length - _IndexOfColumn;
                else if (CurrentStepTempSQL.IndexOf(" Not In", _IndexOfColumn) > -1 && CurrentStepTempSQL.Substring(_IndexOfColumn, 7).Trim().ToUpper() == "NOT IN")
                {
                    if (CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn + 8) > -1)
                        _LengthOfValue = CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn + 8) - _IndexOfColumn;
                    else
                        _LengthOfValue = CurrentStepTempSQL.Length - _IndexOfColumn;
                }
                else if (CurrentStepTempSQL.IndexOf(" In", _IndexOfColumn) > -1 && CurrentStepTempSQL.Substring(_IndexOfColumn, 3).Trim().ToUpper() == "IN")
                {
                    if (CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn + 4) > -1)
                        _LengthOfValue = CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn + 4) - _IndexOfColumn;
                    else
                        _LengthOfValue = CurrentStepTempSQL.Length - _IndexOfColumn;
                }
                else
                    _LengthOfValue = CurrentStepTempSQL.IndexOf(" ", _IndexOfColumn) - _IndexOfColumn;
            }
            Value = CurrentStepTempSQL.Substring(_IndexOfColumn, _LengthOfValue);
            if (Value.IndexOf("<>") > -1)
                Operator = "<>";
            else if (Value.IndexOf("Not In") > -1)
                Operator = "Not In";
            else if (Value.IndexOf("In") > -1)
                Operator = "In";
            else
                Operator = Value.Substring(0, 1);
            Value = Value.Replace(Operator, "");
            if (Operator == "In") Value = Value.Replace("(", "").Replace(")", "");
            if (Operator == "Not In") { Value = Value.Replace("(", "").Replace(")", ""); Operator = "<>"; }
            if (Value == "")
                Value = Operator + "$$-1$$" + SpecialOperator;
            else
                Value = Operator + "$$" + Value + "$$" + SpecialOperator;

            
            return Value;
        }

        catch(Exception Ex)
        {
            _errorLogging.LogError(Ex, Request.UrlReferrer.LocalPath);
        }
        finally
        {

        }
        return "";

    }

    private void SetValue(GridViewRow Row, string Value)
    {
        if (Value != "" && Value.IndexOf("$$") > -1)
        {
            string[] splitOperator = new string[] { "$$" };
            string[] splitValues = Value.Split(splitOperator, StringSplitOptions.RemoveEmptyEntries);
            if (Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 1].GetType().ToString() == "System.Web.UI.WebControls.Image")
                ((TextBox)Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 2]).Text = splitValues[1];
            else if (Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 1].GetType().ToString() == "System.Web.UI.WebControls.DropDownList")
            {
                DropDownList DropDownListTemp = ((DropDownList)Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 1]);
                if (Row.Cells[0].Text == "Company") { _WorkFlowCriteriaCompanyId = Convert.ToInt32(splitValues[1]); }
                if (_WorkFlowCriteriaCompanyId == -1) _WorkFlowCriteriaCompanyId = Convert.ToInt32(((SitePrinciple)HttpContext.Current.Session["UserContext"]).DataRowUser["DefaultCompanyId"]);
                DropDownListTemp.SelectedValue = Server.HtmlDecode(splitValues[1].Trim());
                try
                {
                    if (DropDownListTemp.SelectedValue != splitValues[1] && ((DataView)DropDownListTemp.DataSource) != null && ((DataView)DropDownListTemp.DataSource).Table.TableName == "Staff")
                    {
                        _CommonAdministrationObject = new CommonAdministration();
                        DataTable DataTableStaff = _CommonAdministrationObject.GetStaff(Convert.ToInt32(splitValues[1]), -1);
                        if (DataTableStaff.Rows.Count > 0)
                        {
                            DropDownListTemp.Items.Add(new ListItem(DataTableStaff.Rows[0]["FirstName"].ToString() + " " + DataTableStaff.Rows[0]["LastName"].ToString(), DataTableStaff.Rows[0]["UserId"].ToString()));
                            DropDownListTemp.SelectedValue = splitValues[1];
                        }
                    }
                }
                catch
                {

                }
            }
            else if (Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 2].GetType().ToString() == "System.Web.UI.WebControls.ListBox")
            {
                ListBox ListBoxTemp = ((ListBox)Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 2]);
                if (splitValues[1].Trim().Length > 0)
                {
                    string[] splitValuesOperator = new string[] { "," };
                    string[] SelectedValues = splitValues[1].Split(splitValuesOperator, StringSplitOptions.RemoveEmptyEntries);
                    if (Row.Cells[0].Text == "Program")
                    {
                        _workFlowCriteriaPrograms = splitValues[1];
                        _workFlowCriteriaProgramsControl = ListBoxTemp.ClientID;

                    }
                    for (int i = 0; i < SelectedValues.Length; i++)
                    {
                        ListItem ListItemSelected = ListBoxTemp.Items.FindByValue(SelectedValues[i].ToString().Trim());
                        if (ListItemSelected != null)
                        {
                            ListItemSelected.Selected = true;
                        }
                    }
                }
                else
                    ListBoxTemp.SelectedValue = splitValues[1].Trim();

            }
            else
            {

                ((TextBox)Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 1]).Text = splitValues[1];
            }


            if (splitValues[2] != "-")
            {
                ((DropDownList)Row.Cells[3].Controls[Row.Cells[3].Controls.Count - 2]).SelectedValue = Server.HtmlDecode(splitValues[0]);
                ((DropDownList)Row.Cells[2].Controls[Row.Cells[2].Controls.Count - 1]).SelectedValue = Server.HtmlDecode(splitValues[2]);
            }
            else
            {
                ((DropDownList)Row.Cells[2].Controls[Row.Cells[2].Controls.Count - 1]).SelectedValue = Server.HtmlDecode(splitValues[0]);
            }
        }
        
        if (_WorkflowsRowTemp["EventDescription"].ToString() == "New Client Program Phase" && Row.Cells[5].Text == "ClientProgramPhases.ProgramPhaseId")
        {
            Row.Attributes.Add("DependentParent", "ClientProgramPhases.ProgramPhaseId");
        }

        if (_WorkflowsRowTemp["EventDescription"].ToString() == "New Client Security Level" && Row.Cells[5].Text == "ClientSecurityLevel.SecurityLevelId")
        {
            Row.Attributes.Add("DependentParent", "ClientSecurityLevel.SecurityLevelId");
        }
    }
    private DropDownList GetOperator(string DataType)
    {
        DropDownList DropDownListObject = new DropDownList();

        switch (DataType)
        {
            case "Numeric":
                {
                    DropDownListObject.Items.Add("=");
                    DropDownListObject.Items.Add(">");
                    DropDownListObject.Items.Add("<");
                    DropDownListObject.Items.Add("<>");
                    break;
                }
            case "String":
                {
                    DropDownListObject.Items.Add("=");
                    DropDownListObject.Items.Add("<>");
                    break;
                }
            case "DATETIME":
                {
                    DropDownListObject.Items.Add("=");
                    DropDownListObject.Items.Add(">");
                    DropDownListObject.Items.Add("<");
                    DropDownListObject.Items.Add("<>");
                    break;
                }
            case "GETDATE()":
                {
                    DropDownListObject.Items.Add("+");
                    DropDownListObject.Items.Add("-");
                    DropDownListObject.Items.Add("<>");
                    break;
                }
            case "Fields":
                {
                    DropDownListObject.DataSource = FilterCriteriaFields(DataTableStepCriteriaFields, "DATETIME");
                    DropDownListObject.DataTextField = "ColumnName";
                    DropDownListObject.DataValueField = "ColumnName";
                    DropDownListObject.DataBind();
                    break;
                }
        }
        return DropDownListObject;
    }

    /// <summary>
    /// This method will be used to Fiter Fields Table on based of passed filter
    /// </summary>
    /// <param name="DataTableCriteriaFields"></param>
    /// <param name="DataType"></param>
    /// <returns></returns>
    private DataTable FilterCriteriaFields(DataTable DataTableCriteriaFields, string DataType)
    {
        DataSet DataSetCriteriaFields = new DataSet();

        switch (DataType)
        {
            case "DATETIME":
                {

                    DataSetCriteriaFields.Merge(DataTableCriteriaFields.Select("DataType='System.DateTime' or DataType='GetDate()'"));
                    break;
                }

        }
        return DataSetCriteriaFields.Tables[0];
    }

    private bool IsReferenceColumn(string TableName, string ColumnName)
    {
        DataSetMain DataSetMainObject = null;
        try
        {
            DataSetMainObject = new DataSetMain();
            _CommonAdministrationObject = new CommonAdministration();
            if (DataSetMainObject.Tables.IndexOf(TableName) < 0) return false;
            DataRelation DataRelationTemp = GetDataRelation(DataSetMainObject.Tables[TableName], ColumnName);
            if (DataRelationTemp != null)
            {
                return true;
            }
        }

        catch
        {

        }
        finally
        {
            DataSetMainObject.Dispose();
        }


        return false;
    }
    private DataRelation GetDataRelation(DataTable DataTableTemp, string ColumnName)
    {
        for (Int16 i = 0; i < DataTableTemp.ParentRelations.Count; i++)
        { 
            if (DataTableTemp.ParentRelations[i].ChildColumns[0].ColumnName.IndexOf(ColumnName) > -1) return DataTableTemp.ParentRelations[i];
        }
        return null;                                                                                                                                                                                                                                                                                                                                                                          
    }

    private Control  GetReferenceDropDown(string TableName, string ColumnName)
    {
        DataSetMain DataSetMainObject = null;
        DropDownList DropDownListTemp = null;
        ListBox ListBoxTemp = null;
        try
        {
            DataSetMainObject = new DataSetMain();
            DataRelation DataRelationTemp = GetDataRelation(DataSetMainObject.Tables[TableName], ColumnName);
            DropDownListTemp = new DropDownList();
            if (DataRelationTemp.ParentTable.TableName.ToUpper() == "GLOBALCODES")
            {
                string GlobalCodeCategory = "";
                try
                {
                    GlobalCodeCategory = DataRelationTemp.RelationName.Replace("_FK", "");
                    GlobalCodeCategory = GlobalCodeCategory.Substring(GlobalCodeCategory.LastIndexOf("_") + 1);
                    GlobalCodeCategory = GlobalCodeCategory.Replace("MovementStatus", "ClientMovementStatus");
                }

                catch
                {
                }

                //GlobalCodeCategory = GlobalCodeCategory.Substring(
                _CommonAdministrationObject = new CommonAdministration();
                if (GlobalCodeCategory.ToUpper() == "IRSEVERITY")
                    _CommonAdministrationObject.BindGlobalCodesDropDown(DropDownListTemp, "IRSeverity", true, true);
                else if (GlobalCodeCategory.ToUpper() == "RELEASETO")
                {
                    DropDownListTemp = null;
                    ListBoxTemp = new ListBox();
                    ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                    _CommonAdministrationObject.BindGlobalCodesDropDown(ListBoxTemp, "ExternalFacilities");
                }
                else if (GlobalCodeCategory.ToUpper() == "DOCUMENTTYPE"
                    || GlobalCodeCategory.ToUpper() == "TASKTYPE"
                    || GlobalCodeCategory.ToUpper() == "NOTETYPE"
                    || GlobalCodeCategory.ToUpper() == "INCIDENTREPORTSTATUS"
                    || GlobalCodeCategory.ToUpper() == "CONFINEMENTTYPE"
                    || GlobalCodeCategory.ToUpper() == "PROGRAMSTATUS"
                    || GlobalCodeCategory.ToUpper() == "DIETARYNEEDS"
                    || GlobalCodeCategory.ToUpper() == "LABACCOUNTNUMBER"
                    || GlobalCodeCategory.ToUpper() == "VIOLATIONTYPE"
                    || GlobalCodeCategory.ToUpper() == "GRIEVANCECATEGORY"
                    || GlobalCodeCategory.ToUpper() == "MANAGINGLOCATION"
                    || GlobalCodeCategory.ToUpper() == "SECURITYPROCEDURETYPE"
                    || GlobalCodeCategory.ToUpper() == "CASESTATUS"
                    ||GlobalCodeCategory.ToUpper()=="SERVICESTATUS"
                    || GlobalCodeCategory.ToUpper() == "CLIENTSTATUSTYPE")
                {
                    DropDownListTemp = null;
                    ListBoxTemp = new ListBox();
                    ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                    _CommonAdministrationObject.BindGlobalCodesDropDown(ListBoxTemp, GlobalCodeCategory);
                }

                else if (GlobalCodeCategory.ToUpper() == "MEETINGTYPE")
                {

                    DropDownListTemp = null;
                    ListBoxTemp = new ListBox();
                    ListBoxTemp.Rows = 4;
                    ListBoxTemp.DataSource = _CommonAdministrationObject.BindGlobalCodesListBox(GlobalCodeCategory);
                    ListBoxTemp.DataTextField = "CodeName";
                    ListBoxTemp.DataValueField = "GlobalCodeId";
                    ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                    ListBoxTemp.DataBind();
                    if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                    {
                        ListBoxTemp.Items.RemoveAt(0);
                    }
                }
                /// <ModifedDate>04th-Feb-19</ModifedDate>
                /// <Description>Listbox for Leave type.</Description>
                /// <UserStory>1138</UserStory>
                else if (GlobalCodeCategory.ToUpper() == "LEAVETYPE")
                {

                    DropDownListTemp = null;
                    ListBoxTemp = new ListBox();
                    ListBoxTemp.Rows = 4;
                    ListBoxTemp.DataSource = _CommonAdministrationObject.BindGlobalCodesListBox(GlobalCodeCategory);
                    ListBoxTemp.DataTextField = "CodeName";
                    ListBoxTemp.DataValueField = "GlobalCodeId";
                    ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                    ListBoxTemp.DataBind();
                    if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                    {
                        ListBoxTemp.Items.RemoveAt(0);
                    }
                }
                /// <ModifedDate>19th-Mar-19</ModifedDate>
                /// <Description>Listbox for Assessment type.</Description>
                /// <UserStory>1317</UserStory>
                else if (GlobalCodeCategory.ToUpper() == "ASSESSMENTTYPE")
                {

                    DropDownListTemp = null;
                    ListBoxTemp = new ListBox();
                    ListBoxTemp.Rows = 4;
                    ListBoxTemp.DataSource = _CommonAdministrationObject.BindGlobalCodesListBox(GlobalCodeCategory);
                    ListBoxTemp.DataTextField = "CodeName";
                    ListBoxTemp.DataValueField = "GlobalCodeId";
                    ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                    ListBoxTemp.DataBind();
                    if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                    {
                        ListBoxTemp.Items.RemoveAt(0);
                    }
                }
                /// <ModifyBy>Neeraj Saini</ModifyBy>
                /// <ModifedDate>29th-Jan-19</ModifedDate>
                /// <Description>special case for new movement type events to fetch movement type.</Description>
                /// <UserStory>1099</UserStory>
                else if (GlobalCodeCategory.ToUpper() == "MOVEMENTTYPE")
                {
                    if (_WorkFlowEventDescription == "New Client Arrival" || _WorkFlowEventDescription == "Changed Arrival Status")
                    {
                        DropDownListTemp.DataSource = _CommonAdministrationObject.BindGlobalCodeSpecificDropDown("Arrival", GlobalCodeCategory, _WorkFlowEventDescription);
                        DropDownListTemp.DataTextField = "CodeName";
                        DropDownListTemp.DataValueField = "GlobalCodeId";
                        DropDownListTemp.DataBind();
                    }
                    else if (_WorkFlowEventDescription == "New Client Transfer" || _WorkFlowEventDescription == "Changed Transfer Status")
                    {
                        DropDownListTemp.DataSource = _CommonAdministrationObject.BindGlobalCodeSpecificDropDown("Transfer", GlobalCodeCategory, _WorkFlowEventDescription);
                        DropDownListTemp.DataTextField = "CodeName";
                        DropDownListTemp.DataValueField = "GlobalCodeId";
                        DropDownListTemp.DataBind();
                    }
                    else
                    {
                        DropDownListTemp.DataSource = _CommonAdministrationObject.BindGlobalCodeSpecificDropDown("Release", GlobalCodeCategory, _WorkFlowEventDescription);
                        DropDownListTemp.DataTextField = "CodeName";
                        DropDownListTemp.DataValueField = "GlobalCodeId";
                        DropDownListTemp.DataBind();
                    }
                }

                else
                {
                    _CommonAdministrationObject.BindGlobalCodesDropDown(DropDownListTemp, GlobalCodeCategory, 'Y');
                    //// Modified by : Neeraj(Adjusted code to show first record of dropdown as defult in case of movement type as its compulsory.)
                    //// Modified date : 29th-Nov-2018(#741)
                    //// Modified date : 29th-Jan-2019(#1099)
                    //// Description : Commented code as the new events are created for movements.
                    //if (GlobalCodeCategory == "MovementType")
                    //{
                    //    if (DropDownListTemp.Items.Count > 0 && DropDownListTemp.Items[0].Text == "")
                    //    {
                    //        DropDownListTemp.Items.RemoveAt(0);
                    //    }
                    //}
                }

            }
            else if ((ColumnName == "ProgramId" || ColumnName == "Program_Entering"))
            {
                DropDownListTemp = null;
                ListBoxTemp = new ListBox();
                ListBoxTemp.DataTextField = "Program";
                ListBoxTemp.Rows = 4;
                ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                ListBoxTemp.DataValueField = "ProgramId";
                ListBoxTemp.DataSource = _CommonAdministrationObject.GetPrograms(-1, _WorkFlowCriteriaCompanyId, false);
                ListBoxTemp.DataBind();

                if (_WorkflowsRowTemp["PrimaryTable"].ToString() == "ClientProgramPhases")
                {
                    ListBoxTemp.Attributes.Add("onChange", "FillChildListBox(this," + _WorkFlowCriteriaCompanyId.ToString() + ",'GetProgramPhases');");
                }

                if (_WorkflowsRowTemp["PrimaryTable"].ToString() == "ClientSecurityLevel")
                {
                    ListBoxTemp.Attributes.Add("onChange", "FillChildListBox(this," + _WorkFlowCriteriaCompanyId.ToString() + ",'GetSecurityLevels');");
                }
            }
            else if(DataRelationTemp.ChildColumns[0].ColumnName == "CaseManagerId" && _WorkFlowEventDescription == "New TOMREX Agenda Request")
            {
                DropDownListTemp = null;
                ListBoxTemp = new ListBox();
                ListBoxTemp.Rows = 4;
                
                _CommonAdministrationObject = new CommonAdministration();
                DataTable DataTableCaseManagers = _CommonAdministrationObject.GetStaff(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), true);

                DataView DataViewCaseManager = new DataView(DataTableCaseManagers);
                DataViewCaseManager.RowFilter = "IsCaseManager='Y'";
                ListBoxTemp.DataSource = DataViewCaseManager;
                ListBoxTemp.DataTextField = "Staff";
                ListBoxTemp.DataValueField = "StaffId";
                ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                ListBoxTemp.DataBind();
                if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                {
                    ListBoxTemp.Items.RemoveAt(0);
                }
            }
            else if (DataRelationTemp.ChildColumns[0].ColumnName == "ServiceManagerId" && (_WorkFlowEventDescription == "New Client Service" || _WorkFlowEventDescription== "Changed Service Status" || _WorkFlowEventDescription == "Changed Service End Date"))
            {
              
                _CommonAdministrationObject = new CommonAdministration();
                DataTable DataTableCaseManagers = _CommonAdministrationObject.GetStaff(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), true);
                DropDownListTemp.DataSource = DataTableCaseManagers;
                DropDownListTemp.DataTextField = "Staff";
                DropDownListTemp.DataValueField = "StaffId";
                DropDownListTemp.DataBind();
              
            }
            else if(DataRelationTemp.ChildColumns[0].ColumnName == "CaseManagerId" && _WorkFlowEventDescription == "Changed Scheduled Completion Date")
            {
                DropDownListTemp = null;
                ListBoxTemp = new ListBox();
                ListBoxTemp.Rows = 4;

                _CommonAdministrationObject = new CommonAdministration();
                DataTable DataTableCaseManagers = _CommonAdministrationObject.GetStaff(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), true);

                DataView DataViewCaseManager = new DataView(DataTableCaseManagers);
                DataViewCaseManager.RowFilter = "IsCaseManager='Y'";
                ListBoxTemp.DataSource = DataViewCaseManager;
                ListBoxTemp.DataTextField = "Staff";
                ListBoxTemp.DataValueField = "StaffId";
                ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                ListBoxTemp.DataBind();
                if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                {
                    ListBoxTemp.Items.RemoveAt(0);
                }
            }
            else
            {
                if (DataRelationTemp.ChildColumns[0].ColumnName == "CaseManagerId")
                {
                    BindCaseManager(ref DropDownListTemp);
                }
                else
                {
                    //User Story: #1704
                    //Description: Handled TextColumnName for billing code.
                    string TextColumnName = null;
                    if ((TableName == "ClientAssessments" || TableName == "ClientContactNotes") && ColumnName == "BillingCodeId")
                        TextColumnName = DataRelationTemp.ParentTable.Columns[3].ColumnName;
                    else
                        TextColumnName = DataRelationTemp.ParentTable.Columns[1].ColumnName;
                    string ValueColumnName = DataRelationTemp.ParentTable.Columns[0].ColumnName;

                    if (TextColumnName.ToUpper() == "PROGRAMID" && DataRelationTemp.ParentTable.TableName.ToUpper() == "PROGRAMPHASES")
                        TextColumnName = "Description";
                    if (ColumnName.ToUpper() == "EMPLOYERID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        ListBoxTemp.DataSource = _CommonAdministrationObject.GetDynamicDropDownSource(DataRelationTemp.ParentTable.TableName, ValueColumnName, TextColumnName, DataRelationTemp.ParentTable.Columns.IndexOf("Active"));
                        ListBoxTemp.DataTextField = TextColumnName;
                        ListBoxTemp.DataValueField = ValueColumnName;
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                    }
                    else if (ColumnName.ToUpper() == "TREATMENTGROUPID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        ListBoxTemp.DataSource = _CommonAdministrationObject.GetDynamicDropDownSource(DataRelationTemp.ParentTable.TableName, ValueColumnName, TextColumnName, DataRelationTemp.ParentTable.Columns.IndexOf("Active"));
                        ListBoxTemp.DataTextField = TextColumnName;
                        ListBoxTemp.DataValueField = ValueColumnName;
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                        if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                        {
                            ListBoxTemp.Items.RemoveAt(0);
                        }
                    }
                    else if (ColumnName.ToUpper() == "PROGRAMPHASEID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        DataTable dataTableTemp = _CommonAdministrationObject.GetProgramPhases(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), true);
                        dataTableTemp.Columns.Add("TextColumn", typeof(String), "isnull(Description,'') + ' ' + Program");
                        DataView dataViewTemp = dataTableTemp.DefaultView;

                        if (_workFlowCriteriaPrograms.Length < 1)
                            _workFlowCriteriaPrograms = "-1";

                        ListBoxTemp.Attributes.Add("ParentControl", _workFlowCriteriaProgramsControl);
                        dataViewTemp.RowFilter = "ProgramId in(" + _workFlowCriteriaPrograms + ")";

                        ListBoxTemp.DataSource = dataViewTemp;
                        ListBoxTemp.DataTextField = "TextColumn";
                        ListBoxTemp.DataValueField = "ProgramPhaseId";
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                    }
                    else if (ColumnName.ToUpper() == "SECURITYLEVELID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;

                        DataTable dataTableTemp = _CommonAdministrationObject.GetSecurityLevels(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), -1, -1);
                        dataTableTemp.Columns.Add("TextColumn", typeof(String), "SecurityLevel + ' - ' + Program");
                        DataView dataViewTemp = dataTableTemp.DefaultView;

                        if (_workFlowCriteriaPrograms.Length < 1)
                            _workFlowCriteriaPrograms = "-1";

                        ListBoxTemp.Attributes.Add("ParentControl", _workFlowCriteriaProgramsControl);
                        dataViewTemp.RowFilter = "ProgramId in(" + _workFlowCriteriaPrograms + ")";

                        ListBoxTemp.DataSource = dataViewTemp;
                        ListBoxTemp.DataTextField = "TextColumn";
                        ListBoxTemp.DataValueField = "SecurityLevelId";
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                    }

                    //#1532
                    else if (ColumnName.ToUpper() == "SERVICEID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        PeakSystem.BusinessService.Services _ServicesObject = new PeakSystem.BusinessService.Services();
                        DataTable dataTableTemp = _ServicesObject.GetServices(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]));
                        dataTableTemp.Columns.Add("TextColumn", typeof(String), "isnull(Service,'')");
                        DataView dataViewTemp = dataTableTemp.DefaultView;
                        ListBoxTemp.DataSource = dataViewTemp;
                        ListBoxTemp.DataTextField = "TextColumn";
                        ListBoxTemp.DataValueField = "ServiceId";
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                        if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                        {
                            ListBoxTemp.Items.RemoveAt(0);
                        }
                    }


                    else if (ColumnName.ToUpper() == "SHIFTNOTETYPEID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        ListBoxTemp.DataSource = _CommonAdministrationObject.GetDynamicDropDownSource(DataRelationTemp.ParentTable.TableName, ValueColumnName, TextColumnName, DataRelationTemp.ParentTable.Columns.IndexOf("Active"));
                        ListBoxTemp.DataTextField = TextColumnName;
                        ListBoxTemp.DataValueField = ValueColumnName;
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                        if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                        {
                            ListBoxTemp.Items.RemoveAt(0);
                        }
                    }
                    else if (ColumnName.ToUpper() == "REFERRALSOURCEID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        ListBoxTemp.DataSource = _CommonAdministrationObject.GetDynamicDropDownSource(DataRelationTemp.ParentTable.TableName, ValueColumnName, TextColumnName, DataRelationTemp.ParentTable.Columns.IndexOf("Active"));
                        ListBoxTemp.DataTextField = TextColumnName;
                        ListBoxTemp.DataValueField = ValueColumnName;
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                        if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                        {
                            ListBoxTemp.Items.RemoveAt(0);
                        }
                    }
                    //#1439
                    else if (ColumnName.ToUpper() == "TAGID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;
                        ListBoxTemp.DataSource = _CommonAdministrationObject.GetDynamicDropDownSource(DataRelationTemp.ParentTable.TableName, ValueColumnName, TextColumnName, DataRelationTemp.ParentTable.Columns.IndexOf("Active"));
                        ListBoxTemp.DataTextField = TextColumnName;
                        ListBoxTemp.DataValueField = ValueColumnName;
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                        if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                        {
                            ListBoxTemp.Items.RemoveAt(0);
                        }
                    }
                    else if (ColumnName.ToUpper() == "SECONDARYCASEMANAGERID")
                    {
                        DropDownListTemp = null;
                        ListBoxTemp = new ListBox();
                        ListBoxTemp.Rows = 4;

                        _CommonAdministrationObject = new CommonAdministration();
                        DataTable DataTableCaseManagers = _CommonAdministrationObject.GetStaff(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), true);

                        DataView DataViewCaseManager = new DataView(DataTableCaseManagers);
                        DataViewCaseManager.RowFilter = "IsCaseManager='Y'";
                        ListBoxTemp.DataSource = DataViewCaseManager;
                        ListBoxTemp.DataTextField = "Staff";
                        ListBoxTemp.DataValueField = "StaffId";
                        ListBoxTemp.SelectionMode = ListSelectionMode.Multiple;
                        ListBoxTemp.DataBind();
                        if (ListBoxTemp.Items.Count > 0 && ListBoxTemp.Items[0].Text == "")
                        {
                            ListBoxTemp.Items.RemoveAt(0);
                        }

                    }                    
                    else
                    {
                        DropDownListTemp.DataSource = _CommonAdministrationObject.GetDynamicDropDownSource(DataRelationTemp.ParentTable.TableName, ValueColumnName, TextColumnName, DataRelationTemp.ParentTable.Columns.IndexOf("Active"));
                        DropDownListTemp.DataTextField = TextColumnName;
                        DropDownListTemp.DataValueField = ValueColumnName;
                        DropDownListTemp.DataBind();

                        if (ColumnName == "CompanyId")
                        {
                            DropDownListTemp.Attributes.Add("onChange", "FillChildDropDown(this,this.value);");
                            DropDownListTemp.Items.FindByValue(Convert.ToString(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"])).Selected = true;
                            _WorkFlowCriteriaCompanyId = Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]);


                        }

                    }
                }
            }
        }

        catch(Exception Ex)
        {
            _errorLogging.LogError(Ex, Request.UrlReferrer.LocalPath);
        }

        finally
        {

        }
        if (DropDownListTemp == null) return ListBoxTemp;
        return DropDownListTemp;
    }
    private void BindCaseManager(ref DropDownList DropDownListCaseManager)
    {
        try
        {
            _CommonAdministrationObject = new CommonAdministration();
            DataTable DataTableCaseManagers = _CommonAdministrationObject.GetStaff(-1, Convert.ToInt32(((SitePrinciple)Session["UserContext"]).DataRowUser["DefaultCompanyId"]), true);
          
            DataView DataViewCaseManager = new DataView(DataTableCaseManagers);
            DataViewCaseManager.RowFilter = "IsCaseManager='Y'";
            DropDownListCaseManager.DataSource = DataViewCaseManager;
            DropDownListCaseManager.DataTextField = "Staff";
            DropDownListCaseManager.DataValueField = "StaffId";
            DropDownListCaseManager.DataBind();
        }
        catch (Exception Ex)
        {
            _errorLogging.LogError(Ex, Request.UrlReferrer.LocalPath);
            throw Ex;
        }

    }

    private void BindWorkFlowControls()
    {
        _WorkFlowId = Convert.ToInt32(Request.QueryString["WorkFlowId"]);
        
        DataTable DataTableWorkFlows = _CommonAdministrationObject.GetWorkFlows(_WorkFlowId);
        if (DataTableWorkFlows.Rows.Count > 0)
        {
            DataSetWorkFlowObject.Merge(DataTableWorkFlows);
            _WorkFlowEventId = Convert.ToInt32(DataTableWorkFlows.Rows[0]["WorkFlowEventId"]);
            _WorkFlowEventDescription = Convert.ToString(DataTableWorkFlows.Rows[0]["EventDescription"]);
            //Set the value in the session. User story 726 
            Session["WorkFlowEventId"] = _WorkFlowEventId;
            workflowTitle.Text = DataTableWorkFlows.Rows[0]["WorkflowDescription"].ToString();
            workflowTItleTwo.Text = DataTableWorkFlows.Rows[0]["WorkflowDescription"].ToString();
            changeDesc1.Text = DataTableWorkFlows.Rows[0]["EventDescription"].ToString();
            changeDesc2.Text = DataTableWorkFlows.Rows[0]["EventDescription"].ToString();
            Master.InnerTitle = string.Format("Workflow Details - {0}", 
                DataTableWorkFlows.Rows[0]["WorkflowDescription"].ToString());

        }
        if(_WorkFlowEventId<1)
            _WorkFlowEventId = Convert.ToInt32(Request.QueryString["EventId"]);
        DataTable DataTableWorkFlowEventAssociatedColumns = _CommonAdministrationObject.GetWorkFlowEventAssociatedColumns(_WorkFlowEventId, -1);

        _WorkflowsRowTemp = DataSetWorkFlowObject.Workflows.FindByWorkflowId(_WorkFlowId);

        if (_WorkflowsRowTemp != null)
        {
            if (_WorkflowsRowTemp.IsConditionNull() == false) _CurrentStepSQL = _WorkflowsRowTemp.Condition;
            if (_WorkflowsRowTemp["EventTypeText"].ToString() == "Change")
                BindOldNewValuesDropDowns();
            else
                ClientScript.RegisterStartupScript(GetType(), "Startup4", "<Script Language='Javascript'>ShowWorkFlowDetails(0,'','');</Script>");
        }   
        else
            ClientScript.RegisterStartupScript(GetType(), "Startup4", "<Script Language='Javascript'>ShowWorkFlowDetails(0);</Script>");
        GetFieldsCriteria(DataTableWorkFlowEventAssociatedColumns);

        BindWorkFlowSteps(_WorkFlowId);
    }

    private void BindWorkFlowSteps(Int32 WorkFlowId)
    {
        DataTable DataTableWorkFlowSteps = null;
        try
        {
            DataTableWorkFlowSteps = _CommonAdministrationObject.GetWorkFlowSteps(WorkFlowId, -1);
            if (DataTableWorkFlowSteps.Rows.Count == 0)
            {
                DataRow DataRowWorkFlowStep = DataTableWorkFlowSteps.NewRow();
                DataRowWorkFlowStep["WorkFlowStepId"] = -1;
                DataRowWorkFlowStep["StepDescription"] = "";
                DataTableWorkFlowSteps.Rows.Add(DataRowWorkFlowStep);
            }
            GridViewWorkFlowSteps.DataSource = DataTableWorkFlowSteps;
            GridViewWorkFlowSteps.DataBind();
            GridViewWorkFlowSteps.Visible = true;
        }
        catch 
        {
            
        }
        
    }

    protected void GridViewWorkFlowSteps_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            if (Convert.ToInt32(((DataRowView)e.Row.DataItem)["WorkFlowStepId"]) == -1)
            {
                e.Row.Cells[0].Controls.Clear();
                LiteralControl LiteralControlDiv = new LiteralControl("<Div class='Error'>No action groups have been defined yet</Div>");
                e.Row.Cells[0].ColumnSpan = 3;
                e.Row.Cells[0].Controls.Add(LiteralControlDiv);
                e.Row.Cells[1].CssClass = "HiddenDisplay";
                e.Row.Cells[2].CssClass = "HiddenDisplay";
                e.Row.Cells[3].CssClass = "HiddenDisplay";
            }
        }
    }

    private void BindOldNewValuesDropDowns()
    { 
        string TableName =_WorkflowsRowTemp["PrimaryTable"].ToString();
        string ColumnName =_WorkflowsRowTemp["KeyColumn"].ToString();
        Control ControlTemp = GetReferenceDropDown(TableName, ColumnName);
        //Adjust code for userstory 1265 Fetching newly added globalcode of new category("ChangeWorkflowCodeValue")
        DataTable dataTableAdditionalStatus = _CommonAdministrationObject.GetGlobalCodes(-1, -1, "ChangeWorkflowCodeValue", false);

        if (ControlTemp.GetType().ToString()=="System.Web.UI.WebControls.DropDownList")
        {
            ListBoxNewValue.Rows = 4;
            ListBoxNewValue.DataSource= ((DropDownList)ControlTemp).DataSource;
            ListBoxNewValue.DataTextField = ((DropDownList)ControlTemp).DataTextField;
            ListBoxNewValue.DataValueField = ((DropDownList)ControlTemp).DataValueField;
            ListBoxNewValue.SelectionMode = ListSelectionMode.Multiple;
            ListBoxNewValue.DataBind();
            if (ListBoxNewValue.Items.Count > 0 && ListBoxNewValue.Items[0].Text == "")
            {
                ListBoxNewValue.Items.RemoveAt(0);
            }

            ListBoxOldValue.Rows = 4;
            ListBoxOldValue.DataSource = ((DropDownList)ControlTemp).DataSource;
            ListBoxOldValue.DataTextField = ((DropDownList)ControlTemp).DataTextField;
            ListBoxOldValue.DataValueField = ((DropDownList)ControlTemp).DataValueField;
            ListBoxOldValue.SelectionMode = ListSelectionMode.Multiple;
            ListBoxOldValue.DataBind();
            if (ListBoxOldValue.Items.Count > 0 && ListBoxOldValue.Items[0].Text == "")
            {
                ListBoxOldValue.Items.RemoveAt(0);
            }
        }
        else if(ControlTemp.GetType().ToString()=="System.Web.UI.WebControls.ListBox")
        {
            ListBoxNewValue.Rows = 4;
            ListBoxNewValue.DataSource= ((ListBox)ControlTemp).DataSource;
            ListBoxNewValue.DataTextField = ((ListBox)ControlTemp).DataTextField;
            ListBoxNewValue.DataValueField = ((ListBox)ControlTemp).DataValueField;
            ListBoxNewValue.SelectionMode = ListSelectionMode.Multiple;
            ListBoxNewValue.DataBind();
            if (ListBoxNewValue.Items.Count > 0 && ListBoxNewValue.Items[0].Text == "")
            {
                ListBoxNewValue.Items.RemoveAt(0);
            }

            ListBoxOldValue.Rows = 4;
            ListBoxOldValue.DataSource = ((ListBox)ControlTemp).DataSource;
            ListBoxOldValue.DataTextField = ((ListBox)ControlTemp).DataTextField;
            ListBoxOldValue.DataValueField = ((ListBox)ControlTemp).DataValueField;
            ListBoxOldValue.SelectionMode = ListSelectionMode.Multiple;
            ListBoxOldValue.DataBind();
            if (ListBoxOldValue.Items.Count > 0 && ListBoxOldValue.Items[0].Text == "")
            {
                ListBoxOldValue.Items.RemoveAt(0);
            }
        }
        AddColumnsInDropDownList(ListBoxNewValue, dataTableAdditionalStatus);
        AddColumnsInDropDownList(ListBoxOldValue, dataTableAdditionalStatus);

        if (!_WorkflowsRowTemp.IsOldValueNull())
        {
            string oldValue = _WorkflowsRowTemp.OldValue;
            string[] oldValueArray = oldValue.Split(','); 
            for(int i = 0; i < oldValueArray.Length; i++)
            {
                ListItem SelecteValue = ListBoxOldValue.Items.FindByValue(oldValueArray[i]);
                if(SelecteValue !=null)
                {
                    SelecteValue.Selected = true;
                }
            }
        }
        if (!_WorkflowsRowTemp.IsNewValueNull())
        {
            string newValue = _WorkflowsRowTemp.NewValue;
            string[] newValueArray = newValue.Split(',');
            for (int i = 0; i < newValueArray.Length; i++)
            {
                ListItem SelecteValue = ListBoxNewValue.Items.FindByValue(newValueArray[i]);
                if (SelecteValue != null)
                {
                    SelecteValue.Selected = true;
                }
            }
        } 
    }

    /// <summary>
    /// Add global code list of category "Status" to dropdown control
    /// </summary>
    /// <param name="DropDownList"></param>
    /// <param name="dt"></param>
    public void AddColumnsInDropDownList(ListBox listBox, DataTable dt)
    {
        if (dt.Rows.Count > 0)
        {
            List<ListItem> items = new List<ListItem>();
            foreach (DataRow row in dt.Rows)
            {
                items.Add(new ListItem(row["CodeName"].ToString(), row["GlobalcodeId"].ToString()));
            }
            listBox.Items.AddRange(items.ToArray());
        }
    }
}
