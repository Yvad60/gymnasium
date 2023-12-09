import "reflect-metadata";

class Human {
  constructor
}

const keys = Reflect.defineMetadata("yello_there", { type: "animal" }, Human);

 myHuman = new Human();
const retrivedData = Reflect.getMetadata("yello_there", Human);
console.log(Human.toString());

console.log("retrivedData", retrivedData);
console.log(myHuman);
