import {TaskCount} from "./utils/const";
import {generateTasks} from "./mock/task";
import {generateFilters} from "./mock/filter";
import {renderComponent, RenderPosition} from "./utils/render";

import BoardController from "./controllers/board";
import BoardComponent from "./components/board";
import FilterComponent from "./components/filter";
import SiteMenuComponent from "./components/site-menu";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TaskCount.ALL);
const filters = generateFilters();

renderComponent(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
renderComponent(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

renderComponent(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
