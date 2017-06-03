var express = require('express');
var app = express();

var multer  = require('multer');

//★3 EJSのロード
var ejs = require('ejs');
//★4 テンプレートエンジンの設定
app.engine('ejs',ejs.renderFile);
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/jiro_jpg', express.static(__dirname + '/jiro_jpg'));
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
  res.sendFile(__dirname + '/index.html');
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

    if       ( aspect < 1.10 ) {
      message = '目黒店 ラーメン小';
      photo = 'meguro_shou.jpg';
    } else if( aspect < 1.12 ) {
      message = '新宿小滝橋通り店 ラーメン小';
      photo = 'kotaki_dai.jpg';

    } else if( aspect < 1.135 ) {
      message = '歌舞伎町店 ラーメン小';
      photo = 'kabuki_shou.jpg';

    } else if( aspect < 1.115 ) {
      message = '新橋店　ラーメン小';
      photo = 'senju_dai.jpg';

    } else if( aspect < 1.165 ) {
      message = '千住大橋駅前店 ラーメン大';
      photo = 'senju_shou.jpg';

    } else if( aspect < 1.18 ) {
      message = '三田本店 らーめん大';
      photo = 'jinbo_shou.jpg';

    } else if( aspect < 1.2 ) {
      message = '神保町 らーめん大';
      photo = 'jinbo_dai.jpg';

    } else  {
      message = '野猿街道店2 らーめん大';
      photo = 'yaen_dai.jpg';
    }
    // result.responses[].faceAnnotations[].landmarks;
    res.locals.message = message;
    res.locals.photo = photo;
    res.locals.faceRes = JSON.stringify(result);
    res.render('osusume.ejs', {});
  });

  // res.send(JSON.stringify({ok: true}))
});
