class Helper {
  constructor() {}
  $(target) {
    return document.querySelector(target);
  }
  $All(target) {
    return document.querySelectorAll(target);
  }
}

export default Helper;
