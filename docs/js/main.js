const root = document.getElementById("root");

const state = {
  prev: null,
  target: null,
  pins: [],
  commands: window.localStorage.getItem("myCommands")
    ? new Set(window.localStorage.getItem("myCommands").split("|"))
    : new Set(),
};

function update() {
  let commandsContainer = document.getElementById("commands-container");
  commandsContainer.innerHTML =
    "<div class='header-container'><h4>Commands</h4><button class='sm' onClick='clearCommands()'>Clear</button></div>";
  for (let c of state.commands) {
    let p = document.createElement("p");
    p.innerText = c;
    commandsContainer.appendChild(p);
  }
}

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

function expandTarget() {
  let input = document.getElementById("expand-target-input").value;
  let replaceShorthands = input
    .replaceAll("[nv=", "[node-value=")
    .replaceAll("[nn=", "[node-name=");
  let splitSelectors = replaceShorthands
    .replaceAll(" ", "")
    .split(">")
    .map((e) => e.split(","));

  while (splitSelectors.length > 0) {
    let elms = [...document.querySelectorAll(splitSelectors.join(">"))];
    for (let e of elms) {
      e.classList.remove("hide");
    }
    splitSelectors.pop();
  }
}

function clearCommands() {
  state.commands = new Set();
  window.localStorage.removeItem("myCommands");
  update();
}

function changeToFocus() {
  let findParentBtn;
  let findNextBtn;
  let createPinBtn;

  findParentBtn = document.querySelector("#find-parent");
  findNextBtn = document.querySelector("#find-next");
  createPinBtn = document.querySelector("#create-pin");

  if (findParentBtn) {
    state.prev.removeChild(findParentBtn);
    state.prev.removeChild(findNextBtn);
    state.prev.removeChild(createPinBtn);
  } else {
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
  }
  findParentBtn.onclick = handleFindParentClick;
  findNextBtn.onclick = handleFindNextClick;

  state.target.children[1].insertAdjacentElement("afterend", createPinBtn);
  state.target.children[1].insertAdjacentElement("afterend", findNextBtn);
  state.target.children[1].insertAdjacentElement("afterend", findParentBtn);
}

function handleXMLClick(e) {
  console.log(e.target.parentElement);
  e.stopPropagation();
  state.prev = state.target;
  if (state.prev) {
    state.prev.classList.toggle("focus");
  }
  state.target = e.currentTarget;
  state.target.classList.toggle("focus");
  changeToFocus();
}

function handleChevronClick(e) {
  e.stopPropagation();
  let parent = e.currentTarget.parentElement;
  parent.classList.toggle("hide");
}

// Focus Button Handlers

function handleFindParentClick(e) {
  e.stopPropagation();
  state.prev = state.target;
  if (state.prev) {
    state.prev.classList.toggle("focus");
  }
  state.target = e.currentTarget.parentElement.parentElement;
  state.target.scrollIntoView();
  state.target.classList.toggle("focus");
  changeToFocus();
}

function handleFindNextClick(e) {
  e.stopPropagation();
  let xmlElement = e.target.parentElement;
  let parent = xmlElement.parentElement;
  let children = [...parent.children];
  let found = false;

  for (let c of children) {
    if (found) {
      state.prev = state.target;
      state.prev.classList.toggle("focus");
      state.target = c;
      state.target.classList.toggle("focus");
      changeToFocus();
    }
    found = c === xmlElement;
  }
}

function handleCreatePinClick(e) {
  e.stopPropagation();
}

// Render Helper window
const xmlStats = (() => {
  const statsElm = document.createElement("div");
  statsElm.classList.add(["stats"]);
  root.appendChild(statsElm);

  return statsElm;
})();

update();