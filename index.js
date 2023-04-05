import * as toolkitRaw from "@reduxjs/toolkit";
const { configureStore, createSlice } = toolkitRaw.default;

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload.text);
    },
    removeTodo: (state, action) => {
      state.splice(state.indexOf(action.payload.text, 1));
    },
  },
});

const ownerSlice = createSlice({
  name: "owner",
  initialState: "",
  reducers: {
    changeOwner: (state, action) => (state = action.payload),
  },
});

const { addTodo, removeTodo } = todoSlice.actions;
const { changeOwner } = ownerSlice.actions;

const store = configureStore({
  reducer: { todos: todoSlice.reducer, owner: ownerSlice.reducer },
});

store.dispatch(addTodo({ text: "Hello how are you" }));

console.log(store.getState());

store.dispatch(removeTodo({ text: "Hello how are you" }));
store.dispatch(addTodo({ text: "Hello how are you" }));
store.dispatch(changeOwner("Ivad"));

console.log("after ---> ", store.getState());
