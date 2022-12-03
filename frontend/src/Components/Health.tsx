import './Health.css';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationRoutePaths } from '../ApplicationRoutes';

import ZHeader from './ZHeader';
import ZQuestion from './ZQuestion';

function Health() {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('token'));

  const [filters, setFilters] = useState({ veganSelected: false, glutenFreeSelected: false, lactoseSelected: false });
  const [numberOfCooking, setNumberOfCooking] = useState(1);
  const [mealsSelected, setMealsSelected] = useState(false);

  // useEffect(() => {
  //   if (!token) {
  //     navigate(ApplicationRoutePaths.LOGIN);
  //   }
  // }, []);

  return <></>;
}

export default Health;