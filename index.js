var express = require('express');
var app = express();

var multer  = require('multer');
var uploaded = multer({dest: 'tmp'});

//★3 EJSのロード
var ejs = require('ejs');
//★4 テンプレートエンジンの設定
app.engine('ejs',ejs.renderFile);

var fs = require('fs');

var port = process.env.PORT || 3000;

//サーバーの立ち上げ
var http = require('http');

var gcvHttpRequest = require('./http_request.js');

// サンプルの画像を投稿する場合のやり方
//var imageFile = fs.readFileSync('image.jpg');
//gcvHttpRequest.gcvDetectRequest(imageFile, function(result){
//  console.log(JSON.stringify(result));
//});

//指定したポートにきたリクエストを受け取れるようにする
var server = http.createServer(app).listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/jquery/jquery.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// アップロードされるファイルの受け取り
const upload = multer({dest: 'uploaded'})

app.post('/osusume', upload.single('upName'), (req, res) => {
  console.log(`originalname: ${req.file.originalname}`)
  console.log(`path: ${req.file.path}`)

  var imageFile = fs.readFileSync(`${req.file.path}`);
  gcvHttpRequest.gcvDetectRequest(imageFile, function(result){
    console.log(JSON.stringify(result));
    res.locals.faceRes = JSON.stringify(result);
    res.render('osusume.ejs', {});
  });

  // res.send(JSON.stringify({ok: true}))
});
