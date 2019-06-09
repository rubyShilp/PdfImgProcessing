const fs = require("fs");
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser');
const express=require('express');
const app=express();
const AipOcrClient = require("baidu-aip-sdk").ocr;
const Baiclient = new AipOcrClient('16446178','lBzTz0eRuVbLkDyrIg3r0HP4','hanhf5oW4iZiYv4LtawMbTSkEOUCqHTH');
const Client = require('aliyun-api-gateway').Client;
const client = new Client(203711718,'dycajgu7raonuqw6u7ypqb97ve48tkfq');
const fileUpload=require('./httpServer/fileUpload');
// const Client = require('aliyun-api-gateway').SimpleClient;
// const client=new Client('841fe6f1e1d14debafe51d5be2d54d85');
const http = require('http').createServer(app);
app.set('port', process.env.PORT || 8084);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(multer({ dest: '/file/'}).array('image'));
app.use('/', express.static(__dirname + '/'));
app.use('/',fileUpload)
app.use(history());
http.listen(app.get('port'), function () {
    console.log('server listening on port' + app.get('port'));
});
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
//getImgIdcad();