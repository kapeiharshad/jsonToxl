var mongoose = require("mongoose");
var bigData = require("../schema/bigData");
const fs = require("fs");
const json2xls = require("json2xls");
const Excel = require("exceljs");

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
  // getXl: async function (from, to) {
  //   console.log("from::::", from, to);
  //   try {
  //     if (from < 200000) {
  //       let cursor = (await bigData.collection.find().toArray()).slice(
  //         from,
  //         to
  //       );
  //       // let cursor = await bigData.collection.find().skip(from).limit(100000);
  //       console.log("cursor:::", cursor);
  //       let xls = json2xls(cursor);
  //       fs.appendFile("/home/wohlig/Downloads/data.xlsx", xls, "binary");
  //       console.log("append done::");
  //       return this.getXl(to, to + 20000);
  //     } else {
  //       return "Done";
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  createExcel: async function () {
    console.log("from createExcel:::");
    try {
      let from = 300000;
      console.log("from ::::createExcelcreateExcel");
      let cursor = await bigData.collection.find().limit(from);

      var workbook = new Excel.Workbook();

      workbook.creator = "Me";
      workbook.lastModifiedBy = "Her";
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();
      workbook.properties.date1904 = true;

      workbook.views = [
        {
          x: 0,
          y: 0,
          width: 10000,
          height: 20000,
          firstSheet: 0,
          activeTab: 1,
          visibility: "visible"
        }
      ];
      var worksheet = workbook.addWorksheet("My Sheet");

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
        worksheet.addRow({
          _id: doc._id,
          ts: doc.ts,
          val: doc.val
        });
      }
      await workbook.xlsx.writeFile("/home/wohlig/Downloads/Report.xlsx");

      console.log("after write:::::");

      return this.appendExcel(
        from,
        workbook,
        workbook.getWorksheet("My Sheet")
      );
    } catch (error) {
      throw error;
    }
  },
  appendExcel: async function (from, workbook, worksheet) {
    console.log("from::::", from);
    let limitRate = 100,
      counter = 0;
    let cursorData = await bigData.collection
      .find()
      .skip(from)
      .batchSize(limitRate);
    if (!cursorData.isClosed()) {
      console.log("from afte find:::");
      for (
        let doc = await cursorData.next();
        doc != null;
        doc = await cursorData.next()
      ) {
        counter++;
        console.log("counter::", counter);
        // console.log("doc:::", doc);
        var lastRow = worksheet.lastRow;
        var getRowInsert = worksheet.getRow(++lastRow.number);
        getRowInsert.getCell("A").value = doc._id;
        getRowInsert.getCell("B").value = doc.ts;
        getRowInsert.getCell("C").value = doc.val;
        getRowInsert.commit();
        // worksheet.addRow({
        //   _id: doc._id,
        //   ts: doc.ts,
        //   val: doc.val
        // });
      }
      workbook.xlsx.writeFile("/home/wohlig/Downloads/Report.xlsx");
      console.log("append done::");
      // return this.appendExcel((from = from + limitRate), workbook, worksheet);
      return;
    } else {
      return "all import to excel succesfully::";
    }
  }
};
