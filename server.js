var express = require('express');

var routes = require('./mock')

var app = express();

app.use('/api', routes);



app.listen(3000, () => {
	console.log('running at 3000')
})