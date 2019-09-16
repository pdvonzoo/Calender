class Model {
  constructor() {
    this.date = new Date();
    this.today = {};
    this.target = {};
    this.getCurrentAllDate();
  }
  getCurrentAllDate() {
    this.today = {
      year: this.date.getFullYear(),
      month: {
        num: this.date.getMonth() + 1,
        daylen: "",
        firstDayName: "",
        prevlen: "",
        curWeekLen: "",
        prevWeekLen: ""
      },
      week: "",
      day: { num: this.date.getDate(), name: "" }
    };
    const { year, month, day } = this.today;
    this.today.day.name = this.getCurrentDayName({
      year: year,
      month: month.num,
      day: day.num
    });
    this.today.day.name = this.getDayOfWeek(day.name);
    this.setMonth(this.today);
    this.today.week = this.getCurrentWeek({
      firstDay: this.today.month.firstDayName,
      currentDay: this.today.day.num
    });
    this.target = { ...this.today };
    this.setPrevWeekLen(this.target);
    this.setCurrWeekLen(this.target);
    return this.today;
  }
  setMonth(date) {
    date.month.daylen = this.getLastDay({
      year: date.year,
      month: date.month.num
    });
    date.month.prevlen = this.getLastDay({
      year: date.year,
      month: date.month.num - 1
    });
    const firstDay = this.getFirstDay({
      year: date.year,
      month: date.month.num
    });
    date.month.firstDayName = firstDay.getDay();
  }
  getLastDay({ year, month }) {
    const date = this.getParseDate({
      year,
      month: month + 1,
      day: 0
    }).getDate();
    return date;
  }
  getFirstDay({ year, month }) {
    const date = this.getParseDate({ year, month, day: 1 });
    return date;
  }
  getCurrentDayName({ year, month, day }) {
    const date = this.getParseDate({ year, month, day });
    return date.getDay();
  }
  getDayOfWeek(num) {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토", "일"];
    return dayNames[num];
  }
  getParseDate({ year, month, day }) {
    return new Date(Date.UTC(year, month - 1, day));
  }
  getCurrentWeek({ firstDay, currentDay }) {
    return Math.ceil((firstDay + currentDay) / 7);
  }
  setCurrWeekLen(date) {
    this.target.month.curWeekLen = Math.ceil(
      (date.month.daylen + date.month.firstDayName) / 7
    );
  }
  setPrevWeekLen(date) {
    const firstDay = this.getFirstDay({
      year: date.year,
      month: date.month.num - 1
    }).getDay();
    const lastDay = this.getLastDay({ year: date.year, month: date.month.num });
    this.target.month.prevWeekLen = Math.ceil((firstDay + lastDay) / 7);
  }

  getChangedDate() {
    return this.target;
  }
  setPrevMonthlyDate() {
    this.setPrevWeekLen(this.target);
    this.setCurrWeekLen(this.target);
    this.target.month.num -= 1;
    if (this.target.month.num === 0) {
      this.target.month.num = 12;
      this.target.year -= 1;
    }
    this.setMonth(this.target);
  }
  setNextMonthlyDate() {
    this.setPrevWeekLen(this.target);
    this.setCurrWeekLen(this.target);
    this.target.month.num += 1;
    if (this.target.month.num === 13) {
      this.target.month.num = 1;
      this.target.year += 1;
    }
    this.setMonth(this.target);
  }
  setPrevWeeklyDate() {
    this.target.week -= 1;
    this.target.day.num -= 7;
    if (1 > this.target.day.num) {
      this.target.day.num = this.target.month.prevlen + this.target.day.num;
      this.setPrevMonthlyDate();
      this.target.week = this.getCurrentWeek({
        firstDay: this.target.month.firstDayName,
        currentDay: this.target.day.num
      });
    }
    if (this.target.week === 0) {
      this.setPrevMonthlyDate();
      this.target.week = this.getCurrentWeek({
        firstDay: this.target.month.firstDayName,
        currentDay: this.target.day.num
      });
    }
  }
  setNextWeeklyDate() {
    this.target.week += 1;
    this.target.day.num += 7;
    if (this.target.month.daylen < this.target.day.num) {
      this.target.day.num = this.target.day.num - this.target.month.daylen;
      this.setNextMonthlyDate();
      this.target.week = this.getCurrentWeek({
        firstDay: this.target.month.firstDayName,
        currentDay: this.target.day.num
      });
    }
    if (this.target.week > this.target.month.curWeekLen) {
      this.setNextMonthlyDate();
      this.target.week = this.getCurrentWeek({
        firstDay: this.target.month.firstDayName,
        currentDay: this.target.day.num
      });
    }
  }
  setNextDailyDate() {
    this.target.day.num += 1;
    if (this.target.day.num >= this.target.month.daylen + 1) {
      this.target.day.num = 1;
      this.setNextMonthlyDate();
    }
    this.target.day.name = this.getCurrentDayName({
      year: this.target.year,
      month: this.target.month.num,
      day: this.target.day.num
    });
    this.today.day.name = this.getDayOfWeek(this.target.day.name);
    this.target.week = this.getCurrentWeek({
      firstDay: this.target.month.firstDayName,
      currentDay: this.target.day.num
    });
  }
  setPrevDailyDate() {
    this.target.day.num -= 1;
    if (this.target.day.num === 0) {
      this.target.day.num = this.target.month.prevlen;
      this.setPrevMonthlyDate();
    }
    this.target.day.name = this.getCurrentDayName({
      year: this.target.year,
      month: this.target.month.num,
      day: this.target.day.num
    });
    this.today.day.name = this.getDayOfWeek(this.target.day.name);
    this.target.week = this.getCurrentWeek({
      firstDay: this.target.month.firstDayName,
      currentDay: this.target.day.num
    });
  }
  allStorage() {
    let values = [],
      keys = Object.keys(localStorage),
      i = keys.length - 1;
    while (i >= 0) {
      if (!localStorage.getItem(keys[i]).match(/task_name/)) {
        i--;
        continue;
      }
      values.push(JSON.parse(localStorage.getItem(keys[i])));
      values.forEach(v => (v.task_id = keys[i]));
      i--;
    }
    return values;
  }
}

export default Model;
