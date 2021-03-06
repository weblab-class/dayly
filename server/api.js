/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const ObjectId = mongoose.Types.ObjectId;

// import models so we can interact with the database
const User = require("./models/user");
const Widget = require("./models/widget");
const Day = require("./models/day");
const Note = require("./models/note");
const Collection = require("./models/collection");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
// const socket = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  } else {
    User.findOne({
      _id: req.user._id,
    }).then((user) => {
      res.send(user);
    });
  }
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

/**
 * Given the start and end of a day,
 * if it already exists, return the notes and widgets associated with it in the form of a dict
 * otherwise, create them and return them
 *
 * { notes: String,
 *   widgets: [],
 * }
 */
router.post("/day", (req, res) => {
  let response = {
    notes: null,
    widgets: [],
  };
  const startOfDay = moment(req.body.day)
    .local()
    .startOf("day");
  const endOfDay = moment(req.body.day)
    .local()
    .endOf("day");

  Note.findOne({
    creator: req.user._id,
    timestamp: {
      $gte: startOfDay.format(),
      $lte: endOfDay.format(),
    },
  }).then((n) => {
    // if it doesn't exist, create it!
    if (n) response.notes = n;
    else {
      newNote = new Note({
        creator: req.user._id,
        timestamp: startOfDay,
      });
      newNote.save();
      response["notes"] = newNote;
    }

    // get widgetlist for user
    User.findOne({ _id: req.user._id }).then((u) => {
      const userWidgetList = u.widgetList.map((widget) => ({
        name: widget.name,
        widgetType: widget.widgetType,
      }));
      Widget.find({
        creator: req.user._id,
        timestamp: {
          $gte: startOfDay.format(),
          $lte: endOfDay.format(),
        },
        //allWidgetObjs are the current widget objs associated w the issue in the widget collection
      }).then((allWidgetObjs) => {
        if (allWidgetObjs.length === 0) {
          User.findById(req.user._id).then((user) => {
            user.widgetList.forEach((widget) => {
              newWidget = new Widget({
                creator: req.user._id,
                name: widget.name,
                type: widget.widgetType,
                timestamp: startOfDay.add(1, "minute"),
              });
              newWidget.save();
              response["widgets"].push(newWidget);
            });
            res.send(response);
          });
        } else {
          const widgetWidgetList = allWidgetObjs.map((widgetObj) => ({
            name: widgetObj.name,
            widgetType: widgetObj.type,
          }));
          const updatedWidgetObjs = userWidgetList.map((userWidget) => {
            const matchingWidgets = widgetWidgetList.filter(
              (widget) =>
                widget.name === userWidget.name && widget.widgetType === userWidget.widgetType
            );
            if (matchingWidgets.length !== 0) {
              // preservedWidgets were not added or deleted recently. should be array of one Widget object
              let preservedWidgets = allWidgetObjs.filter(
                (widgetObj) =>
                  widgetObj.name === userWidget.name && widgetObj.type === userWidget.widgetType
              );
              return preservedWidgets[0];
            } else {
              newWidget = new Widget({
                creator: req.user._id,
                name: userWidget.name,
                type: userWidget.widgetType,
                timestamp: startOfDay.add(1, "minute"),
              });
              newWidget.save();
              return newWidget;
            }
          });

          response["widgets"] = updatedWidgetObjs;
          res.send(response);
        }
      });
    });
  });
});

router.post("/user/widgets", auth.ensureLoggedIn, (req, res) => {
  User.findOne({
    _id: req.user._id,
  }).then((user) => {
    user.widgetList.push({ name: req.body.name, widgetType: req.body.widgetType });
    user.save().then((updated) => {
      res.send(updated.widgetList);
    });
  });
});

router.post("/user/widgets/delete", auth.ensureLoggedIn, (req, res) => {
  User.findOne({
    _id: req.user._id,
  })
    .then((user) => {
      user.widgetList.pull({ _id: req.body.widget });
      user.save().then((updated) => {
        res.send(updated);
      });
    })
    .then(() => {
      Widget.deleteMany({
        _id: req.body.widget,
        name: req.body.name,
      });
    });
});

// router.get("/user/theme", (req, res) => {
//   User.findOne({
//     _id: req.user._id,
//   }).then((user) => res.send(user));
// });

router.post("/user/theme", auth.ensureLoggedIn, (req, res) => {
  User.findOne({
    _id: req.user._id,
  }).then((user) => {
    user.theme = req.body.theme;
    user.save().then((updatedUser) => res.send(updatedUser));
  });
});

