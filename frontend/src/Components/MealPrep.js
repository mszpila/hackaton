function MealPrep() {
  return (
    <div id='meal-prep'>
      <div class='outer'>
        <table>
          <thead>
          <tr>
            <th class='headcol'></th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
          </thead>
        </table>

        <div class='wrap'>
          <table class='offset'>

            <tbody>

            <tr>
              <td class='headcol'>Meal 1</td>
              <td></td>
              <td></td>
              <td class='past'></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td class='headcol'>Meal 2</td>
              <td></td>
              <td>
                <div class='event double'><input id='check' type='checkbox' class='checkbox' /><label
                  for='check'></label>8:30–9:30 Yoga
                </div>
              </td>
              <td class='past'></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>


            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
}

export default MealPrep;