const http = require("http");

let server = http.createServer(function (request, response) {
  response.end("<h1>HI!!</h1>");
});
server.listen(5000);
