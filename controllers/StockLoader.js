"use strict";

let mongo = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
let MongoClient = require("mongodb").MongoClient;
let fetch = require("node-fetch");

function StockLoader() {
  this.loadStock = async function (symbol_name) {
    let response = await fetch(
      "https://repeated-alpaca.glitch.me/v1/stock/" + symbol_name + "/quote"
    );

    let { symbol, latestPrice } = await response.json();
    let data = {
      stock: symbol || null,
      price: latestPrice ? String(latestPrice) : null,
    };

    return data;
  };

  // from fcc
  this.loadLikes = function (db, stock, like, ip, callback) {
    if (!like) {
      db.collection("Stock")
        .find({ stock: stock })
        .toArray(function (err, doc) {
          var likes = 0;
          if (err) {
            callback({ stock: null, likes: null });
          } else {
            if (doc.length > 0) {
              likes = doc[0].likes.length;
            }
            callback({ stock: stock, likes: likes });
          }
        });
    } else {
      db.collection("Stock").findAndModify(
        { stock: stock },
        [],
        { $addToSet: { likes: ip } },
        { new: true, upsert: true },
        function (err, doc) {
          if (err) {
            callback({ stock: null, likes: null });
          } else {
            callback({
              stock: stock,
              likes: doc.value.likes.length,
            });
          }
        }
      );
    }
  };
}

module.exports = StockLoader;
