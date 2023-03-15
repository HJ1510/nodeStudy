코드잇 Node.js 기본기 참고
## node js
브라우저 이외의 환경에서도 js 실행 가능

### node로 파일에 있는 코드 실행
1. 파일 실행
``` 
node (파일이름).js //js 확장자는 생략 가능
```

2. REPL (Read Eval Print Loop)
터미널에서 node 실행하고 바로 코드 입력
```
node
```
간단한 코드 테스트 해보기에 좋음
.exit 로 실행종료

### 모듈
nodejs에서의 모듈 =  파일 한 개 한 개
#### require 모듈 로드하는 함수 
require(모듈 경로);
1. 공개하고 싶은 모듈 한개씩 

`math-tools.js`
```js
function add(a, b) {
  return a + b;
}

exports.add = add; //exports.plus(외부로 공개될 이름) = add(모듈 내부에서의 이름);
```

`main.js`
```js
let  m  =  require("./math-tools.js"); //js 확장자는 생략 가능
console.log(m.plus(1, 2)); // math-tools.js에 있는 plus 이름의 함수 호출
```

2. 모듈 내용을 모아서 객체를 통째로

`math-tools.js`
```js
const calculator = {
  PI: 3.14,
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
};

module.exports = calculator; //객체를 통째로 exports 
```

`main.js`
```js
let m = require("./math-tools");

console.log(m.PI); // 3.14
console.log(m.add(1, 2)); // 3
console.log(m.subtract(1, 2)); // -1
console.log(m.multiply(1, 2)); // 2
console.log(m.divide(1, 2)); // 0.5
```

#### 코어모듈
node js에 기본 내장된 모듈 (경로 표시할 필요 없음)

```js
const  fs  =  require("fs"); //file system 디렉토리 생성, 파일 삭제 등
fs.writeFileSync("new", "Hello!!!!"); // 'new'파는 파일에 두 번째 파라미터의 내용을 적음 'new' 없으면 파일 생성 기존에 있는 파일이면 덮어쓰기

const  os  =  require("os"); //operating system 운영체제
console.log(os.cpus()); // 컴퓨터 정보 출력
```

#### 서드파티모듈
다른 사용자들이 만들어서 공개한 모듈
```
npm install (모듈이름)
```
npm (Node Package Manager)
```js
const  cowsay  =  require("cowsay"); //경로지정없이 이름으로 로드
```

### 비동기 프로그래밍
node js에서는 비동기 프로그래밍이 권장 됨
-보통 Sync가 붙은 이름의 함수는 동기 실행(순차실행) 함수, 붙지 않은 것이 비동기 실행(비동기가 권장되니 이쪽이 기본)
-Node.js로 개발할 때는 메인 스레드에 부하를 주면 안 된다

#### 비동기 실행
1. 콜백 사용
특정 작업이 완료되었을 때 실행할 콜백을 등록해두고 바로 다음 코드로 넘어감. 처리 속도가 동기 실행에 비해 빠름
콜백함수 : 어떤 작업이 완료 되었을 때 실행될 함수
```js
fs.readFile("./new", "utf8", (error, data) => {
  console.log(data);
});
```
readFile => 비동기 실행 함수
cf) Node.js에서 많은 콜백은 일반적으로 err 인자를 첫 번째, data와 같이 작업 결과를 나타내는 인자를 뒤에 둠

2. 이벤트 사용
```js
const EventEmitter = require("events"); //events 코어모듈 호출하고 EventEmitter 생성
const myEmitter = new EventEmitter(); //myEmitter 객체 생성

myEmitter.on("test", () => { //on=> 콜백 등록 : 'test'라는 이벤트 발생하면 그 다음 등록한 콜백함수 실행
  console.log("Success!");
});

myEmitter.emit("test"); //emit=> 이벤트 발생 : 'test' 이벤트 발생
```
node js coreAPI는 이벤트 기반인 경우가 많음
!!!이벤트를 발생시키는 모든 객체는 결국 EventEmitter  클래스의 객체임
*EventEmitter 중요성 大*

