'use client';

import classNames from 'classnames';
import Link from 'next/link';
import styles from './singup.module.css';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { registerUser } from '@/services/auth/authApi';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrorMessage('');
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    setErrorMessage('');
  };

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !repeatPassword.trim()
    ) {
      return setErrorMessage('Необходимо заполнить все поля');
    }

    if (password.trim() !== repeatPassword.trim()) {
      return setErrorMessage('Пароли не совпадают');
    }
    setIsLoading(true);

    try {
      await registerUser({ email, username, password });
      router.push('/auth/signin');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setErrorMessage(error.response.data.message || 'Ошибка решистрации');
        } else if (error.request) {
          setErrorMessage('Отсутствует интернет. Попробуйте позже');
        }
      } else {
        setErrorMessage('Неизвестная ошибка. Попробуйте позже');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <Image src="/img/logo_modal.png" alt="logo" width={140} height={21} />
        </div>
      </Link>

      <input
        className={classNames(styles.modal__input, styles.login)}
        type="text"
        name="login"
        placeholder="Почта"
        onChange={onChangeEmail}
      />
      <input
        className={styles.modal__input}
        type="text"
        name="username"
        placeholder="Имя пользователя"
        onChange={onChangeUsername}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={onChangePassword}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Повторите пароль"
        onChange={onChangeRepeatPassword}
      />
      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnSignupEnt}
      >
        Зарегистрироваться
      </button>
    </>
  );
}
