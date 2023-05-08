
# Recent Earthquakes in the World  

Web page link:  
https://tbdestroyer.github.io/Final_Project_INST377/


## Information Problem/Project Description  

There was a big earthquake in Turkey and in Syria in February 2023, killing tens of thousands of people. U.S Geological Survey (USGS) provides a free API interface to access earthquake data. It is interesting how many earthquakes happening everyday throughout the world. The project creates a web page that displays the recent earthquakes where they happened, date and magnitude information with on a map. A Web based visualization application showing the recent earthquake data in the world would increase the knowledge and awareness in a simple and interactive way.  

## Browsers supported  

Major browsers including Chrome, Firefox and Edge are supported  
Page automatically adjusts to narrower screen size for mobile devices but not specific to a mobile device


## Technology Stack  

In addition to the HTML/CSS/JS6, the code uses  https://leafletjs.com/ external library for the mapping. Leaflet.js provides mapping library for the dynamic visualizations of maps. It is open source and free to use.  

USGS API (https://earthquake.usgs.gov/fdsnws/event/1/) doesn’t require any token or permissions. It has a limit of 20,000 earthquakes per query.

## HTML Layout  

The layout is separated into three sections. Main container sets left and right section boxes. Left section input form contains three radio buttons (selects past 1,7 and 30 days of data), one dropdown menubox (selects earthquake magnitude) and one button to refresh the data from the API. Left section box sets up another box for the earthquake images. Images are made visible and hidden through CSS class selectors controlled from the JS code. Right section contains the map and a box under the map for showing earthquake summary information. Top right of the container provides a help/about button that provides a link to the this github readme file.  

## CSS  
CSS file provides most of the formatting. It has many class and id selectors. Flexbox is used for arranging boxes and other elements. Media query is used for arranging left and right sections as a column with flexbox for narrower screen size. JS code also hides the images when the screen size is narrower to make the map visible easier when the boxes are in a column format. Ellipses loading selectors are used to show the user when data is fetched from the API. Refresh button is hidden when the page is loading.

## JavaScript  

Async/await functions are used in the main event function. Fetch is used for API access. Event listeners are set for all the input forms. API accesses 30 days of data and earthquake magnitudes 4.0 to 10.0 from USGS server. Filter functions are used to filter the data based on user selection using radio buttons and menubox selecting the time period and magnitude of the earthquakes. Fetched API data is stored in the browser local storage until the user refreshes the data using the refresh button. Refresh button clears the local browser storage and populates from the API response data. HTML injection of the information in the HTML elements and images injection and hiding or making the elements visible are also controlled from the JS code.

## Leaflet.js  

Map is displayed and controlled using leaflet library. Map is initialized and centered (in Turkiye) and markers are added for each filtered earthquake location parsed from the API data. Tooltip shows details of each earthquake when hovered on the marker. Earthquakes casuing tsunamis are marked as red markers using a separate image file. Number of total earthquakes and number of tsunamis are also displayed in the box below the map based on the filter selected.  

## Next Steps  
Here are some suggestions for further improvements to the app

- Markers can be sized with the magnitude of the earthquake
- Earthquake fault lines and other tiles can be added to the map
- Color scheme probably needs improvement