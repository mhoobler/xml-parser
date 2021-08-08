const selected = document.getElementById("selected");

const fr = new FileReader();
fr.onload = () => renderXML(fr.result);

function htmlToElm(html) {
  var template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function addNode(node, elm = root) {
  let div = document.createElement("div");
  let span = document.createElement("span");
  let controller = document.createElement("div");
  let chevron = document.createElement("div");

  div.className = "xml hide";
  div.setAttribute("node-name", node.nodeName);

  controller.className = "controller";
  chevron.className = "chevron";
  controller.onclick = handleChevronClick;

  if (elm !== root) {
    div.classList.add("child");
  }

  if (
    node.nodeName === "#text" ||
    elm.getAttribute("node-name") === "#comment"
  ) {
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
  elm.appendChild(div);

  if (
    node.nodeName === "#comment" &&
    elm.getAttribute("node-name") !== "#comment"
  ) {
    addNode(node, div);
  } else {
    for (let child of node.childNodes) {
      addNode(child, div);
    }
  }
}

// load XML file - FileReader.onload
function renderXML(string) {
  root.innerHTML = "";
  const spaceless = string.replace(/\s+(?=\<)/g, "");
  // Parse DOM from string
  const parser = new DOMParser();
  const res = parser.parseFromString(spaceless, "application/xml");

  // Process DOM
  console.time("render");
  for (let child of res.childNodes) {
    addNode(child);
  }
  console.timeEnd("render");

  // Convert DOM to string
  const serializer = new XMLSerializer();

  const s = (f) => {};
}

selected.addEventListener("change", (e) => {
  var file = e.target.files[0];
  document.title = file.name;

  fr.readAsText(file);
});

var url = "http://localhost:3000/js/test";

var req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();

req.onreadystatechange = () => renderXML(req.responseText);

/*
req.onreadystatechange = function () {
  root.innerHTML = "";
  console.log(req.responseText);
  const parser = new DOMParser();
  const res = parser.parseFromString(req.responseText, "application/xml");
  console.log(res.children);

  // Process DOM
  for (let child of res.childNodes) {
    addNode(child, 0);
  }

  // Convert DOM to string
  const serializer = new XMLSerializer();

  const s = (f) => {};
};
*/
