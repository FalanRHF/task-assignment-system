import React, { Fragment, useEffect, useState } from "react";

import EditTodo from "./EditTodo";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);

  //delete todo function

  const deleteTodo = async id => {
    try {
      const deleteTodo = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE"
      });

      setTodos(todos.filter(todo => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      const jsonData = await response.json();

      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  console.log(todos);

  return (
    <Fragment>
      {" "}
      <div className="card card-body my-3">
        <h2 className="text-center mt-2">Task lists</h2>
        <ul className="list-group my-1">
        {todos.map(todo => (
          <div key={todo.todo_id}>
            <li className="list-group-item list-group-item:hover{ z-index: auto; } d-flex justify-content-between my-2">
            <h6 className="mt-1 mb-0 align-middle">{todo.description}</h6>
              <div className="todo-icon">
                <span>
                  <EditTodo todo={todo} />
                </span>
                  <span
                    className="mx-2 text-danger"
                    onClick={() => deleteTodo(todo.todo_id)}
                  >
                    <i className="fas fa-trash" />
                  </span>
                </div>
            </li>
          </div>
        ))}
        </ul>
      </div>
    </Fragment>
  );
};
export default ListTodos;
