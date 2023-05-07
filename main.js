window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('allTodos')) || []; // Display the saved tasks and username on page load

    // Elements of the two main input sources of the application
    const username = document.querySelector('#name');
    const todoForm = document.querySelector('#new-todo-form');
    
    // save and get input data from the local storage
    // username field
    username.value = localStorage.getItem('username');
    
    username.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value)
    })

    // form inputs
    todoForm.addEventListener('submit', e => {
        e.preventDefault();
        const todo = {
            content: e.target.elements.content.value,  // in the target(form), specify which element by name
            type: e.target.elements.types.value,
            completed: false, 
            id: new Date().getTime()
        }
        todos.push(todo);
        localStorage.setItem('allTodos', JSON.stringify(todos))

        e.target.reset()

        displayTodos()
    })

    displayTodos()

})

function displayTodos() {
    const todoListParent = document.querySelector('#todo-list');

    todoListParent.innerHTML = '';

    todos.forEach(todo => {

        // Create elements to host each todo item
        const itemContainer = document.createElement('div');
        const label = document.createElement('label');
        const checkInput = document.createElement('input');
        const span = document.createElement('span');
        const contentContainer = document.createElement('div');
        const content = document.createElement('input');
        const actions = document.createElement('div');
        const editBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');

        // Add element's attributes and properties
        itemContainer.classList.add('todo-item');
        checkInput.type = 'checkbox';
        checkInput.checked = todo.completed;

        span.classList.add('bubble')
        if (todo.type === 'priority'){
            span.classList.add('priority')
        } else {
            span.classList.add('normal')
        }

        contentContainer.classList.add('todo-content')
        content.type = 'text';
        content.value = `${todo.content}`;
        content.readOnly = true;
        editBtn.classList.add('editBtn');
        editBtn.innerHTML = 'edit';
        deleteBtn.classList.add('deleteBtn');
        deleteBtn.textContent = 'delete';

        // Append elements to the DOM
        label.appendChild(checkInput);
        label.appendChild(span);
        contentContainer.appendChild(content);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        itemContainer.appendChild(label);
        itemContainer.appendChild(contentContainer);
        itemContainer.appendChild(actions);

        todoListParent.appendChild(itemContainer); 

        // Apply 'completed' class to tasks that have the checkbox marked 
        if (todo.completed){
            itemContainer.classList.add('completed');
        }

        checkInput.addEventListener('click', e => {
            todo.completed = e.target.checked;
            localStorage.setItem('allTodos', JSON.stringify(todos))

            if (todo.completed){
                itemContainer.classList.add('completed')
            } else {
                itemContainer.classList.remove('completed')
            }

            displayTodos()
        })

        // Enable task editing by applying focus() only on Edit button click, save changes onBlur()
        editBtn.addEventListener('click', e => {
            content.removeAttribute('readonly');
            content.focus();
            content.addEventListener('blur', e => {
                content.setAttribute('readonly', true);
                todo.content = e.target.value;
                localStorage.setItem('allTodos', JSON.stringify(todos));

                displayTodos()
            })

        })

        // Delete task and update on the local storage
        deleteBtn.addEventListener('click', e => {
            todos = todos.filter(otherTodo => otherTodo != todo)
            localStorage.setItem('allTodos', JSON.stringify(todos));
            displayTodos()
        })
    })
}