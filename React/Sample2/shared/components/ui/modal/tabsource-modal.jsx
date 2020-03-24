import React, { Component, Fragment } from 'react';
import SelectableDropDown from '../form/selectable-dropdown';
import { Modal, Button } from 'react-bootstrap';
import FormatDateTime from '../../functional/DateTimeFormatter';
import { Form, Schema, Field, TextEdit, Chooser } from "react-dynamic-forms";
// import Select from 'react-select-plus';
import createFilterOptions from "react-select-fast-filter-options";
import Select from "react-select";
import Immutable from "immutable";
import { push } from 'react-router-redux';


class ModalContent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
        }
    }

    render() {
        const globalcodes = JSON.parse(localStorage.getItem('globalcodes'));
        const { headerWithDataType, ediableData, submit, hasMissing, hasErrors, onhandleMissingCountChange, onhandleErrorCountChange, onhandleChange, selectedTabName, modalProps } = this.props;
        
        if (modalProps.ModalTabs.length > 0) {
            return (
                <div id="DivInnerTable">
                    <div className="jarviswidget well" id="wid-id-3" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-togglebutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" data-widget-custombutton="false" data-widget-sortable="false" role="widget" >
                        <ul class="nav nav-tabs bordered">
                            {
                                modalProps.ModalTabs.map((ModalTab, index) => {
                                    return (
                                        <li class="active" tab={ModalTab.TabName}>
                                            <a href="#" data-toggle="tab" onClick={() => this.setState({ activeIndex: index })}>{ModalTab.TabName}</a>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>

                    <div class="tab-content">
                        {
                            modalProps.ModalTabs.map((ModalTab, index) => {
                                
                                return (
                                    <div id={ModalTab.TabName} class={`tab-pane ${index === this.state.activeIndex ? 'active' : ''}`}>
                                        <table className="table table-condensed smart-form">
                                            <tbody>
                                                {
                                                    headerWithDataType.map((row, index) => {
                                                       
                                                        if (ModalTab.Columns.indexOf(row.ColumnName) > 0) {
                                                            if (row["DataType"] === "string") {
                                                                return (
                                                                    <tr key={index} >
                                                                        <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>

                                                                        <td>
                                                                            <label className="input">
                                                                                <input requiredcolumn="false" type="text" id={row["ColumnName"]} name={row["ColumnName"]} value={ediableData[row["ColumnName"]]} onChange={(e) => this.onhandleChange(e, row["ColumnName"])} />
                                                                            </label>
                                                                        </td>

                                                                    </tr>
                                                                );
                                                            }
                                                            else if (row["DataType"] === "CH") {
                                                                return (
                                                                    <tr key={index} >
                                                                        <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                                        <td>
                                                                            <input type="checkbox" checked="checked" id="Active" name="Active" onChange={(e) => this.onhandleChange(e, row["ColumnName"])}></input>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            else if (row["DataType"] === "GC") {
                                                                return (
                                                                    <tr key={index} >
                                                                        <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                                        <td>
                                                                            {/* <label className="select">
                                                                                <select id={ediableData[row["ColumnName"]]}>
                                                                                <option value="-1">Select an Option</option>{
                                                                                     globalcodes.filter(x => x.CategoryName === row["ColumnName"].slice(0, -2)).map((item, key) => {
                                                                                        return (<option key={key} value={item.GlobalCodeId}>{item.Description}</option>);
                                                                                    })
                                                                                }
                                                                                </select>
                                                                            </label> */}
                                                                           {/* <Select filterOptions={filterOptions} options={options} /> */}
                                                                           <SelectableDropDown handleGlobalCodeCategory={row["ColumnName"]} selectedGlobalCode={ediableData[row["ColumnName"]]}></SelectableDropDown>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            else if (row["DataType"] === "TA") {
                                                                return (
                                                                    <tr key={index} >
                                                                        <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                                        <td>
                                                                            <label className='textarea'>
                                                                                <textarea id={row["ColumnName"]} name={row["ColumnName"]} className='req_feild' value={ediableData[row["ColumnName"]]} onChange={(e) => this.onhandleChange(e, row["ColumnName"])} />
                                                                            </label>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                            else {
                                                                return (
                                                                    <tr key={index} >
                                                                        <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                                        <td>
                                                                            <label className='input'><i className='icon-append fa fa-calendar'></i>
                                                                                <input className="datetime" type='text' id={row["ColumnName"]} name={row["ColumnName"]} onChange={(e) => this.onhandleChange(e, row["ColumnName"])} />
                                                                            </label>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        }
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <div id="DivInnerTable">
                    <div className="jarviswidget well" id="wid-id-3" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-togglebutton="false" data-widget-deletebutton="false" data-widget-fullscreenbutton="false" data-widget-custombutton="false" data-widget-sortable="false" role="widget" >
                        <table className="table table-condensed smart-form">
                            <tbody>
                                {
                                    headerWithDataType.map((row, index) => {
                                       
                                        if (row["DataType"] === "string") {
                                            return (
                                                <tr key={index} >
                                                    <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>

                                                    <td>
                                                        <label className="input">
                                                            <input requiredcolumn="false" type="text" id={row["ColumnName"]} name={row["ColumnName"]} value={ediableData[row["ColumnName"]]} onChange={(e) => this.onhandleChange(e, row["ColumnName"])} />
                                                        </label>
                                                    </td>

                                                </tr>
                                            );
                                        }
                                        else if (row["DataType"] === "CH") {
                                            return (
                                                <tr key={index} >
                                                    <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                    <td>
                                                        <input type="checkbox" checked="checked" id="Active" name="Active" onChange={(e) => this.onhandleChange(e, row["ColumnName"])}></input>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        else if (row["DataType"] === "GC") {
                                            return (
                                                <tr key={index} >
                                                    <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                    <td>
                                                        {/* <label className="select">
                                                            <select id={ediableData[row["ColumnName"]]} value={ediableData[row["ColumnName"]]}>{
                                                                globalcodes.filter(x => x.CategoryName === row["ColumnName"].slice(0, -2)).map((item, key) => {
                                                                    return (<option key={key} value={item.GlobalCodeId}>{item.Description}</option>);
                                                                })
                                                            }
                                                            </select><i></i>
                                                        </label> */}
                                                        {/* <Select filterOptions={filterOptions} options={options} /> */}
                                                        <SelectableDropDown handleGlobalCodeCategory={row["ColumnName"]} selectedGlobalCode={ediableData[row["ColumnName"]]}></SelectableDropDown>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        else if (row["DataType"] === "TA") {
                                            return (
                                                <tr key={index} >
                                                    <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                    <td>
                                                        <label className='textarea'>
                                                            <textarea id={row["ColumnName"]} name={row["ColumnName"]} className='req_feild' value={ediableData[row["ColumnName"]]} onChange={(e) => this.onhandleChange(e, row["ColumnName"])} />
                                                        </label>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        else {
                                            return (
                                                <tr key={index} >
                                                    <td key={index}>{row["ColumnName"].replace(/([A-Z])/g, ' $1').trim()}</td>
                                                    <td>
                                                        <label className='input'><i className='icon-append fa fa-calendar'></i>
                                                            <input className="datetime" type='text' id={row["ColumnName"]} name={row["ColumnName"]} onChange={(e) => this.onhandleChange(e, row["ColumnName"])} />
                                                        </label>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }
}

class TabDetailModal extends Component {

    constructor(props) {
        super(props);
        //this.addActiveClass= this.addActiveClass.bind(this);

        this.state = {
            data: [],
            active: false,
            onClose: false,
            selectedRecord: [],
            showModal: false,
            recordType: [],
            loading: true,
            hasMissing: false,
            hasErrors: false,
            submit: false,
            selectedTabName: null,
            selectedTabProps: [],
            value: Immutable.Map({
                first_name: "Bob",
                last_name: "Smith",
                email: "bob@gmail.com"
            })
        }
    }
    handleSubmit() {
        this.setState({ submit: true });
    }
    handleMissingCountChange = (fieldName, missing) => {
        this.setState({ hasMissing: missing > 0 });
    }
    handleErrorCountChange = (fieldName, errors) => {
        this.setState({ hasErrors: errors > 0 });
    }
    handleChange = (e, column) => {
        this.setState({ column: e.target.value })
    }
    getSelectedTabModalJson = (selectedTabProps, selectedtabName) => {
        let tabJson = null;
        selectedTabProps.map((item, index) => {
           
            if (item.OriginalName == selectedtabName) {
               
                tabJson = item;
            }
        });
        return tabJson;
    }


    render() {
        const { onClose, selectedRecord, showModal, recordType, selectedtabName, selectedTabProps } = this.props;
        // const tabSpecificJson = this.getTabSpecificJson(this.props.selectedtabName, selectedRecord, this.props.selectedTabProps);
      
        const SelectedTabModalJSON = this.getSelectedTabModalJson(this.props.selectedTabProps, selectedtabName);
       
        return (
            <Modal show={showModal} onHide={onClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Modify Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModalContent
                        headerWithDataType={recordType}
                        ediableData={selectedRecord}
                        selectedTabName={this.props.selectedtabName}
                        // ediableData={this.state.value}
                        hasMissing={this.state.hasMissing}
                        hasErrors={this.state.hasErrors}
                        submit={this.state.submit}
                        onhandleMissingCountChange={this.handleMissingCountChange}
                        onhandleErrorCountChange={this.handleErrorCountChange}
                        onhandleChange={this.handleChange}
                        modalProps={SelectedTabModalJSON} />
                </Modal.Body>
                <Modal.Footer className="agendaBtn">
                    <Button variant="primary" > Save </Button>
                    <Button variant="secondary" onClick={onClose}> Close </Button>
                </Modal.Footer>
            </Modal >
        )
    }


}
export default TabDetailModal;