'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = require('express');
var app = (0, express_1.default)();
var port = 3000;
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.get('/test', function (req, res) {
  res.send('TEST hello :)');
});
app.get('/test2', function (req, res) {
  res.send('TEST hello 2 :)');
});
app.listen(port, function () {
  console.log('Example app listening on port '.concat(port));
});
