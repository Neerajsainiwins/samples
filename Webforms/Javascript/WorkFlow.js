var _TableName = null;
var WorkFlowEventId = -1;
var _StepId = -1;
_Action = new String();
var _TableRowAssociatedTableColumn = null;
var _RowIndex;
var _GridViewWorkFlow = null;
var _CurrentEventId = -1;
var _CurrentRow = -1;
var _StepAction = "Old";
var _WorkFlowStepActionId = -1;
var _ProgramDropDownContainer = '';
var _CurrentProgramRow = -1;
var _EventOffSetOperator = 'DataListEventOffsetFields_ctl00_DropDownListOperator';
var _EventOffSetDropDown = 'DataListEventOffsetFields_ctl00_DropDownListColumns';
var _EventOffSetDays = 'DataListEventOffsetFields_ctl00_TextBoxExecutionOffsetDays';
var _CurrentRadioButton = null;
var _OptionChange = null;
var _selectedValues;
_ActionHTML = new String();
CreateXmlHttp();
var _CurrentActionText="";

function GetActionParameters(DropDownActions) {
    _CurrentEventId = _WorkFlowEventId;
    _CurrentActionText=$('option:selected', DropDownActions).text();
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&Action=GetWorkFlowActionParameters";
    RequestUrl += "&stamp=" + $.now();
    $.post(RequestUrl, {
        ActionId: $(DropDownActions).val(),
        StepId: _StepId,
        WorkFlowStepActionId: _WorkFlowStepActionId,
        EventId: _CurrentEventId
    }, ShowActionParameters, 'html');
}

function SelectFields() {
    _Action = "GetAssociatedTableColumns";
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow";
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    Params = "&EventId=" + _CurrentEventId + "&Action=" + _Action + "&WorkFlowId=" + _WorkFlowId + "&StepId=" + _StepId + "&StepAction=" + _StepAction;
    CallAjax();
}

function SetCriteria() {
    _Action = "SetCriteria"
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow";
    Params = "&EventId=" + _CurrentEventId + "&Action=" + _Action + "&Fields=" + Fields + "&WorkFlowId=" + _WorkFlowId;
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    Params = Params + "&StepDescription=" + document.getElementById('TextBoxStepName').value + "&StepId=" + _StepId;
    CallAjax();
    return false;
}

function SetEventId(DropDownEvents) {
    _CurrentEventId = DropDownEvents.value;
}

function SetFilterEventId(DropDownEvents) {
    $('#HiddenSelectedEventFilter').val(DropDownEvents.value);
}

function CallAjax() {
    try {
        if (XmlHttp != null) {
            XmlHttp.open("POST", RequestUrl, false);
            XmlHttp.onreadystatechange = ReturnFromAjax;
            XmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            XmlHttp.send(Params);
        }
    }
    catch (ex) {
        alert(ex);
    }

}

function ReturnFromAjax() {

    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            var XMLObject = XmlHttp.responseXML;
            //alert(_Action);
            if (_Action == "GetAssociatedTableColumns") {
                FillAssociatedTableColumns();
            }
            else if (_Action == "BindEvents") {
                BindEvents();
            }
            else if (_Action == "SetCriteria") {
                SetCriteriaFields();
            }
            else if (_Action == "WorkFlowSaved") {
                WorkFlowSaved();
            }
            else if (_Action == "SaveWorkFlowStep") {
                WorkFlowStepSaved();
            }
            else if (_Action == "GetWorkFlowActionParameters") {
                ShowActionParameters();
            }
            else if (_Action == "GetWorkFlowSteps") {
                ShowWorkFlowSteps();
            }
            else if (_Action == "DeleteWorkFlow") {
                WorkFlowDeleted();
            }
            else if (_Action == "DeleteWorkFlowStep") {
                WorkFlowStepDeleted();
            }
            else if (_Action == "DeleteWorkFlowStepAction") {
                WorkFlowStepActionDeleted();
            }
            else if (_Action == "GetWorkFlowStepActions") {
                GetWorkFlowStepActions();
            }
            else if (_Action == "SaveWorkFlowStepAction") {
                WorkFlowStepActionUpdated();
            }
            else if (_Action == "GetProgramListBox") {
                BindProgramDropDown();
            }
            else if (_Action == "GetProgramPhases") {
                BindListBox();
            } else if (_Action == "GetSecurityLevels") {
                BindListBox();
            }


        }
    }
}

function ShowCriteria() {
    CancelWorkFlowEdit();
    document.getElementById('DivWorkFlow').style.visibility = 'hidden';
    document.getElementById('DivWorkFlow').className = 'Hidden';
    window.scrollTo(0, 0);
    SelectFields();
}

function WorkFlowStepSaved(xml) {
    debugger;
    if ($(xml).find("Result").text() == "True") {
        _StepId = $(xml).find("StepId").text();

        if (_StepId > 0) {
            location.href = location.href;
            return;
        }
    }
    else {
        ParseErrorMessage(xml);
    }

    _StepId = -1;
}


function SetDefaults() {
    document.getElementById("TextBoxAssociatedTableColumnId").value = "";
    document.getElementById("TextBoxCodeName").value = "";
    document.getElementById('TextBoxDescription').value = "";
    document.getElementById("CheckboxActive").checked = true;
}

function SetValues() {
    _TableRowAssociatedTableColumn.cells[1].innerHTML = "<A href=Javascript:EditCode(" + document.getElementById("TextBoxAssociatedTableColumnId").value + "," + _CurrentRow + "," + document.getElementById(_DropDownCategories).value + ",'" + _TableName + "')>" + document.getElementById("TextBoxCodeName").value + "</A>";
    if (document.getElementById("CheckboxActive").checked == true) _TableRowAssociatedTableColumn.cells[2].textContent = "Y";
    else _TableRowAssociatedTableColumn.cells[2].textContent = "N";
    _TableRowAssociatedTableColumn.cells[3].textContent = document.getElementById("TextBoxDescription").value;
    _TableRowAssociatedTableColumn.cells[4].textContent = document.getElementById(_DropDownCategories).options[document.getElementById(_DropDownCategories).selectedIndex].text;

}



function GetAssociatedTableColumns() {
    _Action = "GetAssociatedTableColumns"

    RequestUrl = "../Ajax/AjaxServer.aspx?Page=AssociatedTableColumns";
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    Params = "&CategoryId=" + document.getElementById(_DropDownCategories).value + "&Action=" + _Action;

    CallAjax();

}

