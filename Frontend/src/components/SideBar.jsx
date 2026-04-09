import React, { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";
import "../assets/style/SideBar.css";
import { IMAGES, SideBarMenu } from "../utils/constants";
import { useLocation, useNavigate } from "react-router";
import LogoutModel from "../auth/LogoutModel";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideBar, setIsSideBar] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSideBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSideBar]);

  return (
    <>
      <div className="mobile-topbar-container">
        <img
          onClick={() => {
            navigate("/");
          }}
          src={IMAGES.SiteLogo}
          alt="TaskHive Logo"
          className="sidebar-logo"
        />
        <button
          onClick={() => {
            setIsSideBar(!isSideBar);
          }}
        >
          <LucideIcons.Menu />
        </button>
      </div>
      <aside
        ref={sidebarRef}
        className={`sidebar-container ${!isSideBar ? "sidebar-closed" : ""}`}
      >
        <div className="sidebar-header">
          <button className="sidebar-go-back-btn" onClick={() => navigate("/")}>
            <span className="icon">
              <LucideIcons.ChevronLeft />
            </span>
          </button>
          <div className="landing-page-navbar-logo">
            <img
              src={IMAGES.SiteLogo}
              alt="TaskHive Logo"
              className="sidebar-logo"
            />
            <h3>DPN</h3>
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-menu">
          {SideBarMenu.map((item, index) => {
            const Icon = LucideIcons[item.icon];
            const isActive = (item) => {
              if (location.pathname === item.activeAt) return true;
              if (!item.startsWith) return false;

              return item.startsWith.some((path) =>
                location.pathname.startsWith(path),
              );
            };

            return (
              <div
                key={index}
                onClick={() => {
                  navigate(item.route);
                  setIsSideBar(false);
                }}
                className={`sidebar-item ${
                  isActive(item) ? "sidebar-item-active" : ""
                }`}
              >
                <Icon size={20} />
                <span className="sidebar-label">{item.name}</span>
              </div>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button
            onClick={() => {
              setIsLogout(true);
            }}
            className="sidebar-logout-btn"
          >
            <span>
              <LucideIcons.LogOut />
            </span>
            Logout
          </button>
        </div>
        {isLogout && <LogoutModel onClose={() => setIsLogout(false)} />}
      </aside>
    </>
  );
};

export default SideBar;
