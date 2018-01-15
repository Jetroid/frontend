import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ExportData from '../components/ExportData';
import api from "../utils/api";
import { injectIntl } from "react-intl";

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class ExportDataDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.render,
      options: []
    };
  }

  componentDidMount() {
    let component = this;
    if(this.props.thingtype === 'all'){
      return;
    }
    // retrieve the fields to populate the exclusion menu
    api.fetchTemplate(this.props.thingtype).then(function(fields) {
      // Failure case
      if(!fields || typeof fields !== 'object'){
        component.setState({options: []});
      }
      // We don't want to give the option to remove id or title, these are required fields
      delete fields['id'];
      delete fields['title'];

      let keys = Object.keys(fields);
      // format the fields as options for the multi-select
      let options = [];
      for(let i = 0; i < keys.length; i++) {
        options.push({label: keys[i], value: keys[i]});
      }
      component.setState({options: options});
    });
  }

  render() {
    let { intl } = this.props;
    const actions = [
      <FlatButton
        label="CLOSE"
        onClick={this.handleClose}
      />
    ];
    return (
      <div>
        <Dialog
          autoScrollBodyContent={true}
          title={intl.formatMessage({ id: "export_" + this.props.thingtype })}
          actions={actions}
          open={this.props.open}
        >
          <ExportData
            label={intl.formatMessage({ id: "excluded_fields" })}
            placeholder={intl.formatMessage({ id: "excluded_fields_placeholder" })}
            options={this.state.options}
            intl={this.props.intl}
            thingtype={this.props.thingtype}
          />
        </Dialog>
      </div>
    );
  }
}

export default injectIntl(ExportDataDialog);
