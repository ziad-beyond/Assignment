function addTask() {
  let newTask = document.getElementById("taskInput");
  // To remove Whitespaces 
  let taskText = newTask.value.trim();
  // Check the input not Empty
  if (!taskText) {
    alert("please enter a task");
    return;
  }
  let taskList = document.getElementById("taskList");
  taskList.style.listStyleType="none"
  let list = document.createElement("li");
  list.innerHTML = `
<span onclick="this.classList.toggle('completed')">${taskText}</span>
<button onclick="this.parentElement.remove()">Remove</button>
`;
  taskList.appendChild(list);
  newTask.value = " ";
}
