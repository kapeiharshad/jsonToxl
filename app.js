const express = require("express");
const app = express();
const env = require("./config/env")();
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const json2xls = require("json2xls");
const v8 = require("v8");
console.log(
  "total_available_size",
  (v8.getHeapStatistics().total_available_size / 1024 / 1024 / 1024).toFixed(
    2
  ) + "~GB"
);

mongoose.connect(
  env.mongoUrl + "jsontoxl",
  {
    useNewUrlParser: true
  },
  () => {
    console.log("Mongodb Connected");
  }
);
app.use(bodyParser.json());
app.use(json2xls.middleware);

const controllerfiles = fs.readdirSync("./controller/");
for (var i = 0; i <= controllerfiles.length - 1; i++) {
  var controller = require(`./controller/${controllerfiles[i]}`);
  var str1 = controllerfiles[i].split("Controller.js");
  app.use(`/${str1[0]}`, controller);
}
app.listen(env.port, () =>
  console.log(
    `Example app listening on port ${env.port}! \n Notice:- Name of controller file should be (xxxController.js)`
  )
);
