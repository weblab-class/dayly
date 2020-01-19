import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Daily from "./pages/Daily.js";
import Monthly from "./pages/Monthly.js";
import Landing from "./pages/Landing.js";
import Navbar from "./modules/Navbar.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBold, faItalic, faUnderline } from "@fortawesome/free-solid-svg-icons";
library.add(faBold, faItalic, faUnderline);

const moment = require("moment");
moment().format("dddd, MMMM DD YYYY");
moment().local();

class Loading extends Component {
  render() {
    return <div>Loading...</div>;
  }
}

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      creator: undefined,
      year: moment().year(),
      month: moment().month(),
      day: moment().date(),
      widgetlist: null,
      data: null,
      notes: null,
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami");
    console.log("Logged in already as " + user.name);
    // they are registered in the database, and currently logged in.
    if (user._id) {
      this.setState({
        creator: user._id,
        widgetlist: user.widgetList,
      });

      const query = {
        day: this.state.day,
        month: this.state.month,
        year: this.state.year,
      };

      const dayData = await get("/api/day", query);
      this.setState({
        data: dayData,
      });
    }
  }

  handleLogin = (res) => {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        console.log("Logging in as " + user.name);
        this.setState({
          creator: user._id,
          widgetlist: user.widgetList,
        });
        return post("/api/initsocket", { socketid: socket.id });
      })
      .then(() => {
        navigate("/day");
      })
      .then(async () => {
        // After logging in,
        // Create a new Day collection if it does not exist
        const params = {
          day: this.state.day,
          month: this.state.month,
          year: this.state.year,
        };

        const day = await post("/api/day", params);

        // If created, set data to the resulting instance
        if (day) {
          this.setState({
            data: day,
          });
        } else {
          // Otherwise, retrieve the existing data
          const query = {
            day: this.state.day,
            month: this.state.month,
            year: this.state.year,
          };

          const dayData = await get("/api/day", query);
          this.setState({
            data: dayData,
          });
        }
      });
  };

  handleLogout = () => {
    this.setState({ creator: undefined });
    post("/api/logout").then(() => {
      navigate("/");
    });
  };

  handleBackClick(varToChange) {
    const curDate = moment([this.state.year, this.state.month, this.state.day]);

    let newDate;

    if (varToChange === "day") {
      newDate = curDate.subtract(1, "day");
      this.setState({
        day: newDate.date(),
        month: newDate.month(),
        year: newDate.year(),
      });
    } else {
      newDate = curDate.subtract(1, "month");
      this.setState({
        month: newDate.month(),
        year: newDate.year(),
      });
    }
  }

  handleNextClick(varToChange) {
    const curDate = moment([this.state.year, this.state.month, this.state.day]);

    let newDate;

    if (varToChange === "day") {
      newDate = curDate.add(1, "day");
      this.setState({
        day: newDate.date(),
        month: newDate.month(),
        year: newDate.year(),
      });
    } else {
      newDate = curDate.add(1, "month");
      this.setState({
        month: newDate.month(),
        year: newDate.year(),
      });
    }
  }

  render() {
    return (
      <>
        <Navbar
          creator={this.state.creator}
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
        />
        <Router>
          <Landing path="/" creator={this.state.creator} />
          {this.state.data ? (
            <Daily
              path="/day"
              creator={this.state.creator}
              year={this.state.year}
              month={this.state.month}
              day={this.state.day}
              data={this.state.data}
              handleBackClick={() => this.handleBackClick("day")}
              handleNextClick={() => this.handleNextClick("day")}
            />
          ) : (
            <Loading path="/day" />
          )}
          <Monthly
            path="/month"
            creator={this.state.creator}
            day={this.state.day}
            year={this.state.year}
            month={this.state.month}
            widgetlist={this.state.widgetlist}
            handleBackClick={() => this.handleBackClick("month")}
            handleNextClick={() => this.handleNextClick("month")}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
