const pdf2png = require("./lib/pdf2png.js");
const request = require('request');
const images = require("images");
const fs = require("fs");
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const multer  = require('multer');
const express=require('express');
const app=express();
var AipOcrClient = require("baidu-aip-sdk").ocr;
var Baiclient = new AipOcrClient('16446178','lBzTz0eRuVbLkDyrIg3r0HP4','hanhf5oW4iZiYv4LtawMbTSkEOUCqHTH');
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

//身份证号识别
function getImgIdcad(){
	var image = fs.readFileSync("./file/0.jpg").toString("base64");
	/** 
	 * front 正面
	 * back  背面
	*/
	let id_card_side='front';
	Baiclient.idcard(image,id_card_side).then(function(result){
		console.log(JSON.stringify(result));
	}).catch(function(err) {
		// 如果发生网络错误
		console.log(err);
	});
}
getImgIdcad();