import './Header.css';

import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ApplicationRoutePaths } from '../ApplicationRoutes';

function Header() {
  const navigate = useNavigate();

  return (
    <div id='header'>
      <Button onClick={() => navigate(ApplicationRoutePaths.HOME)}>schedule</Button>
      <Button onClick={() => navigate(ApplicationRoutePaths.HEALTH)}>Health</Button>
    </div>
  );
}

export default Header;