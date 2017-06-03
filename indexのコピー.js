var express = require('express');
var app = express();
var fs = require('fs');

var port = process.env.PORT || 3000;

//サーバーの立ち上げ
var http = require('http');

var gcvHttpRequest = require('./http_request.js');

// サンプルの画像を投稿する場合のやり方
var imageFile = fs.readFileSync('image.jpg');
gcvHttpRequest.gcvDetectRequest(imageFile, function(result){
  console.log(JSON.stringify(result));
});

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
app.post('/osusume', function(req, res) {
    // fileオブジェクト取得
    var file = req.files.image_file;
    // リネームしてimgタグで見れるようにする
    fs.rename(file.path, imageDirPath + 'upfile' , function(err) {
        if (err) {
            console.log(err);
        }
        res.sendFile(__dirname + '/osusume.html');
    });
});