function FillAssociatedTableColumns() {
    SetCriteriaFields();
}

function SetCriteriaFields() {
    GridViewStepCriteriaString = new String();
    GridViewStepCriteriaString = XmlHttp.responseText;
    _StepId = GridViewStepCriteriaString.substring(0, GridViewStepCriteriaString.indexOf("</StepId>")).replace("<StepId>", "");
    var _IndexOfTable = GridViewStepCriteriaString.indexOf("<table")
    if (_IndexOfTable > -1)
        GridViewStepCriteriaString = GridViewStepCriteriaString.substr(_IndexOfTable, GridViewStepCriteriaString.length - _IndexOfTable)
    else
        GridViewStepCriteriaString = "";

    document.getElementById('DivWorkFlowSteps').className = 'Hidden';
    document.getElementById('DivWorkFlowSteps').style.visibility = 'hidden';
    document.getElementById('DivWorkFlowStepActions').className = 'Hidden';
    document.getElementById('DivWorkFlowStepActions').style.visibility = 'hidden';

    document.getElementById("DivStepCriteria").className = "";
    document.getElementById("DivStepCriteriaDetails");
    document.getElementById("DivStepCriteriaDetails").innerHTML = GridViewStepCriteriaString //+ "<div>&nbsp;&nbsp;<input type='button' value='Next' onclick='GenerateStatement()' /><input type='button' value='Cancel' /></div>";
    document.getElementById('DivStepCriteriaDetails').className = '';
    document.getElementById('DivStepCriteriaDetails').style.visibility = 'visible';
    document.getElementById('DivCriteriaButtons').style.visibility = 'visible';
    document.getElementById('DivCriteriaButtons').className = ''
    document.getElementById('InnerTitle').textContent = 'Define WorkFlow>>Define Criteria';
}


