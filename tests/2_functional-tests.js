/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

let like = 0;
let rel_like = 0;

suite("Functional Tests", function () {
  suite("GET /api/stock-prices => stockData object", function () {
    test("1 stock", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body.stockData, "stock");
          assert.isString(res.body.stockData.stock);
          assert.equal(res.body.stockData.stock, "GOOG");

          assert.property(res.body.stockData, "price");
          assert.isString(res.body.stockData.price);

          assert.property(res.body.stockData, "likes");
          done();
        });
    });

    test("1 stock with like", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG", like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isAbove(res.body.stockData.likes, 0);
          like = res.body.stockData.likes;
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "GOOG", like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.equal(res.body.stockData.likes, like);

          done();
        });
    });

    test("2 stocks", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["MSFT", "GOOG"] })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData);
          assert.property(res.body.stockData[0], "stock");
          assert.isString(res.body.stockData[0].stock);
          assert.equal(res.body.stockData[0].stock, "MSFT");

          assert.property(res.body.stockData[1], "stock");
          assert.isString(res.body.stockData[1].stock);
          assert.equal(res.body.stockData[1].stock, "GOOG");

          assert.property(res.body.stockData[0], "price");
          assert.isString(res.body.stockData[0].price);

          assert.property(res.body.stockData[1], "price");
          assert.isString(res.body.stockData[1].price);

          assert.property(res.body.stockData[0], "rel_likes");
          assert.property(res.body.stockData[1], "rel_likes");
          assert.equal(
            res.body.stockData[0].rel_likes + res.body.stockData[1].rel_likes,
            0
          );
          rel_like = res.body.stockData[0].rel_likes;
          done();
        });
    }).timeout(10000);

    test("2 stocks with like", function (done) {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["MSFT", "GOOG"], like: true })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.equal(res.body.stockData[0].rel_likes, rel_like);
          done();
        });
    }).timeout(10000);
  });
});
