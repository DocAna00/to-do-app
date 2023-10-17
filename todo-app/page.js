/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { createRunTodoApp } from './view.js';

import {
  getTodoListApi,
  createTodoItemApi,
  switchTodoItemDoneApi,
  deleteTodoItemApi,
} from './api.js';

import {
  getTodoListLS,
  createTodoItemLS,
  switchTodoItemDoneLS,
  deleteTodoItemLS,
} from './localStorage.js';

export async function runTodoApp(owner, title) {
  const btnTransition = document.getElementById('btn-transition');
  const api = JSON.parse(localStorage.getItem(title));
  if (!api) {
    localStorage.setItem(title, JSON.stringify('local'));
  }
  btnTransition.textContent = api === 'server'
    ? 'Перейти на локальное хранилище'
    : 'Перейти на серверное хранилище';
  const todoItemList = api === 'server' ? await getTodoListApi(owner) : await getTodoListLS(owner);
  const options = {
    title,
    owner,
    todoItemList,
    onCreateFormSubmit:
      api === 'server' ? createTodoItemApi : createTodoItemLS,
    onDoneClick:
      api === 'server' ? switchTodoItemDoneApi : switchTodoItemDoneLS,
    onDeleteClick: api === 'server' ? deleteTodoItemApi : deleteTodoItemLS,
  };
  const container = document.getElementById('todo-app');
  createRunTodoApp(container, options);
  const transition = document.getElementById('transition');
  const clickFunction = () => {
    transition.removeEventListener('click', clickFunction);
    container.innerHTML = '';
    if (api === 'local') {
      localStorage.setItem(title, JSON.stringify('server'));
      runTodoApp(owner, title);
    } else {
      localStorage.setItem(title, JSON.stringify('local'));
      runTodoApp(owner, title);
    }
  };
  transition.addEventListener('click', clickFunction);
}
