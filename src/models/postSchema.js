const mongoose = require("mongoose");
const Schema = mongoose.Schema();
const ObjectId = Schema.ObjectId;
const postSchema = new mongoose.Schema({
  name: { type: String },
  location: { type: String },
  description: { type: String },
  PostImage: { data: Buffer, contentType: String },
  imageUrl: { type: String },
  date: Date,
  likes: String,
});
const InstaPost = mongoose.model("InstaPost", postSchema);
module.exports = InstaPost;