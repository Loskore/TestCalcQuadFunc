var express = require('express');
var app = express();
app.set('views', __dirname);
app.set('view engine', 'html');
app.use(express.static(__dirname));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function(req, res) {
    res.sendFile('index.html');
});


app.listen(5050, function(err) {
    if (err) throw err;

    console.log('Сервер запущен по адресу: http://localhost:5050');
});