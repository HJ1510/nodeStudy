### web server
#### server, client
client: server로 서비스에 관한 요청을 보내고 응답을 받음
server: client의 요청을 받고 그에 대한 응답을 보냄

#### 서버 만들기
```js
const http = require("http"); //http 프로토콜로 통신할것임을 명시

let server = http.createServer(function (request, response) {
  response.end("<h1>HI!!</h1>");
});
server.listen(5000); //포트 번호는 5000
```
터미널 창에서 해당 파일 실행시키면 서버가 실행되고
브라우저에서
http://127.0.0.1:5000/
http://localhost:5000/
이 주소로 서버 접근 가능

#### url
https://www.google.com/webhp?hl=ko&sa=X&ved=0ahUKEwjIlczz9tr9AhUHpVYBHZ8vBrYQPAgI
https:스킴(프로토콜 이름)
www.google.com:호스트(특정 서버 이름)
webhp:경로 path(자원의 위치) 실제 서버의 디렉토리와 일치해야하는 것 아님!
hl=ko&sa=X&ved=0ahUKEwjIlczz9tr9AhUHpVYBHZ8vBrYQPAgI 물음표 뒤의 부분: 쿼리(서버에 요청하는 내용)

```js
let url = new URL(
  "https://www.google.com/webhp?hl=ko&sa=X&ved=0ahUKEwjIlczz9tr9AhUHpVYBHZ8vBrYQPAgI"
);

console.log(url.protocol);
console.log(url.host);
console.log(url.pathname);
console.log(url.search); // ?쿼리
```
-라우팅
```js
const http = require("http");

let server = http.createServer(function (request, response) {
  console.log(request.url);
});
server.listen(5000); // 브라우저에 입력된 url에서 5000 이후의 path부터 문자열로 출력
```

```js
const http = require("http");

const members = ["dooly", "ddochi", "heedong", "gildong"];

let server = http.createServer(function (request, response) {
  if (request.url === "/") {
    response.end("<h1>welcome</h1>");
  } else if (request.url === "/users") {
    response.end("<h1>" + members + "</h1>");
  } else if (request.url.split("/")[1] === "users") {
    let membersIdx = request.url.split("/")[2];
    let membersName = members[membersIdx - 1];
    response.end("<h1>" + membersName + "</h1>"); // /users/1, /users/2 ...
  } else {
    response.end("<h1>Service unavailable</h1>");
  }
});

server.listen(5000);
```
request.url === "/" 이 부분으로 라우팅 설정

#### express
```
// 설치
npm install express
```
```js
// express 사용
const  express  =  require('express');
const  app  =  express(); // 보통 app이라는 이름 사용

app.get('/', (request, response) => {
  response.end('<h1>welcome</h1>');
});

app.get('/members/:id', (request, response) => {
  const membersName = members[request.params.id - 1];
  response.end(`<h1>${membersName}</h1>`);
}); // :id -> 이 위치에 오는 값을 id에 할당(가변적인 속성 앞에 : 를 붙여서 표시 = Route parameters)

app.get('*', (request, response) => {
  response.end('<h1>Service unavailable</h1>');
}); // 라우팅할때 코드의 순서 중요함! 순서대로 처리되기때문에 이 코드가 가장 먼저 나오면 그 후에 라우팅하려는 코드는 동작하지 않음

app.listen(5000); // 포트 5000 사용
```
