import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Daily from "./pages/Daily.js";
import Monthly from "./pages/Monthly.js";
import Yearly from "./pages/Yearly.js";
import Collections from "./pages/Collections.js";
import Landing from "./pages/Landing.js";
import Loading from "./pages/Loading.js";
import Settings from "./pages/Settings.js";
import Navbar from "./modules/Navbar.js";
import Tab from "./modules/Tab.js";

import "./App.css";
import "../utilities.css";

// import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faAngleLeft,
  faAngleRight,
  faCheck,
  faTimes,
  faCaretDown,
  faCircle as fasFaCircle,
  faMinus,
  faStrikethrough,
  faHighlighter,
  faFont,
  faSadCry,
  faLaughBeam,
  faGrinHearts,
  faFrown,
  faMeh,
  faCog,
  faTrashAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as farFaCircle } from "@fortawesome/free-regular-svg-icons";
library.add(
  faBold,
  faItalic,
  faUnderline,
  faListUl,
  faListOl,
  faAngleLeft,
  faAngleRight,
  faCheck,
  faTimes,
  faCaretDown,
  fasFaCircle,
  farFaCircle,
  faMinus,
  faStrikethrough,
  faHighlighter,
  faFont,
  faSadCry,
  faLaughBeam,
  faGrinHearts,
  faFrown,
  faMeh,
  faCog,
  faTrashAlt,
  faPlus
);

const moment = require("moment");

const defaultTheme = {
  "--body": "#6e6e6e",
  "--accent-text": "#ffffff",
  "--calendar-text-month": "#c0c0c0",
  "--calendar-text-year": "#696969",
  "--background": "#f5f5f5",
  "--borders": "#cec0b7",
  "--accent": "#cf9893",
  "--headers": "#3d3d3d",
  "--hover": "#f7ebeb",
  "--tab0": "#ff6c6c",
  "--tab1": "#6cb9ff",
  "--tab2": "#ffbc6c",
  "--tab3": "#ad6cff",
  "--label1": "#cf9893",
  "--label2": "#b3d9ff",
  "--label3": "#d9b3ff",
  "--slider-1": "rgba(152, 180, 241, 0.08)",
  "--slider-2": "rgba(152, 180, 241, 0.17)",
  "--slider-3": "rgba(152, 180, 241, 0.25)",
  "--slider-4": "rgba(152, 180, 241, 0.34)",
  "--slider-5": "rgba(152, 180, 241, 0.42)",
  "--slider-6": "rgba(152, 180, 241, 0.5)",
  "--slider-7": "rgba(152, 180, 241, 0.58)",
  "--slider-8": "rgba(152, 180, 241, 0.67)",
  "--slider-9": "rgba(152, 180, 241, 0.75)",
  "--slider-10": "rgba(152, 180, 241, 0.83)",
  "--slider-11": "rgba(152, 180, 241, 0.92)",
  "--slider-12": "rgba(152, 180, 241, 1)",
};

const lilacTheme = {
  "--body": "#6e6e6e",
  "--accent-text": "#ffffff",
  "--calendar-text-month": "#c0c0c0",
  "--calendar-text-year": "#696969",
  "--background": "#eed3fb",
  "--borders": "#CFB4D3",
  "--accent": "#B67BBE",
  "--accent-text": "#ffffff",
  "--headers": "#9D5BA6",
  "--hover": "#E0CAE3",
  "--tab1": "#7a4ca8",
  "--tab2": "#796cff",
  "--tab3": "#6c88ff",
  "--tab0": "#6cbeff",
  "--label1": "#6cbeff",
  "--label2": "#6c88ff",
  "--label3": "#796bff",
  "--slider-1": "rgba(188, 158, 251, 0.08)",
  "--slider-2": "rgba(188, 158, 251, 0.17)",
  "--slider-3": "rgba(188, 158, 251, 0.25)",
  "--slider-4": "rgba(188, 158, 251, 0.34)",
  "--slider-5": "rgba(188, 158, 251, 0.42)",
  "--slider-6": "rgba(188, 158, 251, 0.5)",
  "--slider-7": "rgba(188, 158, 251, 0.58)",
  "--slider-8": "rgba(188, 158, 251, 0.67)",
  "--slider-9": "rgba(188, 158, 251, 0.75)",
  "--slider-10": "rgba(188, 158, 251, 0.83)",
  "--slider-11": "rgba(188, 158, 251, 0.92)",
  "--slider-12": "rgba(188, 158, 251, 1)",
};

