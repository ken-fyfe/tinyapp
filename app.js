// basic web server
const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
const requestHandler = function(request, response) {
  console.log('request.method :', request.method);
  console.log('request.url :', request.url);
  if (request.method === 'GET') {
    const URL = request.url;
    console.log('URL :', URL);
    if (URL === '/') {
      response.end('<h1>Welcome</h1>');
    } else if (URL === '/test') {
      response.end('<h1>Test Page</h1>');
    } else if (URL === '/magic') {
      response.end('<h1>Magic Page</h1>');
    } else if (URL === '/url') {
      response.end("www.lighthouselabs.ca\nwww.google.com");
    } else {
      response.statusCode = 404;
      response.end('404 Page Not Found');
    }
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});