// const fs = require("fs");

// // console.log("Start");

// // let content = fs.readFileSync("./new", "utf8");
// // console.log(content);

// // console.log("Finish");

// console.log("Start");

// fs.readFile("./new", "utf8", (error, data) => {
//   console.log(data);
// });

// console.log("Finish");

// const EventEmitter = require("events");

// const myEmitter = new EventEmitter();

// const cbArr = [];

// cbArr[0] = () => {
//   console.log("A");
// };

// cbArr[1] = () => {
//   console.log("B");
// };

// myEmitter.on("test", cbArr[0]);
// myEmitter.on("test", cbArr[1]);

// myEmitter.off("test", cbArr[0]);
// myEmitter.off("test", cbArr[1]);

// myEmitter.emit("test");