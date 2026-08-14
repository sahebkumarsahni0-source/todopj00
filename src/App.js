import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  const inputRef = useRef(null);

  // Load tasks
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add / Update Task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (task.trim() === "") {
      console.log("Please enter a task");
      return;
    }

    // Update Task
    if (editingId !== null) {
      setTasks(
        tasks.map((item) =>
          item.id === editingId
            ? { ...item, text: task }
            : item
        )
      );

      console.log("Edit Successfully");

      setEditingId(null);
      setTask("");

      inputRef.current.focus();

      return;
    }

    // Add Task
    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    console.log("Add Task Successfully");

    setTask("");

    inputRef.current.focus();
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));

    console.log("Delete Successfully");
  };

  // Complete / Incomplete
  const toggleTask = (id) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: !item.completed,
            }
          : item
      )
    );

    console.log("Complete Successfully");
  };

  // Edit Task
  const editTask = (item) => {
    setTask(item.text);
    setEditingId(item.id);

    inputRef.current.focus();

    console.log("Edit Task");
  };

  // Filter
  const filteredTasks = tasks.filter((item) => {
    if (filter === "completed") {
      return item.completed;
    }

    if (filter === "incomplete") {
      return !item.completed;
    }

    return true;
  });

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">

          <h2 className="text-center mb-4">
            Todo List
          </h2>

          {/* Add Task Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">

              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder="Enter a new task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingId !== null ? "Update" : "Add Task"}
              </button>

            </div>
          </form>

          {/* Filters */}
          <div className="d-flex justify-content-center gap-2 mb-4">

            <button
              className={`btn ${
                filter === "all"
                  ? "btn-dark"
                  : "btn-outline-dark"
              }`}
              onClick={() => {
                setFilter("all");
                console.log("All Filter");
              }}
            >
              All
            </button>

            <button
              className={`btn ${
                filter === "completed"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => {
                setFilter("completed");
                console.log("Completed Filter");
              }}
            >
              Completed
            </button>

            <button
              className={`btn ${
                filter === "incomplete"
                  ? "btn-warning"
                  : "btn-outline-warning"
              }`}
              onClick={() => {
                setFilter("incomplete");
                console.log("Incomplete Filter");
              }}
            >
              Incomplete
            </button>

          </div>

          {/* Todo List */}
          {filteredTasks.length === 0 ? (
            <p className="text-center text-muted">
              No tasks found
            </p>
          ) : (
            filteredTasks.map((item) => (
              <div
                key={item.id}
                className="card mb-2"
              >
                <div className="card-body d-flex justify-content-between align-items-center">

                  <span
                    className={
                      item.completed
                        ? "text-decoration-line-through text-muted"
                        : ""
                    }
                  >
                    {item.text}
                  </span>

                  <div className="d-flex gap-1">

                    {/* Complete */}
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => toggleTask(item.id)}
                    >
                      {item.completed
                        ? "Incomplete"
                        : "Complete"}
                    </button>

                    {/* Edit */}
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => editTask(item)}
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTask(item.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export default App;