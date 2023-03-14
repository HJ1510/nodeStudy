const http = require('http');

const members = ['dooly', 'ddochi', 'heedong', 'gildong'];

const server = http.createServer((request, response) => {
  if (request.url === '/') {
    response.end('<h1>welcome</h1>');
  } else if (request.url === '/users') {
    response.end(`<h1>${members}</h1>`);
  } else if (request.url.split('/')[1] === 'users') {
    const membersIdx = request.url.split('/')[2];
    const membersName = members[membersIdx - 1];
    response.end(`<h1>${membersName}</h1>`);
  } else {
    response.end('<h1>Service unavailable</h1>');
  }
});

server.listen(5000);
