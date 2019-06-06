var pdf2png = require("./lib/pdf2png.js");
var images = require("images");
var fs = require("fs");
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const multer  = require('multer');
const express=require('express');
const app=express();
const Client = require('aliyun-api-gateway').Client;
const client = new Client(203711718,'dycajgu7raonuqw6u7ypqb97ve48tkfq');
// const Client = require('aliyun-api-gateway').SimpleClient;
// const client=new Client('841fe6f1e1d14debafe51d5be2d54d85');
const http = require('http').createServer(app);
app.set('port', process.env.PORT || 8084);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(multer({ dest: '/file/'}).array('image'));
app.use('/', express.static(__dirname + '/'));
app.use(history());
http.listen(app.get('port'), function () {
    console.log('server listening on port' + app.get('port'));
});
app.post('/file_upload',(req,res)=>{
	//let file=req.body.file;
	const des_file = __dirname + "/file/" + req.files[0].originalname;
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
          	res.end( JSON.stringify( response ) );
		})
	})
})
function filePdfImg(params){
	var projectPath = __dirname.split("\\");
	projectPath.pop();
	projectPath = projectPath.join("\\");

	var gsPath = projectPath + "/executables/ghostScript";

	// Rewrite the ghostscript path
	pdf2png.ghostscriptPath = gsPath;

	// Most simple example
	fs.readdirSync('./test').forEach(function(file){
		var curPath ="./test/" + file;
		if (fs.statSync(curPath).isDirectory()) {
			fs.rmdirSync(pathImg);
		} else {
			fs.unlinkSync(curPath,function (err) {
				if (err) throw err;
			});
		}
	})
	pdf2png.convert(params, function(resp){
		if(!resp.success){
			console.log("Something went wrong: " + resp.error);
			return;
		}
		fs.writeFile('./test/'+resp.imgNum+".png",resp.data,function(err){
			if(err){
				console.log(err);
			}
		})
	});
	fs.readdirSync('./test').forEach(function(file){
		var name = './test/'+file;
		images(resp.data).resize(800,1132).save(name,{quality :75});
	})
}
//图片处理
// var readFile = function (filepath, encoding) {
// 	return new Promise((resolve, reject) => {
// 	fs.readFile(filepath, encoding, (err, content) => {
// 		if (err) {
// 		return reject(err);
// 		}
// 		resolve(content);
// 	});
// 	});
// };
// fs.readdirSync('./images').forEach(function(file){
// 	async function post() {
// 		var url = 'http://stamp.market.alicloudapi.com/api/predict/ocr_official_seal';
// 		var png = await readFile('./images/'+file, 'base64');
// 		var result = await client.post(url, {
// 			data: {
// 				'image': png
// 			},
// 			headers:{
// 				'accept': 'application/json',
// 			}
// 		});
// 		let info=JSON.parse(result);
// 		console.log(info.result);
// 	}
// 	post().catch((err) => {
// 		console.log('该图片无法识别');
// 	});
// })