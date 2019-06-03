// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");
var moment = require("moment");

// Routes
// =============================================================
module.exports = function(app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // cms route loads cms.html
  app.get("/cms", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/cms.html"));
  });

  // blog route loads blog.html
  app.get("/blog", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/blog.html"));
  });

  // authors route loads author-manager.html
  app.get("/authors", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/author-manager.html"));
  });

  app.get("/theory", function(req, res) {
    db.Post.findAll({}).then(function(data) {

      console.log(data);      

      var temp = { 
        posts: data,
        votes: data
       };

      res.render("theory", temp);
    });
  });

  app.get("/comment/:id", function(req, res) {
    var postId = req.params.id;

    db.Comment.findAll({
      where: {
        postId: postId
      },
      include: [db.Author, db.Post]
    }).then(function(dbComment) {
      // console.log(dbComment);
      // res.json(dbComment);
      db.Post.findOne({
        where: {
          id: postId
        }
      }).then(function(data) {
        res.render("comment", { Comment: dbComment, Post: data });
      });
    });
  });

  // character route loads characters.html
  app.get("/characters", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/characters.html"));
  });
};
