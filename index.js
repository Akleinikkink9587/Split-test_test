import http from 'http';
import httpProxy from 'http-proxy';
import express from "express";
let app = express();
import session from 'express-session';

app.use(session({ secret: 'Secret5555', resave: false, saveUninitialized: true, }));
// Define the port to run on
app.set('port', process.env.PORT || parseInt(process.argv.pop()) || 8443);
let apiProxy = httpProxy.createProxy({
    changeOrigin: true
});


let aUrls = [
    "https://akleinikkink9587.github.io/test1/",
    "https://akleinikkink9587.github.io/test2/"
];

app.all("/*", function(req, res) {
    let nServer = req.session.nServer;
    if(!nServer || nServer < 1 || nServer > aUrls.length){
        nServer = Math.ceil(Math.random() *aUrls.length);
        req.session.nServer =  nServer;
    }
    apiProxy.web(req, res, {target: aUrls[nServer - 1]});
});

// Create http server that leverages reverse proxy instance
// and proxy rules to proxy requests to different targets
http.createServer(app)
.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + "! Go to https://localhost:" + app.get('port') + "/")
});
