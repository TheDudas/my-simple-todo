// alert("connected");
$(document).ready(function () {
  //create Base URL variable
  const BASE_URL = "http://localhost:3000";

  /**API Request Functions */

  //get all tasks from DB
  const fetchTasks = async () => {
    //fetch data from the server using the fetch API
    const response = await fetch(`${BASE_URL}/tasks`);

    //convert the response to JSON
    const data = await response.json();
     console.log({ data });

    //return the data
    return data;
  };

  //get a task by its ID
  const fetchTask = async (id) => {
    //fetch data from the server using the fetch API
    const response = await fetch(`${BASE_URL}/tasks/${id}`);

    //convert the response to JSON
    const data = await response.json();
    // console.log({ data });

    //return the data
    return data;
  };

  //add a new task to the server
  const addTask = async (text) => {
    //fetch data from the server using the fetch API
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, completed: false }),
    });

    //convert the response to JSON
    const data = await response.json();
    console.log({ data });

    //return the data
    return data;
  };

  /**Other functions to handle CRUD requests */

  //create render function to retrieve data from the server and render it to the page
  const render = async () => {
    //fetch all tasks from the server
    const tasks = await fetchTasks();
    // console.log("tasks from render", { tasks });

    // Clear the current list
    $("#taskList").empty();

    // Loop through the task array and append each task to the list. Adds to INdex.HTML file and db.json
    tasks.forEach(function (task, index) {
      let taskItem = `<li class="list-group-item d-flex justify-content-between align-items-center">
                                  <span class="task-text ${
                                    task.completed ? "completed" : ""
                                  }">${task.text}</span>
                                  <div>
                                      <button class="btn btn-sm btn-secondary editTask" data-index="${
                                        task.id
                                      }">Edit</button>
                                      <button class="btn btn-sm btn-success toggleTask" data-index="${
                                        task.id
                                      }">${
        task.completed ? "Incomplete" : "Complete"
      }</button>
                                      <button class="btn btn-sm btn-danger deleteTask" data-index="${
                                        task.id
                                      }">Delete</button>
                                  </div>
                              </li>`;
      $("#taskList").append(taskItem);
    });
  };

  // Call the render function when the page loads
  render();

  //add event listener to the add task button
  $("#addTask").click(async (event) => {
    event.preventDefault();
    //get the value of the input field
    const text = $("#newTask").val();
    // console.log({ text });

    if (!text) {
      alert("Please enter a task");
      return;
    }

    //add the task to the server
    try {
      await addTask(text);
    } catch (error) {
      console.log(error);
    } finally {
      //clear the input field regardless of the outcome
      $("#newTask").val("");
    }

    //re-render the tasks by calling the render function
    render();
  });

  //add event listener to the delete button
  //Need to use event delegation since the delete button is dynamically created
  $(document).on("click", ".deleteTask", async function () {

    // Get the id of the task to be deleted
    const id = $(this).data("index");
    console.log("deleting", { id });

    // Delete the task from the server
    await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    // Re-render the tasks by calling the render function
    render();
  });

  //add event listener to the toggleTask button
  //Need to use event delegation since the toggleTask button is dynamically created
  $(document).on("click", ".toggleTask", async function () {
    // Get the id of the task to be deleted
    const id = $(this).data("index");
    // fetch the todo from the server
    const task = await fetchTask(id);
    // console.log("editing", { id, task });

    await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // toggle the task status to bo the opposite of what it currently is
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });

    // Re-render the todos by calling the render function
    render();
  });

  //add event listener to the editTask button
  //Need to use event delegation since the editTask button is dynamically created
  // $(document).on("click", ".editTask", async function () {
  //   // Get the id of the task to be deleted
  //   const id = $(this).data("index");
  //   // fetch the task from the server
  //   const task = await fetchTask(id);
  //   let taskTextElement = $(this).closest("li").find(".task-text");
  //   const newText = prompt("Edit your Task:", task.text);

  //   console.log("editing", { id, taskTextElement, newText });

  //   if (!newText) {
  //     return;
  //   }

  //   await fetch(`${BASE_URL}/tasks/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     // toggle the task status to bo the opposite of what it currently is
  //     body: JSON.stringify({ ...task, text: newText }),
  //   });

  //   // Re-render the tasks by calling the render function
  //   render();
  // });
});
