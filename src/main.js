import {generateTasks} from "./mock/task";
import {generateFilters} from "./mock/filter";
import {renderComponent, RenderPosition, replaceComponent, remove} from "./utils/render";

import BoardComponent from "./components/board";
import FilterComponent from "./components/filter";
import LoadMoreButtonComponent from "./components/load-more-button";
import TaskEditComponent from "./components/task-edit";
import TasksComponent from "./components/tasks";
import TaskComponent from "./components/task";
import NoTasksComponent from "./components/no-task";
import SiteMenuComponent from "./components/site-menu";
import SortComponent from "./components/sorting";

const TaskCount = {
  ALL: 20,
  SHOWING_ON_START: 8,
  SHOWING_BY_BUTTON: 8,
};

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

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    renderComponent(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    return;
  }

  renderComponent(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREEND);
  renderComponent(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = TaskCount.SHOWING_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  renderComponent(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.setClickHandler(() => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + TaskCount.SHOWING_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TaskCount.ALL);
const filters = generateFilters();

renderComponent(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
renderComponent(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
renderComponent(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
