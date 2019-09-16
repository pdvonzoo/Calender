const uuidv1 = require("uuid/v1");
import registers from "./registers";
class View {
  constructor() {
    this.popup = false;
    this.tasksToggle = false;
    this._h;
  }
  init(helper) {
    this._h = helper;
    const tasksPopupRmBtn = this._h.$(".close-task-list");
    const tasksPopup = this._h.$(".tasks_cover");
    tasksPopupRmBtn.addEventListener("click", e =>
      this.closeTaskListPopup(e, tasksPopup)
    );
  }
  closeTaskListPopup(e, tasksPopup) {
    e.preventDefault();
    this.tasksToggle = false;
    tasksPopup.style.display = "none";
  }
  updateInitView(today, tasks) {
    this.updateMonthTitle(today);
    this.updateDateTitle(today);
    this.updateMonthDays(today);
    this.updateWeekTitle(today);
    this.updateWeekDays(today);
    this.updateDayTitle(today);
    this.updateTasks(tasks, today);
    this.tasks = tasks;
  }
  updateDateTitle({ year, month, day }) {
    const currentDate = this._h.$(".current-date");
    currentDate.innerText = `${year}.${month.num}.${day.num}`;
  }
  updateMonthTitle({ year, month }) {
    const monthInfo = this._h.$(".monthInfo");
    monthInfo.innerText = `${year}.${month.num}`;
  }
  updateWeekTitle({ month, week }) {
    const monthInfo = this._h.$(".weekInfo");
    monthInfo.innerText = `${month.num}월, ${week}째 주`;
  }
  updateDayTitle({ day }) {
    const dailyHeader = this._h.$(".daily-header");
    dailyHeader.innerHTML = "";
    const dayEl = document.createElement("div");
    dayEl.className = "day-name";
    if (day.name === "일") {
      dayEl.className += " sun";
    }
    if (day.name === "토") {
      dayEl.className += " sat";
    }
    dayEl.innerText = `${day.name} ${day.num}`;
    dayEl.dataset.number = day.num;
    dailyHeader.appendChild(dayEl);
  }
  updateWeekDays(date) {
    const weekDayName = ["일", "월", "화", "수", "목", "금", "토"];
    const weeklyHeader = this._h.$(".weekly-header");
    let prevlen = date.month.prevlen - date.month.firstDayName + 1;
    let nextlen = date.month.daylen;
    let next = 1;
    weeklyHeader.innerHTML = "";
    let firstDay = (date.week - 1) * 7 - date.month.firstDayName + 1;
    for (let i = 0; i < 7; i++) {
      const el = document.createElement("div");
      el.className = "day-name";
      el.innerText = `${weekDayName[i]} `;
      if (i === 0) el.className += " sun";
      if (i === 6) el.className += " sat";
      if (firstDay < 1) {
        el.innerText += prevlen;
        el.dataset.number = prevlen;
        el.className += " prev-mon";
        prevlen++;
        firstDay++;
      } else if (firstDay > nextlen) {
        el.innerText += next;
        el.dataset.number = next;
        el.className += " next-mon";
        next++;
      } else {
        el.innerText += firstDay;
        el.dataset.number = firstDay;
        firstDay++;
      }
      weeklyHeader.appendChild(el);
    }
  }
  updateMonthDays(date) {
    const monthlyBody = this._h.$(".monthly-body");
    monthlyBody.innerHTML = "";
    const {
      month: { prevlen, daylen, firstDayName }
    } = date;
    let day = 1;
    let prevDay = prevlen - firstDayName + 1;
    let len = Math.ceil((firstDayName + daylen) / 7);
    let prev = 1;
    while (len--) {
      const parent = document.createElement("div");
      parent.className = "week";
      for (let i = 0; i < 7; i++) {
        const el = document.createElement("div");
        el.className = "day day-name";
        if (day > daylen) {
          el.innerText = prev;
          el.dataset.number = prev;
          el.className += " next-mon";
          prev++;
        } else if (i >= firstDayName || prevDay > prevlen) {
          el.innerText = day;
          el.dataset.number = day;
          day++;
          if (date.day.num === +el.innerText) {
            el.className += " active";
          }
        } else {
          el.innerText = prevDay;
          el.dataset.number = prevDay;
          el.className += " prev-mon";
          prevDay++;
        }

        if (i === 0) {
          el.className += " sun";
        }
        if (i === 6) {
          el.className += " sat";
        }
        parent.appendChild(el);
      }
      monthlyBody.appendChild(parent);
    }
  }
  updateToggleTasks(tasks) {
    const taskList = this._h.$(".task_list");
    taskList.innerHTML = "";
    tasks.forEach(task => {
      const taskEl = document.createElement("li");
      taskEl.className = "task_item";
      taskEl.innerText = task;
      taskList.appendChild(taskEl);
    });
  }
  toggleTasksPopup(e, day) {
    const children = day ? day.children : [];
    const tasks = [...children]
      .filter(el => el.className.match("task"))
      .map(el => el.innerText);
    const tasksPopup = this._h.$(".tasks_cover");
    tasksPopup.style.display = this.togglePopup ? "block" : "none";
    this.updateToggleTasks(tasks);
  }
  togglePopup(value) {
    const popupCover = this._h.$(".popup_cover");
    const updateDelete = this._h.$(".update-delete");
    const submit = this._h.$(".submit");
    this.popup = !this.popup;
    popupCover.style.display = this.popup ? "block" : "none";
    if (value === "updateNdelete") {
      updateDelete.style.display = "flex";
      submit.style.display = "none";
    } else if (value === "submit") {
      updateDelete.style.display = "none";
      submit.style.display = "inline-block";
    }
  }
  updateTasks(tasks, date) {
    this.updateMonthTask(tasks, date);
    this.updateWeekTask(tasks, date);
    this.updateDayTask(tasks, date);
  }
  updateMonthTask(tasks, date) {
    const days = this._h.$All(".day");
    const currentMonth = date.month.num;
    for (let task of tasks) {
      if (this.checkYear(task, date)) {
        return;
      }
      const startAt = [+task.startAt.slice(5, 7), +task.startAt.slice(8, 10)];
      const endAt = [+task.endAt.slice(5, 7), +task.endAt.slice(8, 10)];
      const taskName = task.task_name;
      const color = this.getRandomColor();
      let maxChildElNum = 1;
      for (let day of days) {
        if (
          startAt[1] <= +day.dataset.number &&
          +day.dataset.number <= endAt[1] &&
          +day.dataset.taskNumber
        ) {
          maxChildElNum = +day.dataset.taskNumber + 1;
        }
      }
      for (let day of days) {
        const curDay = +day.dataset.number;
        if (
          registers.some(register =>
            register.condition(startAt, endAt, currentMonth, curDay, day)
          )
        ) {
          this.updateMonthWorkingDay(
            startAt,
            endAt,
            day,
            maxChildElNum,
            taskName,
            color,
            task
          );
        }
      }
    }
  }
  addPlusButton(day) {
    const taskEl = document.createElement("div");
    taskEl.className = "plus-btn";
    taskEl.innerText = "+";
    taskEl.addEventListener("click", e => this.toggleTasksPopup(e, day));
    day.appendChild(taskEl);
  }
  updateMonthWorkingDay(
    startAt,
    endAt,
    day,
    maxChildElNum,
    taskName,
    color,
    task
  ) {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    taskEl.innerText = taskName;
    if (startAt[1] === +day.dataset.number) {
      taskEl.className += " start";
    } else if (endAt[1] === +day.dataset.number) {
      taskEl.className += " end";
    } else if (day.className.match(/sat/)) {
      taskEl.className += " sat";
    } else if (day.className.match(/sun/)) {
      taskEl.className += " sun";
    }
    taskEl.style.backgroundColor = color;
    taskEl.style.right = "-0.1rem";
    taskEl.style.top = `${(maxChildElNum - 1) * 4 + 4}rem`;
    if (+day.dataset.taskNumber > 1) {
      this.addPlusButton(day);
      taskEl.style.top = `20rem`;
    }

    taskEl.addEventListener("click", () => this.openTask(task));
    day.appendChild(taskEl);
    day.dataset.taskNumber = `${maxChildElNum}`;
  }
  updateWeekTask(tasks, date) {
    const days = this._h.$All(".weekly-header .day-name");
    const currentMonth = date.month.num;
    for (let task of tasks) {
      if (this.checkYear(task, date)) {
        return;
      }
      const startAt = [
        +task.startAt.slice(5, 7),
        +task.startAt.slice(8, 10),
        +task.startAt.slice(11, 13)
      ];
      const endAt = [+task.endAt.slice(5, 7), +task.endAt.slice(8, 10)];
      const taskName = task.task_name;
      const color = this.getRandomColor();
      for (let day of days) {
        const curDay = +day.dataset.number;

        if (
          registers.some(register =>
            register.condition(startAt, endAt, currentMonth, curDay, day)
          )
        ) {
          this.updateWeekWorkingDay(startAt, endAt, day, taskName, color, task);
        }
      }
    }
  }
  updateWeekWorkingDay(startAt, endAt, day, taskName, color, task) {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    const curDay = +day.dataset.number;
    const dayName = day.innerText.split(" ")[0];
    if (startAt[1] === +curDay) {
      taskEl.innerText = taskName;
      taskEl.className += " start";
    } else if (endAt[1] === +curDay) {
      taskEl.className += " end";
    } else if (dayName === "토") {
      taskEl.className += " sat";
    } else if (dayName === "일") {
      taskEl.className += " sun";
    }
    taskEl.style.backgroundColor = color;
    taskEl.style.right = "-0.1rem";
    taskEl.style.top = `${startAt[2] * 3.1 + 3.3}rem`;
    taskEl.addEventListener("click", () => this.openTask(task));
    day.appendChild(taskEl);
  }
  updateDayTask(tasks, date) {
    const days = this._h.$All(".daily-header .day-name");
    const currentMonth = date.month.num;
    for (let task of tasks) {
      if (this.checkYear(task, date)) {
        return;
      }
      const startAt = [
        +task.startAt.slice(5, 7),
        +task.startAt.slice(8, 10),
        +task.startAt.slice(11, 13)
      ];
      const endAt = [+task.endAt.slice(5, 7), +task.endAt.slice(8, 10)];
      const taskName = task.task_name;
      const color = this.getRandomColor();
      for (let day of days) {
        const curDay = +day.dataset.number;

        if (
          registers.some(register =>
            register.condition(startAt, endAt, currentMonth, curDay, day)
          )
        ) {
          this.updateWorkingDay(startAt, endAt, day, taskName, color, task);
        }
      }
    }
  }
  updateWorkingDay(startAt, endAt, day, taskName, color, task) {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    const curDay = +day.innerText.split(" ")[1];
    if (startAt[1] === +curDay) {
      taskEl.innerText = taskName;
      taskEl.className += " start";
    } else if (endAt[1] === +curDay) {
      taskEl.className += " end";
    }
    if (endAt[1] !== +curDay && (endAt[1] > +curDay || startAt[0] < endAt[0])) {
      taskEl.className += " going";
    }
    if (
      startAt[1] !== +curDay &&
      (startAt[1] < +curDay || startAt[0] < endAt[0])
    ) {
      taskEl.className += " continue";
    }
    taskEl.style.backgroundColor = color;
    taskEl.style.top = `${startAt[2] * 3.1 + 3.4}rem`;
    taskEl.addEventListener("click", () => this.openTask(task));
    day.appendChild(taskEl);
  }
  checkYear(task, date) {
    const taskStartYear = +task.startAt.slice(0, 4);
    const taskEndYear = +task.endAt.slice(0, 4);
    if (taskStartYear !== date.year && taskEndYear !== date.year) {
      return true;
    }
  }
  openTask(task) {
    this.togglePopup("updateNdelete", task);
    this.setPopupData(task);
  }
  setPopupData(task) {
    const updateBtn = this._h.$(".update-delete .update");
    const deleteBtn = this._h.$(".update-delete .delete");
    const titleEl = this._h.$("input.title");
    const startAtEl = this._h.$("input.start_at");
    const startTimeEl = this._h.$("input.start_time");
    const endAtEl = this._h.$("input.end_at");
    const memoEl = this._h.$("textarea.memo");
    const startDay = task.startAt.split(" ")[0];
    const startTime = task.startAt.split(" ")[1];

    titleEl.value = task.task_name;
    startAtEl.value = startDay;
    startTimeEl.value = startTime;
    endAtEl.value = task.endAt;
    memoEl.value = task.memo;
    updateBtn.addEventListener("click", e => this.updateTask(e, task));
    deleteBtn.addEventListener("click", e => this.deleteTask(e, task));
  }
  updateTask(e, task) {
    e.preventDefault();
    this.setTask(task.task_id);
  }
  deleteTask(e, task) {
    e.preventDefault();
    localStorage.removeItem(task.task_id);
    location.reload(true);
  }
  setTask(id) {
    const task_id = id ? id : uuidv1();
    const title = this._h.$("input.title");
    const startAt = this._h.$("input.start_at");
    const startTime = this._h.$("input.start_time");
    const endAt = this._h.$("input.end_at");
    const memo = this._h.$("textarea.memo");
    localStorage.setItem(
      task_id,
      `{ "task_name": "${title.value}", "startAt": "${startAt.value} ${startTime.value}", "endAt": "${endAt.value}", "memo": "${memo.value}"}`
    );
    this.togglePopup();
    location.reload(true);
  }
  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

export default View;
