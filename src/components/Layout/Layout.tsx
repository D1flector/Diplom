import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
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
  BookOpen,
  HelpCircle,
  Settings,
  FileEdit,
  Users,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from "lucide-react";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeStep, setActiveStep] = useState<number | null>(1);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };

  const toggleStep = (stepIdx: number) => {
    setActiveStep(activeStep === stepIdx ? null : stepIdx);
  };

  const isDashboard = location.pathname === "/dashboard";

  const menuItems = [
    {
      path: "/dashboard",
      name: "Обзор проекта",
      icon: <LayoutDashboard size={20} />,
      allowedRoles: ["Инженер ПТО", "Руководитель проекта", "Администратор"],
    },
    {
      path: "/directories",
      name: "Справочники",
      icon: <FolderOpen size={20} />,
      allowedRoles: ["Инженер ПТО", "Администратор"],
    },
    {
      path: "/inputs",
      name: "Входные документы",
      icon: <FileText size={20} />,
      allowedRoles: ["Инженер ПТО", "Администратор", "Руководитель проекта"],
    },
    {
      path: "/outputs",
      name: "Выходные документы",
      icon: <Calendar size={20} />,
      allowedRoles: ["Инженер ПТО", "Руководитель проекта", "Администратор"],
    },
  ];

  const steps = [
    {
      id: 1,
      title: "Шаг 1. Убедитесь в правильности заполнения справочников",
      icon: <Settings size={20} />,
      content: (
        <p>
          Перед запуском расчетов проверьте правильность и актуальность в
          разделе «Справочники».
        </p>
      ),
    },
    {
      id: 2,
      title: "Шаг 2. Проверьте правильность заполнения входных документов",
      icon: <FileEdit size={20} />,
      content: (
        <p>
          Убедитесь, что все данные корректно внесены в разделе «Входные
          документы».
        </p>
      ),
    },
    {
      id: 3,
      title: "Шаг 3. Перейдите в раздел выходных документов и запустите расчет",
      icon: <PlayCircle size={20} />,
      content: (
        <p>
          Откройте страницу «Выходные документы», нажмите кнопку «Рассчитать»
          для запуска планирования.
        </p>
      ),
    },
    {
      id: 4,
      title: "Шаг 4. Сформируйте готовые планы и экспортируйте в Excel или PDF",
      icon: <FileText size={20} />,
      content: (
        <p>
          После завершения расчета выберите нужный плановый документ для
          предпросмотра, распечатайте его в PDF или выгрузите в Excel-файл.
        </p>
      ),
    },
  ];

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.logoArea}>
            <div className={styles.logoBox}>М</div>
            <span className={styles.logoText}>АО «МСУ-1»</span>
          </div>

          <nav className={styles.navigation}>
            {menuItems
              .filter((item) => item.allowedRoles.includes(user?.role || ""))
              .map((item) => (
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

        <div className={styles.profileArea}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              <UserIcon size={18} />
            </div>
            <div className={styles.userInfo}>
              <h4 className={styles.userName}>
                {user?.full_name || user?.username || "Пользователь"}
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

      <div className={styles.mainArea}>
        <header className={styles.header}>
          <h2>ПТО АО «МСУ-1»</h2>
          <div className={styles.headerMeta}>Кабинет планирования СМР</div>
        </header>

        <main className={styles.content}>
          <div className={styles.contentWrapper}>
            {isDashboard ? (
              <div className={styles.stepsList}>
                <div className={styles.guideWelcome}>
                  <h2>
                    <BookOpen size={24} />
                    Интерактивное руководство пользователя АСУ
                  </h2>
                  <p>
                    Добро пожаловать в систему автоматизации ПТО АО «МСУ-1»,{" "}
                    <strong>{user?.full_name || user?.username}</strong>!
                  </p>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.75rem" }}>
                    Ваша системная роль:{" "}
                    <strong style={{ color: "#3b82f6" }}>{user?.role}</strong> |
                    Статус системы:{" "}
                    <strong style={{ color: "#10b981" }}>
                      Готова к расчетам
                    </strong>
                  </p>
                </div>

                <div className={styles.guideContainer}>
                  <div className={styles.guideHeader}>
                    <HelpCircle size={18} />
                    <span>Руководство по пользованию системой</span>
                  </div>

                  <div className={styles.stepsList}>
                    {steps.map((step) => {
                      const isOpen = activeStep === step.id;
                      return (
                        <div
                          key={step.id}
                          className={
                            isOpen ? styles.stepCardActive : styles.stepCard
                          }
                        >
                          <div
                            className={styles.stepHeader}
                            onClick={() => toggleStep(step.id)}
                          >
                            <div className={styles.stepTitleBox}>
                              <span className={styles.stepIcon}>
                                {step.icon}
                              </span>
                              <span>{step.title}</span>
                            </div>
                            <span className={styles.chevron}>
                              {isOpen ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </span>
                          </div>
                          {isOpen && (
                            <div className={styles.stepContent}>
                              {step.content}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.footerNote}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>
                    При возникновении вопросов по работе алгоритмов
                    планирования, пожалуйста, обратитесь к Системному
                    администратору ПТО.
                  </span>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
