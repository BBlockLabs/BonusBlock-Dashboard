import { DashboardSpeed, Server, Settings, Notes } from "iconoir-vue";

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
  new NavigationItem("Templates", null, Notes),
  new NavigationItem("Provider", null, Server),
  new NavigationItem("Packages", "Provider"),
  new NavigationItem("Server", "Provider", null, false),
  new NavigationItem("Organizations", "Provider"),
  new NavigationItem("Organization", "Provider", null, false),
  new NavigationItem("Servers Map", "Provider"),
  new NavigationItem("Settings", null, Settings),
];
