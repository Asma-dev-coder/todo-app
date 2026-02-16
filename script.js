// ================== SELECT ELEMENTS ==================
const taskList = document.getElementById("taskList");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const dateInput = document.querySelector("input[type='date']");

// ================== GLOBAL VARIABLES ==================
let tasks = [];
let currentFilter = "all"; // all | completed | pending

// ================== LOCAL STORAGE ==================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}

// ================== ADD TASK ==================
function addTask() {
  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const dueDate = dateInput.value;

  if (!title || !dueDate) {
    alert("Please enter title and date");
    return;
  }

  const task = {
    id: Date.now(), // unique identifier
    text: title,
    category: category,
    date: dueDate,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  titleInput.value = "";
  dateInput.value = "";
}

// ================== TOGGLE TASK ==================
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// ================== DELETE TASK ==================
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ================== EDIT TASK ==================
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = prompt("Edit task title:", task.text);
  if (newTitle === null || newTitle.trim() === "") return;

  const newCategory = prompt("Edit category:", task.category);
  if (newCategory === null || newCategory.trim() === "") return;

  const newDate = prompt("Edit due date (YYYY-MM-DD):", task.date);
  if (newDate === null || newDate.trim() === "") return;

  task.text = newTitle.trim();
  task.category = newCategory.trim();
  task.date = newDate;

  saveTasks();
  renderTasks();
}

// ================== FILTER TASKS ==================
function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

// ================== RENDER TASKS ==================
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "<li>No tasks found</li>";
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <input type="checkbox"
        class="task-checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${task.id})"
      >
      <div class="task-content">
        <strong>${task.text}</strong>
        <span>${task.category} | Due: ${task.date}</span>
      </div>
      <button onclick="editTask(${task.id})" class="edit-btn">✎</button>
      <button onclick="deleteTask(${task.id})" class="delete-btn">×</button>
    `;

    taskList.appendChild(li);
  });
}

// ================== LOAD ON PAGE START ==================
loadTasks();
