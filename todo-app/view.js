/* eslint-disable import/prefer-default-export */
// создаем и возвращаем заголовок приложения
function createAppTitle(title) {
  const appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
}

// создаем и возвращаем форму для создания дела
function createTodoItemForm() {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const buttonWrapper = document.createElement('div');
  const button = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';

  button.disabled = true;
  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  input.addEventListener('input', () => {
    if (input.value !== '') {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  });

  return {
    form,
    input,
    button,
  };
}

// создаем и возвращаем список элементов
function createTodoList() {
  const list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = 'list-group-item-success';

  const item = document.createElement('li');
  // кнопки помещаем в элемент, который красиво покажет их в одной группе
  const buttonGroup = document.createElement('div');
  const doneButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  // устанавливаем стили для элемента списка, а также для размещения кнопок
  // в его правой части с помощью flex
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  if (todoItem.done) {
    item.classList.add(doneClass);
  }
  item.textContent = todoItem.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  // добавляем обработчики на кнопки
  doneButton.addEventListener('click', () => {
    onDone({ todoItem, element: item });
    item.classList.toggle(doneClass, todoItem.done);
  });
  deleteButton.addEventListener('click', () => {
    onDelete({ todoItem, element: item });
  });

  // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  return item;
}

async function createRunTodoApp(container, {
  title,
  owner,
  todoItemList = [],
  onCreateFormSubmit,
  onDoneClick,
  onDeleteClick,
}) {
  const runTodoAppTitle = createAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();
  const handlers = { onDone: onDoneClick, onDelete: onDeleteClick };

  container.append(runTodoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach((todoItem) => {
    const todoItemElement = createTodoItemElement(todoItem, handlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, handlers);

    todoList.append(todoItemElement);

    todoItemForm.input.value = '';
  });
}

export { createRunTodoApp };
