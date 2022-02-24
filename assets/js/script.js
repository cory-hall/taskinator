var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

var taskFormHandler = function(event) {
   event.preventDefault();
   var taskNameInput = document.querySelector("input[name='task-name']").value;
   var taskTypeInput = document.querySelector("select[name='task-type'").value;

   // check iif input values are empty strings
   if (!taskNameInput || !taskTypeInput) {
      alert("You need to fill out the task form!");
      return false;
   }

   formEl.reset();
   
   var isEdit = formEl.hasAttribute("data-task-id");

   // has data attribute, so get task id and call function to complete edit process
   if (isEdit) {
      var taskId = formEl.getAttribute("data-task-id");
      completeEditTask(taskNameInput, taskTypeInput, taskId);
   }
   // no data attribute, so create object as normal and pass to createTaskEl function
   else {
      var taskDataObj = {
         name: taskNameInput,
         type: taskTypeInput,
         status: "to do"
      };
      createTaskEl(taskDataObj);
   }
};

   // send it as an argument to createTaskEl


var createTaskEl = function(taskDataObj) {
   // create list item
   var listItemEl = document.createElement("li");
   listItemEl.className = "task-item";

   // add task id as a custom attribute
   listItemEl.setAttribute("data-task-id", taskIdCounter);
   
   // create div to hold task info and add to list item
   var taskInfoEl = document.createElement("div");
   // give it a class name
   taskInfoEl.className = "task-info";
   // add HTML content to div
   taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
   
   listItemEl.appendChild(taskInfoEl);

   taskDataObj.id = taskIdCounter;

   tasks.push(taskDataObj);
   saveTasks();
   
   var taskActionsEl = createTaskActions(taskIdCounter);
   listItemEl.appendChild(taskActionsEl);

   // add entire list item to list
   tasksToDoEl.appendChild(listItemEl);

   // increase task counter for next unique id
   taskIdCounter++;
};

var createTaskActions = function(taskID) {
   var actionContainerEl = document.createElement("div");
   actionContainerEl.className = "task-actions";

   // create edit button
   var editButtonEl = document.createElement("button");
   editButtonEl.textContent = "Edit";
   editButtonEl.className = "btn edit-btn";
   editButtonEl.setAttribute("data-task-id", taskID);

   actionContainerEl.appendChild(editButtonEl);

   // create delete button
   var deleteButtonEl = document.createElement("button");
   deleteButtonEl.textContent = "Delete";
   deleteButtonEl.className = "btn delete-btn";
   deleteButtonEl.setAttribute("data-task-id", taskID);

   actionContainerEl.appendChild(deleteButtonEl);

   var statusSelectEl = document.createElement("select");
   statusSelectEl.className = "select-status";
   statusSelectEl.setAttribute("name", "status-change");
   statusSelectEl.setAttribute("data-task-id", taskID);

   actionContainerEl.appendChild(statusSelectEl);

   var statusChoices = ["To Do", "In Progress", "Completed"];
   for (var i = 0; i < statusChoices.length; i++) {
      // create option element
      var statusOptionEl = document.createElement("option");
      statusOptionEl.textContent = statusChoices[i];
      statusOptionEl.setAttribute("value", statusChoices[i]);

      // append to select
      statusSelectEl.appendChild(statusOptionEl);
   }

   return actionContainerEl;
};

var taskButtonHandler = function(event) {
   // get target element from event
   var targetEl = event.target;
   
   // delete button was clicked
   if (targetEl.matches(".delete-btn")) {
      // get the element's task id
      var taskID = targetEl.getAttribute("data-task-id");
      deleteTask(taskID);
   }
   // edit button was picked
   else if (targetEl.matches(".edit-btn")) {
      var taskID = targetEl.getAttribute("data-task-id");
      editTask(taskID);
   }
};

var taskStatusChangeHandler = function(event) {
   // get task item's id
   var taskId = event.target.getAttribute("data-task-id");

   // get the currently selected option's value and convert to lowercase
   var statusValue = event.target.value.toLowerCase();

   // find the parent task item element based on the id
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
   }
   else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
   }
   else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
   }

   for (var i = 0; i < tasks.length; i++) {
      if (tasks[i] === parseInt(taskId)) {
         tasks[i].status = statusValue;
      }
   }
   saveTasks();
};

var deleteTask = function(taskID) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
   taskSelected.remove();

   // create new array to hold updated list of tasks
   var updatedTaskArr = [];

   // loop through current tasks
   for (var i = 0; i < tasks.length; i++) {
      // if tasks[i].id doesn't match the value of taskId, let's keep that task and 
      // push it into the new array
      if (tasks[i].id !== parseInt(taskId)) {
         updatedTaskArr.push(tasks[i]);
      }
   }

   // reassign tasks array to be the same as updatedTasksArr
   tasks = updatedTaskArr;
   saveTasks();
}

var editTask = function(taskID) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

   // get content from task name and type
   var taskName = taskSelected.querySelector("h3.task-name").textContent;
   var taskType = taskSelected.querySelector("span.task-type").textContent;

   document.querySelector("input[name='task-name']").value = taskName;
   document.querySelector("select[name='task-type']").value = taskType;

   document.querySelector("#save-task").textContent = "Save Task";

   formEl.setAttribute("data-task-id", taskID);
};

var completeEditTask = function(taskName, taskType, taskID) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

   // set new values
   taskSelected.querySelector("h3.task-name").textContent = taskName;
   taskSelected.querySelector("span.task-type").textContent = taskType;

   for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
         tasks[i].name = taskName;
         tasks[i].type = taskType;
      }
   }

   saveTasks();
   alert("Task Updated!");

   formEl.removeAttribute("data-task-id");
   document.querySelector("#save-task").textContent = "Add Task";
};

var saveTasks = function () {
   localStorage.setItem("tasks", JSON.stringify(tasks));
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);


formEl.addEventListener("submit", taskFormHandler);