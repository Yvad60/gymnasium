const { createApi, fetchBaseQuery } = require("@reduxjs/toolkit/query");
const { configureStore } = require("@reduxjs/toolkit");

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
    }),
  }),
});

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

console.log(apiSlice.endpoints.getUsers.initiate());

setTimeout(() => {
  console.log("------>", store.getState().api.queries["getUsers(undefined)"]);
  const data = store.dispatch(apiSlice.endpoints.getUsers.select());
  console.log(data);
}, 3000);
