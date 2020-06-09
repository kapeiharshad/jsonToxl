const bigDataModel = require("../model/bigDataModel");
var express = require("express");
var router = express.Router();
var fs = require("fs");
const Excel = require("exceljs");
const tempfile = require("tempfile");

//*********************By using async-await***************************
router.post("/uploadFile", async (req, res) => {
  try {
    let bigData = await bigDataModel.uploadFile(0, 200000);
    res.status(200).send(bigData);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/getXl", async (req, res) => {
  try {
    let xlData = await bigDataModel.getXl(0, 20000);
    res.download("/home/wohlig/Downloads/data.xlsx", "data.xlsx");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/createExcel", async function (req, res, next) {
  try {
    let xlData = await bigDataModel.createExcel();
    res.end();
    // fs.appendFile("/home/wohlig/Downloads/data.xlsx", xlData, "binary");
    // res.download("/home/wohlig/Downloads/data.xlsx", "data.xlsx");
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/appendExcel", async function (req, res, next) {
  try {
    let xlData = await bigDataModel.appendExcel();
    res.end();
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
