const app = {};
app.apiDataPoints = ["images", "scores"];


app.getCityPromise = function(cityName, dataPoint) {
	const endpoint = `https://api.teleport.org/api/urban_areas/slug:${cityName}/${dataPoint}`;
	// console.log(endpoint);
	return $.ajax({
		url: endpoint,
		method: "GET",
		dataType: "json"
	});
};

app.getCityData = () => {
	$('#submit').on('click', async function(e) {
		e.preventDefault();
		app.userCity1 = $('#location1').val();
		app.userCity2 = $('#location2').val();

		const city1Data = [];
		const city2Data = [];

		for (let i = 0; i < app.apiDataPoints.length; i++) {
			const city1DataPoint = await app.getCityPromise(app.userCity1, app.apiDataPoints[i]);
			city1Data.push(city1DataPoint);
			const city2DataPoint = await app.getCityPromise(app.userCity2, app.apiDataPoints[i]);
			city2Data.push(city2DataPoint);

			// city1Promises.push(app.getCityPromise(app.userCity1, app.apiDataPoints[i]));
			// city2Promises.push(app.getCityPromise(app.userCity2, app.apiDataPoints[i]));
		
		}

		console.log("City 1 data", city1Data);
		console.log("City2 data", city2Data);
		// console.log(city1Promises, city2Promises);

		// $.when(...city1Promises, ...city2Promises)
		// 	.then(function(...results) {
		// 		console.log(results);
		// 	})
		// 	.fail(function() {});

	});
};

app.parseCityData = function() {};
app.displayCityData = function() {};
app.init = function() {
	app.getCityData();
};
$(document).ready(function() {
	//document ready
	app.init();
}); // end of document ready
