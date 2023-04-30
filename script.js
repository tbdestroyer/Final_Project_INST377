/*
  ## Utility Functions
*/

/* Use some code from https://www.coderrocketfuel.com/article/convert-unix-timestamp-to-yyyy-mm-dd-format*/
   /* return yyyy-mm-dd string given milliseconds */
   function getDateTime (timeInMilli) {
    let date = new Date(timeInMilli); // current time in milliseconds minus past time in milliseconds
    
    // get the current year in YYYY digit format
    const year = date.getFullYear();

    // get the month in a 2-digit format
    // getMonth() returns an index position of the month in an array.
    // Therefore, we need to add 1 to get the correct month.
    // toLocaleString() converts any single digit months to have a leading zero (i.e. "2" => "02")
    let month = date.getMonth() + 1;
    month = month.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

    // get the current day of the month
    // toLocaleString() converts any single digit days to have a leading zero (i.e. "8" => "08")
    let day = date.getDate();
    day = day.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

    // combine the year, month, and day into one string to create the "YYYY-MM-DD" format
    const dateString = `${year}-${month}-${day}`;
    console.log(dateString)
    return dateString;
  }


  function injectHTML(list) {
    console.log('fired injectHTML');
    const target = document.querySelector('#earthquake_summary');

    // Count the earthquakes caused Tsunamis
    const countTsunamies = list.filter(item => item.properties.tsunami === 1).length;
      
    // format the string to display in the summary
    const summary = "Number of earthquakes : "+ String(list.length) + "\n" +
                    "Number of tsunamis : " + String(countTsunamies);

    if (list.length > 0)
          target.innerText = summary
    else
        target.innerText = 'No earthquakes found';
  
  }

  /* Filter on the selected magnitude and period */
  /* can test epoch time conversion at https://www.epochconverter.com */
