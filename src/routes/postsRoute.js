const express = require("express");
const instaclone = require("../models/postSchema");
const router = express.Router();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
router.use(express.json());
router.use(bodyParser.json());

// config cloudinary
cloudinary.config({ 
  cloud_name: 'dts1lml8f', 
  api_key: '739148648384844', 
  api_secret: 'N5nXKPI03GNuLOBpSe69ssn_rUY' 
});

router.get("/posts", async (req, res) => {
  
  const posts = await instaclone.find();
  
  try {
    res
      .status(200)
      .json({ status: "Data Fetched Successfully", Result: posts });
  } catch (e) {
    res.status(400).json({ status: "Data Fetched failed", message: e.message });
  }
});
router.post("/posts", async (req, res, next) => {
      console.log(req.body);
  const file = req.files.PostImage.tempFilePath;
      console.log(file)
  
  await cloudinary.uploader.upload(file, async (err, result) => {
       console.log(err);
       console.log(result);
    const posts = await instaclone.create({
      PostImage: result.original_filename + result.format,
      imageUrl: result.secure_url,
      likes: Math.floor(Math.random() * 10000),
      date:new Date().toLocaleDateString(),
      ...req.body,
    });
    posts
      .save()
      .then(() => {
        console.log("Post Has been Saved");
      })
      .catch((e) => {
        console.log(e.message);
      });
  
    try {
      res.status(200).json({ status: "Posted Successfully", Result: posts });
    } catch (e) {
      res.status(400).json({ status: "Failed", message: e.message });
    }
  });
});
router.put("/posts/:id", async (req, res) => {
  const posts = await instaclone.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!posts) {
    return res
      .status(403)
      .json({ status: "Failed", Result: "No Post available" });
  }
  try {
    res
      .status(200)
      .json({ status: "Data Updated Successfully", Result: posts });
  } catch (e) {
    res.status(400).json({ status: "Upadtion failed", message: e.message });
  }
});
router.delete("/posts/:id", async (req, res) => {
  const posts = await instaclone.deleteOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  if (!posts) {
    return res.status(403).json({
      status: "Failed",
      Result: "Can not delete because No Post available",
    });
  }
  try {
    res.status(200).json({ status: "Deleted Successfully", Result: posts });
  } catch (e) {
    res.status(400).json({ status: "Deleted failed", message: e.message });
  }
});

module.exports = router;
