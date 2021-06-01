import React, { Fragment } from "react";
import "./App.css";

//components

import InputTodo from "F:/Kerja 21/FYP/task-assignment-system/web/src/components/InputTodo";
import ListTodos from "F:/Kerja 21/FYP/task-assignment-system/web/src/components/ListTodos";

function App() {
  return (
    <Fragment>
      <div className="container">
        <InputTodo />
        <ListTodos />
      </div>
    </Fragment>
  );
}

export default App;