/**
 * Updates the value of the widget instance for specified day
 */
router.post("/widget", auth.ensureLoggedIn, (req, res) => {
  const startOfDay = moment(req.body.day)
    .local()
    .startOf("day")
    .format();
  const endOfDay = moment(req.body.day)
    .local()
    .endOf("day")
    .format();

  Widget.findOne({
    creator: req.user._id,
    name: req.body.name,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).then((widget) => {
    widget.value = req.body.value;
    widget.save().then((updated) => {
      res.send(updated.value);
    });
  });
});

/**
 * Retrieves all widgets for given month sorted by timestamp
 */
router.get("/month/widgets", auth.ensureLoggedIn, (req, res) => {
  const startOfMonth = moment(req.query.day)
    .local()
    .startOf("month")
    .format();
  const endOfMonth = moment(req.query.day)
    .local()
    .endOf("month")
    .format();

  Widget.find({
    creator: req.user._id,
    timestamp: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  })
    .sort({ timestamp: 1 })
    .then((widgets) => {
      res.send(widgets);
    });
});

/**
 * Retrieves all widgets for given year sorted by timestamp
 */
router.get("/year/widgets", auth.ensureLoggedIn, (req, res) => {
  const startOfYear = moment(req.query.day)
    .local()
    .startOf("year")
    .format();
  const endOfYear = moment(req.query.day)
    .local()
    .endOf("year")
    .format();

  Widget.find({
    creator: req.user._id,
    timestamp: {
      $gte: startOfYear,
      $lte: endOfYear,
    },
  })
    .sort({ timestamp: 1 })
    .then((widgets) => {
      res.send(widgets);
    });
});

/**
 * Updates the value of the note instance for specified day
 */
router.post("/notes", auth.ensureLoggedIn, (req, res) => {
  const startOfDay = moment(req.body.day)
    .local()
    .startOf("day")
    .format();
  const endOfDay = moment(req.body.day)
    .local()
    .endOf("day")
    .format();

  Note.findOne({
    creator: req.user._id,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).then((note) => {
    note.value = req.body.value;
    note.save().then((updated) => {
      res.send(updated.value);
    });
  });
});

router.get("/collections/all", (req, res) => {
  Collection.find({ creator: req.user._id })
    .sort({ timestamp: -1 })
    .then((collections) => res.send(collections));
});

router.post("/collections/new", auth.ensureLoggedIn, (req, res) => {
  if (!req.body.name) {
    res.send({ error: "Collection name cannot be blank." });
  } else {
    const collectionQuery = {
      creator: req.user._id,
      name: req.body.name,
    };

    Collection.findOne(collectionQuery).then((collection) => {
      if (collection) {
        res.send({ error: "You already have a collection with this name!" });
      } else {
        const newCollection = new Collection({
          creator: req.user._id,
          name: req.body.name,
          content: "",
        });
        newCollection.save().then((collection) => res.send(collection));
      }
    });
  }
});

router.post("/collections/rename", auth.ensureLoggedIn, (req, res) => {
  if (!req.body.newName) {
    res.send({ error: "Collection name cannot be blank." });
  } else {
    Collection.findOne({ creator: req.user._id, name: req.body.newName }).then((collection) => {
      if (collection) {
        res.send({ error: "You already have a collection with this name!" });
      } else {
        Collection.findOne({ creator: req.user._id, name: req.body.oldName }).then((collection) => {
          collection.name = req.body.newName;
          collection.save().then((updatedCollection) => res.send(updatedCollection));
        });
      }
    });
  }
});

router.post("/collections/delete", auth.ensureLoggedIn, (req, res) => {
  Collection.findOneAndDelete({
    creator: req.user._id,
    name: req.body.name,
  }).then((deletedCollection) => res.send(deletedCollection));
});

router.get("/collections", (req, res) => {
  const collectionQuery = {
    creator: req.user._id,
    name: req.query.name,
  };

  Collection.findOne(collectionQuery).then((collection) => res.send(collection));
});

router.post("/collections", auth.ensureLoggedIn, (req, res) => {
  const collectionQuery = {
    creator: req.user._id,
    name: req.body.name,
  };

  Collection.findOne(collectionQuery).then((collection) => {
    collection.content = req.body.content;
    collection.save().then((updatedCollection) => res.send(updatedCollection));
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
