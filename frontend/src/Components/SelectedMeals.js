import { useEffect, useState } from 'react'
import CachedIcon from '@mui/icons-material/Cached';

function SelectedMeals( {filters, numberTypesMeals}) {
    
    
    useEffect(() => {
      
    }, [meal])
    

    let meal = fetch('').then(response => response.JSON)
    return ( 
        <div id="selected-meals">
            <h2>Meal 1 :</h2>



            <h2>Meal 2 :</h2>


        </div>
     );
}

export default SelectedMeals;