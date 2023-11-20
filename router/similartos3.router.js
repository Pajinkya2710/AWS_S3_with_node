const fs = require("fs");
const router = require("express").Router();
const Auth = require("../middleware/auth.middleware");
const {upload}= require('../middleware/multer.middleware')
const path= require('path')
const UploadModel= require('../model/upload.model')

//these route is use for creating the buckets
router.post("/createBucket", Auth.userAuthMiddleware, async (req, res) => {
  const folderName = req.body.folderName;
  if (!folderName) {
    return res.status(400).send({ message: "Folder name is Mandatory" });
  }
  const rootFolder = "rootFolder";
  const folderPath = `${rootFolder}/${folderName}`;
  try {
    if (fs.existsSync(rootFolder)) {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        return res.status(200).send({ message: "Bucket Created" });
      }
    } else {
      fs.mkdirSync(rootFolder);
      return res.json({ status: 200, message: "Bucket Created" });
    }
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      return res.status(200).send({ message: "Bucket Created" });
    }
    return res.status(200).send({ message: "Bucket is Already Created" });
  } catch (error) {
    console.log(error);
  }
});
//These route is use for Get the bucket list
router.get('/getallBuckets', Auth.userAuthMiddleware, async(req,res)=>{
    const rootPath= path.join('rootFolder');

    fs.readdir(rootPath,(err, files)=>{
        const directories= files.filter(file=>{

            const filePath= path.join(rootPath, file);
            return fs. statSync(filePath).isDirectory()
        })
        if(directories){
            return res.json({status:200, success: directories})
        }
    })
});
//These route is use for Put the Object in the bucket
router.post('/uploadFile', Auth.userAuthMiddleware, upload().single('myFile') ,async (req, res)=>{
    if(req.file){
        console.log('req file:', req.file)
        const fileFullPath= req.file.destination + req.file.filename;
        const uploadedData= new UploadModel({userId: req.user._id, filename: req.file.filename, mineType:req.file.mimeType, path: fileFullPath})
        await uploadedData.save()
        return res.json({status:200, success: "file successfully uploaded"})
    }
})
//These route is use for Get the Object in the bucket
router.get('/getFile', Auth.userAuthMiddleware, async(req, res)=>{
    const bucketName= req.body.bucketName;
    if(!bucketName){
        return res.json({status:false,message:"Please provide a valid Bucket Name"})
    }

    try {
        const directoryPath= path.join(`rootFolder/${bucketName}`)
        fs.readdir(directoryPath, (err, files)=>{
            const allFiles = files.filter(file => {
                const filePath = path.join(directoryPath, file);
                return fs.statSync(filePath).isFile();
            }
            );
            if(allFiles.length==0){
            return res.json({status:true, message:"No files found"})
            }
            return res.json({status:true, allFiles: allFiles})
        })

    } catch (error) {
        console.log(error)
    }
})
// These route is use for Get the files list in a specific bucket
router.get('/getFilesInBucket', Auth.userAuthMiddleware, async (req, res) => {
  const bucketName = req.query.bucketName; // Using query parameter to get the bucketName
  if (!bucketName) {
    return res.json({ status: false, message: "Please provide a valid Bucket Name" });
  }

  try {
    const directoryPath = path.join(`rootFolder/${bucketName}`);
    fs.readdir(directoryPath, (err, files) => {
      const allFiles = files.filter(file => {
        const filePath = path.join(directoryPath, file);
        return fs.statSync(filePath).isFile();
      });

      if (allFiles.length === 0) {
        return res.json({ status: true, message: "No files found in the bucket" });
      }

      return res.json({ status: true, files: allFiles });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

//These route is use for delete the Object in the bucket
router.delete('/deleteFile', Auth.userAuthMiddleware, (req,res)=>{
  const {folderName, filename}= req.body;
  if(!folderName){
    return res.json({message:"FolderName is Mandatory"})
  }
  if(!filename){
    return res.json({message:"FileName is Mandatory"})
  }
  const rootFolder= "rootFolder";
  const filePath =`${rootFolder}/${folderName}/${filename}`

  try {
    fs.unlink(filePath,(err)=>{
      if(err){
        console.log(error)
      }
      return res.json({message:"File deleted successfully"})
    })
  } catch (error) {
    
  }

})

module.exports = router;
