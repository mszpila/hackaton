import './ZOptions.css';

function ZOptions( {setFilter} ){
    return ( 
        <div id="zoptions">
          <form>
            <input type="checkbox" id="vegan" value="vegan"/><label for="vegan">Vegan:</label>
            <br></br>
            <input type="checkbox" id="gluten" value="gluten"/><label for="Gluten-free">GlutenFree</label>
            <br/>
            <input type="checkbox" id="lactose" value="lactose"/><label for="Lactose intolerant">Lactose</label>
            <br/>
          </form>
        </div>
     );
}

export default ZOptions;