const express = require("express");
const route = express.Router();

module.exports = () => {
  route.get("/", (req, res, next) => {
    return res.send("home");
  });

  return route;
};