function ShowActionParameters(html) {
    if (html.indexOf("<tr") > -1) {
        html = "<table class='table smart-form' id='DataListActionParameters'>" +
        html.substring(html.indexOf("<tr"), html.length) + "</table>";

    }
    else {
        html = "";
    }
    $("#DivWorkFlowActionParameters").html(html);
    $("#DataListActionParameters select").css('min-width', '90px');
    $("#DataListActionParameters select").wrap("<label class='select display-inline col-sm-12 vert-middle'></label>");
    $("#DataListActionParameters label[class='select display-inline col-sm-12 vert-middle']").append("<i></i>");

    $("#DataListActionParameters input").wrap("<label class='input display-inline col-sm-12 vert-middle'></label>");

    //Set the required field for the comments when the action is Create Sign Out Hold
    if ($('#DropDownListActions :Selected').text() == "Create Sign Out Hold")
        $("#DataListActionParameters textarea").wrap("<label class='textarea req_field_text vert-middle'></label>");
    else
        $("#DataListActionParameters textarea").wrap("<label class='textarea vert-middle'></label>");
    if ($('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text() == 'External Email') {
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress').css('display', 'table-row');
        $('#DivWorkFlowActionParameters').find('.SendTo').css('display', 'none').val('-1');
    } else if ($('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text() == 'Clients Case Manager'
        || $('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text() == 'Clients Secondary Case Manager'
        || $('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text() == 'Treatment Group Facilitator'
        || $('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text()  == 'Grievance Investigator'
        || $('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text() == 'Probation Officer'
        || $('#DivWorkFlowActionParameters').find('.AssigneeType select option:selected, .RecipientType select option:selected').text() == 'Service Manager') {
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress').css('display', 'none').val('');
        $('#DivWorkFlowActionParameters').find('.SendTo').css('display', 'none').val('-1');
        $('#DivWorkFlowActionParameters').find('.StaffId').css('display', 'none').val('-1');
        $('#DivWorkFlowActionParameters').find('.StaffId select').val('-1');
    } else {
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress').css('display', 'none').val('');
        $('#DivWorkFlowActionParameters').find('.SendTo').css('display', 'table-row');

        $('#DivWorkFlowActionParameters').find('.SecurityProcedureType>td:first').text('SecurityProcedure   Type');
    }
    if ($('#DivWorkFlowActionParameters').find('#DataListEventOffsetFields_ctl00_TextBoxExecutionOffsetDays').parent().removeClass('col-sm-12'));
    if ($('#DivWorkFlowActionParameters').find('#DataListEventOffsetFields_ctl00_DropDownListOperator').parent().removeClass('col-sm-12'));
    if ($('#DivWorkFlowActionParameters').find('#DataListEventOffsetFields_ctl00_DropDownListColumns').parent().removeClass('col-sm-12'));

    if(_CurrentActionText==="Create Task"){
         $('#DivWorkFlowActionParameters .AssigneeType select option:contains(External Email)').remove();
    }
    
    var IgnoreWorkFlowEvents = [50 , 52 , 55];
    if (IgnoreWorkFlowEvents.includes(_CurrentEventId) == false) {
        $('[id$="DataListActionParameters_ctl04_ColumnGlobalCode3"] option:contains("Link task to Service")').remove();
    }
}

function FormatCriteriaFields() {
    $("#" + _GridViewStepCriteriaControl + " select[multiple!='multiple']").wrap("<label class='select'></label>");
    $("#" + _GridViewStepCriteriaControl + " select[multiple='multiple']").wrap("<label class='select select-multiple'></label>");
    $("#" + _GridViewStepCriteriaControl + " label[class='select']").append("<i></i>");

    $("#" + _GridViewStepCriteriaControl + " input").wrap("<label class='input'></label>");
}

function GenerateStatement() {

    var TotalRows = document.getElementById(_GridViewStepCriteriaControl).rows.length;
    Criteria = new String();
    if (TotalRows == 1) {
        //
    }
    else {

        var Operator = '';
        var SubCriteria = '';
        for (Rows = 1; Rows < TotalRows; Rows++) {
            if (!($('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(0).prop('tagName').toLowerCase() == "select"
                && $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(0).val() == "-1")) {

                Operator = $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(2) label').children().eq(0).val();
                for (Nodes = 0; Nodes < $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().length; Nodes++) {
                    if ($('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).prop('tagName').toLowerCase() != "img"
                        && $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).prop('tagName') != "a") {
                        if ($('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).prop('tagName').toLowerCase() == "select"
                            && $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).prop('multiple') == true) {

                            $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).children('option').each(function () {
                                if ($(this).prop('selected') == true) {
                                    SubCriteria += $(this).val() + ",";
                                }
                            });

                            if (SubCriteria.length > 0) {
                                if (Operator == "<>") {
                                    Operator = " Not In (";
                                }
                                else {
                                    Operator = " In (";
                                }
                                SubCriteria = SubCriteria.substr(0, SubCriteria.length - 1) + ")";
                            }
                        }
                        else {
                            if ($('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).data('type') != undefined &&
                                $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).data('type') == 'char') {
                                SubCriteria += $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).val();
                            } else {
                                SubCriteria += $('#' + _GridViewStepCriteriaControl + ' tr:eq(' + Rows + ') td:eq(3) label').children().eq(Nodes).val();
                            }
                        }
                    }
                }
                if (ValidateCriteria(document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[5].textContent, Operator, SubCriteria, document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[3].childNodes[0]) == false) return false;
                if (SubCriteria != "") {
                    if (RTrim(Criteria) != "")
                        Criteria += " And ";
                    Criteria += document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[5].textContent
                    Criteria += Operator + SubCriteria;
                }

                SubCriteria = "";
                Operator = "";

            }
            else if (document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[3].childNodes[0].tagName == "SELECT") {
                if (ValidateCriteria(document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[5].textContent, Operator, document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[3].childNodes[0].value, document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[3].childNodes[0]) == false) return false;
            }

        }
    }
    if ($('#' + _ListBoxOldValue).val() != "" && $('#' + _ListBoxOldValue).val() != null) {
        var OldValue = $('#' + _ListBoxOldValue).val().toString();
    }
    else
    {
        OldValue = "-1";
    }
    if ($('#' + _ListBoxNewValue).val() != "" && $('#' + _ListBoxNewValue).val() != null) {
        var NewValue = $('#' + _ListBoxNewValue).val().toString();
    }
    else {
        NewValue = "-1";
    }
    $.post("../Ajax/AjaxServer.aspx?Page=Workflow&Action=SaveCriteria", {
        EventId: _WorkFlowEventId,
        Criteria: Criteria,
        WorkFlowId: _WorkFlowId,
        OldValue: OldValue,
        NewValue: NewValue
    }, ReturnSQL, 'html');
}

function ReturnSQL(html) {
    localStorage.setItem("savedMessage", "Workflow updated successfully.");
    window.location.href = window.location.href;
}


function ValidateWorkFlowStep() {
    if ($('#TextBoxStepName').val() == "") {
        showErrorMessage("Please enter the Step Description");
        $('#TextBoxStepName').focus();
        return false;
    }

    return true;
}

function EditWorkFlow(WorkFlowTempId, RowIndex, GridViewWorkFlow) {
    if (IsWritePermission()) {
        _GridViewWorkFlow = GridViewWorkFlow;
        _RowIndex = RowIndex;

        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&Action=GetWorkFlowDetails";
        RequestUrl += "&stamp=" + $.now();
        _WorkFlowId = WorkFlowTempId;
        $.post(RequestUrl, { 'WorkFlowId': WorkFlowTempId }, WorkflowDetailModal.OnEdit, 'xml');
    }
}

function EditSteps(WorkFlowId, RowIndex, GridViewWorkFlowSteps, WorkFlowEventId) {
    _TableName = GridViewWorkFlowSteps;
    _RowIndex = RowIndex;
    _WorkFlowId = WorkFlowId;
    _CurrentEventId = WorkFlowEventId;
    _Action = "GetWorkFlowSteps";
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow";
    RequestUrl += "&stamp=" + $.now();
    Params = "&WorkFlowId=" + WorkFlowId + "&Action=" + _Action + "&EventId=" + WorkFlowEventId;
    _WorkFlowId = WorkFlowId;
    CallAjax();
}

function AddStep() {
    $("#TextBoxStepName").val('');
    $("#ButtonModifyStep").val('Insert');
    $("#TextBoxWorkFlowStepId").val('-1');
    _StepId = -1;
    ShowStepSection();
}
function ShowStepSection() {
    $('#DivWorkFlowStepsInfo').modal('show');
}
function SaveStep() {
    if (!ValidateWorkFlowStep()) return;

    $.post("../Ajax/AjaxServer.aspx?Page=Workflow&Action=SaveWorkFlowStep", {
        WorkFlowId: _WorkFlowId,
        StepDescription: $("#TextBoxStepName").val(),
        StepId: _StepId,
        EventId: _CurrentEventId
    }, WorkFlowStepSaved, 'xml');
}

function EditWorkFlowStep(WorkFlowStepId, RowIndex, GridName) {
 _StepId = WorkFlowStepId;
    _RowIndex = RowIndex;
    _TableName = GridName;
    $('#TextBoxStepName').val($.trim(document.getElementById(GridName).rows[RowIndex + 1].cells[2].textContent));
    $('#ButtonModifyStep').text("Update Step");
    ShowStepSection();
}
function CancelEditWorkFlowStep() {
    document.getElementById('ButtonUpdateStep').value = "Add Step";
    document.getElementById('TextBoxStepName').value = "";
    document.getElementById('TextBoxNumberOfDays').value = "";
    document.getElementById('CheckBoxRecurring').checked = false;
    _StepId = -1;
}

function SetActionCriteria(Recurring, NumberOfDays) {
    document.getElementById('CheckBoxRecurring').checked = eval(Recurring);
    document.getElementById('TextBoxDays').value = NumberOfDays;
    GetActionParameters(document.getElementById('DropDownListActions'));
}

function GetActionParametersValue(TableActionParams) {
    ActionParamXML = new String("");
    if (TableActionParams != null) {
        var _ParamCount = TableActionParams.rows.length;
        var StartPosition = 0;
        if (document.getElementById(_EventOffSetOperator) != null) StartPosition = 1;
        for (Row = StartPosition; Row < _ParamCount; Row++) {
            if ((RTrim(TableActionParams.rows[Row].cells[1].textContent) == 'Integer' || RTrim(TableActionParams.rows[Row].cells[1].textContent) == 'GlobalCode') && $(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").children(0).children(0).children(0).tagName == "SELECT" && ($(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").children(0).children(0).children(0).val() == "-1" || $(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").children(0).children(0).children(0).val() == "0")) {
                ActionParamXML += "<Param DataField='" + RTrim(TableActionParams.rows[Row].cells[0].textContent) +
                "' DataType='" + RTrim(TableActionParams.rows[Row].cells[1].textContent) + "'></Param>";
            }
            else {
                //if ($.trim(TableActionParams.rows[Row].cells[0].textContent) == 'SendTo') {
                //    ActionParamXML += "<Param DataField='" + $.trim(TableActionParams.rows[Row].cells[0].textContent) +
                //    "' DataType='" + RTrim(TableActionParams.rows[Row].cells[1].textContent) + "'>" +
                //   $(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").find('.active select,.active input').val() + "</Param>";
                //} else {
                //    ActionParamXML += "<Param DataField='" + $.trim(TableActionParams.rows[Row].cells[0].textContent) +
                //    "' DataType='" + RTrim(TableActionParams.rows[Row].cells[1].textContent) + "'>" +
                //   $(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").children(0).children(0).children(0).val() + "</Param>";
                //}

                ActionParamXML += "<Param DataField='" + $.trim(TableActionParams.rows[Row].cells[0].textContent) +
                  "' DataType='" + RTrim(TableActionParams.rows[Row].cells[1].textContent) + "'>" +
                 $(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").children(0).children(0).children(0).val() + "</Param>";
            }
        }
    }
    
    return ActionParamXML;
}

function MoveToStep(StepNum) {

    if (StepNum == 0) {
        document.getElementById("DivWorkflow").className = "";
        document.getElementById("DivWorkflow").style.visibility = "visible";
        document.getElementById("DivWorkFlowSteps").className = "Hidden";
        document.getElementById("DivWorkFlowSteps").style.visibility = "hidden";
        document.getElementById("TDWorkFlowSteps").className = "Hidden";
        document.getElementById("TDWorkFlowSteps").style.visibility = "hidden";
        document.getElementById("DivStepCriteria").className = "Hidden";
        document.getElementById('DivStepCriteriaDetails').style.visibility = 'hidden';
        document.getElementById('DivStepCriteriaDetails').className = 'Hidden';
        document.getElementById('DivCriteriaButtons').style.visibility = 'hidden';
        document.getElementById('DivCriteriaButtons').className = 'Hidden';
        document.getElementById('InnerTitle').textContent = 'Define WorkFlow';
    }
    else if (StepNum == 1) {
        var Actions = 0;
        for (i = 1; i < document.getElementById("GridViewWorkFlowStepActions").rows.length; i++) {
            if (document.getElementById("GridViewWorkFlowStepActions").rows[i].cells[0].innerHTML.indexOf("deleteIcon.gif") > -1) {
                Actions++;
            }
        }
        document.getElementById(_GridViewWorkFlowStepsControl).rows[_CurrentRow + 1].cells[3].textContent = Actions;
        document.getElementById('DivWorkFlowStepDetails').style.display = 'none';
        document.getElementById('ButtonUpdateWorkFlowStepAction').textContent = 'Insert';
        EnableBackGround();
    }
        // Original State of Detail Page
    else if (StepNum == 2) {
        document.getElementById('DivWorkFlowStepsInfo').style.display = 'none';
        EnableBackGround();
    }

}

function ShowWorkFlowSteps() {
    DataGridWorkFlowSteps = new String();
    DataGridWorkFlowSteps = XmlHttp.responseText;

    if (DataGridWorkFlowSteps.indexOf("<table") > -1) {
        DataGridWorkFlowSteps = DataGridWorkFlowSteps.substring(DataGridWorkFlowSteps.indexOf("<table"), DataGridWorkFlowSteps.length)
    }
    else {
        DataGridWorkFlowSteps = "";
    }
    document.getElementById('DivWorkFlowSteps').className = '';
    document.getElementById('DivWorkFlowSteps').style.visibility = 'visible';

    document.getElementById('DivStepCriteria').className = 'hidden';
    document.getElementById('DivStepCriteria').style.visibility = 'Hidden';
    document.getElementById('DivStepCriteriaDetails').style.visibility = 'Hidden';
    document.getElementById('DivCriteriaButtons').style.visibility = 'Hidden';
    document.getElementById('DivStepCriteriaDetails').className = 'Hidden';
    document.getElementById('DivCriteriaButtons').className = 'Hidden';

    document.getElementById('DivWorkFlow').style.visibility = 'hidden';
    document.getElementById('DivWorkFlow').className = 'Hidden';
    document.getElementById('TDWorkFlowSteps').className = '';
    document.getElementById('TDWorkFlowSteps').style.visibility = 'visible';
    document.getElementById('TDWorkFlowSteps').innerHTML = DataGridWorkFlowSteps;
    document.getElementById('InnerTitle').textContent = 'Manage Steps';
    window.scrollTo(0, 0);
    document.getElementById("TextBoxStepName").focus();
    //document.getElementById('DivWorkFlowBreadCrumb').textContent='Manage Steps';
}


function ShowSecondStep() {
    document.getElementById("DivWorkFlowSteps").style.visibility = "visible";
}

function DeleteWorkFlowStep(Object, WorkFlowStepId, RowIndex, TableName) {
    var _NewImage = document.getElementById(TableName).rows[RowIndex + 1].cells[0].innerHTML;
    _RowIndex = RowIndex;
    _TableName = TableName;
    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
        var ErrorMessage = "Are you sure you want to delete this Step?";
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&WorkFlowId=" + _WorkFlowId + "&StepId=" + WorkFlowStepId + "&Action=DeleteWorkFlowStep&Active=Y";
    }
    else {
        var ErrorMessage = "Are you sure you want to Rollback delete of this Step ?"
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&WorkFlowId=" + _WorkFlowId + "&StepId=" + WorkFlowStepId + "&Action=DeleteWorkFlowStep&Active=N";
    }
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    if (confirm(ErrorMessage)) {
        _StepId = -1;
        _Action = "DeleteWorkFlowStep";
        //RequestUrl ="../Ajax/AjaxServer.aspx?Page=Workflow";
        Params = "&Action=" + _Action;
        //alert(RequestUrl);
        CallAjax();
    }
}

function WorkFlowStepDeleted() {
    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            var XMLObject = XmlHttp.responseXML;
            if (XMLObject.getElementsByTagName("Result").length > 0 && XMLObject.getElementsByTagName("Result")[0].childNodes[0].nodeValue == "True") {
                var _NewImage = document.getElementById(_TableName).rows[_RowIndex + 1].cells[0].innerHTML;
                if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
                    _NewImage = _NewImage.replace("deleteIcon.gif", "True.gif");
                    _NewImage = _NewImage.replace("Delete", '"Rollback Delete"');
                }
                else {
                    _NewImage = _NewImage.replace("True.gif", "deleteIcon.gif");
                    _NewImage = _NewImage.replace("Rollback Delete", "Delete");
                }
                //alert(_NewImage)
                document.getElementById(_TableName).rows[_RowIndex + 1].cells[0].innerHTML = _NewImage;
            }
            else {
                showErrorMessage("An error occurred while saving this record.");
            }
        }
    }
}

function ManageActions(LinkObject, WorkFlowStepId, RowIndex, TableName) {
    if (LinkObject != null)
        _CurrentRow = RowIndex;
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&Action=GetWorkFlowStepActions";
    RequestUrl += "&stamp=" + $.now();
    Params = "&WorkFlowStepId=" + WorkFlowStepId + "&EventId=" + _CurrentEventId;
    _StepId = WorkFlowStepId;
    $.post(RequestUrl, {
        WorkFlowStepId: WorkFlowStepId,
        EventId: _CurrentEventId
    }, GetWorkFlowStepActions, 'html');
}

function GetWorkFlowStepActions(html) {

    DataGridWorkFlowStepActions = new String();
    DataGridWorkFlowStepActions = html;
    WorkFlowActionString = new String();

    if (DataGridWorkFlowStepActions.indexOf("<select") > -1) {
        WorkFlowActionString = DataGridWorkFlowStepActions.substr(DataGridWorkFlowStepActions.indexOf("<select"), (DataGridWorkFlowStepActions.indexOf("</select") - DataGridWorkFlowStepActions.indexOf("<select")) + 9)
    }
    else {
        WorkFlowActionString = "";
    }

    if (DataGridWorkFlowStepActions.indexOf("<table") > -1) {
        DataGridWorkFlowStepActions = DataGridWorkFlowStepActions.substr(DataGridWorkFlowStepActions.indexOf("<table"), (DataGridWorkFlowStepActions.indexOf("</table") - DataGridWorkFlowStepActions.indexOf("<table")) + 8)
    }
    else {
        DataGridWorkFlowStepActions = "";
    }

    $('#DivWorkFlowStepDetails').modal('show');
    $('#ButtonUpdateWorkFlowStepAction').val('Insert');

    $('#DivWorkFlowActionParameters').html("");
    $('#DivWorkFlowStepActionsGrid').html(DataGridWorkFlowStepActions);
    $('#DivWorkFlowActionsDropDown').html("<label class='select'>" + WorkFlowActionString + "<i></i></label>");



    $('#DivWorkFlowStepActions').removeClass();
    $('#DivWorkFlowStepActions').css('visibility', 'visible');

    _WorkFlowStepActionId = -1;

}

function EditWorkFlowStepAction(WorkFlowStepActionId, WorkFlowStepId, WorkFlowActionId, ActionDueDays) {
    _StepId = WorkFlowStepId;
    _WorkFlowStepActionId = WorkFlowStepActionId
    $('#TextBoxExecutionOffsetDays').val(ActionDueDays);
    $('#ButtonUpdateWorkFlowStepAction').val("Update");
    $('#DropDownListActions').val(WorkFlowActionId);
    GetActionParameters(document.getElementById("DropDownListActions"));
}

function UpdateWorkFlowStepAction() {
    if (!ValidateWorkFlowStepAction()) return;
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&Action=SaveWorkFlowStepAction";
    RequestUrl += "&stamp=" + $.now();
    offset = "";
    if (document.getElementById(_EventOffSetOperator) != null) {
        if (document.getElementById(_EventOffSetOperator).value == "-1")
            offset += "-";
        offset += $('#' + _EventOffSetDays).val();
    }
    Params = Params + "&ActionParams=<Params>" + GetActionParametersValue(document.getElementById('DataListActionParameters')) + "</Params>";
    $.post(RequestUrl, {
        WorkFlowActionId: $('#DropDownListActions').val(),
        WorkFlowStepId: _StepId,
        WorkFlowStepActionId: _WorkFlowStepActionId,
        ExecutionOffsetDays: offset,
        WorkFlowEventOffsetFieldId: $('#' + _EventOffSetDropDown).val(),
        ActionParams: '<Params>' + GetActionParametersValue(document.getElementById('DataListActionParameters')) + '</Params>'
    }, WorkFlowStepActionUpdated, 'html');

}

function WorkFlowStepActionUpdated(html) {
    $("#ButtonUpdateWorkFlowStepAction").val("Insert");
    $("#TextBoxExecutionOffsetDays").val("");
    $("#DivWorkFlowActionParameters").html("");
    _WorkFlowStepActionId = -1;
    ManageActions(_CurrentRadioButton, _StepId, 0, 0);

}

function ValidateWorkFlowStepAction() {
    if (document.getElementById("DropDownListActions").selectedIndex < 1) {
        showErrorMessage("Please select a workFlow action");
        document.getElementById('DropDownListActions').focus();
        return false;
    } else if ($('#DataListActionParameters .RecipientType').length != 0
        && $('#DataListActionParameters .RecipientType select option:selected').text() == 'External Email'
        && !validateEmail($('#DataListActionParameters .ExternalEmailAddress input').val())) {
        showErrorMessage("Invalid external email");
        return false;

    }
    // Validate the blank comments when the action is Create Sign Out Hold
    else if (document.getElementById("DropDownListActions").options[document.getElementById("DropDownListActions").selectedIndex].text == "Create Sign Out Hold") {
        if ($("#DataListActionParameters_ctl01_ColumnText1").val() == "") {
            showErrorMessage("Please enter comments");
            return false;
        }
    }
    else if (document.getElementById("DropDownListActions").options[document.getElementById("DropDownListActions").selectedIndex].text == "Create Task") {
        var TableActionParams = document.getElementById('DataListActionParameters');
        var _ParamCount = TableActionParams.rows.length;
        var StartPosition = 0;
        if (document.getElementById(_EventOffSetOperator) != null) StartPosition = 1;
        ActionParamXML = new String("");
        var AssigneeType = 'C';
        for (Row = StartPosition; Row < _ParamCount; Row++) {
            if (LTrim(RTrim(TableActionParams.rows[Row].cells[0].textContent)) == "TaskType" || LTrim(RTrim(TableActionParams.rows[Row].cells[0].textContent)) == "AssigneeType") {
                if (ValidateActionParamControl(TableActionParams.rows[Row]) == false) return false;
                if ($(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").find("select :selected").text() == "Specific Staff")
                    AssigneeType = 'S';
            }
            else {
                if (RTrim(TableActionParams.rows[Row].cells[0].textContent) == "StaffId" && AssigneeType == 'S') {
                    if (ValidateActionParamControl(TableActionParams.rows[Row]) == false) return false;
                }
                else
                    $(TableActionParams).find("tr:eq(" + Row + ")").find("td:eq(2)").find("select").attr('selectedIndex', 1);
            }
        }

    }
    if (!ValidateStepActionFields()) return;
    return true;
}

function ValidateActionParamControl(Row) {
    if ($(Row).find('select').val() < 1) {
        $(Row).find('select').focus();
        showErrorMessage("Please enter value of " + LTrim(RTrim(Row.cells[0].textContent)));
        return false;
    }
}

function DeleteWorkFlowStepAction(Object, WorkFlowStepActionId, RowIndex, TableName) {
    var _NewImage = document.getElementById(TableName).rows[RowIndex + 1].cells[0].innerHTML;
    _RowIndex = RowIndex;
    _TableName = TableName;
    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
        var ErrorMessage = "Are you sure you want to delete this Step?";
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&WorkFlowId=" + _WorkFlowId + "&WorkFlowStepActionId=" + WorkFlowStepActionId + "&StepId=-1&Action=DeleteWorkFlowStepAction&Active=Y";
    }
    else {
        var ErrorMessage = "Are you sure you want to Rollback delete of this Step ?"
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&WorkFlowId=" + _WorkFlowId + "&WorkFlowStepActionId=" + WorkFlowStepActionId + "&StepId=-1&Action=DeleteWorkFlowStepAction&Active=N";
    }

    RequestUrl += "&stamp=" + $.now();
    if (confirm(ErrorMessage)) {
        //_StepId = -1;
        _Action = "DeleteWorkFlowStepAction";
        Params = "&Action=" + _Action;
        $.get(RequestUrl, WorkFlowStepActionDeleted, 'xml');
    }
}

function WorkFlowStepActionDeleted(xml) {
    var XMLObject = xml;
    if (XMLObject.getElementsByTagName("Result").length > 0 && XMLObject.getElementsByTagName("Result")[0].childNodes[0].nodeValue == "True") {
        var _NewImage = document.getElementById(_TableName).rows[_RowIndex + 1].cells[0].innerHTML;
        if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
            _NewImage = _NewImage.replace("deleteIcon.gif", "True.gif");
            _NewImage = _NewImage.replace("Delete", '"Rollback Delete"');
        }
        else {
            _NewImage = _NewImage.replace("True.gif", "deleteIcon.gif");
            _NewImage = _NewImage.replace("Rollback Delete", "Delete");
        }
        document.getElementById(_TableName).rows[_RowIndex + 1].cells[0].innerHTML = _NewImage;
    }
    else {
        showErrorMessage("An error occurred while saving this record.");
    }
}


function EditCriteria(WorkFlowId, RowIndex, GridViewWorkFlowSteps, WorkFlowEventId) {
    _TableName = GridViewWorkFlowSteps;
    _RowIndex = RowIndex;
    _WorkFlowId = WorkFlowId;
    _CurrentEventId = WorkFlowEventId;
    ShowCriteria();
}

function CancelAction() {
    document.getElementById("DropDownListActions").selectedIndex = 0;
    document.getElementById("ButtonUpdateWorkFlowStepAction").value = "Insert";
    document.getElementById("TextBoxExecutionOffsetDays").value = "";
    document.getElementById("DivWorkFlowActionParameters").innerHTML = "";
    _WorkFlowStepActionId = -1;
}

function FillChildDropDown(Object, CompanyId) {
    var Position = -1;
    ControlName = new String();
    //alert(Object.id + ":" + CompanyId + ":" + Object.name);
    ControlName = Object.name.replace("GridViewStepCriteria$ctl0", "");
    ControlName = ControlName.replace("$ctl01", "")
    Position = parseInt(ControlName) + 1;
    document.getElementById(_GridViewStepCriteriaControl).rows[2].cells[3].Program
    for (Rows = 0; Rows < document.getElementById(_GridViewStepCriteriaControl).rows.length; Rows++) {
        if (document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[3].Company == "True") {
            _ProgramDropDownContainer = document.getElementById(_GridViewStepCriteriaControl).rows[Rows].cells[3];
            _Action = "GetProgramListBox"
            RequestUrl = "../Ajax/AjaxServer.aspx?Page=Common&CompanyId=" + CompanyId + "&Action=" + _Action;
            var stamp = new Date();
            RequestUrl += "&stamp=" + stamp.getTime();
            _CurrentProgramRow = Rows;
            CallAjax();

        }
    }

}
function FillChildListBox(Object, CompanyId, AjaxAction) {

    ControlName = new String();
    ControlName = Object.name.replace("GridViewStepCriteria$ctl0", "");
    ControlName = ControlName.replace("$ctl01", "")
    Position = parseInt(ControlName) + 1;

    _selectedValues = "";
    $(Object).find("option:selected").each(function () {
        _selectedValues += $(this).val() + ",";
    });
    var childSelectedValues = "";
    $("[ParentControl='" + $(Object).prop("id") + "']").find("option:selected").each(function () {
        childSelectedValues += $(this).val() + ",";
    });
    if (_selectedValues.length > 0) _selectedValues = _selectedValues.substring(0, _selectedValues.length - 1);
    _Action = AjaxAction;
    RequestUrl = "../Ajax/AjaxServer.aspx?Page=Common&CompanyId=" + CompanyId + "&Action=" + _Action + "&SelectedValues=" + _selectedValues + "&ParentControlId=" + $(Object).prop("id") + "&ChildSelectedValues=" + childSelectedValues;

    RequestUrl += "&stamp=" + $.now();
    CallAjax();
    $("[ParentControl='" + $(Object).prop("id") + "']").trigger('change');
}

function BindProgramDropDown() {
    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            GridProgramsString = new String();
            GridProgramsString = XmlHttp.responseText;

            if (GridProgramsString.indexOf("<select") > -1) {
                GridProgramsString = GridProgramsString.substring(GridProgramsString.indexOf("<select"), GridProgramsString.indexOf("</select") + 9)
                GridProgramsString = GridProgramsString.replace("ListBoxProgram", "ListBoxProgram" + _CurrentProgramRow);
                GridProgramsString += "<a href=Javascript:ClearList('ListBoxProgram" + _CurrentProgramRow + "')>Clear</a>"
            }
            else {
                GridProgramsString = "<Select id='DropDownListProgram' name='DropDownListProgram'></Select>";
            }

            _ProgramDropDownContainer.innerHTML = GridProgramsString;

        }
    }
}



function BindListBox() {
    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {

            ListItems = new String();
            ListItems = XmlHttp.responseText;

            if (ListItems.indexOf("<select") > -1) {
                var id = '';
                id = $("tr[DependentParent]").find("td:eq(3)").find("select").prop("name");
                ListItems = ListItems.substring(ListItems.indexOf("<select"), ListItems.indexOf("</select") + 9)
                ListItems = ListItems.replace("ListBoxTemp", id);
                ListItems += "<a href=Javascript:ClearList('" + id + "')>Clear</a>"
            }
            else {
                ListItems = "<Select id='ListBoxTemp' name='ListBoxTemp'></Select>";
            }
            $("tr[DependentParent]").find("td:eq(3)").find("select,a").remove();
            $("tr[DependentParent]").find("td:eq(3)").find('label').html(ListItems);
        }
    }
}


