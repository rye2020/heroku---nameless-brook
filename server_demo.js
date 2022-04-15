const http = require('http');
const path = require('path');
const fs = require('fs');
const res = require('express/lib/response');
const server = http.createServer((req, res) => {

let done = 0;
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'};

var dir = path.join(__dirname, 'public');
var reqpath = req.url.toString().split('?')[0];
var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
var type = mime[path.extname(file).slice(1)] || 'text/html';   // Should this default to 'text/plain'?

// Build file path
    let rpath = req.url.slice(1);      // Remove leading /
    let filePath = path.join(__dirname, 'public', req.url === '/' ?
    'index.html' : rpath + '.html');  
   
    // Extension of the file
    let extname = path.extname(filePath);
    
    // Handle css file
    if ( !done ) {
    if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

        fs.readFile(__dirname + '/public/css/style.css', function (err, data) {
          if (err) throw err;
          res.writeHead(200, {'Content-Type': type});
          res.write(data);
          res.end();
          done = 1;
        });
    }
      }

//        Handle jpg file
      if ( !done ) {
        if (/.(jpg)$/.test(req.url)) {                  // test if req.url has jpg extension
            console.log(reqpath);
            var s = fs.createReadStream(reqpath);
            s.on('open', function() {
                res.setHeader('Content-Type', 'text/html');
                s.pipe(res);
            });
            s.on('error', function() {
                res.setHeader('Content-Type', type);
                res.statusCode= 404;
                res.end('Not found');
            });
              done = 1; 
          }
        }

    // Read file
    if ( !done ) {
      fs.readFile(filePath, (err, content) =>     {
        if (err) {
            if (err.code == 'ENOENT') {
                // Page not found
                 fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html'});
                    res.end(content, 'utf8');
                 })
                 
            } else {
                // Some server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': type });
            res.end(content);
        }
        })
    done = 1;
    }

    function newFunction() {
        console.log(path.join(__dirname, 'public', 'images', 'jrm.jpg'));
    }
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));

// Using 'npm run dev' which will run nodemon which will run server_demo
//   see package.json 