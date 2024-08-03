import express from 'express';
import http from 'http'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve all the files in 'dist'.
app.use(express.static("dist"));
//  Serve data
app.use('/data',express.static("data"));
//  Serve draw
app.use('/draw',express.static("draw"));

//  INDEX.HTML
app.get('/', function(request, response){
    response.sendFile(__dirname +'/index.html');
});

const server = http.createServer(app);

// Start the web server.
const listener = server.listen(3000, () => {//3000 or use process.env.PORT
    console.log("Your app is listening on port " + listener.address().port);
    console.log("http://localhost:3000")
  });

