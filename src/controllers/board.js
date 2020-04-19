import {TaskCount} from "../utils/const";
import {renderComponent, RenderPosition, replaceComponent, remove} from "../utils/render";

import LoadMoreButtonComponent from "../components/load-more-button";
import NoTasksComponent from "../components/no-task";
import TaskEditComponent from "../components/task-edit";
import SortComponent from "../components/sorting";
import TaskComponent from "../components/task";
import TasksComponent from "../components/tasks";

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replaceComponent(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replaceComponent(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  renderComponent(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();

    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      renderComponent(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderComponent(container, this._sortComponent, RenderPosition.BEFOREEND);
    renderComponent(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = TaskCount.SHOWING_ON_START;
    tasks.slice(0, showingTasksCount)
      .forEach((task) => {
        renderTask(taskListElement, task);
      });

    renderComponent(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + TaskCount.SHOWING_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }
}
