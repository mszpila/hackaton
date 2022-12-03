import { useEffect, useState } from 'react'

function SelectedMeals( {filters, numberOfCooking}) {
    const [changeMeal1, setChangeMeal1] = useState(false)
    const [changeMeal2, setChangeMeal2] = useState(false)
    useEffect(() => {
      
    }, [changeMeal1])
    

    let meal = fetch('').then(response => response.JSON)
    return ( 
        <div id="selected-meals">
            <h2>Meal 1 :</h2>



            <h2>Meal 2 :</h2>


        </div>
     );
}

export default SelectedMeals;