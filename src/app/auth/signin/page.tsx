'use client';

import classNames from 'classnames';
import Link from 'next/link';
import styles from './styles.module.css';
import Image from 'next/image';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { getToken } from '@/services/auth/authApi';
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

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }
    setIsLoading(true);

    try {
      const tokens = await getToken(email, password);

      if (!tokens?.access || !tokens?.refresh) {
        throw new Error('Сервер не вернул токены доступа');
      }

      dispatch(setUsername(email));
      dispatch(setAccessToken(tokens.access));
      dispatch(setRefreshToken(tokens.refresh));

      router.replace('/music/main');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.data) {
          const data = error.response.data;
          const msg =
            data.message ||
            data.error ||
            (typeof data === 'string' ? data : 'Неверный логин или пароль');
          setErrorMessage(msg);
        } else if (error.request) {
          setErrorMessage('Нет ответа от сервера. Проверьте интернет.');
        } else {
          setErrorMessage(error.message || 'Произошла ошибка при входе.');
        }
      } else {
        setErrorMessage('Неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.modal__form} onSubmit={onSubmit}>
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
        className={classNames(styles.modal__input)}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
      />

      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        type="submit"
        disabled={isLoading}
        className={styles.modal__btnEnter}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
      <Link href={'/auth/signup'} className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </form>
  );
}
