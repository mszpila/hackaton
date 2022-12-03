import './Health.css'
import ZOptions from './ZOptions';

import ZQuestion from './ZQuestion';
import React, {useState} from 'react';
import {Button} from 'antd'
import MealPrep from './MealPrep';
//import { findByLabelText } from '@testing-library/react';
import SelectedMeals from './SelectedMeals';


function Health( {setEvents} ) {
    const [filters, setFilters] = useState({veganSelected: false, glutenFreeSelected: false, lactoseSelected: false})
    const [numberOfCooking, setNumberOfCooking] = useState(1);
    const [mealsSelected, setMealsSelected] = useState(false);
    
    return ( 
        <div id="health">
            {
                !mealsSelected ?
                <>
                <div id="zheader">
                <h2>Shop Once a week !</h2>
                <br></br>
            </div>
            <div id="input-questions">
                <div id="input">
                    <ZQuestion setNumberOfCooking={setNumberOfCooking} numberOfCooking={numberOfCooking}/><br></br>
                </div>
                
                <div id='questions'>
                    <ZOptions setFilters={setFilters}/>
                </div>
            </div>
            <div className='ant-btn'>
                <Button > Generate Meals </Button>
            </div>
            
            <SelectedMeals filters={filters} numberOfCooking={numberOfCooking}/>
            </>

            :
            
            <>
            <MealPrep />
            </>


            }
            
            

         </div>
     );
}

export default Health;