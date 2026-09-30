const defaultEvents = [
  {
    id: 101,
    name: "Java Programming Workshop",
    category: "Technical",
    date: "05 Oct 2026",
    time: "10:00 AM",
    venue: "Seminar Hall A",
    organizer: "CSE Department",
    capacity: 50
  },
  {
    id: 102,
    name: "Web Development Seminar",
    category: "Seminar",
    date: "08 Oct 2026",
    time: "11:00 AM",
    venue: "Seminar Hall B",
    organizer: "IT Department",
    capacity: 40
  }
];

let events = JSON.parse(localStorage.getItem("oems_events")) || defaultEvents;
let participants = JSON.parse(localStorage.getItem("oems_participants")) || [];

const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem("oems_events", JSON.stringify(events));
  localStorage.setItem("oems_participants", JSON.stringify(participants));
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function goTo(sectionId) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
  document.querySelectorAll(".nav-link").forEach(b => b.classList.remove("active"));
  $(sectionId).classList.add("active-section");
  document.querySelector(`.nav-link[data-section="${sectionId}"]`)?.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
  if (sectionId === "events") renderEvents();
  if (sectionId === "dashboard") renderDashboard();
  if (sectionId === "participants") renderParticipants();
}

document.querySelectorAll(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => goTo(btn.dataset.section));
});

document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => goTo(btn.dataset.go));
});

$("menuBtn").addEventListener("click", () => $("navbar").classList.toggle("open"));

function renderEvents() {
  const filter = $("categoryFilter").value;
  const grid = $("eventGrid");
  const filtered = events.filter(e => filter === "All" || e.category === filter);

  grid.innerHTML = filtered.map(event => {
    const full = event.registered >= event.capacity;
    return `
      <article class="event-card">
        <div class="event-top">
          <span class="event-id">EVENT ID: ${event.id}</span>
          <span class="status ${full ? "full-status" : ""}">${full ? "REGISTRATION FULL" : "REGISTRATION OPEN"}</span>
        </div>
        <h3>${event.name}</h3>
        <div class="event-details">
          <div>📅 ${event.date}</div>
          <div>⏰ ${event.time}</div>
          <div>📍 ${event.venue}</div>
          <div>🏫 ${event.organizer}</div>
        </div>
        <div class="event-footer">
          <span><b>${event.registered || 0}</b> / ${event.capacity} registered</span>
          <button class="primary-btn" ${full ? "disabled" : ""} onclick="selectEvent(${event.id})">${full ? "Full" : "Register"}</button>
        </div>
      </article>
    `;
  }).join("");
}

function selectEvent(id) {
  $("eventSelect").value = String(id);
  goTo("register");
}

function populateEventSelect() {
  $("eventSelect").innerHTML = events.map(e => {
    const full = e.registered >= e.capacity;
    return `<option value="${e.id}" ${full ? "disabled" : ""}>${e.name} — ${full ? "Full" : `${e.capacity - (e.registered || 0)} seats left`}</option>`;
  }).join("");
}

$("registrationForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const eventId = Number($("eventSelect").value);
  const event = events.find(x => x.id === eventId);

  if (!event) {
    showToast("Please select an event.");
    return;
  }

  if ((event.registered || 0) >= event.capacity) {
    showToast("Event registration is full!");
    return;
  }

  const registration = {
    id: "REG" + String(Date.now()).slice(-6),
    studentName: $("studentName").value.trim(),
    rollNo: $("rollNo").value.trim(),
    department: $("department").value,
    email: $("email").value.trim(),
    phone: $("phone").value.trim(),
    eventId: event.id,
    eventName: event.name
  };

  participants.push(registration);
  event.registered = (event.registered || 0) + 1;
  save();

  alert(
    "Registration Successful!\n\n" +
    "Registration ID: " + registration.id + "\n" +
    "Student: " + registration.studentName + "\n" +
    "Event: " + event.name
  );

  e.target.reset();
  populateEventSelect();
  updateStats();
  renderEvents();
  renderDashboard();
  renderParticipants();
});

function cancelRegistration(id) {
  const participant = participants.find(p => p.id === id);
  if (!participant) return;

  const event = events.find(e => e.id === participant.eventId);
  if (event && event.registered > 0) event.registered--;

  participants = participants.filter(p => p.id !== id);
  save();

  showToast("Registration cancelled successfully.");
  updateStats();
  renderEvents();
  renderDashboard();
  renderParticipants();
}

function renderDashboard() {
  $("eventTableBody").innerHTML = events.map(event => {
    const full = (event.registered || 0) >= event.capacity;
    return `
      <tr>
        <td>${event.id}</td>
        <td><b>${event.name}</b></td>
        <td>${event.category}</td>
        <td>${event.organizer}</td>
        <td>${event.registered || 0}</td>
        <td>${event.capacity}</td>
        <td><span class="pill ${full ? "full-pill" : ""}">${full ? "FULL" : "OPEN"}</span></td>
      </tr>
    `;
  }).join("");
}

function renderParticipants() {
  const body = $("participantsBody");
  $("emptyParticipants").style.display = participants.length ? "none" : "block";

  body.innerHTML = participants.map(p => `
    <tr>
      <td><b>${p.id}</b></td>
      <td>${p.studentName}</td>
      <td>${p.rollNo}</td>
      <td>${p.department}</td>
      <td>${p.email}</td>
      <td>${p.eventName}</td>
      <td><button class="delete-btn" onclick="cancelRegistration('${p.id}')">Cancel</button></td>
    </tr>
  `).join("");
}

function updateStats() {
  const total = participants.length;
  const open = events.filter(e => (e.registered || 0) < e.capacity).length;
  const capacity = events.reduce((sum,e) => sum + e.capacity, 0);

  $("statEvents").textContent = events.length;
  $("statOpen").textContent = open;
  $("statParticipants").textContent = total;
  $("heroEventCount").textContent = events.length;
  $("heroRegistrationCount").textContent = total;

  $("dashEvents").textContent = events.length;
  $("dashRegs").textContent = total;
  $("dashOpen").textContent = open;
  $("dashCapacity").textContent = capacity;
}

$("categoryFilter").addEventListener("change", renderEvents);

$("resetDemo").addEventListener("click", () => {
  if (!confirm("Reset all demo registrations and restore the original events?")) return;
  events = JSON.parse(JSON.stringify(defaultEvents));
  participants = [];
  save();
  populateEventSelect();
  updateStats();
  renderEvents();
  renderDashboard();
  renderParticipants();
  showToast("Demo data has been reset.");
});

function init() {
  events.forEach(e => { if (typeof e.registered !== "number") e.registered = 0; });
  populateEventSelect();
  updateStats();
  renderEvents();
  renderDashboard();
  renderParticipants();
}
init();
