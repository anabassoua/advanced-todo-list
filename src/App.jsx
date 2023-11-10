import { useEffect, useReducer, useState } from "react";
import "./styles.css";
import { TodoItem } from "./TodoItem";

const ACTIONS = {
  ADD: "ADD",
  DELETE: "DELETE",
  TOGGLE: "TOGGLE",
};
function reducer(todos, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return [
        ...todos,
        {
          name: action.payload.name,
          completed: false,
          id: crypto.randomUUID(),
        },
      ];
  }
}
const LOCAL_KEY_VALUE = "TODOS";

function App() {
  const [newTodoName, setNewTodoName] = useState("");

  const [todos, dispatch] = useReducer(reducer, [], () => {
    const value = localStorage.getItem(LOCAL_KEY_VALUE);
    if (value === null) return [];

    return JSON.parse(value);
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_VALUE, JSON.stringify(todos));
  }, [todos]);

  function addNewTodo() {
    if (newTodoName === "") return;

    // setTodos((currentTodos) => {
    //   return [
    //     ...currentTodos,
    //     { name: newTodoName, completed: false, id: crypto.randomUUID() },
    //   ];
    // });
    //ok
    dispatch({ type: ACTIONS.ADD, payload: { name: newTodoName } });
    setNewTodoName("");
  }

  function toggleTodo(todoId, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === todoId) return { ...todo, completed };

        return todo;
      });
    });
  }

  function deleteTodo(todoId) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== todoId);
    });
  }

  return (
    <>
      <ul id="list">
        {todos.map((todo) => {
          return (
            <TodoItem
              key={todo.id}
              {...todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          );
        })}
      </ul>

      <div id="new-todo-form">
        <label htmlFor="todo-input">New Todo</label>
        <input
          type="text"
          id="todo-input"
          value={newTodoName}
          onChange={(e) => setNewTodoName(e.target.value)}
        />
        <button onClick={addNewTodo}>Add Todo</button>
      </div>
    </>
  );
}

export default App;
