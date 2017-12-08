import React from 'react';
//import ReactDOM from 'react-dom';
import { FormattedMessage } from "react-intl";
import { Form, Field } from "simple-react-form";
import { ChoiceEditor } from "./PropEditors";
import HumanCitation from "./HumanCitation";
import MachineCitation from "./MachineCitation";
import api from "../utils/api";
import { FlatButton, Dialog, RaisedButton } from "material-ui";

const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.75)',
    zIndex            : 1000
  },
  content : {
    top                   : '50%',
    left                  : '50%',
    width                 : '50%',
    height                : 'auto',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex                : 1005,
    overflow              : 'hidden'
  }
};

export default class CiteThis extends React.Component {

  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    let { intl } = this.props;
    var label = intl.formatMessage({ id: "cite_" + this.props.thing.type });
    const actions = [
      <FlatButton
        label={intl.formatMessage({ id: "close" })}
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <div>
        <RaisedButton
          onClick={this.handleOpen}
          className="customButton"
          label={label}
          style={{marginTop: '15px'}}
        />
        <Dialog
          title={label}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <HumanCitation
            intl={intl}
            thing={this.props.thing}
          />
          <hr />
          <MachineCitation
            intl={intl}
            thing={this.props.thing}
          />
        </Dialog>
      </div>
    );
  }
}

//ReactDOM.render(<CiteThis />, appElement);
