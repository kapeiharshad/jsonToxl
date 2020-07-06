var mongoose = require("mongoose");
var bigData = require("../schema/bigData");
const fs = require("fs");
const Excel = require("exceljs");

// let name = " Report" + count;

const options = {
  filename: "/home/wohlig/Downloads/Report.xlsx",
  useStyles: true,
  useSharedStrings: true
};

let workbook = new Excel.stream.xlsx.WorkbookWriter(options);

// const path = require("path");
// const Grid = require("gridfs-stream");
// const conn = mongoose.connection;
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
  },

  createExcel: async function (from, to, loopNum, limit, startTime) {
    console.log("from createExcel :::");
    console.log("loopNum::::::::", loopNum);
    console.log("from, to ,limit,", from, to, limit);

    try {
      if (to <= limit) {
        let sheet = "My Sheet " + loopNum;
        let cursor = await bigData.collection.find().skip(from).limit(500000);

        var worksheet = workbook.addWorksheet(sheet);
        worksheet.state = "visible";
        console.log("after worksheet");

        worksheet.columns = [
          {header: "_id", key: "_id", width: 32},
          {header: "ts", key: "ts", width: 32},
          {header: "val", key: "val", width: 32}
        ];

        for (
          let doc = await cursor.next();
          doc != null;
          doc = await cursor.next()
        ) {
          worksheet
            .addRow({
              _id: doc._id,
              ts: doc.ts,
              val: doc.val
            })
            .commit();
        }
        worksheet.commit();
        console.log("after write:::::");
        loopNum = loopNum + 1;
        return this.createExcel(to, to + 500000, loopNum, limit, startTime);
      } else {
        console.log("from else::::::::::::::::::::::::::::");
        await workbook.commit();
        console.log("Successfully excel completed:::::::::::::::::::::");
        console.log("Completion time::", new Date() - startTime);
        return "Sucessfully added";
      }
    } catch (error) {
      throw error;
    }
  }
};
