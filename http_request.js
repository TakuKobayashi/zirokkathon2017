//requestをrequire
var request = require('request');
var fs = require('fs');
var apiConfig = JSON.parse(fs.readFileSync('./config/apiconfig.json', 'utf8'));

var url = "https://vision.googleapis.com/v1/images:annotate";

var headers = {
  'Content-Type':'application/json;charset=UTF-8'
}

var request_url = url + "?key=" + apiConfig.google.apikey

var imageFile = fs.readFileSync('image.jpg');
var imageBase64Encoded = new Buffer(imageFile).toString('base64');

bodyObj = {
  requests: [{
    image: {
      content: imageBase64Encoded
    },
    features: [
      {
        type: "FACE_DETECTION",
        maxResults: 10
      },
      {
        type: "LABEL_DETECTION",
        maxResults: 10
      },
      {
        type: "TEXT_DETECTION",
        maxResults: 10
      },
      {
        type: "LANDMARK_DETECTION",
        maxResults: 10
      },
      {
        type: "IMAGE_PROPERTIES",
        maxResults: 10
      }
    ]
  }]
}

//オプションを定義
var options = {
  url: request_url,
  method: 'POST',
  headers: headers,
  json: true,
  body: bodyObj
}

//リクエスト送信
request(options, function (error, response, body) {
  console.log(JSON.stringify(body));
  //コールバックで色々な処理
})