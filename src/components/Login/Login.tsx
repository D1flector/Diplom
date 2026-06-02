import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { KeyRound, User as UserIcon } from "lucide-react";
import styles from "./Login.module.scss";

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!username.trim() || !password.trim()) {
      setLocalError("Пожалуйста, заполните все поля ввода");
      return;
    }

    try {
      await dispatch(
        loginUser({ username: username.trim(), password }),
      ).unwrap();
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
    }
  };

  const activeError = localError || error;

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
          {activeError && <div className={styles.error}>{activeError}</div>}

          <div className={styles.formGroup}>
            <label>Имя пользователя</label>
            <div className={styles.inputWrapper}>
              <span className={styles.icon}>
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                required
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                placeholder="Введите логин"
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
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Выполняется вход..." : "Войти в систему"}
          </button>
        </form>
      </div>
    </div>
  );
};
