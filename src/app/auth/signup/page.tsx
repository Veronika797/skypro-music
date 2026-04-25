'use client';

import classNames from 'classnames';
import Link from 'next/link';
import styles from './styles.module.css';
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

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

    if (password.length < 8) {
      return setErrorMessage('Пароль должен содержать минимум 8 символов');
    }

    setIsLoading(true);

    try {
      await registerUser({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      router.push('/auth/signin');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const responseData = error.response.data as {
          message?: string;
          data?: {
            errors?: Record<string, string | string[]>;
          };
        };

        if (responseData?.data?.errors) {
          const errors = responseData.data.errors;
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => {
              const msgs = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgs.join(', ')}`;
            })
            .join('\n');

          setErrorMessage(`Ошибка валидации:\n${errorMessages}`);
        } else if (responseData?.message) {
          setErrorMessage(`Ошибка: ${responseData.message}`);
        } else {
          setErrorMessage('Неизвестная ошибка сервера');
        }
      } else {
        setErrorMessage('Ошибка сети. Попробуйте позже');
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
        type="email"
        name="email"
        placeholder="Почта"
        value={email}
        onChange={onChangeEmail}
      />

      <input
        className={styles.modal__input}
        type="text"
        name="username"
        placeholder="Имя пользователя"
        value={username}
        onChange={onChangeUsername}
      />

      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
      />

      <input
        className={styles.modal__input}
        type="password"
        name="repeatPassword"
        placeholder="Повторите пароль"
        value={repeatPassword}
        onChange={onChangeRepeatPassword}
      />

      <div className={styles.errorContainer}>{errorMessage}</div>

      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnSignupEnt}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      <Link href={'/auth/signin'} className={styles.modal__btnSigninEnt}>
        Войти
      </Link>
    </>
  );
}
