let allTasks = [];
let valueInputTask = "";
let inputTask = null;
let valueInputSum = "";
let inputSum = null;
let flagForEditing = -1;
let timeText = "";

window.onload = init = async () => {
  inputTask = document.getElementById("addTask");
  inputTask.addEventListener("change", updateValue);
  inputSum = document.getElementById("addNumb");
  inputSum.addEventListener("change", updateValue2);
  const resp = await fetch("http://localhost:7070/allTasks", {
    method: "GET",
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const onClickButton = async () => {
  if (!inputTask.value.trim() || !inputSum.value.trim())
    alert("пожалуйста введите данные");
  else {
    const resp = await fetch("http://localhost:7070/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        text: valueInputTask,
        sum: valueInputSum,
      }),
    });
    const result = await resp.json();
    allTasks = result.data;
    valueInputTask = "";
    inputTask.value = "";
    valueInputSum = "";
    inputSum.value = "";
  }
  render();
};

const updateValue = (event) => (valueInputTask = event.target.value);
const updateValue2 = (event) => (valueInputSum = event.target.value);

const render = () => {
  const content = document.getElementById("contentPage");
  const allSum = document.getElementById("allSum");
  while (content.firstChild) content.removeChild(content.firstChild);
  while (allSum.firstChild) allSum.removeChild(allSum.firstChild);
  allTasks.map((item, index) => {
    if (flagForEditing === index) {
      const container = document.createElement("div");
      container.className = "taskContainerForEdit";
      const editInput = document.createElement("input");
      editInput.className = "textTask";
      editInput.value = item.text;
      timeText = "";
      editInput.onchange = (e) => (timeText = e.target.value);
      const sum = document.createElement("img");
      sum.className = "allSum";
      sum.innerText = item.sum + "р";
      const imageClose = document.createElement("img");
      imageClose.src = "images/close.svg";
      imageClose.onclick = () => closeTask(item, index);
      const date = document.createElement("p");
      date.innerText = item.date.slice(0, 10);
      container.appendChild(editInput);
      container.appendChild(date);
      container.appendChild(sum);
      container.appendChild(imageClose);
      content.appendChild(container);
    } else {
      const container = document.createElement("div");
      container.id = index;
      container.className = "taskContainer";
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "textTask doneText" : "textTask";
      const date = document.createElement("p");
      date.innerText = item.date.slice(0, 10);
      const sum = document.createElement("p");
      sum.className = "allSum";
      sum.innerText = item.sum + "р";
      const imageEdit = document.createElement("img");
      imageEdit.src = "images/edit.svg";
      imageEdit.className = "editSvg";
      imageEdit.onclick = () => editTask(index);
      if (allTasks[index].isCheck === false) container.appendChild(imageEdit);
      const imageDelete = document.createElement("img");
      imageDelete.src = "images/close.svg";
      imageDelete.onclick = () => removeTask(index);
      container.appendChild(text);
      container.appendChild(date);
      container.appendChild(sum);
      container.appendChild(imageDelete);
      content.appendChild(container);
    }
  });
};

const removeTask = async (index) => {
  const resp = await fetch(
    `http://localhost:7070/deleteTasks?_id=${allTasks[index]._id}`,
    {
      method: "DELETE",
    }
  );
  const result = await resp.json();
  allTasks = result.data;
  render();
};