const selected = document.getElementById("selected");

const startLoader = () => {
  document.getElementById("loader").classList.remove("hide");
};
const endLoader = () => {
  document.getElementById("loader").classList.add("hide");
};

const fr = new FileReader();
fr.onload = () => {
  renderXML(fr.result);
};

function htmlToElm(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function addNode(node, elm = null) {
  let div = document.createElement("div");
  let span = document.createElement("span");
  let controller = document.createElement("div");
  let chevron = document.createElement("div");

  div.className = "xml hide";
  div.setAttribute("node-name", node.nodeName);

  controller.className = "controller";
  chevron.className = "chevron";
  controller.onclick = handleChevronClick;

  const nodeNameBool = elm && elm.getAttribute("node-name") === "#comment";

  if (node.nodeName === "#comment") {
    div.set;
    span.innerText = `<!-- ${node.nodeValue} -->`;
  } else if (node.nodeName === "#text") {
    span.innerText = node.nodeValue;
    span.classList.add("xml-value");
    span.setAttribute("value", node.nodeValue);
  } else {
    span.innerText = node.nodeName;
    controller.appendChild(chevron);
    div.appendChild(controller);
  }

  div.onclick = handleXMLClick;

  div.appendChild(span);
  if (elm) {
    div.classList.add("child");
    elm.appendChild(div);
  }

  if (node.nodeName === "#comment" && nodeNameBool) {
    addNode(node, div);
  } else {
    for (let child of node.childNodes) {
      addNode(child, div);
    }
  }
  return new Promise((res, rej) => res(div));
}

// load XML file - FileReader.onload
async function renderXML(string) {
  root.innerHTML = "";
  // Get rid of any whitespace outisde of enclosing tags
  // Not exactly a perfect match, but seems to work well enough
  const spaceless = string.replace(/\s+(?=\<)/g, "");
  // Parse XML from string
  console.time("parser");
  const parser = new DOMParser();
  const res = parser.parseFromString(spaceless, "application/xml");
  console.timeEnd("parser");

  // Render XML
  console.time("render");
  let div = document.createElement("div");
  for (let child of res.childNodes) {
    let x = await addNode(child);
    div.append(x);
  }
  root.appendChild(div);
  console.timeEnd("render");
  clearPins();
  endLoader();
}

selected.addEventListener("change", (e) => {
  startLoader();
  var file = e.target.files[0];
  document.title = file.name;

  fr.readAsText(file);
});

var url = window.location.href + "js/test";

var req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();

req.onreadystatechange = () => {
  startLoader();
  renderXML(req.responseText);
};
