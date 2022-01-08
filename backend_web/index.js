const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a task

app.post("/postnewtask", async (req, res) => {
    try {
      const { title, description, assignTo, duedate, filePath } = req.body;
      const newTask = await pool.query(
        "INSERT INTO task (ta_title,ta_description,ta_assignto,ta_duedate,ta_fileurl) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [title, description, assignTo, duedate, filePath]
      );
  
      res.json(newTask.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });

 //get all tasks

app.get("/tasks", async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

 //get a task

app.get("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
        id
        ]);

        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

 //update a task

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query(
        "UPDATE todo SET description = $1 WHERE todo_id = $2",
        [description, id]
        );

        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
    });

 //delete a task

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
        id
        ]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log("server has started on port 5000");
});
