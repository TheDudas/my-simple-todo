// alert("connected");
$(document).ready(function () {
  //create Base URL variable
  const BASE_URL = "http://localhost:3000";

  /**API Request Functions */

  //create a function to get all todos from the server
  const fetchTodos = async () => {
    //fetch data from the server using the fetch API
    const response = await fetch(`${BASE_URL}/todos`);

    //convert the response to JSON
    const data = await response.json();
    // console.log({ data });

    //return the data
    return data;
  };

  //create a function to add a new todo to the server
  const fetchTodo = async (id) => {
    //fetch data from the server using the fetch API
    const response = await fetch(`${BASE_URL}/todos/${id}`);

    //convert the response to JSON
    const data = await response.json();
    // console.log({ data });

    //return the data
    return data;
  };

  //create a function to add a new todo to the server
  const addTodo = async (text) => {
    //fetch data from the server using the fetch API
    const response = await fetch(`${BASE_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, completed: false }),
    });

    //convert the response to JSON
    const data = await response.json();
    // console.log({ data });

    //return the data
    return data;
  };

  /**Other functions to handle CRUD requests */

  //create render function to retrieve data from the server and render it to the page
  const render = async () => {
    //fetch all todos from the server
    const todos = await fetchTodos();
    // console.log("todos from render", { todos });

    // Clear the current list
    $("#todoList").empty();

    // Loop through the todos array and append each todo to the list
    todos.forEach(function (todo, index) {
      let todoItem = `<li class="list-group-item d-flex justify-content-between align-items-center">
                                  <span class="todo-text ${
                                    todo.completed ? "completed" : ""
                                  }">${todo.text}</span>
                                  <div>
                                      <button class="btn btn-sm btn-secondary editTodo" data-index="${
                                        todo.id
                                      }">Edit</button>
                                      <button class="btn btn-sm btn-success toggleTodo" data-index="${
                                        todo.id
                                      }">${
        todo.completed ? "Incomplete" : "Complete"
      }</button>
                                      <button class="btn btn-sm btn-danger deleteTodo" data-index="${
                                        todo.id
                                      }">Delete</button>
                                  </div>
                              </li>`;
      $("#todoList").append(todoItem);
    });
  };

  // Call the render function when the page loads
  render();

  //add event listener to the add todo form
  $("#addTodo").click(async () => {
    //get the value of the input field
    const text = $("#newTodo").val();
    console.log({ text });

    //add the todo to the server
    try {
      await addTodo(text);
    } catch (error) {
      console.log(error);
    } finally {
      //clear the input field regardless of the outcome
      $("#newTodo").val("");
    }

    //re-render the todos by calling the render function
    render();
  });

  //add event listener to the delete button
  //Need to use event delegation since the delete button is dynamically created
  $(document).on("click", ".deleteTodo", async function () {
    // Get the id of the todo to be deleted
    const id = $(this).data("index");
    console.log("deleting", { id });

    // Delete the todo from the server
    await fetch(`${BASE_URL}/todos/${id}`, {
      method: "DELETE",
    });

    // Re-render the todos by calling the render function
    render();
  });

  //add event listener to the toggleTodo button
  //Need to use event delegation since the toggleTodo button is dynamically created
  $(document).on("click", ".toggleTodo", async function () {
    // Get the id of the todo to be deleted
    const id = $(this).data("index");
    // fetch the todo from the server
    const todo = await fetchTodo(id);
    // console.log("editing", { id, todo });

    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      // toggle the todo status to bo the opposite of what it currently is
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    });

    // const updatedTodo = await res.json();
    // console.log({ updatedTodo });
    // Re-render the todos by calling the render function
    render();
  });
});
