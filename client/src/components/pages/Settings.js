import React, { Component } from "react";
import "./Settings.css";
import "../../utilities.css"

import Widget from "../modules/Widget.js";
import minus from "../../public/round-delete-button.png";

import { get, post } from "../../utilities";
/**
 * Settings is a component for displaying the settings page
 *
 * Proptypes
 * @param {ObjectId} creator
 * @param {array} widgetlist
 **/
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newWidgetName: "",
      newWidgetType: "ColorWidget",
      errorMsgs: [],
    };
  }

  MAX_LENGTH = 32;

  widgetTypes = ["ColorWidget", "SliderWidget", "BinaryWidget"];

  componentDidMount() {
    this.displayWidgets();
  }

  displayWidgets = () => {
    let widgets = [];
    let isBinary = false;
    if (this.props.widgetlist) {
      this.props.widgetlist.forEach((widget) => {
        isBinary = widget["widgetType"] === "BinaryWidget"
        widgets.push(
          <div className="widContainer" >
            <> {this.getWidgetStyle(widget["name"], widget["widgetType"])} </>
            <img
              className={`${isBinary ? "minus-sign-Binary" : "minus-sign"}`}
              onClick={() => this.handleWidDelete(widget["_id"], widget["name"])}
              src={minus}
            ></img>
          </div >
        );
      });
    }
    return widgets;
  };

  getWidgetStyle(widgetName, widgetType) {
    return <Widget isSettings="true" name={widgetName} type={widgetType} work="no" />;
  }

  handleNameChange = (event) => {
    this.setState({
      newWidgetName: event.target.value,
    });
    if (event.target.value.length === this.MAX_LENGTH) {
      this.setState({ errorMsgs: `Names of widgets must be less than ${this.MAX_LENGTH} characters` })
    } else {
      this.setState({
        errorMsgs: [],
      })
    }
  };

  handleTypeChange = (event) => {
    this.setState({
      newWidgetType: event.target.value,
    });
  };

  handleWidDelete = (id, name) => {
    this.props.handleWidgetDelete(id, name);
  };


  handleWidSubmit = (e) => {
    // e.preventDefault();
    // this.validate(this.state.newWidgetName).then((msg) => {
    //   if (msg.length > 0) {
    //     alert(msg);
    //   } else {
    let a = this.validate();
    if (a.length === 0) {
      this.props.handleWidgetSubmit(this.state.newWidgetName, this.state.newWidgetType);
      this.setState({ errorMsgs: [] })
    } else {
      this.setState({ errorMsgs: a })
    };
    if (this.state.newWidgetName !== "") {
      this.setState({ newWidgetName: "" });
      this.setState({ newWidgetType: "ColorWidget" });
    };

  };

  validate = () => {
    let alert = "";
    const badChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?"
    for (var i = 0; i < this.state.newWidgetName.length; i++) {
      if (badChars.indexOf(this.state.newWidgetName.charAt(i)) != -1) {
        alert = "File name has special characters ~`!#$%^&*+=-[]\\\';,/{}|\":<>? \nThese are not allowed\n";
      }
    };

    this.props.widgetlist.forEach((w) => {
      console.log(w["name"])
      let prevWidget = w["name"].toLowerCase();
      let newWidget = this.state.newWidgetName.toLowerCase();
      if (newWidget === prevWidget) {
        alert = "Please name your widgets uniquely"
      }
    })

    if (this.state.newWidgetName.length === 0) {
      alert = "Please have a name a length > 0";
    };

    return alert;
  };

  render() {
    return (
      <div className="settingsContainer">
        <h2>Settings</h2>
        <h3> Widgets </h3>
        {this.displayWidgets()}
        <div className="form">
          <input
            type="text"
            value={this.state.newWidgetName}
            onChange={this.handleNameChange}
            className="NewWidget-input"
            maxLength={this.MAX_LENGTH}
          />
          <label>
            <select className="dropDownSettings" value={this.state.newWidgetType} onChange={this.handleTypeChange}>
              <option className="dropDown-option" value="ColorWidget">Color</option>
              <option className="dropDown-option" value="SliderWidget">Slider</option>
              <option className="dropDown-option" value="BinaryWidget">Binary</option>
            </select>
          </label>
          <button type="submit" className="widgetButton" onClick={this.handleWidSubmit}>
            Add Widget
          </button>
        </div>
        <div className="errorContainer">
          {this.state.errorMsgs}
        </div>
      </div>
    );
  }
}

export default Settings;
