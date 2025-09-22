// API Configuration
const API_BASE =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT";

// Application State
const state = {
  parties: [],
  selectedParty: null,
};

// API Functions
async function fetchParties() {
  try {
    const response = await fetch(`${API_BASE}/events`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Failed to fetch parties");
    }

    return data.data;
  } catch (error) {
    throw new Error(`Error fetching parties: ${error.message}`);
  }
}

async function fetchPartyById(id) {
  try {
    const response = await fetch(`${API_BASE}/events/${id}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Failed to fetch party details");
    }

    return data.data;
  } catch (error) {
    throw new Error(`Error fetching party details: ${error.message}`);
  }
}

// State Management Functions
function updateState(newState) {
  Object.assign(state, newState);
  render();
}

async function loadParties() {
  try {
    const parties = await fetchParties();
    updateState({ parties, selectedParty: null });
  } catch (error) {
    console.error(error);
  }
}

async function selectParty(id) {
  try {
    const party = await fetchPartyById(id);
    updateState({ selectedParty: party });
  } catch (error) {
    console.error(error);
  }
}

// Component Functions
function createPartyList() {
  const ul = document.createElement("ul");

  state.parties.forEach((party) => {
    const li = document.createElement("li");
    li.textContent = party.name;
    li.addEventListener("click", () => selectParty(party.id));
    ul.appendChild(li);
  });

  return ul;
}

function createPartyDetails() {
  const div = document.createElement("div");

  if (!state.selectedParty) {
    div.textContent = "Please select a party to view details";
    return div;
  }

  const party = state.selectedParty;

  const nameEl = document.createElement("h2");
  nameEl.textContent = party.name;
  div.appendChild(nameEl);

  const idEl = document.createElement("p");
  idEl.textContent = `ID: ${party.id}`;
  div.appendChild(idEl);

  const dateEl = document.createElement("p");
  dateEl.textContent = `Date: ${party.date}`;
  div.appendChild(dateEl);

  const descEl = document.createElement("p");
  descEl.textContent = `Description: ${party.description}`;
  div.appendChild(descEl);

  const locEl = document.createElement("p");
  locEl.textContent = `Location: ${party.location}`;
  div.appendChild(locEl);

  return div;
}

// Render Function
function render() {
  document.body.innerHTML = "";

  const container = document.createElement("div");

  const title = document.createElement("h1");
  title.textContent = "Party Planner";
  container.appendChild(title);

  const partyList = createPartyList();
  container.appendChild(partyList);

  const partyDetails = createPartyDetails();
  container.appendChild(partyDetails);

  document.body.appendChild(container);
}

// Initialize Application
async function init() {
  try {
    await loadParties();
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

// Start the application
init();
