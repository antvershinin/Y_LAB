import React, { FormEvent, useEffect, useState } from "react";
import styles from "./AuthForm.module.css";
import logo from "../../assets/authForm/logo.png";

interface IInputStyles {
  visible?: string;
  emailError?: string;
  passError?: string;
}

interface IFormErrors {
  emailError?: boolean;
  passwordError?: boolean;
}

export const AuthForm = () => {
  const [formErrors, setFormErrors] = useState<IFormErrors>();
  const [inputStyles, setInputStyles] = useState<IInputStyles>();
  const [buttonVisible, setButtonVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value[e.target.value.length + 1] === "a") return;
    e.target.value = e.target.value.trim();
    setEmail(e.target.value);
    if (e.target.value.length === 0) setFormErrors({ emailError: true });
    else {
      (e.target.value.includes("@") && e.target.value.includes(".")) ||
        setFormErrors({ emailError: true });
      e.target.value.includes("@") &&
        e.target.value.includes(".") &&
        !e.target.value.endsWith(".") &&
        setFormErrors({});
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.trim();
    setPassword(e.target.value);
    if (e.target.value.length < 6 && e.target.value.length)
      setFormErrors({ passwordError: true });
    else {
      setFormErrors({});
    }
  };

  useEffect(() => {
    if (email.length) {
      formErrors?.emailError
        ? setInputStyles({ emailError: `${styles.red}` })
        : !password.length
        ? setInputStyles({
            emailError: `${styles.green}`,
            visible: `${styles.inputVisible}`,
          })
        : formErrors?.passwordError
        ? setInputStyles({ ...inputStyles, passError: `${styles.red}` })
        : setInputStyles({ ...inputStyles, passError: `${styles.green}` });
    }
    if (
      email.length &&
      password.length &&
      !formErrors?.emailError &&
      !formErrors?.passwordError
    ) {
      setButtonVisible(true);
    } else setButtonVisible(false);
    console.log(formErrors?.passwordError);
  }, [formErrors, email.length, password.length]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <img src={logo} className={styles.image} />
      </div>
      <div className={styles.divider} />
      <div className={styles.formWrapper}>
        <div className={styles.formTitle}>
          <h2>Login</h2>
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
              className={`${styles.input} ${
                inputStyles && inputStyles.visible
              } ${inputStyles && inputStyles.passError}`}
              type="password"
            />
          </div>

          <button
            type="submit"
            className={`${styles.formButton} ${
              buttonVisible && styles.inputVisible
            }`}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
