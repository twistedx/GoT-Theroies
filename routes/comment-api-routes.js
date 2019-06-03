// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {
  // GET route for getting all of the posts
  app.get("/api/comment", function(req, res) {
    var query = {};
    if (req.query.PostId) {
      query.PostId = req.query.PostId;
    }
    // // Here we add an "include" property to our options in our findAll query
    // // We set the value to an array of the models we want to include in a left outer join
    // // In this case, just db.Author
    db.Comment.findAll({
      where: query,
      include: [db.Post, db.Author]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/comment/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Author
    db.Comment.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Author, db.Post]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  app.post("/api/comment", function(req, res) {
    db.Comment.create(req.body).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/comment/:id", function(req, res) {
    db.Comment.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/comment", function(req, res) {
    console.log(req.body);
    db.Comment.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
};
