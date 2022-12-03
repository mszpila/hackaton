import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, singup } from './api/AuthAPI';
import { LoginButtonStyle, LoginFormStyle, LoginInputStyle } from './styles/LoginFormStyle';

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const validateForm = async () => {
    const registerData = await singup(email, password, firstName, lastName);

    if (registerData) {
      localStorage.setItem('x-token', registerData.token);
      localStorage.setItem('user', registerData.user);

      return navigate('/');
    }
  };

  const onChangeSetEmail = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmail(e.target.value);
  };

  const onChangeSetPassword = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPassword(e.target.value);
  };

  const onChangeSetFirstName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFirstName(e.target.value);
  };

  const onChangeSetLastName = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLastName(e.target.value);
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
      <Form.Item style={ LoginInputStyle } name='email'
                 rules={ [{ required: true, message: 'Please input email', type: 'email' }] }>
        <Input onChange={ onChangeSetEmail } prefix={ <UserOutlined className='site-form-item-icon' /> }
               placeholder='Email' />
      </Form.Item>

      <Form.Item style={ LoginInputStyle } name='password'
                 rules={ [{ required: true, message: 'Please input password' }] }>
        <Input onChange={ onChangeSetPassword } prefix={ <LockOutlined className='site-form-item-icon' /> }
               type='password' placeholder='Password' />
      </Form.Item>

      <Form.Item style={ LoginInputStyle } name='firstName'
                 rules={ [{ required: true, message: 'Please input first name' }] }>
        <Input onChange={ onChangeSetEmail } prefix={ <UserOutlined className='site-form-item-icon' /> }
               placeholder='First name' />
      </Form.Item>

      <Form.Item style={ LoginInputStyle } name='lastName'
                 rules={ [{ required: true, message: 'Please input last name' }] }>
        <Input onChange={ onChangeSetEmail } prefix={ <UserOutlined className='site-form-item-icon' /> }
               placeholder='Last name' />
      </Form.Item>


      <Form.Item>
        <Button style={ LoginButtonStyle } onClick={ validateForm } type='primary'>Register</Button>
      </Form.Item>
    </Form>
  </>;
};

export default RegisterPage;