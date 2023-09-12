const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ItemSchema = new Schema({
  name: {type: String, required: true},
  description: String,
  category: {type: Schema.Types.ObjectId, ref: "Category"},
  author: String,
  price: String
})

ItemSchema.virtual("url").get(function() {
  return `/item/${this._id}`
});

module.exports = mongoose.model("Item", ItemSchema)