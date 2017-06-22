// var httpProxy = require('http-proxy');
// var proxy =new httpProxy.createProxyServer({
// 	target: {
//     host: 'http://localhost',
//     port: 3000
//     }
// });

module.exports = {
	 'GET /api/*': 'http://localhost:3000',
	 'POST /api/*': 'http://localhost:3000',
	 // '/api/*': function(req, res) {
	 // 	proxy.web(req,res)
	 // }
}
