import React, { Fragment } from "react";
import uuid from 'uuid'
import "./App.css";

//components

import InputTodo from "./components/InputTodo";
import ListTodos from "./components/ListTodos";

function App() {
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-10 col-md-8 mx-auto mt-4">
          <InputTodo />
          <ListTodos />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
