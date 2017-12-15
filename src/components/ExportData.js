import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import RaisedButton from 'material-ui/RaisedButton';
import 'react-select/dist/react-select.css';
import api from "../utils/api";
import fileDownload from "js-file-download";

export default class ExportData extends React.Component {

  constructor(props) {
    super(props)

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.exportData = this.exportData.bind(this);

    this.state = {
      removeSelected: true,
      stayOpen: false,
      value: [],
    };
  }

  propTypes: {
    thingtype: PropTypes.string,
  };

  handleSelectChange (value) {
    this.setState({ value });
  }

  convertValueToQueryParams(value) {
    // no filtering when nothing selected
    if(value === null || value.length < 1) {
      return {};
    }
    // selected fields are converted into null objects to be passed as a GET parameter
    let values = value.split(',');
    let queryParams = {}
    for(let i = 0; i < values.length; i++) {
      let value = values[i];
      queryParams[value] = null;
    }
    return queryParams;
  }

  exportData (accept) {
    //console.log(this.state.value);
    var filter = this.convertValueToQueryParams(this.state.value);
    api.fetchAllThings(this.props.thingtype, accept, filter)
      .then(function(response) {
        var filename = response.headers.get('content-disposition').match(/filename="(.+)"/)[1];
        response.text().then(function (text) {
          fileDownload(text, filename);
        });
      });
  }

  render () {
    let { intl } = this.props;
    const buttonStyle = {
        margin: 12,
      };
    const { value } = this.state;
    return (
      <div>
        <div className="section">
          <h3 className="section-heading">{this.props.label}</h3>
          <Select
            closeOnSelect={false}
            multi
            onChange={this.handleSelectChange}
            options={this.props.options}
            placeholder={this.props.placeholder}
            removeSelected={this.state.removeSelected}
            simpleValue
            value={value}
            menuContainerStyle={{zIndex:500}}
          />
        </div>
        <RaisedButton
          label={intl.formatMessage({ id: "export_csv" })}
          style={buttonStyle}
          onClick={this.exportData.bind(this, "text/csv")}
        />
        <RaisedButton
          label={intl.formatMessage({ id: "export_xml" })}
          style={buttonStyle}
          onClick={this.exportData.bind(this, "application/xml")}
        />
        <RaisedButton
          label={intl.formatMessage({ id: "export_json" })}
          style={buttonStyle}
          onClick={this.exportData.bind(this, "application/json")}
        />
      </div>
    );
  }
}
