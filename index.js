const express = require("express");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const PORT = process.env.PORT || 3000;

const app = express();

app.use("/js", express.static(__dirname + "/docs/js"));
app.use("/css", express.static(__dirname + "/docs/css"));

app.get("/", (req, res) => {
  // bunch of stuff so this plays nicely with GHP
  const html = fs.readFileSync("./docs/index.html");
  const $ = cheerio.load(html);
  const devSrcs = [...$("script")];
  const devHrefs = [...$("link")];

  for (let tag of devSrcs) {
    const srcArr = $(tag).attr("src").split("/");
    const newSrc = "/" + srcArr.slice(1, srcArr.length).join("/");
    $(tag).attr("src", newSrc);
  }

  for (let tag of devHrefs) {
    const hrefArr = $(tag).attr("href").split("/");
    const newHref = "/" + hrefArr.slice(1, hrefArr.length).join("/");
    $(tag).attr("href", newHref);
  }

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
