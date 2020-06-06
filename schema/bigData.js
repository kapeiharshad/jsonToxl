var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bigDataSchema = new Schema({
  ts: {type: Number, index: true},
  val: {type: Number, index: true}
});
module.exports = mongoose.model("bigData", bigDataSchema);
