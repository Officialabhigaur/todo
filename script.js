
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let filter = "all";

  function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"), 1500);
  }

  function addTask() {
    const input = document.getElementById("taskInput");
    if (!input.value.trim()) return;
    tasks.push({ text: input.value, completed: false });
    input.value = "";
    save(); render(); showToast("Task Added");
  }

  function setFilter(f) {
    filter = f;
    document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    render();
  }

  function render() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, i) => {
      if (filter === "completed" && !task.completed) return;
      if (filter === "pending" && task.completed) return;

      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const left = document.createElement("div");
      left.className = "left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onchange = () => {
        task.completed = checkbox.checked;
        save(); render(); showToast("Task Updated");
      };

      const span = document.createElement("span");
      span.textContent = task.text;

      left.append(checkbox, span);

      const actions = document.createElement("div");

      const edit = document.createElement("button");
      edit.textContent = "✏️";
      edit.onclick = () => {
        const val = prompt("Edit:", task.text);
        if (val) task.text = val;
        save(); render(); showToast("Task Edited");
      };

      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => {
        tasks.splice(i,1);
        save(); render(); showToast("Task Deleted");
      };

      actions.append(edit, del);
      li.append(left, actions);
      list.append(li);
    });

    updateStats();
  }

  function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(t=>t.completed).length;
    const pending = total - done;

    document.getElementById("total").textContent = total;
    document.getElementById("completed").textContent = done;
    document.getElementById("pending").textContent = pending;

    const percent = total ? (done/total)*100 : 0;
    

    // progress bar
    document.getElementById("progressFill").style.width = percent + "%";

    // progress text + dynamic color
    document.getElementById("progressText").textContent = Math.round(percent) + "% completed";

    const bar = document.getElementById("progressFill");
    if (percent < 40) bar.style.background = "linear-gradient(90deg, #ff416c, #ff4b2b)";
    else if (percent < 80) bar.style.background = "linear-gradient(90deg, #f7971e, #ffd200)";
    else bar.style.background = "linear-gradient(90deg, #56ab2f, #a8e063)";
  }

  function toggleMode() {
    document.body.classList.toggle("dark");
  }

  render();
