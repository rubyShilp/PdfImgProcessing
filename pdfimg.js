const pdf2png = require("./lib/pdf2png");
const fs = require("fs");
const path=require('path');
const images = require("images");
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const filePdfImg=function(params){
	var projectPath = __dirname.split("\\");
	projectPath.pop();
	projectPath = projectPath.join("\\");

	var gsPath = projectPath + "./executables/ghostScript";

	// Rewrite the ghostscript path
	pdf2png.ghostscriptPath = gsPath;
	//转成图片之前删除临时目录内所有文件
	deteleFile('./temp/');
	// Most simple example
	pdf2png.convert(params, function(resp){
		if(!resp.success){
			console.log("Something went wrong: " + resp.error);
			return;
		}else{
			let name='./temp/'+resp.imgNum+".png";
			images(resp.data).size(800,1132).save(name,{quality :100});
		}
		//压缩图片之前删除文件下的所有内容
		deteleFile('./contractFile/');
		fs.readdir('./temp',function(err,files){
			(function iterator(i){
				if(i===files.length){
					return;
				}
				fs.stat(path.join('./temp/',files[i]),function(err, data){
					if(data.isFile()){
						(async () => {
							await imagemin(['./temp/'+files[i]], './contractFile', {
								plugins: [
									imageminPngquant()
								]
							});
						})();
					}
					iterator(i+1);
				})
			})(0)
		})
	});
}
//删除目录下的文件
function deteleFile(params){
	fs.readdirSync(params).forEach(function(file){
		var curPath =params+file;
		if (fs.statSync(curPath).isDirectory()) {
			fs.rmdirSync(pathImg);
		} else {
			fs.unlinkSync(curPath,function (err) {
				if (err) throw err;
			});
		}
	})
}
module.exports=filePdfImg;