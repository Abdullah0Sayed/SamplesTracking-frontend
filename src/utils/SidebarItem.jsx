import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const SidebarItem = ({ item, onClick }) => {
  const { t } = useTranslation("global");
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const baseClass = "w-full flex items-center gap-2 p-2 rounded-md transition ";

  const activeClass = "bg-primary-color/20 text-primary-color font-bold";

  const inactiveClass = "hover:bg-primary-color hover:text-white";

  // 🔥 افتح submenu لو route active
  useEffect(() => {
    if (item.children) {
      const isChildActive = item.children.some((child) =>
        location.pathname.includes(child.to),
      );
      setOpen(isChildActive);
    }
  }, [location.pathname]);

  if (item.children) {
    return (
      <li>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls={`submenu-${item.label}`}
          className={`${baseClass} justify-between`}
        >
          <div className="flex gap-2 ">
            <item.icon />
            {t(item.label)}
          </div>
          {open ? <BiChevronUp /> : <BiChevronDown />}
        </button>

        {open && (
          <ul id={`submenu-${item.label}`} className="pl-6 mt-1 space-y-1">
            {item.children.map((child, idx) => (
              <NavLink
                key={idx}
                to={child.to}
                end
                onClick={onClick}
                className={({ isActive }) =>
                  `${baseClass} text-sm ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {t(child.label)}
              </NavLink>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.to}
        end={item.exact === true}
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        <item.icon />
        {t(item.label)}
      </NavLink>
    </li>
  );
};

export default SidebarItem;
