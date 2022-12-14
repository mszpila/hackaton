import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Checkbox, Col, Collapse, Divider, Form, InputNumber, List, Modal, Row, Space, TimePicker, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationRoutePaths } from '../ApplicationRoutes';
import { LoginButtonStyle, LoginFormStyle } from '../auth/styles/LoginFormStyle';
import { generateWeeklyPlan, getCurrentWeeklyPlan, getShoppingList, getWeeklyPlan, IShoppingListItem, IWeeklyPlan } from './api/WeeklyPlanAPI';
import './MainInterface.css';

dayjs.extend(weekday);

const MainInterface: FC = () => {

  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('x-token'));
  const [weeklyPlan, setWeeklyPlan] = useState<IWeeklyPlan | null>(null);
  const [shoppingList, setShoppingList] = useState<IShoppingListItem[]>([]);

  const [open, setOpen] = useState(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const [modalText, setModalText] = useState('Content of the modal');

  const showModal = () => {
    setOpen(true);
  };
  const showPopUp = () => {
    setPopUpOpen(true);
  };

  const fetchData = async (token: string) => {
    const currentWeeklyPlan = await getCurrentWeeklyPlan(token!);

    if (currentWeeklyPlan) {
      const fetchedWeeklyPlan = await getWeeklyPlan(token!, currentWeeklyPlan.id);
      setWeeklyPlan(fetchedWeeklyPlan);

      if (fetchedWeeklyPlan) {
        const shoppingList = await getShoppingList(token!, fetchedWeeklyPlan.id);
        setShoppingList(shoppingList);
      }
    }

  };

  //hidden login

  useEffect(() => {
    if (!token) {
      return navigate(ApplicationRoutePaths.LOGIN);
    }

    fetchData(token);
  }, []);

  // const handleOk = () => {
  //   setModalText('The modal will be closed after two seconds');
  //   setConfirmLoading(true);
  //   setTimeout(() => {
  //     setOpen(false);
  //     setConfirmLoading(false);
  //   }, 2000);
  // };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const handlePopUpCancel = () => {
    setPopUpOpen(false);
  };

  const [mealsNumber, setMealsNumber] = useState(0);
  const setMealAmountOnChange = (e: any) => {
    setMealsNumber(e);
  };

  const [peopleNumber, setPeopleNumber] = useState(0);
  const setPeopleNumberOnChange = (e: any) => {
    setPeopleNumber(e);
  };

  const [vegan, setVegan] = useState(false);
  const setVeganOnChange = (e: CheckboxChangeEvent) => {
    setVegan(e.target.checked);
  };

  const [vegetarian, setVegetarian] = useState(false);
  const setVegetarianOnChange = (e: CheckboxChangeEvent) => {
    setVegetarian(e.target.checked);
  };

  const [ketogenic, setKetogenic] = useState(false);
  const setKetogenicOnChange = (e: CheckboxChangeEvent) => {
    setKetogenic(e.target.checked);
  };

  const [dairyFree, setDairyFree] = useState(false);
  const setDairyFreeOnChange = (e: CheckboxChangeEvent) => {
    setDairyFree(e.target.checked);
  };

  const [glutenFree, setGlutenFree] = useState(false);
  const setGlutenFreeOnChange = (e: CheckboxChangeEvent) => {
    setGlutenFree(e.target.checked);
  };

  const [dates, setDates] = useState<string[]>([]);

  const addDate = (time: Dayjs, dayOfTheWeek: number): void => {
    // if (time.toDate().getTime() < dayjs().toDate().getTime()) {
    //   message.error('Cannot use passed date');
    // }

    setDates(prevState => [...prevState, time.day(dayOfTheWeek).toISOString()]);
    console.log(dates);
  };

  const generateMeals = async () => {
    const diets: string[] = [];
    if (vegan) diets.push('VEGAN');
    if (vegetarian) diets.push('VEGETARIAN');
    if (ketogenic) diets.push('KETOGENIC');

    const intolerances: string[] = [];
    if (dairyFree) diets.push('DAIRY_FREE');
    if (glutenFree) diets.push('GLUTEN_FREE');

    const generatedWeeklyPlan = await generateWeeklyPlan(token!, {
      dates,
      mealsNumber,
      peopleNumber,
      diets,
      intolerances,
    });

    const weeklyPlan = await getWeeklyPlan(token!, generatedWeeklyPlan.id);
    setWeeklyPlan(weeklyPlan);

    const shoppingList = await getShoppingList(token!, weeklyPlan.id);
    setShoppingList(shoppingList);
  };

  return (
    <Row style={{ height: '100%' }}>
      <Col span={18}>
        <div id='main-interface'>
          <FullCalendar
            height={'100%'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='timeGridWeek'
            events={ weeklyPlan ? weeklyPlan.recipes : [] }
            editable={ true }
            // headerToolbar={ { center: 'timeGridWeek' } }
          />
        </div>
      </Col>
      <Col span={6}>
        {shoppingList.length ? <List
          header={<div>Shopping list</div>}
          // footer={<div>Footer</div>}
          bordered
          dataSource={shoppingList}
          renderItem={(item) => (
            <List.Item>
              <>
                <Typography.Text mark>{item.name} {item.amount} {item.unit}</Typography.Text>
              </>
            </List.Item>
          )}
        /> : <>
          <Button type='primary' onClick={ showModal }>Add meals</Button>
          <Modal
            title='recipie'
            open={ popUpOpen }
            onCancel={ handlePopUpCancel }>
            Sow Recipe here
          </Modal>

          <Modal
            title='Generate meals'
            open={ open }
            // onOk={ handleOk }
            confirmLoading={ confirmLoading }
            onCancel={ handleCancel }
          >
            <Form
              name='normal_login'
              className='login-form'
              initialValues={{
                remember: true,
              }}
              style={LoginFormStyle}
            >
              <Typography.Text className='larger_text'>How many meals do you want to generate?</Typography.Text>
              <InputNumber min={1} max={14} onChange={setMealAmountOnChange} />

              <Typography.Text className='larger_text'>How many servings?</Typography.Text>
              <InputNumber min={ 1 } max={ 4 } onChange={ setPeopleNumberOnChange } />

              <Typography.Text className='larger_text'>Diet restrictions</Typography.Text>
              <Space split={<Divider type="horizontal" />}>
                <Checkbox onChange={setVeganOnChange}>Vegan</Checkbox>
                <Checkbox onChange={setVegetarianOnChange}>Vegetarian</Checkbox>
                <Checkbox onChange={setKetogenicOnChange}>Ketogenic</Checkbox>
              </Space>


              <Typography.Text className='larger_text'>Intolerances</Typography.Text>
              <Space split={<Divider type="horizontal" />}>
                <Checkbox onChange={setDairyFreeOnChange}>Diary free</Checkbox>
                <Checkbox onChange={setGlutenFreeOnChange}>Gluten free</Checkbox>
              </Space>

              <Collapse className='wider'>
                <Collapse.Panel header='Monday' key='1'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 1)} />
                </Collapse.Panel>
                <Collapse.Panel header='Tuesday' key='2'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 2)} />
                </Collapse.Panel>
                <Collapse.Panel className='wider' header='Wednesday' key='3'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 3)} />
                </Collapse.Panel>
                <Collapse.Panel header='Thursday' key='4'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 4)} />
                </Collapse.Panel>
                <Collapse.Panel header='Friday' key='5'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 5)} />
                </Collapse.Panel>
                <Collapse.Panel header='Saturday' key='6'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 6)} />
                </Collapse.Panel>
                <Collapse.Panel header='Sunday' key='7'>
                  <TimePicker className='wider' onChange={(time) => time && addDate(time, 0)} />
                </Collapse.Panel>
              </Collapse>

              <Form.Item>
                <br />
                <Button style={LoginButtonStyle} type='primary' onClick={generateMeals}>Generate meals</Button>
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