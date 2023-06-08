import SvgHome from "@/assets/icons/sidebar/home.svg";
import SvgCampaigns from "@/assets/icons/sidebar/campaigns.svg";
import SvgSettings from "@/assets/icons/sidebar/settings.svg";

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
  new NavigationItem("Home", null, SvgHome),
  new NavigationItem("Campaigns", null, SvgCampaigns),
  new NavigationItem("Settings", null, SvgSettings),
];
