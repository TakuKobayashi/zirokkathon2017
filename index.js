var express = require('express');
var app = express();

var multer  = require('multer');

//★3 EJSのロード
var ejs = require('ejs');
//★4 テンプレートエンジンの設定
app.engine('ejs',ejs.renderFile);
app.use('/assets', express.static(__dirname + '/assets'));

var fs = require('fs');

var port = process.env.PORT || 3000;

//サーバーの立ち上げ
var http = require('http');

var gcvHttpRequest = require('./http_request.js');

//指定したポートにきたリクエストを受け取れるようにする
var server = http.createServer(app).listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/jquery/jquery.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.js');
});

app.get('/', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.render('top.ejs', {});
});

app.get('/top', function(req, res){
  res.render('top.ejs', {});
});

// アップロードされるファイルの受け取り
const upload = multer({dest: 'uploaded'})

app.post('/osusume', upload.single('upName'), (req, res) => {
  console.log(`originalname: ${req.file.originalname}`)
  console.log(`path: ${req.file.path}`)

  var imageFile = fs.readFileSync(`${req.file.path}`);
  gcvHttpRequest.gcvDetectRequest(imageFile, function(result){
    console.log(JSON.stringify(result));


    var left = (result.responses[0].faceAnnotations[0].landmarks.filter(function(item, index){
      if (item.type == 'LEFT_EAR_TRAGION') return true;
    }))[0].position.x;

    var right = (result.responses[0].faceAnnotations[0].landmarks.filter(function(item, index){
      if (item.type == 'RIGHT_EAR_TRAGION') return true;
    }))[0].position.x;

    var top = (result.responses[0].faceAnnotations[0].landmarks.filter(function(item, index){
      if (item.type == 'FOREHEAD_GLABELLA') return true;
    }))[0].position.y;

    var bottom = (result.responses[0].faceAnnotations[0].landmarks.filter(function(item, index){
      if (item.type == 'CHIN_GNATHION') return true;
    }))[0].position.y;

    var aspect = (right - left) / (bottom - top)

    res.locals.aspect = "[" + left + "," + right + "," + top + "," + bottom + "," + aspect + "]";
    // result.responses[].faceAnnotations[].landmarks;
    res.locals.faceRes = JSON.stringify(result);
    res.render('osusume.ejs', {});
  });

  // res.send(JSON.stringify({ok: true}))
});
