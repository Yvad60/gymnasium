const toolkit = require("@reduxjs/toolkit");
const query = require("@reduxjs/toolkit/query");

const { configureStore, createSlice, createAsyncThunk } = toolkit;
const { createApi } = query;

console.log(createApi());

const thunk = createAsyncThunk("user/getusers", async (hey, thunkAPI) => {
  console.log("hello world", thunkAPI);
  const users = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await users.json();
  return data;
});

const userSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(thunk.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(thunk.pending, (state, action) => {
      console.log("this is the action for pending.....", action);
    });
    builder.addCase(thunk.rejected, (state, action) => {
      console.log("this is the action for rejected.....", action.error.message);
    });
  },
});

// console.log(createApi);

// const store = configureStore({ reducer: userSlice.reducer });

// store.dispatch(thunk());