function BindProgramDropDown() {
    
    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            GridProgramsString = new String();
            GridProgramsString = XmlHttp.responseText;

            if (GridProgramsString.indexOf("<select") > -1) {
                GridProgramsString = GridProgramsString.substring(GridProgramsString.indexOf("<select"), GridProgramsString.indexOf("</select") + 9)
                GridProgramsString = GridProgramsString.replace(/ListBoxProgram/g, "ListBoxProgram" + _CurrentProgramRow);
                GridProgramsString += "<a href=Javascript:ClearList('ListBoxProgram" + _CurrentProgramRow + "')>Clear</a>"
            }
            else {
                GridProgramsString = "<Select id='DropDownListProgram' name='DropDownListProgram'></Select>";
            }
            var onChangeEvent = $(_ProgramDropDownContainer).find("select").attr("onchange");
            _ProgramDropDownContainer.innerHTML = GridProgramsString.replace('id="ListBoxProgram' + _CurrentProgramRow + '"', 'id="ListBoxProgram' + _CurrentProgramRow + '" onchange="' + onChangeEvent + '"');
            $("#ListBoxProgram" + _CurrentProgramRow).change();


        }
    }
}






function DeleteWorkFlow(Object, WorkFlowId, RowIndex, TableName) {
    var _NewImage = document.getElementById(TableName).rows[RowIndex + 1].cells[0].innerHTML;
    _RowIndex = RowIndex;
    _TableName = TableName;
    if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
        var ErrorMessage = "Are you sure you want to delete this WorkFlow?";
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&WorkFlowId=" + WorkFlowId + "&Action=DeleteWorkFlow&Active=Y";
    }
    else {
        var ErrorMessage = "Are you sure you want to Rollback delete of this  WorkFlow?"
        RequestUrl = "../Ajax/AjaxServer.aspx?Page=Workflow&WorkFlowId=" + WorkFlowId + "&Action=DeleteWorkFlow&Active=N";
    }
    var stamp = new Date();
    RequestUrl += "&stamp=" + stamp.getTime();
    if (confirm(ErrorMessage)) {
        _Id = -1;
        _Action = "DeleteWorkFlow";
        //RequestUrl ="../Ajax/AjaxServer.aspx?Page=Workflow";
        Params = "&Action=" + _Action;
        //alert(RequestUrl);
        CallAjax();
    }
}

