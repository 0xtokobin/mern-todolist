import { useEffect, useState } from "react";

const api_base = "http://8.130.67.133:4001";
const SHOW_ALL = "all";
const SHOW_COMPLETED = "completed";
const SHOW_ACTIVE = "active";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState(SHOW_ALL);

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(api_base + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(api_base + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const addTodo = async () => {
    const data = await fetch(api_base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);

    setPopupActive(false);
    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    const data = await fetch(api_base + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data.result._id));
  };

  const handleFilterChange = (filter) => {
    setVisibilityFilter(filter);
  };

  const renderTodoList = () => {
    switch (visibilityFilter) {
      case SHOW_COMPLETED:
        return todos
          .filter((todo) => todo.complete)
          .map((todo) => renderTodoItem(todo));
      case SHOW_ACTIVE:
        return todos
          .filter((todo) => !todo.complete)
          .map((todo) => renderTodoItem(todo));
      default:
        return todos.map((todo) => renderTodoItem(todo));
    }
  };

  const renderTodoItem = (todo) => (
    <div
      className={"todo" + (todo.complete ? " is-complete" : "")}
      key={todo._id}
      onClick={() => completeTodo(todo._id)}
    >
      <div className="checkbox"></div>

      <div className="text">{todo.text}</div>

      <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
        x
      </div>
    </div>
  );

  return (
    <div className="App">
      <h1>TodoList</h1>
      <h4>任务列表</h4>

      <div className="todos">
        {renderTodoList().length > 0 ? renderTodoList() : <p>目前没有任务</p>}
      </div>

      <div className="footer">
        <span>内容展示: </span>
        <button onClick={() => handleFilterChange(SHOW_ALL)}>全部</button>
        <button onClick={() => handleFilterChange(SHOW_COMPLETED)}>
          已完成
        </button>
        <button onClick={() => handleFilterChange(SHOW_ACTIVE)}>未完成</button>
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>添加任务</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
