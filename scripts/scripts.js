const app = {};
app.apiDataPoints = ['/', '/images', '/scores'];

app.getCityPromise = function(cityName, dataPoint) {
	const endpoint = `https://api.teleport.org/api/urban_areas/slug:${cityName}${dataPoint}`;
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

	console.log(cityData);
	app.parseCityData(cityData);
};

app.parseCityData = function(cityData) {
	// console.log(cityData['/images']);

	const cityTeleportScore = cityData['/scores']['teleport_city_score'].toFixed(
		1
	);
	const cityName = cityData['/']['full_name'];

	// Convert to HTML

	const $result = $("<div class='result'>");

	const $imageHtml = $(
		`<div class="imgWrapper"><img src="${cityData['/images'].photos[0].image.mobile}" alt="Landscape of the city of ${cityName}"></div>`
	);

	const $cityTitle = $(`<h2>${cityName}</h2>`);
	const $cityDescription = $('<p>city description</p>');
	const $scoresList = $('<ul class="lQItems">');
	// $result.append()

	const cityScoreArray = cityData['/scores']['categories'];
	// console.log(cityScoreArray);

	// creating <li.lQitem
	cityScoreArray.forEach(function(score) {
		const $score = $('<li class="lQItem">');
		const $itemTitle = $('<h3 class="itemTitle">').text(score.name);

		const $scoreNum = $('<span> class="scoreNum">').text(
			score['score_out_of_10'] ? score['score_out_of_10'].toFixed(1) : 'N/A'
		);

		const $scoreBarFull = $('<div class="scoreBar scoreBarFull">');
		const $scoreBarFill = $('<div class="scoreBar scoreBarFill">').css({
			width: score['score_out_of_10'] * 10 + '%',
			height: '10px',
			background: score['color']
		});

		$scoreBarFull.html($scoreBarFill);
		$score.append($itemTitle, $scoreNum, $scoreBarFull);
		$scoresList.append($score);
		$result.append($imageHtml, $cityTitle, $scoresList);
	});

	$('.results').append($result);
};

app.displayCityData = function(parsedCityData) {
	// jQuery happens here
	// app.parseCityData();
};

app.cleanUserInput = function(inputValue) {
	return inputValue
		.trim()
		.toLowerCase()
		.split(' ')
		.join('-');
};

app.init = function() {
	$('#submit').on('click', async function(e) {
		e.preventDefault();
		//todo: function
		app.userCity1 = app.cleanUserInput($('#location1').val());
		app.userCity2 = app.cleanUserInput($('#location2').val());

		$('.results').empty();
		app.getCityData(app.userCity1);
		app.getCityData(app.userCity2);
	});
};

//document ready
$(document).ready(function() {
	app.init();
});
// end of document ready
