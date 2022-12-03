import { LockOutlined, UserOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './MainInterface.css';
import { Button, Checkbox, Col, DatePicker, Form, Input, List, Modal, Row, Space, Typography } from 'antd';

import { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { TypeEvents } from '../App';
import { ApplicationRoutePaths } from '../ApplicationRoutes';
import { LoginButtonStyle, LoginFormStyle, LoginInputStyle } from '../auth/styles/LoginFormStyle';

const MainInterface: FC = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('token'));

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  // useEffect(() => {
  //   if (!token) {
  //     navigate(ApplicationRoutePaths.LOGIN);
  //   }
  // }, []);

  const [events, setEvents] = useState<TypeEvents[]>([
    { title: 'event 1', start: '2022-12-02T10:00:00', end: '2022-12-02T12:00:00' },
    { title: 'event 2', date: '2022-12-02' },
  ]);

  const { RangePicker } = DatePicker;
  const weekFormat = 'MM/DD';

  return (
    <Row style={ { height: '100%' } }>
      <Col span={ 18 }>
        <div id='main-interface'>
          <FullCalendar
            height={ '100%' }
            plugins={ [dayGridPlugin, timeGridPlugin, interactionPlugin] }
            initialView='timeGridWeek'
            events={ events }
            // headerToolbar={ { center: 'timeGridWeek' } }
          />
        </div>
      </Col>
      <Col span={ 6 }>
        { [].length ? <List
          header={ <div>Shopping list</div> }
          // footer={<div>Footer</div>}
          bordered
          dataSource={ [] }
          renderItem={ (item) => (
            <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text> { item }
            </List.Item>
          ) }
        /> : <>
          <Button type='primary' onClick={ showModal }>Add meals</Button>
          <Modal
            title='Title'
            open={ open }
            onOk={ handleOk }
            confirmLoading={ confirmLoading }
            onCancel={ handleCancel }
          >
            <Form
              name='normal_login'
              className='login-form'
              initialValues={ {
                remember: true,
              } }
              style={ LoginFormStyle }
            >
              <Typography.Text>How many meals do you want to generate?</Typography.Text>
              <Form.Item style={ LoginInputStyle } name='cook'
                         rules={ [{ required: true, message: 'Input amount of cook' }] }>
                <Input placeholder='Cook amount' />
              </Form.Item>

              <Typography.Text>How many servings?</Typography.Text>
              <Form.Item style={ LoginInputStyle } name='servings'
                         rules={ [{ required: true, message: 'Input amount of servings' }] }>
                <Input placeholder='Servings amount' />
              </Form.Item>

              <Typography.Text>Diet restrictions</Typography.Text>
              <Checkbox>Vegan</Checkbox>
              <Checkbox>Vegetarian</Checkbox>
              <Checkbox>Ketogenic</Checkbox>

              <Typography.Text>Intolerances</Typography.Text>
              <Checkbox>Diary free</Checkbox>
              <Checkbox>Gluten free</Checkbox>

              <Space direction='vertical' size={ 12 }>
                <RangePicker
                  // defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
                  format={ weekFormat }

                />
              </Space>


              {/*<Form.Item style={ LoginInputStyle } name='password'*/ }
              {/*           rules={ [{ required: true, message: 'Please input password' }] }>*/ }
              {/*  <Input onChange={ onChangeSetPassword } prefix={ <LockOutlined className='site-form-item-icon' /> }*/ }
              {/*         type='password' placeholder='Password' />*/ }
              {/*</Form.Item>*/ }

              {/*<Form.Item style={ LoginOptionsStyle }>*/ }
              {/*  <Checkbox checked onChange={ onChangeSetRemember }>Remember me</Checkbox>*/ }
              {/*</Form.Item>*/ }

              <Form.Item>
                <Button style={ LoginButtonStyle } type='primary'>Generate meals</Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
        }
      </Col>

    </Row>
  );
};

export default MainInterface;