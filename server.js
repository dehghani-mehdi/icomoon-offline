const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const port = process.argv[2] || 3000;
const contentTypes = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
};

http.createServer((req, res) => {
    let uri = url.parse(req.url).pathname;

    if (uri.indexOf('/api/getall') > -1 ) {
        // simulate database delay
        setTimeout(() => {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write(JSON.stringify({id: 10}));
            res.end();
        }, 1000);
    }
    else {
        let filename = path.join(process.cwd(), uri);

        fs.exists(filename, exists => {
            if(!exists) {
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("404 Not Found\n");
                res.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';

            fs.readFile(filename, "binary", (err, file) => {
              if (err) {        
                res.writeHead(500, {"Content-Type": "text/plain"});
                res.write(err + "\n");
                res.end();
                return;
              }      

            let headers = {},
                contentType = contentTypes[path.extname(filename)];

              if (contentType) headers["Content-Type"] = contentType;

              res.writeHead(200, headers);           
              res.write(file, "binary");
              res.end();      
            });
        });
    }   
}).listen(parseInt(port, 10), () => console.log(`server running @ localhost:${port}`));