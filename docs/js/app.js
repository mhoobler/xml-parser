const root = document.getElementById("root");

const state = {
  prev: null,
  target: null,
  pins: [],
  commands: window.localStorage.getItem("xmlCommands")
    ? new Set(window.localStorage.getItem("xmlCommands").split("|"))
    : new Set(),
};

function expandAll(e) {
  let elms = document.querySelectorAll(".xml");

  for (let e of elms) {
    e.classList.remove("hide");
  }
}

function hideAll(e) {
  let elms = document.querySelectorAll(".xml");

  for (let e of elms) {
    e.classList.add("hide");
  }
}

function changeToFocus(target, shouldScroll) {
  let findParentBtn;
  let findNextBtn;
  let createPinBtn;

  // Manage state
  state.prev = state.target;
  if (state.prev) {
    state.prev.classList.remove("focus");
  }
  state.target = target;
  state.target.classList.add("focus");
  if (shouldScroll) {
    state.target.scrollIntoView();
    window.scrollBy(0, -100);
  }

  // Rendering circus
  document.querySelector("#find-parent") &&
    document.querySelector("#find-parent").remove();
  document.querySelector("#find-next") &&
    document.querySelector("#find-next").remove();
  document.querySelector("#create-pin") &&
    document.querySelector("#create-pin").remove();

  findParentBtn = document.createElement("button");
  findNextBtn = document.createElement("button");
  createPinBtn = document.createElement("button");
  findParentBtn.className = findNextBtn.className = createPinBtn.classList =
    "sm focus-btn";

  findParentBtn.id = "find-parent";
  findParentBtn.innerText = "Parent";

  findNextBtn.id = "find-next";
  findNextBtn.innerText = "Next";

  createPinBtn.id = "create-pin";
  createPinBtn.innerText = "Pin";

  findParentBtn.onclick = handleFindParentClick;
  findNextBtn.onclick = handleFindNextClick;
  createPinBtn.onclick = handleCreatePinClick;

  state.target.children[1].insertAdjacentElement("afterend", createPinBtn);
  state.target.children[1].insertAdjacentElement("afterend", findNextBtn);
  if (state.target.classList.contains("child")) {
    state.target.children[1].insertAdjacentElement("afterend", findParentBtn);
  }
}

// Focus Button Handlers

function handleXMLClick(e) {
  e.stopPropagation();
  changeToFocus(e.currentTarget);
}

function handleChevronClick(e) {
  e.stopPropagation();
  let parent = e.currentTarget.parentElement;
  parent.classList.toggle("hide");
}

function handleFindParentClick(e) {
  e.stopPropagation();
  const parent = e.currentTarget.parentElement.parentElement;
  changeToFocus(parent, true);
}

function handleFindNextClick(e) {
  e.stopPropagation();
  let target = e.target.parentElement;
  let parent = target.parentElement;
  let children = [...parent.children];
  let found = false;

  for (let c of children) {
    if (found) {
      changeToFocus(c);
      return;
    }
    found = c === target;
  }

  console.warn("Could not find next child");
}

// Pins
function handleCreatePinClick(e) {
  const target = e.currentTarget;
  // get array of the nodeNames for every parent
  const nodeName = (() => {
    let nodeName = [];
    let parent = target.parentElement;
    while (parent.getAttribute("node-name")) {
      nodeName.unshift(parent.getAttribute("node-name"));
      parent = parent.parentElement;
    }
    return nodeName;
  })();

  state.pins.push({
    // making it look nice as text
    string: nodeName.join(" > "),
    // actual target for the appropriate element
    target: e.currentTarget.parentElement,
  });
  renderPins();
}

function clearPins() {
  state.pins = [];
  renderPins();
}

function renderPins() {
  const pins = [...state.pins];
  const pinsContainer = document.getElementById("pins-container");
  pinsContainer.innerHTML =
    "<div class='header-container'><h4>Pins</h4><button class='sm' onClick='clearPins()'>Clear</button></div>";
  pins.forEach((pin, index) => {
    const elm = document.createElement("div");
    elm.classList.add("pin");
    elm.innerText = pin.string;
    elm.dataset.index = index;

    elm.onclick = () => {
      changeToFocus(pin.target, true);
    };
    pins.pinElm = elm;

    pinsContainer.appendChild(elm);
  });
}

// Commands
function expandTarget() {
  let input = document.getElementById("expand-target-input").value;

  // add input into state and localStorage
  state.commands.add(input);
  window.localStorage.setItem("xmlCommands", [...state.commands].join("|"));

  // allow for some shorthands
  let replaceShorthands = input
    .replaceAll("[nv=", "[node-value=")
    .replaceAll("[nn=", "[node-name=");
  // split and clean things up
  let splitSelectors = replaceShorthands
    .replaceAll(/\/s/g, "")
    .split(">")
    .map((e) => e.split(","));

  while (splitSelectors.length > 0) {
    let elms = [...document.querySelectorAll(splitSelectors.join(">"))];
    for (let e of elms) {
      e.classList.remove("hide");
    }
    splitSelectors.pop();
  }

  renderCommands();
}

function clearCommands() {
  state.commands = new Set();
  window.localStorage.removeItem("xmlCommands");
  renderCommands();
}

function renderCommands() {
  let commandsContainer = document.getElementById("commands-container");
  commandsContainer.innerHTML =
    "<div class='header-container'><h4>Commands</h4><button class='sm' onClick='clearCommands()'>Clear</button></div>";
  for (let c of state.commands) {
    let div = document.createElement("div");
    div.classList.add("command");
    div.innerText = c;
    commandsContainer.appendChild(div);
    div.onclick = (e) => {
      document.getElementById("expand-target-input").value =
        e.currentTarget.innerText;
    };
  }
}

renderCommands();
renderPins();
