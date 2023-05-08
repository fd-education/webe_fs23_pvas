const todoTitle = document.getElementById('todo-title');
const todoDesc = document.getElementById('todo-desc');
const todoAssignee = document.getElementById('todo-assignee');

const DB_VERSION = 1;
const DB_NAME = 'todoDb';
const request = window.indexedDB.open(DB_NAME, DB_VERSION)
let db;

function handleConnectionError(errorEvent){
    console.error(errorEvent);
}

function handleConnectionSuccess(successEvent){
    db = successEvent.target.result;
    console.log('Connection successful');
}

request.onerror = handleConnectionError;
request.onsuccess = handleConnectionSuccess;
request.onupgradeneeded = (event) => {
    console.log('Upgrading database');
    const db = event.target.result;
    const objectStore= db.createObjectStore('todos', {keyPath: 'id', autoIncrement: true});

    objectStore.createIndex('title', 'title', {unique: false});
    objectStore.createIndex('assignee', 'assignee', {unique: false});
}

class Todo{
    constructor(title, description, assignee){
        this.title = title
        this.description = description;
        this.assignee = assignee
        this.done = false;

    }

    print(){
        console.log(`${this.assignee} | ${this.title}: ${this.description} | ${this.done}`);
    }
}

function submitTodo(){
    if(todoTitle.value === '' || todoDesc.value === '' || todoAssignee.value === '') return;

    const todo = new Todo(todoTitle.value, todoDesc.value, todoAssignee.value);
    todo.print();

    const transaction = db.transaction(['todos'], 'readwrite');

    transaction.oncomplete = () => {
        console.log('Todo added successfully');
    }

    transaction.onerror = () => {
        console.error('Error adding todo');
    }

    const objectStore = transaction.objectStore('todos');
    objectStore.add(todo);

    updateTodos();
}

function updateTodos(){
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.getAll();

    request.onerror = () => {
        console.error('Error updating todos');
    }

    request.onsuccess = event => {
        console.log('Todos updated');
        console.log('Todos: ', event.target.result);

        const todos = event.target.result;

        displayTodos(todos);
    }

}

function displayTodos(todos){
    if(todos.length === 0) return;

    document.getElementById('todo-list').innerHTML = '';

    for(let todo of todos){
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        todoDiv.id = todo.id;

        const todoTitle = document.createElement('h3');
        todoTitle.innerText = todo.title;

        const todoDesc = document.createElement('p');
        todoDesc.innerText = todo.description;

        const todoAssignee = document.createElement('p');
        todoAssignee.innerText = todo.assignee;

        const todoDone = document.createElement('input');
        todoDone.type = 'checkbox';
        todoDone.checked = todo.done;

        const todoDelete = document.createElement('button');
        todoDelete.innerText = 'Delete';
        todoDelete.onclick = () => {
            deleteTodoById(todo.id);
        }

        todoDiv.appendChild(todoTitle);
        todoDiv.appendChild(todoDesc);
        todoDiv.appendChild(todoAssignee);
        todoDiv.appendChild(todoDone);
        todoDiv.appendChild(todoDelete);

        document.getElementById('todo-list').appendChild(todoDiv);
    }
}

function deleteTodoById(id){
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');

    const request = objectStore.delete(id);

    request.onerror = () => {
        console.error('Error deleting todo');
    }

    request.onsuccess = () => {
        console.log('Todo deleted');
        document.getElementById(id).remove();
    }
}