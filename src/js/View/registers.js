const registers = [
  {
    title: "전 달 시작, 현재 달 종료",
    condition: (startAt, endAt, currentMonth, curDay, day) =>
      (startAt[0] === currentMonth - 1 &&
        endAt[0] === currentMonth &&
        startAt[1] <= curDay &&
        day.className.match(/prev-mon/)) ||
      (startAt[0] === currentMonth - 1 &&
        endAt[0] === currentMonth &&
        endAt[1] >= curDay &&
        !day.className.match(/next-mon|prev-mon/))
  },
  {
    title: "현재 달 시작, 및 종료",
    condition: (startAt, endAt, currentMonth, curDay, day) =>
      startAt[0] === currentMonth &&
      endAt[0] === currentMonth &&
      startAt[1] <= curDay &&
      endAt[1] >= curDay &&
      !day.className.match(/next-mon|prev-mon/)
  },
  {
    title: "현재 달 시작, 다음 달 끝",
    condition: (startAt, endAt, currentMonth, curDay, day) =>
      (startAt[0] === currentMonth &&
        startAt[1] <= curDay &&
        endAt[0] === currentMonth + 1 &&
        !day.className.match(/next-mon|prev-mon/)) ||
      (startAt[0] === currentMonth &&
        endAt[0] === currentMonth + 1 &&
        endAt[1] >= curDay &&
        day.className.match(/next-mon/))
  }
];

export default registers;