-EventEmitter 객체를 사용할 때는 이벤트를 발생 시키기 전에 콜백 등록 필요
```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter(); 

myEmitter.emit("test"); 

myEmitter.on("test", () => { 
  console.log("Success!");
}); // 이 코드는 Success!를 출력하지 않음
```
-하나의 이벤트에 여러개의 콜백 설정 가능

```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();  

myEmitter.on("test", () => { 
  console.log("Success!");
}); 
myEmitter.on("test", () => { 
  console.log("1!");
}); 
myEmitter.on("test", () => { 
  console.log("2!");
}); 
myEmitter.on("test", () => { 
  console.log("3!");
}); 

myEmitter.emit("test"); // 등록해둔 콜백함수 모두 실행됨
```

-이벤트 발생과 그에 대한 콜백 실행은 하나의 EventEmitter 객체 안에서 이루어짐
```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();
const myEmitter2 = new EventEmitter();

myEmitter.on("test", () => {
  console.log("Success!");
});

myEmitter.on("test", () => {
  console.log("1!");
});

myEmitter.on("test", () => {
  console.log("2!");
});

myEmitter2.on("test", () => {
  console.log("3!");
});

myEmitter.emit("test"); //3!은 출력되지 않음
myEmitter2.emit("test"); //3!만 출력
```

**EventEmitter** 메소드
1 on(=addListener)
이벤트 발생하면 실행될 콜백함수 설정(이벤트 핸들러)
2 emit
인위적으로 이벤트 발생 (실제로 쓰일 일은 않지는 않음)
3 once
특정 이벤트에 대한 이벤트 핸들러 기능 한번만 실행됨
```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.once("test", () => {
  console.log("Success!");
});

myEmitter.once("test", () => {
  console.log("1!");
});

myEmitter.once("test", () => {
  console.log("2!");
});

myEmitter.once("test", () => {
  console.log("3!");
});

myEmitter.emit("test");
myEmitter.emit("test");
myEmitter.emit("test"); //emit으로 이벤트를 세번 발생했지만 콘솔에 출력(콜백함수 실행)은 한번씩만 됨
```
4 listeners
특정 이벤트에 대한 이벤트 핸들러를 출력
```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.once("test", () => {
  console.log("Success!");
});

myEmitter.once("test", () => {
  console.log("Success2!");
});

console.log(myEmitter.listeners("test")); //[ [Function (anonymous)], [Function (anonymous)] ]
```
5 off
이벤트 핸들러 해제
```js
// off가 동작 안함: on과 off가 걸려있는게 생김새만 같을뿐 다른 함수이기때문
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("test", () => {
  console.log("Success!");
});

myEmitter.off("test", () => {
  console.log("Success!");
});

myEmitter.emit("test");
```
```js
// 이벤트 핸들러 한개일때
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

const callback = () => {
  console.log("Success!");
};

myEmitter.on("test", callback);
myEmitter.off("test", callback);
myEmitter.emit("test");
```
```js
// 이벤트 핸들러 여러개일때
const EventEmitter = require("events");
const myEmitter = new EventEmitter();
const cbArr = [];

cbArr[0] = () => {
  console.log("A");
};

cbArr[1] = () => {
  console.log("B");
};

myEmitter.on("test", cbArr[0]);
myEmitter.on("test", cbArr[1]);

myEmitter.off("test", cbArr[0]);
myEmitter.off("test", cbArr[1]);

myEmitter.emit("test");
```

-이벤트에 파라미터 전달
```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("test", (arg1, arg2, arg3) => {
  console.log(arg1);
  console.log(arg2);
});

myEmitter.emit("1", "2", "3"); // 1,2
```
```js
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("test", (arg1, arg2, arg3, arg4) => {
  console.log(arg1);
  console.log(arg2);
  console.log(arg3);
  console.log(arg4);
});

myEmitter.emit("1", "2", "3"); // 1,2,3,undefined
```
```js
// 객체 전달
const EventEmitter = require("events");
const myEmitter = new EventEmitter();

const person = { name: "dooly", age: 8, gender: "male" };

myEmitter.on("start", (info) => {
  console.log(info);
  console.log(info.name);
  console.log(info.gender);
});

myEmitter.emit("start", person); // { name: 'dooly', age: 8, gender: 'male' }, dooly, male
```
