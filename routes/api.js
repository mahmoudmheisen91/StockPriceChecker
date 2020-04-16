"use strict";

let mongo = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
let MongoClient = require("mongodb").MongoClient;
let StockLoader = require("../controllers/StockLoader.js");

let stockPrices = new StockLoader();

module.exports = function (app, db) {
  app.route("/api/stock-prices").get(async function (req, res) {
    let stock = req.query.stock;
    let like = req.query.like;
    let ip = req.connection.remoteAddress;

    let stockData = null;
    let likeData = null;

    if (!Array.isArray(stock)) {
      stockData = await stockPrices.loadStock(stock.toUpperCase());
      stockPrices.loadLikes(db, stock, like, ip, loadLikes_cb);
    } else {
      stockData = [];
      likeData = [];

      stockData.push(await stockPrices.loadStock(stock[0].toUpperCase()));
      stockData.push(await stockPrices.loadStock(stock[1].toUpperCase()));

      stockPrices.loadLikes(db, stock[0], like, ip, loadLikes_cb);
      stockPrices.loadLikes(db, stock[1], like, ip, loadLikes_cb);
    }

    // from fcc
    function loadLikes_cb(data) {
      Array.isArray(stock) ? likeData.push(data) : (likeData = data);

      if (!Array.isArray(stock)) {
        stockData.likes = likeData.likes;
        res.json({ stockData });
      } else if (
        Array.isArray(stock) &&
        stockData.length == 2 &&
        likeData.length == 2
      ) {
        if (stockData[0].stock == likeData[0].stock) {
          stockData[0].rel_likes = likeData[0].likes - likeData[1].likes;
          stockData[1].rel_likes = likeData[1].likes - likeData[0].likes;
        } else {
          stockData[0].rel_likes = likeData[1].likes - likeData[0].likes;
          stockData[1].rel_likes = likeData[0].likes - likeData[1].likes;
        }
        res.json({ stockData });
      }
    }
  });
};