function WorkFlowDeleted() {
    if (XmlHttp.readyState == 4) {
        if (XmlHttp.status == 200) {
            var XMLObject = XmlHttp.responseXML;
            if (XMLObject.getElementsByTagName("Result").length > 0 && XMLObject.getElementsByTagName("Result")[0].childNodes[0].nodeValue == "True") {
                var _NewImage = document.getElementById(_TableName).rows[_RowIndex + 1].cells[0].innerHTML;
                if (_NewImage.indexOf("deleteIcon.gif") >= 0) {
                    _NewImage = _NewImage.replace("deleteIcon.gif", "True.gif");
                    _NewImage = _NewImage.replace("Delete", '"Rollback Delete"');
                }
                else {
                    _NewImage = _NewImage.replace("True.gif", "deleteIcon.gif");
                    _NewImage = _NewImage.replace("Rollback Delete", "Delete");
                }
                //alert(_NewImage)
                document.getElementById(_TableName).rows[_RowIndex + 1].cells[0].innerHTML = _NewImage;
            }
            else {
                showErrorMessage("An error occurred while saving this record.");
            }
        }
    }
}


function ValidateCriteria(Criteria, Operator, SubCriteria, Control) {
    if (Criteria == "ClientMovements.MovementType" && (SubCriteria == "" || SubCriteria == "-1")) {
        showErrorMessage("Please select " + Criteria);
        Control.focus();
        return false;
    }
    return true;
}
function SetDefaultExecutionOffSet() {
    if (document.getElementById(_EventOffSetOperator) != null) document.getElementById(_EventOffSetOperator).selectedIndex = 0;
    if (document.getElementById(_EventOffSetDropDown) != null) document.getElementById(_EventOffSetDropDown).selectedIndex = 0;
    if (document.getElementById(_EventOffSetDays) != null) document.getElementById(_EventOffSetDays).value = "";
}
function ShowHide(TableName, flag, obj) {
    if (flag == false) {
        document.getElementById(TableName).style.display = 'none';
        document.getElementById(obj).innerHTML = "<a href=\"javascript:ShowHide('" + TableName + "',-1,'" + obj + "')\">Show</a>";
    }
    else if (flag == -1) {
        if (document.getElementById(TableName).style.display == "none") {
            document.getElementById(TableName).style.display = 'block';
            document.getElementById(obj).innerHTML = "<a href=\"javascript:ShowHide('" + TableName + "',-1,'" + obj + "')\">Hide</a>";
        }
        else {
            document.getElementById(TableName).style.display = 'none';
            document.getElementById(obj).innerHTML = "<a href=\"javascript:ShowHide('" + TableName + "',-1,'" + obj + "')\">Show</a>";
        }
    }
    else {
        document.getElementById(obj).innerHTML = "<a href=Javascript:ShowHide('" + TableName + "',-1,'" + obj + "')>Hide</a>";
        document.getElementById(TableName).style.visibility = 'visible';
        document.getElementById(TableName).style.position = 'relative';
    }
}
function SetDefaultSection() {
    if (location.href.indexOf("WorkFlowDetails.aspx?Mode=New") > -1) {
        document.getElementById("divShowHideClientNote").innerHTML = "<a href=Javascript:ShowHide('DivWorkFlowCriteria',-1,'divShowHideClientNote')>Hide</a>";
    }
}
function ShowWorkFlowDetails(flag, OldValue, NewValue) {
    debugger;
    if (flag == 1) {
        document.getElementById('DivWorkFlowDetails').style.display = 'block';
        document.getElementById('TextBoxOldValue').value = OldValue;
        document.getElementById('TextBoxNewValue').value = NewValue;
    }
    else
        document.getElementById('DivWorkFlowDetails').style.display = 'none';
}
function GetProgramChildControls(ProgramId) {
    $.ajax({ type: "GET", url: "../Ajax/AjaxServer.aspx", cache: false, data: 'Page=Financials&Action=GetFeeTypeDropDownFromProgram&ProgramId=' + ProgramId, success: ShowFeeDropDown });
}
function ShowFeeDropDown(Result) {
    if (Result.indexOf("<select") > -1) {
        Result = Result.substring(Result.indexOf("<select"), Result.indexOf("</select") + 9);
        $("[Dependent=Program]").parent().html(Result);
    }
}