function filter_Data(list, mag_query, period_query) {
    let min = 4.0;
    let max = 10.0;
    const endtime = Date.now(); // current epoch time in milliseconds
    let starttime =  endtime - 86400000; // default to past 1 day
  
    if(mag_query === 'four_to_fourhalf' ){
      min = 4.0;
      max = 4.5;
    }
    else if(mag_query === 'fourhalf_to_five'){
      min = 4.5;
      max = 5.0;

    }
    else if(mag_query === 'five_to_fivehalf'){
      min = 5.0;
      max = 5.5;

    }
    else if(mag_query === 'fivehalf_to_six'){
      min = 5.5;
      max = 6.0;

    }
    else if(mag_query === 'six_to_ten'){
      min = 6.0;
      max = 10.0;
    }
    console.log(min,max);
    

    // if radio_button is 1 it is already set above as default
    // create a boolean based opast 1 day, past 7 days or past 30 days based on radio button period
    if (period_query === 'radio_2'){
      starttime =  endtime - 604800000; // 7 days in milliseconds
    }
    else if (period_query === 'radio_3'){
      starttime =  endtime - 2592000000; // 30 days in milliseconds
    }

    console.log(period_query, starttime, endtime);

    /* Filter for Magnitude selected from drodown mwenu */
    /* Filter for radio buttons, period selected, 1 day, 7 days or 30 days*/
    return list.filter((item)=>{
       return ( (item.properties.mag >= min && item.properties.mag < max) &&
        (item.properties.time >= starttime && item.properties.time < endtime) );
    });


}

 /* Process JSON raw data and create a list of earthquake items*/
 function processJsonData(origArr) {
  
  let loc_list =[];

  for(let i=0; i < origArr.features.length; i++){ 

    loc_list.push(origArr.features[i]);
  }
  //console.log(loc_list)

  return loc_list;
}


  /* Map initialization, center it at ???? */
  function initMap(){

    console.log("initMap");
  
    const map = L.map('map').setView([39.9334, 32.8597], 3);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
    return map;
  }
  
  /* Place markers on the map */
  function markerPlace(array, map) {
    //console.log("markerPlace", array);
    //const marker = L.marker([51.5, -0.09]).addTo(map);
    /*remove previous markers before placing the new ones*/
    map.eachLayer((layer=>{
        if(layer instanceof L.Marker) {
            layer.remove();
        }
    }));

    array.forEach((item, index)=>{
       // console.log(item.geometry.coordinates[1], item.geometry.coordinates[0]);
        m = L.marker([item.geometry.coordinates[1], item.geometry.coordinates[0]]).addTo(map);

        // Add a tooltip
        const tooltip = 'mag= '+ String(item.properties.mag) +"<br>loc= "+
             item.properties.place + "<br>"+"date="+getDateTime(item.properties.time); 

        m.bindTooltip(tooltip);
        
    });
    map.setView([39.9334, 32.8597], 2);

  }

   

  /****************************************
     Main Event
  ****************************************/
  async function mainEvent() {
   
    const pageMap = initMap(); // initialize leaflet map

    // set query selectors for radio buttons, dropdown menu and update button
    const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
    const submitButton= document.querySelector('#get-region'); // get a reference to  submit button
    const radio_1_Button= document.querySelector('#radio_1'); // get a reference to radio 1 submit button
    const radio_2_Button= document.querySelector('#radio_2'); // get a reference to radio 2 submit button
    const radio_3_Button= document.querySelector('#radio_3'); // get a reference to radio 3 submit button
    const dropdownMenuButton= document.querySelector('#region1'); // get a reference to radio 3 submit button

    /* API URL, we add start and end dates and min, max magnitude to this query */
    const urlbase ='https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&'

    let currentList = []; // This list holds the data from API
    let filtered_List = []; // this list holds the filtered list based on magnitude and data

    // Date period of earthquake datae
    const endDate = getDateTime (Date.now()); // current date in year,month, day
    const startDate = getDateTime (Date.now() - 2592000000); // 30 days past in milliseconds

    //Keep track of previous dropdown menu selection value
    let selectedMenuItem_Value = document.getElementById("region1").value;
    let selectedRadioButton_value = document.querySelector('input[name="period"]:checked').value;

    // show the ellipsis loading widget
    const loadAnimation = document.querySelector('.lds-ellipsis'); // get a reference to your loading animation
    submitButton.style.display = 'none'; // let Refresh button disappear
  
    console.log("before API fetch");
    /* Let's get some data from the API - it will take a second or two to load */
    /* the async keyword means we can make API requests */
    
    // Use this one to update the data from the API, get 30 days past earthquake data and magnitude from 4.0 to 10.0 then filter
    // using filter functions for filtering magnituteds and past 1 day and past 7 days earthquakes
    let results = await fetch(urlbase+'&starttime='+startDate+'&endtime='+endDate+'&minmagnitude=4.0&maxmagnitude=10.0');
    let arrayFromJson = await results.json(); // here is where we get the data from our request as JSON
  
    console.log(arrayFromJson);
   
    console.log("after API fetch");
    submitButton.style.display = 'block'; // let's turn the Refresh button back on
    loadAnimation.classList.remove('lds-ellipsis');
    loadAnimation.classList.add('lds-ellipsis_hidden');

    currentList = processJsonData(arrayFromJson);
    console.log(currentList);

    filtered_List = filter_Data(currentList, selectedMenuItem_Value, selectedRadioButton_value);

    console.log(filtered_List);

    markerPlace(filtered_List, pageMap);
    injectHTML(filtered_List);

    // Refresh button listener, when clicked updates earthquake data from teh API
    submitButton.addEventListener('click', async (event) =>{
      console.log('update button clicked');
      submitButton.style.display = 'none'; // let Refresh button disappear
      loadAnimation.classList.add('lds-ellipsis');
      // Use this one to update the data from the API, get 30 days past earthquake data
      results = await fetch(urlbase+'&starttime='+startDate+'&endtime='+endDate+'&minmagnitude=4.0&maxmagnitude=10.0');
      arrayFromJson = await results.json(); // here is where we get the data from our request as JSON
      
      submitButton.style.display = 'block'; // let's turn the Refresh button back on
      loadAnimation.classList.remove('lds-ellipsis');
      loadAnimation.classList.add('lds-ellipsis_hidden');
      /*update current list */
      currentList = processJsonData(arrayFromJson);
      console.log(currentList);
    
      filtered_List = filter_Data(currentList, selectedMenuItem_Value, selectedRadioButton_value);
    
      console.log(filtered_List);
      markerPlace(filtered_List, pageMap);
 
    });

    // Filter Earthquakes for past 1 day earthquakes only
    radio_1_Button.addEventListener('click', async (event) =>{
      console.log('Radio 1 button clicked');
      selectedRadioButton_value  = document.querySelector('input[name="period"]:checked').value;
      console.log("selected radio button= ", selectedRadioButton_value);
      
      filtered_List = filter_Data(currentList, selectedMenuItem_Value, selectedRadioButton_value);

      console.log(filtered_List);


      markerPlace(filtered_List, pageMap);
      injectHTML(filtered_List);
  
    });

     // Filter Earthquakes for past 7 day earthquakes only
    radio_2_Button.addEventListener('click', async (event) =>{
      console.log('Radio 2 button clicked');
      selectedRadioButton_value  = document.querySelector('input[name="period"]:checked').value;
      console.log("selected radio button= ", selectedRadioButton_value);
      
      filtered_List = filter_Data(currentList, selectedMenuItem_Value, selectedRadioButton_value);

      console.log(filtered_List);

      markerPlace(filtered_List, pageMap);
      injectHTML(filtered_List);
  
    });

    // Filter Earthquakes for past 30 day earthquakes only
    radio_3_Button.addEventListener('click', async (event) =>{
      console.log('Radio 3 button clicked');
      selectedRadioButton_value  = document.querySelector('input[name="period"]:checked').value;
      console.log("selected radio button= ", selectedRadioButton_value);
      
      filtered_List = filter_Data(currentList, selectedMenuItem_Value, selectedRadioButton_value);

      console.log(filtered_List);

      markerPlace(filtered_List, pageMap);
      injectHTML(filtered_List);
  
    });

    // Filter earthquakes for magnitude range selected from the dropdown menu
    dropdownMenuButton.addEventListener('click', (event) =>{
      console.log('Drop down menu clicked');
     
      const selectedMenuItem = document.getElementById("region1");
      
       // Take action only dropdown value has changed.
      if (selectedMenuItem.value != selectedMenuItem_Value)
      {
        console.log("selected menu item value = ", selectedMenuItem.value);
        selectedMenuItem_Value= selectedMenuItem.value;

        filtered_List = filter_Data(currentList, selectedMenuItem_Value,selectedRadioButton_value);
        console.log(filtered_List);
        markerPlace(filtered_List, pageMap);
        injectHTML(filtered_List);
      }
    });

  
  }
  
  /*
    This last line actually runs first!
    It's calling the 'mainEvent' function
    It runs first because the listener is set to when  HTML content has loaded
  */
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
  