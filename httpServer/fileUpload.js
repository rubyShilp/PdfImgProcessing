const multer  = require('multer');
const fs = require("fs");
const bodyParser = require('body-parser');
const express=require('express');
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ dest: './../file/'}).array('file'));
const filePdfImg=require('./../pdfimg.js');
app.post('/user/upload',(req,res)=>{
    const des_file = __dirname + "./../file/" + req.files[0].originalname;
    let response=null;
	fs.readFile(req.files[0].path,(err, data)=>{
		fs.writeFile(des_file,data,(err)=>{
			if(err){
				console.log(err);
			}else{
				response = {
					message:'File uploaded successfully', 
					filename:req.files[0].originalname
			   };
			}
			filePdfImg(des_file)
          	res.end(JSON.stringify(response));
		})
	})
})
module.exports=app;