function InitWorkflowClone(elem, workflowId, description) {
    if (confirm("Do you want to make a copy of the workflow?")) {
        $('#CloneWorkflowId').val(workflowId);
        $('#TextBoxDescription').val(description + ' - Copy');
        $('#WorkflowDescContainer').modal('show');
    }
}

function WorkflowClone() {
    $.post('/Ajax/AjaxServer.aspx?Page=Workflow&Action=Clone', {
        WorkflowId: $('#CloneWorkflowId').val(),
        Description: $('#TextBoxDescription').val()
    }, CloneDone, 'xml');
}

function CloneDone(xml) {
    $('#WorkflowDescContainer').modal('hide');
    localStorage.setItem("savedMessage", 'Make any changes to the configuration and then set the Start Date to the current date to allow the workflow to start executing');
    localStorage.setItem("messageTimeout", 10000);
    window.location.href = 'DesignWorkflow.aspx';
}

function InitActionClone(WorkFlowStepActionId, WorkFlowStepId, WorkFlowActionId, ActionDueDays) {
    EditWorkFlowStepAction(WorkFlowStepActionId, WorkFlowStepId, WorkFlowActionId, ActionDueDays);
    $('#ButtonUpdateWorkFlowStepAction').val("Clone");
    _WorkFlowStepActionId = -1;
}