const naturalTheme = {
  "--body": "#6e6e6e",
  "--accent-text": "#ffffff",
  "--calendar-text-month": "#c0c0c0",
  "--calendar-text-year": "#696969",
  "--background": "#f4eee1",
  "--borders": "#e4d1c2",
  "--accent": "#efba89",
  "--headers": "#999999",
  "--hover": "#f1e3d6",
  "--tab1": "#d3c4be",
  "--tab2": "#d39b84",
  "--tab3": "#8090a8",
  "--tab0": "#695b5c",
  "--label1": "#A37974",
  "--label2": "#D1AFAB",
  "--label3": "#91A2AC",
  "--slider-1": "rgba(39, 95, 151, 0.08)",
  "--slider-2": "rgba(39, 95, 151, 0.17)",
  "--slider-3": "rgba(39, 95, 151, 0.25)",
  "--slider-4": "rgba(39, 95, 151, 0.34)",
  "--slider-5": "rgba(39, 95, 151, 0.42)",
  "--slider-6": "rgba(39, 95, 151, 0.5)",
  "--slider-7": "rgba(39, 95, 151, 0.58)",
  "--slider-8": "rgba(39, 95, 151, 0.67)",
  "--slider-9": "rgba(39, 95, 151, 0.75)",
  "--slider-10": "rgba(39, 95, 151, 0.83)",
  "--slider-11": "rgba(39, 95, 151,, 0.92)",
  "--slider-12": "rgba(39, 95, 151, 1)",
}

const ivyTheme = {
  "--body": "#6e6e6e",
  "--accent-text": "#ffffff",
  "--calendar-text-month": "#c0c0c0",
  "--calendar-text-year": "#696969",
  "--background": "#DEEDE9",
  "--borders": "#B6D8CE",
  "--accent": "#3AB795",
  "--accent-text": "#ffffff",
  "--headers": "#3E8E66",
  "--hover": "#ADEACC",
  "--slider-1": "rgba(158, 251, 215, 0.08)",
  "--slider-2": "rgba(158, 251, 215, 0.17)",
  "--slider-3": "rgba(158, 251, 215, 0.25)",
  "--slider-4": "rgba(158, 251, 215, 0.34)",
  "--slider-5": "rgba(158, 251, 215, 0.42)",
  "--slider-6": "rgba(158, 251, 215, 0.5)",
  "--slider-7": "rgba(158, 251, 215, 0.58)",
  "--slider-8": "rgba(158, 251, 215, 0.67)",
  "--slider-9": "rgba(158, 251, 215, 0.75)",
  "--slider-10": "rgba(158, 251, 215, 0.83)",
  "--slider-11": "rgba(158, 251, 215, 0.92)",
  "--slider-12": "rgba(158, 251, 215, 1)",
};

const themeMap = {
  default: defaultTheme,
  ivy: ivyTheme,
  lilac: lilacTheme,
  natural: naturalTheme,
};

