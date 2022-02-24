var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// create an array to hold tasks for saving
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
   var listItemEl = document.createElement("li");
   listItemEl.className = "task-item";
   listItemEl.setAttribute("data-task-id", taskIdCounter);
    
   var taskInfoEl = document.createElement("div");
   taskInfoEl.className = "task-info";
   taskInfoEl.innerHTML =
     "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
   listItemEl.appendChild(taskInfoEl);
    
   var taskActionsEl = createTaskActions(taskIdCounter);
   listItemEl.appendChild(taskActionsEl);
    
   switch (taskDataObj.status) {
      case "to do":
         taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
         tasksToDoEl.append(listItemEl);
         break;
      case "in progress":
         taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
         tasksInProgressEl.append(listItemEl);
         break;
      case "completed":
         taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
         tasksCompletedEl.append(listItemEl);
         break;
      default:
         console.log("Something went wrong!");
      }

    // save task as an object with name, type, status, and id properties then push it into tasks array
    taskDataObj.id = taskIdCounter;
    
    tasks.push(taskDataObj);
    
    // save tasks to localStorage
    saveTasks();
    
    // increase task counter for next unique task id
    taskIdCounter++;
   };

var createTaskActions = function(taskId) {
   var actionContainerEl = document.createElement("div");
   actionContainerEl.className = "task-actions";

   // create edit button
   var editButtonEl = document.createElement("button");
   editButtonEl.textContent = "Edit";
   editButtonEl.className = "btn edit-btn";
   editButtonEl.setAttribute("data-task-id", taskId);

   actionContainerEl.appendChild(editButtonEl);

   // create delete button
   var deleteButtonEl = document.createElement("button");
   deleteButtonEl.textContent = "Delete";
   deleteButtonEl.className = "btn delete-btn";
   deleteButtonEl.setAttribute("data-task-id", taskId);

   actionContainerEl.appendChild(deleteButtonEl);

   var statusSelectEl = document.createElement("select");
   statusSelectEl.setAttribute("name", "status-change");
   statusSelectEl.setAttribute("data-task-id", taskId);
   statusSelectEl.className = "select-status";

   actionContainerEl.appendChild(statusSelectEl);

   var statusChoices = ["To Do", "In Progress", "Completed"];
   for (var i = 0; i < statusChoices.length; i++) {
      // create option element
      var statusOptionEl = document.createElement("option");
      statusOptionEl.setAttribute("value", statusChoices[i]);
      statusOptionEl.textContent = statusChoices[i];

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
      var taskId = targetEl.getAttribute("data-task-id");
      deleteTask(taskId);
   }
   // edit button was picked
   else if (targetEl.matches(".edit-btn")) {
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
   }
};

var taskStatusChangeHandler = function(event) {
   // get task item's id
   var taskId = event.target.getAttribute("data-task-id");

   // find the parent task item element based on the id
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   // get the currently selected option's value and convert to lowercase
   var statusValue = event.target.value.toLowerCase();

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
      if (tasks[i].id === parseInt(taskId)) {
         tasks[i].status = statusValue;
      }
   }
   saveTasks();
};

var deleteTask = function(taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
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

var editTask = function(taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

   // get content from task name and type
   var taskName = taskSelected.querySelector("h3.task-name").textContent;
   var taskType = taskSelected.querySelector("span.task-type").textContent;

   document.querySelector("input[name='task-name']").value = taskName;
   document.querySelector("select[name='task-type']").value = taskType;

   document.querySelector("#save-task").textContent = "Save Task";

   formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

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

var loadTasks = function () {
   var savedTasks = localStorage.getItem("tasks");

   if (!savedTasks) {
      return false;
   }

   savedTasks = JSON.parse(savedTasks);

   for (var i = 0; i < savedTasks.length; i++) {
      createTaskEl(savedTasks[i]);
   }
   // get task items from localStorage
   // tasks = localStorage.getItem("tasks");

   // if (!tasks) {
   //    tasks = [];
   //    return false;
   // }

   // // convert tasks from string format back into an array of objects
   // tasks = JSON.parse(tasks);

   // // iterate through a task array and creates task elements on the page from it
   // for (var i = 0; i < tasks.length; i++) {
   //    tasks[i].id = taskIdCounter;
   //    listItemEl = document.createElement("li");
   //    listItemEl.className = "task-item";
   //    listItemEl.setAttribute("data-task-id", tasks[i].id);
   //    taskInfoEl = document.createElement("div");
   //    taskInfoEl.className = "task-info";
   //    taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
   //    listItemEl.appendChild(taskInfoEl);
   //    var taskActionsEl = createTaskActions(tasks[i].id);
   //    listItemEl.appendChild(taskActionsEl);

   //    if (tasks[i].status === "to do") {
   //       listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
   //       tasksToDoEl.appendChild(listItemEl);
   //    }
   //    else if (tasks[i].status === "in progress") {
   //       listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
   //       tasksToDoEl.appendChild(listItemEl);
   //    }
   //    else if (tasks[i].status === "complete") {
   //       listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
   //       tasksToDoEl.appendChild(listItemEl);
   //    }
   //    taskIdCounter++;
   // }
};

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);


formEl.addEventListener("submit", taskFormHandler);
loadTasks();
