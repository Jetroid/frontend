import React, { Component } from "react";
import { FormattedMessage, intlShape, injectIntl } from "react-intl";
import { Form, Field } from "simple-react-form";
import BodyEditor from "./BodyEditor";
import { Container, Col } from "reactstrap";
import ImageListEditor from "./ImageListEditor";
import Text from "simple-react-form-material-ui/lib/text";
import tags_json from "../autocomplete_data/tags.json";
import "./CaseEditor.css";
import "./GeoSuggest/GeoSuggest.css";
import RelatedEditor from "./RelatedEditor";
import RaisedButton from "material-ui/RaisedButton";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Publish from "material-ui/svg-icons/editor/publish";
import fix_related from "./fix-related.js";
import { encodeLocation } from "./geoutils";
import PublishIcon from "material-ui/svg-icons/editor/publish";
import Joyride from 'react-joyride';
import {
  makeLocalizedChoiceField,
  makeLocalizedBooleanField,
  makeLocalizedDateField,
  makeLocalizedNumberField,
  makeLocalizedTextField,
  makeLocalizedLocationField,
  makeLocalizedListField
} from "./PropEditors";

const tags = tags_json["tags"];

const buttonStyle = {
  margin: "1em"
};


class CaseEditor extends Component {
  constructor(props) {
    super(props);
    let thing = props.thing;
    if (!thing.images) {
      thing.images = [];
    }
    if (!thing.body) {
      thing.body = props.intl.formatMessage({
        id: "case_description_placeholder"
      });
    }
    this.state = { 
      thing, 
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: true,
      stepIndex: 0,
    };
    this.updateBody = this.updateBody.bind(this);
    this.goFullSubmit = this.goFullSubmit.bind(this);
    this.callback = this.callback.bind(this);
    this.next = this.next.bind(this);
  }

  next() {
    this.joyride.next();
  }

  callback(data) {

  }

  goFullSubmit() {
    this.setState({
      steps: null,
    });
  }

  updateBody(body) {
    let updatedThing = Object.assign({}, this.state.thing, {body: body});
    this.setState({thing:updatedThing});
  }

  componentWillReceiveProps(nextProps) {
    let thing = nextProps.thing;
    if (!thing.body) {
      thing.body = nextProps.intl.formatMessage({
        id: "case_description_placeholder"
      });
    }
    if (
      thing.number_of_meeting_days === null ||
      thing.number_of_meeting_days === "null"
    ) {
      thing.number_of_meeting_days = 0;
    }
    this.setState({ thing });
  }

  onSubmit() {
    let thing = this.state.thing;
    this.props.onSubmit(thing);
  }
  
