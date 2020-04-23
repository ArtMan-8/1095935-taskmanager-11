import {renderComponent, RenderPosition, replaceComponent} from "../utils/render";

import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";

export default class TaskController {
  constructor(container) {
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._container = container;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
    });

    renderComponent(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replaceComponent(this._taskComponent, this._taskEditComponent);
  }

  _replaceTaskToEdit() {
    replaceComponent(this._taskEditComponent, this._taskComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
