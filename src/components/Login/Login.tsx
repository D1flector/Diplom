import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/auth/authSlice"; // Импортируем экшен из стора
import type { UserRole } from "../../types/entities";
import { useNavigate } from "react-router-dom";
import { KeyRound, User as UserIcon } from "lucide-react";
import styles from "./Login.module.scss";

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Пожалуйста, заполните все поля ввода");
      return;
    }

    setError("");

    // Имитация бэкенда: определяем роль по логину
    let determinedRole: UserRole = "Инженер ПТО";

    if (username.toLowerCase() === "director") {
      determinedRole = "Руководитель проекта";
    } else if (username.toLowerCase() === "admin") {
      determinedRole = "Администратор";
    }

    // Отправляем данные в Redux-стор
    dispatch(loginSuccess({ username, role: determinedRole }));
    navigate("/dashboard"); // Перенаправляем пользователя на дашборд
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <div className={styles.logo}>М</div>
          <h2 className={styles.title}>АО «МСУ-1»</h2>
          <p className={styles.subtitle}>
            Подсистема автоматизации планирования СМР
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label>Имя пользователя</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Иванов И.И."
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Пароль</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>
                <KeyRound size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Войти в систему
          </button>
        </form>
      </div>
    </div>
  );
};