  render() {
    let { cases, methods, organizations, isQuick, onExpand, intl } = this.props;
    let thing = this.state.thing;
    thing.related_cases = fix_related(thing.related_cases);
    thing.related_methods = fix_related(thing.related_methods);
    thing.related_organizations = fix_related(thing.related_organizations);
    if (!thing.location) {
      thing.location = "";
    }
    if (typeof thing.location !== typeof "") {
      thing.location = encodeLocation(thing.location);
    }

    if (!this.state.thing) {
      return <div />;
    }
    let onSubmit = this.onSubmit.bind(this);
    let tagseditor = (
      <Field
        fieldName="tags"
        type={RelatedEditor}
        maxSearchResults={30}
        dataSource={tags}
        placeholder={intl.formatMessage({
          id: "tags_placeholder"
        })}
      />
    );
    let related_cases = (
      <Field
        fieldName="related_cases"
        type={RelatedEditor}
        dataSource={cases}
        dataSourceConfig={{ text: "text", value: "value" }}
        placeholder={intl.formatMessage({
          id: "related_cases_placeholder"
        })}
      />
    );
    let related_methods = (
      <Field
        fieldName="related_methods"
        type={RelatedEditor}
        dataSource={methods}
        dataSourceConfig={{ text: "text", value: "value" }}
        placeholder={intl.formatMessage({
          id: "related_methods_placeholder"
        })}
      />
    );
    let related_organizations = (
      <Field
        fieldName="related_organizations"
        type={RelatedEditor}
        dataSource={organizations}
        dataSourceConfig={{ text: "text", value: "value" }}
        placeholder={intl.formatMessage({
          id: "related_organizations_placeholder"
        })}
      />
    );
    let incomplete = thing.title ? false : true;
    let issue = this.state.thing.issue;
    let doFullVersion = this.props.new
      ? "do_full_version"
      : "edit_full_version";
    let quickSubmitText = "publish";
    let fullSubmitText = "publish";
    const {
      isRunning,
      joyrideOverlay,
      joyrideType,
      stepIndex,
    } = this.state;
    let steps;
    isQuick & !incomplete ? 
      steps = [
        {
          title: 'Publish',
          text: 'Click here to publish this article. Don’t leave the page without clicking this button, as your work won’t be saved. You can publish at any time and return to edit any article later. Articles that you have published will be saved to your profile page.',
          selector: '.publish.qs',
          position: 'top',
          type: 'hover',
        },
        {
          title: 'Full Version',
          text: 'There’s more information you can add about this case. Click here to enter more details, including a narrative description. The information you’ve already entered will carry over to the full version.',
          selector: '.full-submit',
          position: 'top',
          type: 'hover',
        },
        {
          title: 'Submit',
          text: 'Click here to publish this article. Don’t leave the page without clicking this button, as your work won’t be saved. You can publish at any time and return to edit any article later. Articles that you have published will be saved to your profile page.',
          selector: '.submitUIButton',
          isFixed: true,
          position: 'top',
          type: 'hover',
        },
      ]
     :
      steps = []
    return (
      <div>
        <Joyride
          ref={c => (this.joyride = c)}
          callback={this.callback}
          debug={false}
          allowClicksThruHole={true}
          locale={{
            back: (<span>Back</span>),
            close: (<span>Close</span>),
            last: (<span>Last</span>),
            next: (<span>Next</span>),
            skip: (<span>Skip</span>),
          }}
          run={isRunning}
          showOverlay={joyrideOverlay}
          showSkipButton={true}
          showStepsProgress={true}
          stepIndex={stepIndex}
          steps={steps}
          type={joyrideType}
        />
        <Form
          onSubmit={onSubmit}
          state={thing}
          onChange={changes => this.setState({ thing: changes })}
        >
          <div className="main-contents">
            <Container className="detailed-case-component" fluid>
              <Col
                md="3"
                className="d-none d-sm-block d-md-block d-lg-block d-xl-block sidepanel"
              />
              <Col md="6" className="ml-auto mr-auto">
                <div className="case-box">
                  <div className="field-case top">
                    <h2 className="sub-heading">
                      <label htmlFor="title">
                        <FormattedMessage id={thing.type + "_title_label"} />
                      </label>
                    </h2>
                    <p className="explanatory-text"><FormattedMessage
                      id={intl.formatMessage({
                        id: thing.type + "_title_placeholder"
                      })}/></p>
                    <Field
                      fieldName="title"
                      name="title"
                      className="custom-field"
                      type={Text}
                      placeholder=""
                      fullWidth
                    />
                  </div>
                  {makeLocalizedChoiceField(
                    intl,
                    "issue",
                    "issue",
                    "general_issues"
                  )}
                  {issue && !isQuick ? (
                    <div>
                      {makeLocalizedChoiceField(
                        intl,
                        "specific_topic",
                        issue,
                        "specific_topic"
                      )}
                    </div>
                  ) : (
                    undefined
                  )}
                  {issue === "other" &&
                  this.state.thing.specific_topic === "other" ? (
                    <b>
                      {intl.formatMessage({
                        id: "send_email_with_catgeory_additions"
                      })}
                    </b>
                  ) : (
                    undefined
                  )}
                  <div className="case-location">
                    {makeLocalizedLocationField(intl, "location")}
                    <h2 className="sub-heading">
                      <FormattedMessage id="date" />
                    </h2>
                    {makeLocalizedDateField(intl, "start_date")}
                    {makeLocalizedDateField(intl, "end_date")}
                    <h2 className="sub-heading">
                      <FormattedMessage id="links" />
                    </h2>
                    {makeLocalizedListField(intl, "links")}
                  </div>
                  <h2 className="sub-heading">
                    <FormattedMessage id="media" />
                  </h2>
                  <p className="sub-sub-heading">
                    <FormattedMessage id="photos" />
                  </p>
                  <ImageListEditor property="images" thing={thing} />
                  <p className="sub-sub-heading">
                    <FormattedMessage id="videos" />
                  </p>
                  {makeLocalizedListField(intl, "videos")}
                  <h2 className="sub-heading">
                    <FormattedMessage id="tags_title" />
                  </h2>
                  {tagseditor}
                </div>
                <div>
                  {isQuick ? (
                    <div>
                      {incomplete ? (
                        <div className="incomplete pt-4">
                          <FormattedMessage id={"incomplete_" + thing.type} />
                        </div>
                      ) : null}
                      <RaisedButton
                        className="publish qs left customButton"
                        disabled={incomplete}
                        label="Label after"
                        labelPosition="after"
                        icon={<PublishIcon />}
                        secondary
                        style={buttonStyle}
                        type="submit"
                        label={intl.formatMessage({
                          id: quickSubmitText
                        })}
                      />
                      <span><FormattedMessage id="or" /></span>
                      <RaisedButton
                        onClick={() => onExpand(this.state.thing)}
                        className="customButton full-submit"
                        style={buttonStyle}
                        primary
                        label={intl.formatMessage({ id: doFullVersion })}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="field-case">
                        <h2 className="sub-heading" htmlFor="body_en">
                          {intl.formatMessage({
                            id: thing.type + "_body_title"
                          })}
                        </h2>
                        <BodyEditor onEditorChange={this.updateBody} html={thing.body} />
                      </div>
                      <div className="related-content">
                        {makeLocalizedChoiceField(intl, "communication_mode")}
                        {makeLocalizedChoiceField(
                          intl,
                          "communication_with_audience"
                        )}
                        {makeLocalizedChoiceField(intl, "decision_method")}
                        {makeLocalizedChoiceField(
                          intl,
                          "facetoface_online_or_both"
                        )}
                        {makeLocalizedBooleanField(intl, "facilitated")}
                        {makeLocalizedChoiceField(intl, "voting")}
                        {makeLocalizedNumberField(intl, "number_of_meeting_days")}
                        {makeLocalizedChoiceField(
                          intl,
                          "targeted_participant_demographic"
                        )}
                        {makeLocalizedChoiceField(intl, "kind_of_influence")}
                        {makeLocalizedChoiceField(
                          intl,
                          "targeted_participants_public_role"
                        )}
                        {makeLocalizedChoiceField(intl, "targeted_audience")}
                        {makeLocalizedChoiceField(intl, "participant_selection")}
                        {makeLocalizedChoiceField(intl, "type_of_funding_entity")}
                        {makeLocalizedChoiceField(
                          intl,
                          "type_of_implementing_entity"
                        )}
                        {makeLocalizedChoiceField(
                          intl,
                          "type_of_sponsoring_entity"
                        )}
                        {}
                        {makeLocalizedBooleanField(intl, "ongoing")}
                        {makeLocalizedTextField(intl, "staff_type")}
                        {makeLocalizedTextField(
                          intl,
                          "who_else_supported_the_initiative"
                        )}
                        <div className="pb-1">
                          <h2 className="sub-heading">
                            <FormattedMessage id="related_content" />
                          </h2>
                          <p className="sub-sub-heading">
                            <FormattedMessage id="related_cases_label" />
                          </p>
                          {related_cases}
                        </div>
                        <div className="pb-1">
                          <p className="sub-sub-heading">
                            <FormattedMessage id="related_methods_label" />
                          </p>
                          {related_methods}
                        </div>
                        <div className="pb-1">
                          <p className="sub-sub-heading">
                            <FormattedMessage id="related_organizations_label" />
                          </p>
                          {related_organizations}
                        </div>{" "}
                      </div>
                      {incomplete ? (
                        <p className="pt-3 incomplete">
                          {intl.formatMessage({
                            id: "incomplete_" + thing.type
                          })}
                        </p>
                      ) : null}
                      <RaisedButton
                        className="publish qs left customButton"
                        disabled={incomplete}
                        label="Label after"
                        labelPosition="after"
                        icon={<PublishIcon />}
                        secondary
                        style={buttonStyle}
                        type="submit"
                        label={intl.formatMessage({
                          id: fullSubmitText
                        })}
                      />
                    </div>
                  )}
                </div>
              </Col>
              {!isQuick ?
                <FloatingActionButton
                  onTouchTap={this.onSubmit.bind(this)}
                  className="submitUIButton"
                  disabled={incomplete}
                >
                  <Publish />
                </FloatingActionButton>
                :
                <div/>
              }
            </Container>
          </div>
        </Form>
      </div>
    );
  }
}

CaseEditor.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(CaseEditor);
