import { useContext, useEffect, useState } from "react";
import {
  FaHome,
  FaSearch,
  FaChevronDown,
  FaCogs,
  FaClipboardList,
  FaChartPie,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiChatVoiceFill } from "react-icons/ri";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CgGames } from "react-icons/cg";
import { MdChecklist } from "react-icons/md";
import { IoClipboardOutline } from "react-icons/io5";

import { ThemeContext } from "../context/theme";

interface MenuItem {
  icon: JSX.Element;
  label: string;
  to?: string;
  subMenu?: MenuItem[];
}

const Dashboard: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const { theme } = useContext(ThemeContext);

  // Debounce effect
  let debounceTimer: NodeJS.Timeout;

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleSubMenu = (label: string) => {
    setIsSubMenuOpen((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  useEffect(() => {
    if (isMinimized) {
      setIsSubMenuOpen({});
    }
  }, [isMinimized]);

  const size = "24px";

  const menuItems: MenuItem[] = [
    { icon: <FaHome size={size} />, label: "Home", to: "/home" },
    {
      icon: <IoClipboardOutline size={size} />,
      label: "WhiteBoard",
      to: "/canvas",
    },
    {
      icon: <FaBell size={size} />,
      label: "Notifications",
      to: "/notifications",
    },
    {
      icon: <IoChatbubbleEllipsesOutline size={size} />,
      label: "Chat",
      subMenu: [
        {
          icon: <RiChatVoiceFill size={size} />,
          label: "VoiceChat",
          to: "/voiceChat",
        },
      ],
    },
    { icon: <CgGames size={size} />, label: "Games", to: "/games" },
    { icon: <MdChecklist size={size} />, label: "To-do List", to: "/todo" },
    {
      icon: <FaChartPie size={size} />,
      label: "Statistics",
      to: "/statistics",
    },
  ];

  const handleMouseEnter = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setIsMinimized(false), 100);
  };

  const handleMouseLeave = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setIsMinimized(true), 100);
  };

  return (
    <div
      id="sidebar"
      className={`flex flex-col h-[85%] p-3 rounded-xl z-50 absolute left-[24px] items-center shadow-xl top-[70px] noselect ${
        isMinimized ? "w-20" : "w-72"
      } ${
        theme
          ? "bg-white text-white-primary"
          : "bg-dark text-dark-primary border-dark-primary border-2"
      } transition-all duration-300 ease-in-out text-xl font-poppins font-medium`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className=" flex-1">
        <div className="flex items-end justify-between">
          {!isMinimized && (
            <h2
              className={`${
                theme ? "text-dark" : "text-white"
              } font-medium text-2xl `}
            >
              Dashboard
            </h2>
          )}
          <button className="p-2" onClick={toggleMinimize}>
            {isMinimized ? (
              <FaClipboardList
                className={`fill-current ${theme ? "text-dark" : "text-white"}`}
                size={size}
              />
            ) : (
              <IoClose
                className={`fill-current ${
                  theme ? "text-dark" : "text-white"
                } mr-[-12px] mb-[-3px]`}
                size={size}
              />
            )}
          </button>
        </div>
        <div className="border-t border-gray-500 mb-4 mt-2" />
        <div className="flex flex-col space-y-3">
          {!isMinimized && (
            <div className="relative border-dark-primary border-2 rounded-lg">
              <span className="absolute inset-y-0 left-0 flex items-center py-4 ">
                <button
                  type="submit"
                  className="pl-2 pb-2.5 focus:outline-none focus:ring"
                >
                  <FaSearch
                    className={`w-5 h-5 ${theme ? "text-dark" : "text-white"}`}
                  />
                </button>
              </span>
              <input
                type="search"
                name="Search"
                placeholder="Search..."
                className={`w-full py-2 pl-10 text-sm rounded-md focus:outline-none ${
                  theme ? "bg-white text-dark" : "bg-dark text-white"
                } focus:${theme ? "bg-dark" : "bg-white-primary"}`}
              />
            </div>
          )}
          <ul className="pt-2 pb-4 space-y-2 text-sm">
            {menuItems.map((item, index) => (
              <li key={index} className="rounded-sm ">
                <a
                  href={item.to || "#"}
                  className={`flex items-center rounded-md justify-between ${
                    theme ? "bg-white text-dark" : "bg-dark text-white"
                  }`}
                  onClick={
                    !isMinimized && item.subMenu
                      ? (e) => {
                          e.preventDefault();
                          toggleSubMenu(item.label);
                        }
                      : undefined
                  }
                >
                  <div className="flex space-x-3 items-center rounded-md p-2">
                    {item.icon}
                    {!isMinimized && (
                      <span className="text-md font-normal">{item.label}</span>
                    )}
                  </div>
                  {item.subMenu && !isMinimized && (
                    <FaChevronDown
                      className={`w-3 h-3 ml-auto transition-transform duration-200 mr-4 ${
                        isSubMenuOpen[item.label] ? "transform rotate-180" : ""
                      } ${theme ? "text-dark" : "text-white"}`}
                    />
                  )}
                </a>
                {item.subMenu && isSubMenuOpen[item.label] && (
                  <ul className="pl-8 mt-1 space-y-1">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex} className="rounded-sm">
                        <a
                          href={subItem.to}
                          className={`flex items-center p-2 space-x-3 rounded-md ${
                            theme ? "bg-white text-dark" : "bg-dark text-white"
                          }`}
                        >
                          {subItem.icon}
                          {!isMinimized && (
                            <span className="text-md font-normal">
                              {subItem.label}
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={`border-t border-gray-500 mt-4 pt-4 space-y-3 w-[85%] ${
          theme ? "bg-white text-dark" : "bg-dark text-white"
        }`}
      >
        <ul className="pt-2 pb-2 space-y-2 text-sm">
          {[
            { icon: <FaCogs size={size} width={"24px"} />, label: "Settings" },
            {
              icon: <FaQuestionCircle size={size} width={"24px"} />,
              label: "FAQ",
            },
            {
              icon: <FaSignOutAlt size={size} width={"24px"} />,
              label: "Logout",
            },
          ].map((item, index) => (
            <li key={index} className="rounded-sm">
              <a
                href="#"
                className={`flex  p-2 space-x-3 rounded-md ${
                  theme ? "bg-white text-dark" : "bg-dark text-white"
                }`}
              >
                {item.icon}
                {!isMinimized && (
                  <span className="text-md font-normal">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
