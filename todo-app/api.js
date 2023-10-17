/* eslint-disable no-restricted-globals */
/* eslint-disable no-return-await */
const SERVER_URL = 'http://localhost:3000/api/todos';

export async function getTodoListApi(owner) {
  const response = await fetch(
    `${SERVER_URL}?owner=${owner}`,
  );
  return await response.json();
}

export async function createTodoItemApi({ owner, name }) {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    body: JSON.stringify({
      name,
      owner,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export function switchTodoItemDoneApi({ todoItem }) {
  todoItem.done = !todoItem.done;
  fetch(`${SERVER_URL}/${todoItem.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: todoItem.done }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function deleteTodoItemApi({ element, todoItem }) {
  if (!confirm('Вы уверены?')) {
    return;
  }
  element.remove();
  fetch(`${SERVER_URL}/${todoItem.id}`, {
    method: 'DELETE',
  });
}
