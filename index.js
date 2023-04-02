const salim = {
  name: "Salim",
  age: 40,
  address: { country: "Rwanda" },
};

const newSalim = salim;
console.log(salim === newSalim); // true since they both reference to the same object

const brandNewSalim = { ...salim };
console.log(salim === brandNewSalim); // false as there is a new object created

console.log(newSalim.address === brandNewSalim.address); // true both addresses are still referencing the same object since we performed a shallow copy
