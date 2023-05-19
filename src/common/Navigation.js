import { DashboardSpeed, Notes } from "iconoir-vue";

export class NavigationItem {
  /**
   * @type {String}
   */
  name = "";

  /**
   * @type {String|null}
   */
  parent = null;

  /**
   * @type {import('vue').RenderFunction|null}
   */
  icon = null;

  /**
   * @type {Boolean}
   */
  showInMenu = null;

  /**
   * @param {String} name
   * @param {String|null} parent
   * @param {import('vue').RenderFunction|null} icon
   * @param {Boolean} showInMenu
   */
  constructor(name, parent = null, icon = null, showInMenu = true) {
    this.name = name;
    this.parent = parent;
    this.icon = icon;
    this.showInMenu = showInMenu;
  }
}

export default [
  new NavigationItem("Home", null, DashboardSpeed),
  new NavigationItem("Campaigns", null, Notes),
];
