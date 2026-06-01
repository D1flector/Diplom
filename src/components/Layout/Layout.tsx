import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { logoutSuccess } from "../../store/auth/authSlice";
import {
  LayoutDashboard,
  Calendar,
  FolderOpen,
  LogOut,
  User as UserIcon,
  FileText,
} from "lucide-react";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };

  // Сжатое меню из 4 ключевых разделов
  const menuItems = [
    {
      path: "/dashboard",
      name: "Обзор проекта",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/directories",
      name: "Справочники",
      icon: <FolderOpen size={20} />,
    },
    {
      path: "/inputs",
      name: "Входные документы",
      icon: <FileText size={20} />,
    },
    {
      path: "/outputs",
      name: "Выходные документы",
      icon: <Calendar size={20} />,
    },
  ];

  return (
    <div className={styles.appShell}>
      {/* Боковое меню (Sidebar) */}
      <aside className={styles.sidebar}>
        <div>
          {/* Область логотипа */}
          <div className={styles.logoArea}>
            <div className={styles.logoBox}>М</div>
            <span className={styles.logoText}>АО «МСУ-1»</span>
          </div>

          {/* Список навигации */}
          <nav className={styles.navigation}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? styles.activeNavLink : styles.navLink
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Профиль пользователя */}
        <div className={styles.profileArea}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              <UserIcon size={18} />
            </div>
            <div className={styles.userInfo}>
              <h4 className={styles.userName}>
                {user?.username || "Пользователь"}
              </h4>
              <p className={styles.userRole}>
                {user?.role || "Роль не определена"}
              </p>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={14} />
            Выйти из системы
          </button>
        </div>
      </aside>

      {/* Рабочая область */}
      <div className={styles.mainArea}>
        <header className={styles.header}>
          <h2>ПТО АО «МСУ-1»</h2>
          <div className={styles.headerMeta}>Кабинет планирования СМР</div>
        </header>

        <main className={styles.content}>
          <div className={styles.contentWrapper}>{children}</div>
        </main>
      </div>
    </div>
  );
};
