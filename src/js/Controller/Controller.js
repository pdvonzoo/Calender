class Controller {
  constructor(model, view, helper) {
    this.model = model;
    this.view = view;
    this._h = helper;
    this.currentDate;
    this.dateType = "monthly";
  }
  init() {
    this.view.init(this._h);
    const monthSelector = this._h.$(".month-navigator");
    const daySelector = this._h.$(".date-navigator");
    const weekSelector = this._h.$(".week-navigator");
    const dateType = this._h.$(".date-type-container");
    const addEvtBtn = this._h.$(".add-event");
    const popupCloseBtn = this._h.$(".popup-header .close");
    const popupSubmitBtn = this._h.$(".popup .submit");

    monthSelector.addEventListener("click", this.setMonthlyDate.bind(this));
    weekSelector.addEventListener("click", this.setWeeklyDate.bind(this));
    daySelector.addEventListener("click", this.setDayDate.bind(this));
    dateType.addEventListener("click", this.updateDateType.bind(this));
    addEvtBtn.addEventListener("click", this.togglePopup.bind(this));
    popupCloseBtn.addEventListener("click", this.togglePopup.bind(this));
    popupSubmitBtn.addEventListener("click", this.handleSubmit.bind(this));
    this.updateInitView();
  }
  updateView(date) {
    this.view.updateDateTitle(date);
    this.view.updateWeekTitle(date);
    this.view.updateWeekDays(date);
    this.view.updateMonthDays(date);
    this.view.updateMonthTitle(date);
    this.view.updateDayTitle(date);
    this.updateTask();
  }
  updateInitView() {
    const today = this.model.getCurrentAllDate();
    const tasks = this.model.allStorage();
    this.view.updateInitView(today, tasks);
  }
  setMonthlyDate(e) {
    if (e.target.innerText === "<") {
      this.model.setPrevMonthlyDate();
    } else if (e.target.innerText === ">") {
      this.model.setNextMonthlyDate();
    } else {
      return;
    }
    const date = this.model.getChangedDate();
    this.updateView(date);
  }
  setWeeklyDate(e) {
    if (e.target.innerText === "<") {
      this.model.setPrevWeeklyDate();
    } else if (e.target.innerText === ">") {
      this.model.setNextWeeklyDate();
    } else {
      return;
    }
    const date = this.model.getChangedDate();
    this.updateView(date);
  }
  setDayDate(e) {
    if (e.target.innerText === "<") {
      this.model.setPrevDailyDate();
    } else if (e.target.innerText === ">") {
      this.model.setNextDailyDate();
    } else if (e.target.innerText === "오늘") {
      this.updateInitView();
    } else {
      return;
    }
    const date = this.model.getChangedDate();
    this.updateView(date);
  }
  updateDateType(e) {
    const calendars = this._h.$All(".calendar");
    for (let el of calendars) {
      let str = "active";
      if (el.className.match(str)) {
        el.className = el.className.replace(" active", "");
      }
    }
    for (let el of e.currentTarget.children) {
      el.className = "date-type-item";
      if (e.target.innerText === el.innerText) {
        el.className += " active";
        const target = this._h.$(`.${el.id}`);
        target.className += " active";
      }
    }
  }
  updateTask() {
    const date = this.model.getChangedDate();
    const tasks = this.model.allStorage();
    this.view.updateTasks(tasks, date);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.view.setTask();
  }
  togglePopup(e) {
    e.preventDefault();
    this.view.togglePopup("submit");
  }
}

export default Controller;
