var mongoose = require("mongoose");
var bigData = require("../schema/bigData");
const fs = require("fs");
const path = require("path");
const Grid = require("gridfs-stream");
const conn = mongoose.connection;
module.exports = {
  uploadFile: async function (from, to) {
    console.log("from to::", from, to);
    try {
      let arrayData = [];
      arrayData = JSON.parse(
        fs.readFileSync(
          "/home/wohlig/Downloads/completeTask/THERM0001.json",
          "utf8"
        )
      ).slice(from, to);
      this.saveBluk(arrayData)
        .then(() => {
          if (to < 5000000) {
            return this.uploadFile(to, to + 200000);
          } else {
            console.log("Done:::::::::::::::");
            return "Done";
          }
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      throw error;
    }
  },
  saveBluk: async function (arrayData) {
    console.log("from save::");
    try {
      let data = bigData.insertMany(arrayData);
      return data;
    } catch (e) {
      throw e;
    }
  }
};
