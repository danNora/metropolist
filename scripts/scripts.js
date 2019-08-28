const app = {};

app.getCityData = () => {
	$('#submit').on('click', function(e) {
		e.preventDefault();
		app.userCity1 = $('#location1').val();
		app.userCity2 = $('#location2').val();
	});
};

app.setEndpoint = function(cityName, queryItem) {
	app.endpoint = `https://api.teleport.org/api/urban_areas/slug:${cityName}/${queryItem}`;
	$.ajax({
		url: app.endpoint
	});
};

app.parseCityData = function() {};
app.displayCityData = function() {};
app.init = function() {};
$(document).ready(function() {
	//document ready
	app.init();
}); // end of document ready
