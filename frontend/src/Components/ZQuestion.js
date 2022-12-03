import './ZQuestion.css';
function ZQuestion( 
    {setNumberOfCooking, numberOfCooking} ,
    //additional params
    {setNumberOfPeople, numberOfPeople}
    ){

    return(
        <div id="zquestions">
            <p>How many meals you want to cook this week  bi?</p>
            <input type="number" id="lname" name="lname" onChange={(event) => setNumberOfCooking(event.target.value)} value={numberOfCooking}/>
            <br/>
            <p>Number of People? </p>
            <br/>
            <input type="number" id="lpeople" name="lpeople" onChange={(event) => setNumberOfPeople(event.target.value)} value={numberOfPeople}/>
            
        </div>
        // 1 => 14 same
        // 2 => 2 mals acrros week how? 
        // 3 => 

    );

}

export default ZQuestion;
