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
    // retrieve the case fields
    api.fetchFields(this.props.thingtype).then(function(fields) {
      // isolate the fields
      var keys = Object.keys(fields);
      var options = [];
      // format the fields as options for the multi-select
      for(var i = 0; i < keys.length; i++) {
        options.push({label: keys[i], value: keys[i]});
      }
      // add the options to state
      var stateOptions = component.state.options.slice();
      Array.prototype.push.apply(stateOptions, options);
      component.setState({options: stateOptions});
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
          fullscreen
          title={intl.formatMessage({ id: "export_" + this.props.thingtype })}
          actions={actions}
          modal={false}
          open={this.props.open}
          bodyStyle={{overflowY: "visible"}}
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
