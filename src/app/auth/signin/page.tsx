'use client';

import classNames from 'classnames';
import Link from 'next/link';
import styles from './styles.module.css';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { authUser, getToken } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/store';
import {
  setAccessToken,
  setRefreshToken,
  setUsername,
} from '@/store/features/authSlice';

export default function Signin() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChangeEmail = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setPassword(e.target.value);
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }
    setIsLoading(true);

    authUser({ email, password })
      .then(() => {
        dispatch(setUsername(email));
        return getToken(email, password);
      })
      .then((res) => {
        dispatch(setAccessToken(res.access));
        dispatch(setRefreshToken(res.refresh));
        router.push('/music/main');
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response) {
            setErrorMessage(error.response.data.message);
          } else if (error.request) {
            setErrorMessage('Отсутствует интернет. Попробуйте позже');
          } else {
            setErrorMessage('Неизвестная ошибка. Попробуйте позже');
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        name="login"
        placeholder="Почта"
        onChange={onChangeEmail}
      />

      <input
        className={classNames(styles.modal__input)}
        type="password"
        name="password"
        placeholder="Пароль"
        onChange={onChangePassword}
      />

      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnEnter}
      >
        Войти
      </button>
      <Link href={'/auth/signup'} className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </>
  );
}