function onAssigneeTypeChange(obj) {
    if ($(obj).find('option:selected').text() == 'External Email') {
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress').css('display', 'table-row');
        $('#DivWorkFlowActionParameters').find('.SendTo').css('display', 'none');
        $('#DivWorkFlowActionParameters').find('.SendTo select').val('-1');
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress input').addClass('req_field');
    } else if ($(obj).find('option:selected').text() == 'Clients Case Manager'
        || $(obj).find('option:selected').text() == 'Clients Secondary Case Manager'
        || $(obj).find('option:selected').text() == 'Treatment Group Facilitator'
        || $(obj).find('option:selected').text() == 'Grievance Investigator'
        || $(obj).find('option:selected').text() == 'Service Manager'
        || $(obj).find('option:selected').text() == 'Probation Officer') {
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress').css('display', 'none').val('');
        $('#DivWorkFlowActionParameters').find('.SendTo').css('display', 'none').val('-1');
        $('#DivWorkFlowActionParameters').find('.SendTo select').val('-1');
        $('#DivWorkFlowActionParameters').find('.StaffId').css('display', 'none').val('-1');
        $('#DivWorkFlowActionParameters').find('.StaffId select').val('-1');

    } else {
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress').css('display', 'none');
        $('#DivWorkFlowActionParameters').find('.ExternalEmailAddress input').val('');
        $('#DivWorkFlowActionParameters').find('.SendTo,.StaffId').css('display', 'table-row');
    }


}

