import axios from 'axios';
import { BASE_URL } from '../constants';

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
  username: string,
  password: string,
): Promise<tokensType> => {
  return axios
    .post<ApiResponse<tokensType>>(
      BASE_URL + '/user/token/',
      { username, password },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
    .then((res) => res.data.data);
};

export const refreshToken = (data: accessTokenProps): Promise<tokensType> => {
  return axios
    .post<ApiResponse<tokensType>>(BASE_URL + '/user/token/refresh', data, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then((res) => res.data.data);
};
