import { message } from 'antd';
import { apiClient } from '../../api';

export interface ILoginData {
  token: string;
  user: string;
}

export const login = (email: string, password: string) =>
  apiClient(null)
    .url('/auth/login')
    .post({ email, password })
    .badRequest(() => message.error('Wrong credentials'))
    .notFound(() => message.error('Wrong credentials'))
    .json<ILoginData>();

export const singup = (email: string, password: string, firstName: string, lastName: string) =>
  apiClient(null)
    .url('/auth/singup')
    .post({ email, password, firstName, lastName })
    .notFound(() => message.error('Wrong credentials'))
    .json<ILoginData>();

export const logout = () =>
  apiClient(null)
    .url('/auth/logout')
    .post()
    .res();