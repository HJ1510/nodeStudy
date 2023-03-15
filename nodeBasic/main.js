const http = require('http');

const express = require('express');

const app = express();

const members = ['dooly', 'ddochi', 'heedong', 'gildong'];

app.get('/', (request, response) => {
  response.end('<h1>welcome</h1>');
});

app.get('/members', (request, response) => {
  response.end(`<h1>${members}</h1>`);
});

app.get('/members/:id', (request, response) => {
  // console.log(request.params);
  const membersName = members[request.params.id - 1];
  response.end(`<h1>${membersName}</h1>`);
});

app.get('*', (request, response) => {
  response.end('<h1>Service unavailable</h1>');
});

app.listen(5000);

// const server = http.createServer((request, response) => {
//   if (request.url === '/') {
//     response.end('<h1>welcome</h1>');
//   } else if (request.url === '/members') {
//     response.end(`<h1>${members}</h1>`);
//   } else if (request.url.split('/')[1] === 'users') {
//     const membersIdx = request.url.split('/')[2];
//     const membersName = members[membersIdx - 1];
//     response.end(`<h1>${membersName}</h1>`);
//   } else {
//     response.end('<h1>Service unavailable</h1>');
//   }
// });

// server.listen(5000);
