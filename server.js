import express from "express";
import fs from "fs";

const app = express();

// app.use(express.static("dist"));

app.get("/", (req, res) => {
  const html = fs.readFileSync("./dist/index.html", "utf-8");

  const newHtml = html.replace('<div id="root"></div>', '<div id="root"><h1>Hello world now</h1></div>');
  console.log("Serving index.html", html);
  res.send(newHtml);
});

app.use(express.static("dist"));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on now http://localhost:${PORT}`);
});
