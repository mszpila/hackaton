import './Health.css'

import ZQuestion from './ZQuestion';
import ZOptions from './ZOptions';
import React, {useState} from 'react';
import {Button} from 'antd'
import MealPrep from './MealPrep';
//import { findByLabelText } from '@testing-library/react';
import SelectedMeals from './SelectedMeals';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


function Health( {setEvents} ) {
    const [filters, setFilters] = useState({veganSelected: false, glutenFreeSelected: false, lactoseSelected: false})
    const [numberTypesMeals, setNumberTypesMeals] = useState(1);
    const [mealsSelected, setMealsSelected] = useState(false);
    const [meals, setMeals] = useState(new Array(numberTypesMeals).fill([]));


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
                    <ZQuestion setNumberTypesMeals={setNumberTypesMeals} numberTypesMeals={numberTypesMeals}/><br></br>
                </div>
                
                <div id='questions'>
                    <ZOptions setFilters={setFilters}/>
                </div>
            </div>
            <div className='ant-btn'>
                <Button > Generate Meals </Button>
            </div>
            
            <SelectedMeals filters={filters} numberTypesMeals={numberTypesMeals}/>

            <div id="continue" onClick={() => setMealsSelected(!mealsSelected)}> Continue <ChevronRightIcon/></div>
            </>

            :
            
            <>
                <div id="meals-header">
                    <h3>Your meals :</h3>
                    {
                        meals.map(meal => <div>{meal.title}</div> || <p>0</p>)
                    }
                <div id="change" onClick={() => setMealsSelected(!mealsSelected)}>Change <ChevronRightIcon/></div>
                </div>
                
                <MealPrep />
            </>


            }
            
            
            
         </div>
     );
}

export default Health;