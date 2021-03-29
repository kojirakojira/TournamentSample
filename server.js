var express = require('express')
var serveStatic = require('serve-static')
var app = express()
const path = require('path')
app.use(serveStatic(path.join(__dirname, '/dist')))
var port = process.env.PORT || 5000
app.listen(port)
console.log('server started ' + port)
