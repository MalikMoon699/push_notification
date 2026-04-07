import SiteLogo from "../assets/images/SiteLogo.png";
import PlaceHolder from "../assets/images/PlaceHolder.jpg";
import NotFound from "../assets/images/NotFound.png";

export const IMAGES = {
  SiteLogo,
  PlaceHolder,
  NotFound,
};

export const SideBarMenu = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    route: "/dashboard",
    activeAt: "/dashboard",
  },
  {
    name: "Usage",
    icon: "ChartNoAxesCombined",
    route: "/usage",
    activeAt: "/usage",
  },
  {
    name: "Rewards",
    icon: "Gift",
    route: "/rewards",
    activeAt: "/rewards",
  },
  {
    name: "API Section",
    icon: "Key",
    route: "/api-section",
    activeAt: "/api-section",
  },
  {
    name: "Payments",
    icon: "BadgePoundSterling",
    route: "/payments",
    activeAt: "/payments",
    startsWith: ["/payment-success"],
  },
  {
    name: "Settings",
    icon: "Settings",
    route: "/settings",
    activeAt: "/settings",
  },
];

export const limit = 4;