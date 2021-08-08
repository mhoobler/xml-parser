const express = require("express");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const PORT = process.env.PORT || 3000;

const app = express();

app.use("/js", express.static(__dirname + "/docs/js"));
app.use("/css", express.static(__dirname + "/docs/css"));

app.get("/", (req, res) => {
  // Hack to fix bug with browser-refresh
  const html = fs.readFileSync("./docs/index.html");
  const $ = cheerio.load(html);
  $("body").append(
    `<script src="${process.env.BROWSER_REFRESH_URL}"></script>`
  );

  res.send($.html());
});

app.listen(PORT, () => {
  console.log("server listening");

  if (process.send) {
    process.send("online");
  }
});
