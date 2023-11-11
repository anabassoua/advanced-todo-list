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
    case ACTIONS.DELETE:
      return todos.filter((todo) => todo.id !== action.payload.todoId);
    case ACTIONS.TOGGLE:
      return todos.map((todo) => {
        if (todo.id === action.payload.todoId)
          return { ...todo, completed: action.payload.completed };

        return todo;
      });

    default:
      throw new Error("error");
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

    dispatch({ type: ACTIONS.ADD, payload: { name: newTodoName } });
    setNewTodoName("");
  }

  function toggleTodo(todoId, completed) {
    dispatch({ type: ACTIONS.TOGGLE, payload: { todoId, completed } });
  }

  function deleteTodo(todoId) {
    dispatch({ type: ACTIONS.DELETE, payload: { todoId } });
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
