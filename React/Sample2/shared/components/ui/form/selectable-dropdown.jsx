import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import createFilterOptions from "react-select-fast-filter-options";
import Select from "react-select";

class SelectableDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedGlobalCodeOption: null,
            option: [],
            filterOptions: []
        };
    }
    componentDidMount() {
        const { handleGlobalCodeCategory, selectedGlobalCode } = this.props;
        const options = this.getGlobalCodeJson(handleGlobalCodeCategory, selectedGlobalCode);
        const filterOptions = createFilterOptions({
            options
        });
        this.setState({ option: options, selectedGlobalCodeOption: selectedGlobalCode, filterOptions: filterOptions });
    }
    handleChange = selectedGlobalCode => {
        this.setState({ selectedGlobalCodeOption: selectedGlobalCode.value });
        console.log(`Option selected:`, selectedGlobalCode);
    };
    getGlobalCodeJson = (category, selectedValue) => {
        let selectedInactiveGlobalCodeJson = null;
        debugger;
        //let globalCodeJson = JSON.parse(localStorage.getItem('globalcodes'));
         let globalCodeJson = this.props.global;
        let activeGlobalCodeJson = globalCodeJson.filter(x => x.CategoryName === category.slice(0, -2) && x.RecordDeleted === "N" && x.Active === "Y")
        if (selectedValue) {
            if ((globalCodeJson.filter(x => x.CategoryName === category.slice(0, -2) && (x.RecordDeleted === "Y" || x.Active === "N"))).length > 0) {
                selectedInactiveGlobalCodeJson = globalCodeJson.filter(obj => {
                    return obj.GlobalCodeId === selectedValue;
                });
                activeGlobalCodeJson.push(selectedInactiveGlobalCodeJson[0]);
            }
        }


        const json = [];

        // globalCodeJson.filter(x => x.CategoryName === category.slice(0, -2) && x.RecordDeleted === "N" && x.Active === "Y").map((items, index) => {
        activeGlobalCodeJson.map((items, index) => {
            let jsonObj = {
                label: items["CodeName"],
                value: items["GlobalCodeId"]
            };
            json.push(jsonObj);
        })
        return json;

    }

    render() {
        const { option, selectedGlobalCodeOption, filterOptions } = { ...this.state };
// console.log(this.props.global);
        return (

            <Fragment>
                <Select value={selectedGlobalCodeOption} filterOptions={filterOptions} options={option} onChange={this.handleChange} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    debugger;
    return {
        global: state.global
    };
};

export default connect(mapStateToProps, null)(SelectableDropDown);