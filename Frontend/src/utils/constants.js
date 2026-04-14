import SiteLogo from "../assets/images/SiteLogo.png";
import PlaceHolder from "../assets/images/PlaceHolder.jpg";
import NotFound from "../assets/images/NotFound.png";

export const IMAGES = {
  SiteLogo,
  PlaceHolder,
  NotFound,
};

export const UserSideBarMenu = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    route: "/dashboard",
    activeAt: "/dashboard",
  },
  {
    name: "Analytics",
    icon: "ChartNoAxesCombined",
    route: "/analytics",
    activeAt: "/analytics",
  },
  {
    name: "API Section",
    icon: "Key",
    route: "/api-section",
    activeAt: "/api-section",
  },
  {
    name: "Rewards",
    icon: "Gift",
    route: "/rewards",
    activeAt: "/rewards",
  },
  {
    name: "Usage",
    icon: "Activity",
    route: "/usage",
    activeAt: "/usage",
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


export const AdminSideBarMenu = [
  {
    name: "Dashboard",
    icon: "LayoutDashboard",
    route: "/admin/dashboard",
    activeAt: "/admin/dashboard",
  },
  {
    name: "Users",
    icon: "Users",
    route: "/admin/users",
    activeAt: "/admin/users",
  },
  {
    name: "Credit Sales",
    icon: "Coins",
    route: "/admin/credit-sales",
    activeAt: "/admin/credit-sales",
  },
  {
    name: "Credit Logs",
    icon: "ScrollText",
    route: "/admin/credit-logs",
    activeAt: "/admin/credit-logs",
  },
  {
    name: "API Keys",
    icon: "Key",
    route: "/admin/api-keys",
    activeAt: "/admin/api-keys",
  },
  {
    name: "Settings",
    icon: "Settings",
    route: "/admin/settings",
    activeAt: "/admin/settings",
  },
];

export const limit = 10;
