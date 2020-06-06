const bigDataModel = require("../model/bigDataModel");
var express = require("express");
var router = express.Router();

//*********************By using async-await***************************
router.post("/uploadFile", async (req, res) => {
  try {
    let bigData = await bigDataModel.uploadFile(0, 200000);
    res.status(200).send(bigData);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
