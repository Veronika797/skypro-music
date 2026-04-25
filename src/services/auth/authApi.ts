import axios from 'axios';
import { BASE_URL } from '../constants';
import { AxiosError } from 'axios';

type authUserProps = {
  email: string;
  password: string;
};

type authUserReturn = {
  email: string;
  username: string;
  _id: number;
};

type registerUserProps = {
  username: string;
  email: string;
  password: string;
};

type registerUserReturn = {
  message: string;
  result: {
    username: string;
    email: string;
    _id: number;
  };
  success: boolean;
};

type accessTokenProps = {
  access: string;
};

type refreshTokenProps = {
  refresh: string;
};

type tokensType = accessTokenProps & refreshTokenProps;

interface ApiResponse<T> {
  data: T;
}

interface UniversalApiResponse<T> {
  data?: T;
  result?: T;
  message?: string;
  success?: boolean;
}

export const authUser = (data: authUserProps): Promise<authUserReturn> => {
  return axios
    .post<ApiResponse<authUserReturn>>(BASE_URL + '/user/login/', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then((res) => res.data.data);
};

export const registerUser = (
  data: registerUserProps,
): Promise<registerUserReturn> => {
  return axios
    .post<ApiResponse<registerUserReturn>>(BASE_URL + '/user/signup/', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then((res) => res.data.data);
};

export const getToken = (
  email: string,
  password: string,
): Promise<tokensType> => {
  return axios
    .post<UniversalApiResponse<tokensType>>(
      BASE_URL + '/user/token/',
      { email: email, password },
      {
        headers: { 'content-type': 'application/json' },
      },
    )
    .then((res) => {
      const tokens =
        res.data?.data || res.data?.result || (res.data as tokensType);

      if (!tokens?.access || !tokens?.refresh) {
        throw new Error('Сервер не вернул токены');
      }

      return tokens;
    })
    .catch(async (error: unknown) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return axios
          .post<
            UniversalApiResponse<tokensType>
          >(BASE_URL + '/user/token/', { username: email, password }, { headers: { 'content-type': 'application/json' } })
          .then((res) => {
            const tokens =
              res.data?.data || res.data?.result || (res.data as tokensType);

            if (!tokens?.access || !tokens?.refresh) {
              throw new Error('Сервер не вернул токены');
            }
            return tokens;
          });
      }
      throw error;
    });
};

export const refreshToken = (data: refreshTokenProps): Promise<tokensType> => {
  return axios
    .post<ApiResponse<tokensType>>(BASE_URL + '/user/token/refresh/', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then((res) => res.data.data);
};
