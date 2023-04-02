import produce from "immer";

// Testing Immer
const salim = {
  name: "Salim",
  age: 40,
  address: { country: "Rwanda", city: "Kigali" },
};

const newSalim = produce(salim, () => {}); // no mutation was specified in the recipe function
console.log(newSalim === salim); // true

const brandNewSalim = produce(salim, (draft) => {
  draft.address.country = "Burundi";
}); // mutation are performed and a new object is created for the new object and the internal objects

console.log(salim === brandNewSalim);

const wrongSalim = produce(salim, (draft) => (draft.age = 60)); // will throw an error as the recipe function can either return something new or mutate the draft but not both
