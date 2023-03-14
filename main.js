const EventEmitter = require("events");
const myEmitter = new EventEmitter();

const person = { name: "dooly", age: 8, gender: "male" };

myEmitter.on("start", (info) => {
  console.log(info);
  console.log(info.name);
  console.log(info.gender);
});

myEmitter.emit("start", person);
