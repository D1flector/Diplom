import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { Login } from "./components/Login/Login";
import { Layout } from "./components/Layout/Layout";
import { Directories } from "./pages/Directories/Directories";
import { Inputs } from "./pages/Inputs/Inputs";
import { Outputs } from "./pages/Outputs/Outputs";

// Информационная панель дашборда (Обзор проекта) - без инлайн-стилей
const MockDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div>
      <h2 className="pageTitle">Обзор строительного проекта ЖК «Северный»</h2>
      <p className="pageText">
        Добро пожаловать в систему автоматизации ПТО, {user?.username}!
      </p>
      <p className="pageText marginTopSm">
        Системная роль: <strong className="highlightText">{user?.role}</strong>
      </p>
    </div>
  );
};

// Компонент защиты приватных страниц (проверяет авторизацию в Redux)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичный маршрут входа */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Приватная часть приложения под единым Sidebar-интерфейсом */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Автоматический перенаправление с корня на дашборд */}
                  <Route
                    path=""
                    element={<Navigate to="dashboard" replace />}
                  />

                  {/* Подключение реальных разделов и заглушек */}
                  <Route path="dashboard" element={<MockDashboard />} />
                  <Route path="directories" element={<Directories />} />

                  {/* Временные заглушки для новых разделов по нашему новому плану */}
                  <Route path="inputs" element={<Inputs />} />
                  <Route path="outputs" element={<Outputs />} />

                  {/* Перенаправление всех ненайденных путей на дашборд */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
