import Controller from "./Controller/Controller";
import Model from "./Model/Model";
import View from "./View/View";
import Helper from "./Utils/Helper";

document.addEventListener("DOMContentLoaded", () => {
  const controller = new Controller(new Model(), new View(), new Helper());
  controller.init();
});
