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
      filters: [],
    };
  }

  propTypes: {
    thingtype: PropTypes.string,
  };

  handleSelectChange (filters) {
    this.setState({ filters });
    // Reposition the dialog - https://github.com/mui-org/material-ui/issues/5793
    window.dispatchEvent(new Event('resize'));
  }

  exportData (accept) {
    var filter = this.state.value;
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
        margin: '12px',
      };
    return (
      <div>
        <div className="section">
          <h3 className="section-heading">{this.props.label}</h3>
          <div style={{position: "relative"}}>
            <Select
              closeOnSelect={false}
              multi
              onChange={this.handleSelectChange}
              options={this.props.options}
              placeholder={this.props.placeholder}
              removeSelected={true}
              value={this.state.filters}
              menuContainerStyle={{
                position: "fixed",
                zIndex: 500,
                top: "auto",
                width: "400px",
              }}
            />
          </div>
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
