let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'All';
let editIndex = -1;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function addTask() {
  const text = document.getElementById('taskInput').value.trim();
  const priority = document.getElementById('priorityInput').value;
  const date = document.getElementById('dateInput').value;
  if (!text) { alert('Please enter a task'); return; }

  if (editIndex === -1) {
    tasks.push({ text, priority, date, completed: false });
  } else {
    tasks[editIndex] = { ...tasks[editIndex], text, priority, date };
    editIndex = -1;
    document.getElementById('addBtn').innerText = 'Add Task';
  }
  document.getElementById('taskInput').value = '';
  saveTasks();
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  let filtered = tasks.filter(t => {
    if (currentFilter === 'All') return true;
    if (currentFilter === 'Completed') return t.completed;
    return t.priority === currentFilter;
  });

  document.getElementById('taskCount').innerText = `Total: ${tasks.length} | Completed: ${tasks.filter(t => t.completed).length}`;

  filtered.forEach((task, index) => {
    const realIndex = tasks.indexOf(task);
    const li = document.createElement('li');
    li.className = task.priority + (task.completed ? ' completed' : '');
    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${realIndex})">
        <span>${task.text}</span><br>
        <span class="badge">${task.priority}</span> <small>${task.date || ''}</small>
      </div>
      <div>
        <button onclick="editTask(${realIndex})">✏️</button>
        <button onclick="deleteTask(${realIndex})">🗑️</button>
      </div>`;
    list.appendChild(li);
  });
}

function toggleTask(i) { tasks[i].completed = !tasks[i].completed; saveTasks(); }
function deleteTask(i) { if(confirm('Delete this task?')) { tasks.splice(i, 1); saveTasks(); } }
function editTask(i) {
  document.getElementById('taskInput').value = tasks[i].text;
  document.getElementById('priorityInput').value = tasks[i].priority;
  document.getElementById('dateInput').value = tasks[i].date;
  editIndex = i;
  document.getElementById('addBtn').innerText = 'Update Task';
}
function filterTasks(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  renderTasks();
}
function clearCompleted() { tasks = tasks.filter(t => !t.completed); saveTasks(); }
renderTasks();
