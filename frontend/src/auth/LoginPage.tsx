import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationRoutes, { ApplicationRoutePaths } from '../ApplicationRoutes';
import { login } from './api/AuthAPI';
import { LoginButtonStyle, LoginFormStyle, LoginInputStyle } from './styles/LoginFormStyle';


const LoginPage: FC = () => {
  const navigate = useNavigate();
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validateForm = async (e: any) => {
    e.preventDefault();
    const loginData = await login(email, password);

    if (loginData.token) {
      localStorage.setItem('x-token', loginData.token);
      localStorage.setItem('user', loginData.user);

      return navigate('/');
    }
  };

  const onChangeSetUsername = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUsername(e.target.value);
  };

  const onChangeSetPassword = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPassword(e.target.value);
  };

  const navigateToRegister = () => {
    navigate(ApplicationRoutePaths.REGISTER);
  };

  return <>
    <Form
      name='normal_login'
      className='login-form'
      initialValues={ {
        remember: true,
      } }
      style={ LoginFormStyle }
    >
      {/* some breaks */}
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <Form.Item className='center' style={ LoginInputStyle } name='email'
                 rules={ [{ required: true, message: 'Please input email', type: 'email' }] }>
        <Input onChange={ onChangeSetUsername } prefix={ <UserOutlined className='site-form-item-icon' /> }
               placeholder='Email' />
      </Form.Item>

      <Form.Item style={ LoginInputStyle } name='password'
                 rules={ [{ required: true, message: 'Please input password' }] }>
        <Input onChange={ onChangeSetPassword } prefix={ <LockOutlined className='site-form-item-icon' /> }
               type='password' placeholder='Password' />
      </Form.Item>

      {/*<Form.Item style={ LoginOptionsStyle }>*/ }
      {/*  <Checkbox checked onChange={ onChangeSetRemember }>Remember me</Checkbox>*/ }
      {/*</Form.Item>*/ }

      <Form.Item>
        <Button style={ LoginButtonStyle } onClick={ (e) => validateForm(e) } type='primary'>Login</Button>
        <br/>
        <br/>
        <Button style={ LoginButtonStyle } onClick={ navigateToRegister }>Register</Button>
      </Form.Item>
    </Form>
  </>;
};

export default LoginPage;