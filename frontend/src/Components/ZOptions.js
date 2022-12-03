import './ZOptions.css';

function ZOptions({ setFilter }) {
  return (
    <div id="zoptions">
      <form>
        <input type="checkbox" id="VEGAN" value="VEGAN" /><label for="VEGAN">Vegan</label>
        <br />
        <input type="checkbox" id="VEGETARIAN" value="VEGETARIAN" /><label for="VEGETARIAN">Vegetarian</label>
        <br />
        <input type="checkbox" id="GLUTEN_FREE" value="GLUTEN_FREE" /><label for="GLUTEN_FREE">Gluten Free</label>
        <br />
        <input type="checkbox" id="DAIRY_FREE" value="DAIRY_FREE" /><label for="DAIRY_FREE">Dairy Free</label>
        <br />
        <input type="checkbox" id="KETOGENIC" value="KETOGENIC" /><label for="KETOGENIC">Ketogenic</label>
        <br />
      </form>
    </div>
  );
}

export default ZOptions;