// const themeMap = {
//   default: {
//     name: "default",
//     theme: defaultTheme,
//     displayColors: ["#ff6c6c", "#6cb9ff", "#ffbc6c", "#ff6c6c", "#6cb9ff"],
//   },
//   ivy: {
//     name: "ivy",
//     theme: ivyTheme,
//     displayColors: ["#3AB795", "#ADEACC", "#3E8E66", "#3AB795", "#ADEACC"],
//   },
// };

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      creator: undefined,
      creatorName: undefined,
      dateObject: moment().local(),
      data: null,
      widgetlist: null,
      currentView: "",
      activeTheme: null,
    };
  }

  async componentDidMount() {
    const user = await get("/api/whoami");
    // they are registered in the database, and currently logged in.
    if (user._id) {
      this.setState({
        creator: user._id,
        creatorName: user.name,
        activeTheme: user.theme,
      });

      const userWidgets = user.widgetList;
      this.setState({
        widgetlist: userWidgets,
      });

      this.getDateData(this.state.dateObject);

      this.setState({
        currentView: window.location.pathname.slice(1),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentView !== window.location.pathname.slice(1)) {
      this.setState({
        currentView: window.location.pathname.slice(1),
      });
    }
  }

  handleLogin = (res) => {
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken })
      .then((user) => {
        this.setState({
          creator: user._id,
          widgetlist: user.widgetList,
          creatorName: user.name,
          activeTheme: user.theme,
        });
        // return post("/api/initsocket", { socketid: socket.id });
      })
      .then(() => {
        navigate("/day");
      })
      .then(() => {
        this.getDateData(this.state.dateObject);
      });

    this.setState({
      currentView: window.location.pathname.slice(1),
    });
  };

  handleLogout = () => {
    this.setState({
      creator: undefined,
    });
    post("/api/logout").then(() => {
      navigate("/");
      this.setTheme("default");
    });
  };

  handleBackClick = async (varToChange) => {
    // update date state
    if (varToChange === "day") {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "day"),
      });
      this.getDateData(this.state.dateObject);
    } else if (varToChange === "month") {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "month"),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.subtract(1, "year"),
      });
    }
  };

  handleNextClick = async (varToChange) => {
    // if changing daily view update date state
    if (varToChange === "day") {
      this.setState({
        dateObject: this.state.dateObject.add(1, "day"),
      });
      this.getDateData(this.state.dateObject);
    } else if (varToChange === "month") {
      this.setState({
        dateObject: this.state.dateObject.add(1, "month"),
      });
    } else {
      this.setState({
        dateObject: this.state.dateObject.add(1, "year"),
      });
    }
  };

  handleWidgetSubmit = (name, type) => {
    const params = { name: name, widgetType: type };
    post("/api/user/widgets", params).then((newWidgets) => {
      this.setState({
        widgetlist: newWidgets,
      });
    });
  };

  handleWidgetDelete = (id, name) => {
    post("/api/user/widgets/delete", { widget: id, name: name }).then((userNew) => {
      this.setState({ widgetlist: userNew.widgetList });
    });
  };

  setTheme = (themeName) => {
    const theme = themeMap[themeName];
    Object.keys(theme).map((color) => {
      const value = theme[color];
      document.documentElement.style.setProperty(color, value);
    });
  };

  handleThemeChange = (themeName) => {
    post("/api/user/theme", { theme: themeName }).then((updatedUser) => {
      this.setState({ activeTheme: updatedUser.theme });
    });
  };

  /**
   *  Methods for overriding current day
   *  */
  getDateData = async (date) => {
    // update data state
    const params = {
      day: date.format(),
    };
    const newData = await post("/api/day", params);
    this.setState({
      data: newData,
    });
  };

  setToOldDate = (date) => {
    this.setState({
      dateObject: date,
    });
    this.getDateData(date);
  };

  viewToday = () => {
    this.setState({
      dateObject: moment().local(),
    });
  };

  resetCurrentView = () => {
    if (this.state.currentView.length != "") {
      this.setState({
        currentView: "",
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentView !== window.location.pathname.slice(1)) {
      this.setState({
        currentView: window.location.pathname.slice(1),
      });
    }
  }

  render() {
    if (this.state.creator) {
      if (this.state.activeTheme) {
        this.setTheme(this.state.activeTheme);
      }
      return (
        <>
          <Navbar
            creator={this.state.creator}
            creatorName={this.state.creatorName}
            currentView={this.state.currentView}
            handleViewChange={this.resetCurrentView}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
          // handleViewChange={this.viewToday}
          />

          <div className="bullet-journal">
            <div className="bullet-journal_body">
              <Router>
                {this.state.data ? (
                  <Daily
                    path="/day"
                    dateObject={this.state.dateObject}
                    data={this.state.data}
                    handleBackClick={() => this.handleBackClick("day")}
                    handleNextClick={() => this.handleNextClick("day")}
                  />
                ) : (
                    <Loading path="/day" />
                  )}
                {/* View for when you look back on Monthly view */}
                <Daily
                  path="/day/:oldYear/:oldMonth/:oldDay"
                  dateObject={this.state.dateObject}
                  data={this.state.data}
                  setToOldDate={this.setToOldDate}
                  handleBackClick={() => this.handleBackClick("day")}
                  handleNextClick={() => this.handleNextClick("day")}
                />
                <Monthly
                  path="/month"
                  dateObject={this.state.dateObject}
                  widgetlist={this.state.widgetlist}
                  handleBackClick={() => this.handleBackClick("month")}
                  handleNextClick={() => this.handleNextClick("month")}
                />
                <Yearly
                  path="/year"
                  dateObject={this.state.dateObject}
                  widgetlist={this.state.widgetlist}
                  handleBackClick={() => this.handleBackClick("year")}
                  handleNextClick={() => this.handleNextClick("year")}
                />
                <Collections path="/collections" />
                <Settings
                  path="/settings"
                  creator={this.state.creator}
                  widgetlist={this.state.widgetlist}
                  handleWidgetSubmit={this.handleWidgetSubmit}
                  handleWidgetDelete={this.handleWidgetDelete}
                  themeMap={themeMap}
                  activeTheme={this.state.activeTheme}
                  handleThemeChange={this.handleThemeChange}
                />
                <Daily
                  path="/"
                  dateObject={this.state.dateObject}
                  data={this.state.data}
                  setToOldDate={this.setToOldDate}
                  handleBackClick={() => this.handleBackClick("day")}
                  handleNextClick={() => this.handleNextClick("day")}
                />
                <Loading default />
              </Router>
            </div>
            <Tab
              creator={this.state.creator}
              currentView={this.state.currentView}
              handleViewChange={this.viewToday}
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <Navbar
            //creator={this.state.creator}
            currentView={this.state.currentView}
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            handleViewChange={this.viewToday}
          />
          <Router>
            <Landing path="/" />
            <Loading default />
            <NotFound path="/404" />
          </Router>
        </>
      );
    }
  }
}

export default App;
