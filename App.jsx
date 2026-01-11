const App = () => {
  const handleClick = () => {
    console.log("hello world");
  };
  return (
    <h1 onClick={handleClick}>
      Hello world now
      {["je;;"].map((item) => (
        <div>ok</div>
      ))}
    </h1>
  );
};
export default App;
