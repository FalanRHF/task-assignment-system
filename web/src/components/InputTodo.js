import React, { Fragment, useState } from "react";

const InputTodo = () => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async e => {
    e.preventDefault();
    try {
      const body = { description };
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <div className="card card-body my-3">
        <h2 className="text-center mt-2">Assign Task</h2>
        <form onSubmit={onSubmitForm}>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text bg-info text-white">
                <i className="fas fa-book"></i>
              </div>
            </div>
            
              <input
              type="text"
              className="form-control"
              placeholder="Create new task"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required/>
          </div>

          <button className="btn btn-block mt-3 btn-success btn-info">Add</button>
        </form>
      </div>
    </Fragment>
  );
};

export default InputTodo;