function BindFilterEvents(html) {

    if (html.indexOf("<select") > -1) {
        html = html.substring(html.indexOf("<select"), html.indexOf("</select") + 9)
        html = html.replace("name=\"DropDownListEvents\" id=\"DropDownListEvents\"", "name=\"DropDownListEventsFilter\" id=\"DropDownListEventsFilter\"");
        html = html.replace("SetEventId(this)", "SetFilterEventId(this)");
        $("#FilterEventContainer").html("<label class='select'>" + html + "<i></i></label>");
        if ($('#HiddenSelectedEventFilter').val()) {
            $('#DropDownListEventsFilter').val($('#HiddenSelectedEventFilter').val());
        }
    }
    else {
        $('#DropDownListEventsFilter option').remove();
    }
}

function GetFilterEvents() {
    if (parseInt($('#DropDownListEventTypesFilter').val()) < 1) {
        $('#DropDownListEventsFilter option').remove();
    }
    else {
        $.post("../Ajax/AjaxServer.aspx?Page=Workflow&Action=BindEvents", { EventTypeId: $('#DropDownListEventTypesFilter').val() }, BindFilterEvents, 'html');
    }
}

function InitFilters() {
    GetFilterEvents();

    $('#DropDownListEventTypesFilter').change(function () {
        $('#HiddenSelectedEventFilter').val('');
    });
}


function ValidateStepActionFields() {
    var checked = null;
    $("#DataListActionParameters .req_field").each(function () {
        if (isEmpty($(this).val()) || $(this).val() == "-1" && $(this).is(":visible"))
        {
            var fieldName = $(this).closest("tr").attr("class");
            showErrorMessage("Please enter the value of " + fieldName + "");
            checked = false;
            return checked;
        }
    });
    
    if (checked == null) {
        return true;
    }

}