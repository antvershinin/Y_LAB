import React, { FormEvent, useEffect, useState } from "react";
import styles from "./AuthForm.module.css";
import logo from "../../assets/authForm/logo.png";
import { authUser } from "../../api/AuthApi";
import manIcon from '../../../src/assets/authForm/man.png'

interface IInputStyles {
  emailError?: string;
  passError?: string;
  authError?: string;
}

interface IFormErrors {
  emailError?: boolean;
  passwordError?: boolean;
}

interface IUser {
  firstName :string,
  lastName:string
  phone:string
}

export const AuthForm = () => {
  const [user, setUser] = useState<IUser>()
  const [formErrors, setFormErrors] = useState<IFormErrors>();
  const [inputStyles, setInputStyles] = useState<IInputStyles>();
  const [buttonVisible, setButtonVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result : IUser | undefined = await authUser({ email, password });
    if (result === undefined) {
      alert("Неверный логин или пароль");
      setInputStyles({ ...inputStyles, authError: `${styles.red}` });
      setLoading(false);
    } else {
      setUser(result)
      setInputStyles({authError:`${styles.green}`})
      setLoading(false);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value
      .replace(/[а-я]/gi, "")
      .trim()
      .toLocaleLowerCase();
    setEmail(e.target.value);
    if (e.target.value.length === 0) setFormErrors({ emailError: true });
    else {
      (e.target.value.includes("@") && e.target.value.includes(".")) ||
        setFormErrors({ emailError: true });
      e.target.value.includes("@") &&
        e.target.value.includes(".") &&
        !e.target.value.endsWith(".") &&
        setFormErrors({})
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[а-я]/gi, "").trim();
    setPassword(e.target.value);
    if (e.target.value.length < 5 && e.target.value.length)
      setFormErrors({ passwordError: true });
    else {
      setFormErrors({});
    }
  };

  useEffect(() => {
    if (email.length || (email.length && password.length)) {
      formErrors?.emailError
        ? setInputStyles({ ...inputStyles, emailError: `${styles.red}` })
        : !password.length
        ? setInputStyles({
            ...inputStyles,
            emailError: `${styles.green}`,
          })
        : formErrors?.passwordError
        ? setInputStyles({ ...inputStyles, passError: `${styles.red}` })
        : setInputStyles({
            ...inputStyles,
            passError: `${styles.green}`,
            emailError: `${styles.green}`,
          });
    }
    if (
      email.length &&
      password.length &&
      !formErrors?.emailError &&
      !formErrors?.passwordError
    ) {
      setButtonVisible(true);
    }
  }, [formErrors, email.length, password.length]);

  return (
    <div
      className={`${styles.wrapper} ${inputStyles && inputStyles.authError}`}
    >
      <div
        className={`${styles.loader} ${loading && styles.loaderVisible}`}
      ><div className={styles.loaderSpinner} /></div>
      <div className={styles.logoWrapper}>
        <img src={logo} className={styles.image} />
      </div>
      <div className={styles.divider} />
        {user ? (
          <div className={styles.profileWrapper}>
            <div className={styles.avatarWrapper}>
              <img className={styles.image} src={manIcon}/>
            </div>
            <div className={styles.profileInfo}>
              <span>👥{user.firstName} {user.lastName}</span>
              <span>✆ {user.phone}</span>
            </div>
          </div>
        ) : (
      <div className={styles.formWrapper}>
        <div className={styles.formTitle}>
          <h2>Авторизация</h2>
        </div>
        <form className={styles.formContent} onSubmit={(e) => handleSubmit(e)}>
          <div>
            <input
              placeholder="✉ Email"
              className={`${styles.input}  ${styles.inputVisible} ${
                inputStyles && inputStyles.emailError
              }`}
              onChange={(e) => {
                handleChangeEmail(e);
              }}
            />
          </div>

          <div>
            <input
              onChange={(e) => handleChangePassword(e)}
              placeholder="ꗃ Password"
              className={`${styles.input}
              ${inputStyles && inputStyles.passError}`}
              type="password"
            />
          </div>

          <button
            type="submit"
            className={`${styles.formButton} ${
              buttonVisible && styles.buttonVisible
            }`}
          >
            Войти
          </button>
        </form>
      </div>
        )}
    </div>
  );
};
