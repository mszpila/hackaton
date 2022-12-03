import './Header.css'

import { Button } from 'antd';

function Header( { setSelectedView } ) {
    return ( 
        <div id="header">
            <Button onClick = {()=> setSelectedView("MainInterface")}>schedule</Button>
            <Button onClick = {()=> setSelectedView("Health")}>Health</Button>
        </div>
     );
}

export default Header;