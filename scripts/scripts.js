const app = {};
app.apiDataPoints = ['images', 'scores'];

app.getCityPromise = function(cityName, dataPoint) {
	const endpoint = `https://api.teleport.org/api/urban_areas/slug:${cityName}/${dataPoint}`;
	// console.log(endpoint);
	return $.ajax({
		url: endpoint,
		method: 'GET',
		dataType: 'json'
	});
};

app.getCityData = async cityName => {
	const cityData = {};

	for (let i = 0; i < app.apiDataPoints.length; i++) {
		const cityDataPoint = await app.getCityPromise(
			cityName,
			app.apiDataPoints[i]
		);
		cityData[app.apiDataPoints[i]] = cityDataPoint;
	}

	app.parseCityData(cityData);
};

app.parseCityData = function(cityData) {
	// console.log(cityData['images']);
	const imageHtml = `<img src="${cityData['images'].photos[0].image.mobile} alt="Landscape of the city of city name">`;
	const cityTeleportScore = Math.round(
		cityData['scores']['teleport_city_score']
	);

	const cityScoreArray = cityData['scores']['categories'];
	console.log(cityData['scores']);

	// Convert to HTML
	const scoresHtml = $('.lQItems');
	cityScoreArray.forEach(function(object) {
		scoresHtml.append(`<li class="lQItem">`);
	});

	// app.displayCityData(parsedData);
};

app.displayCityData = function(parsedCityData) {
	// jQuery happens here

	app.parseCityData();
};

app.init = function() {
	$('#submit').on('click', async function(e) {
		e.preventDefault();
		//todo: function
		app.userCity1 = $('#location1')
			.val()
			.trim()
			.toLowerCase()
			.split(' ')
			.join('-');
		app.userCity2 = $('#location2')
			.val()
			.trim()
			.toLowerCase()
			.split(' ')
			.join('-');

		app.getCityData(app.userCity1);
		app.getCityData(app.userCity2);
	});
};

//document ready
$(document).ready(function() {
	app.init();
});
// end of document ready
