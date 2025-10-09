const dateElement = document.getElementById('date');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const todoList = document.getElementById('todo-list');
const emptyState = document.querySelector('.empty-state');
const itemsLeftSpan = document.getElementById('items-left');
const clearCompletedButton = document.getElementById('clear-completed');
const filterElements = document.querySelectorAll('.filter');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function updateDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
    });

    if (filteredTodos.length === 0 && todos.length > 0) {
        // Only show empty state if NO tasks exist, not just if the current filter is empty
        emptyState.classList.add('hidden');
    } else if (todos.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filteredTodos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        if (todo.completed) {
            listItem.classList.add('completed');
        }
        listItem.dataset.id = todo.id;

        listItem.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <span class="todo-item-text">${todo.text}</span>
            <button class="delete-btn"><i class="fas fa-times"></i></button>
        `;

        const checkbox = listItem.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', toggleComplete);

        const deleteButton = listItem.querySelector('.delete-btn');
        deleteButton.addEventListener('click', deleteTask);

        todoList.appendChild(listItem);
    });

    updateItemsLeft();
}

function updateItemsLeft() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    itemsLeftSpan.textContent = `${activeTasks} items left`;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTodo = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    todos.push(newTodo);
    saveTodos();
    taskInput.value = '';
    renderTodos();
}

function deleteTask(e) {
    const listItem = e.target.closest('.todo-item');
    const taskId = Number(listItem.dataset.id);
    todos = todos.filter(todo => todo.id !== taskId);
    saveTodos();
    renderTodos();
}

function toggleComplete(e) {
    const listItem = e.target.closest('.todo-item');
    const taskId = Number(listItem.dataset.id);
    const todo = todos.find(t => t.id === taskId);

    if (todo) {
        todo.completed = e.target.checked;
        saveTodos();
        renderTodos();
    }
}

function setFilter(e) {
    const newFilter = e.target.dataset.filter;
    if (currentFilter === newFilter) return;

    currentFilter = newFilter;

    filterElements.forEach(filterEl => {
        filterEl.classList.remove('active');
    });

    e.target.classList.add('active');
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
}

function initializeApp() {
    updateDate();
    renderTodos();

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    clearCompletedButton.addEventListener('click', clearCompleted);

    filterElements.forEach(filterEl => {
        filterEl.addEventListener('click', setFilter);
    });
}

initializeApp();
