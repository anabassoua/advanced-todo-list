import { useEffect, useReducer, createContext, useState } from "react";
import "./styles.css";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";
import { TodoFilterForm } from "./TodoFilterForm";

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

export const TodoContext = createContext();

function App() {
  const [filterName, setFilterName] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [todos, dispatch] = useReducer(reducer, [], () => {
    const value = localStorage.getItem(LOCAL_KEY_VALUE);
    if (value === null) return [];

    return JSON.parse(value);
  });

  const filteredTodos = todos.filter((todo) => {
    if (hideCompleted && todo.completed) return false;
    return todo.name.includes(filterName);
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_VALUE, JSON.stringify(todos));
  }, [todos]);

  function addNewTodo(name) {
    dispatch({ type: ACTIONS.ADD, payload: { name } });
  }

  function toggleTodo(todoId, completed) {
    dispatch({ type: ACTIONS.TOGGLE, payload: { todoId, completed } });
  }

  function deleteTodo(todoId) {
    dispatch({ type: ACTIONS.DELETE, payload: { todoId } });
  }

  return (
    <TodoContext.Provider
      value={{ todos: filteredTodos, toggleTodo, deleteTodo, addNewTodo }}
    >
      <TodoFilterForm
        name={filterName}
        setName={setFilterName}
        hideCompleted={hideCompleted}
        setHideCompleted={setHideCompleted}
      />
      <TodoList />
      <TodoForm />
    </TodoContext.Provider>
  );
}

export default App;
