"use strict";

let expect = require("chai").expect;
let mongo = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
let MongoClient = require("mongodb").MongoClient;

module.exports = function (app, db) {
  app.route("/api/stock-prices").get(function (req, res) {});

  // app.route("/api/books").get(function (req, res) {

  //   db.collection("Library")
  //     .find()
  //     .toArray(function (err, books) {
  //       if (err) {
  //         res.redirect("/");
  //       } else {
  //         books.map((item) => {
  //           item.commentcount = item.comments.length;
  //           delete item.comments;
  //         });
  //         res.json(books);
  //       }
  //     });
  // });
};
