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
	return cityData;
};

app.displayCityData = function(cityName, resultClass) {
	const cityData = app.getCityData(cityName);

	//An overall score of the city given by Teleport
	// const cityTeleportScore = cityData['/scores']['teleport_city_score'].toFixed(1);

	// A div>ul to house all the <li>
	// const $result = $("<div class='result'>");
	const $scoresList = $('<ul class="lQItems">');

	// Get data out of objects
	const cityName = cityData['/']['full_name'];
	const $cityNameHtml = $(`<h2>${cityName}</h2>`);
	$('.titleResults').append($cityNameHtml);

	// Get city image url
	const cityImage = cityData['/images'].photos[0].image.mobile;

	// Create div.imgWrapper>img
	const $imageHtml = $(
		`<div class="imgWrapper"><img src="${cityImage}" alt="Landscape of the city of ${cityName}"></div>`
	);

	$('.imageResults').append($imageHtml);

	// const $cityTitle = $(`<h2>${cityName}</h2>`);
	// const $cityDescription = $('<p>city description</p>');

	const cityScoreArray = cityData['/scores']['categories'];

	cityScoreArray.forEach(function(score) {
		const $score = $('<li class="lQItem">');
		const $itemTitle = $('<h3 class="itemTitle">').text(score.name);
		const $scoreNum = $('<span class="scoreNum">').text(
			score['score_out_of_10'] ? score['score_out_of_10'].toFixed(1) : 'N/A'
		);

		const $scoreBarFull = $('<div class="scoreBar scoreBarFull">');
		const $scoreBarFill = $('<div class="scoreBar scoreBarFill">').css({
			width: score['score_out_of_10'] * 10 + '%',
			background: score['color']
		});

		$scoreBarFull.html($scoreBarFill);
		$score.append($itemTitle, $scoreNum, $scoreBarFull);
		$scoresList.append($score);
	});

	$('.scoresResults').append($scoresList);
	// $('.scoresResults').append($result);
};

app.cleanUserInput = function(inputValue) {
	return inputValue
		.trim()
		.toLowerCase()
		.split(' ')
		.join('-'); resultClass
};

app.init = function() {
	$('#submit').on('click', async function(e) {
		e.preventDefault();
		//todo: function
		app.userCity1 = app.cleanUserInput($('#location1').val());
		app.userCity2 = app.cleanUserInput($('#location2').val());

		$('.imageResults, .titleResults, .scoresResults').empty();
		app.displayCityData(app.userCity1, ".result1");
		app.displayCityData(app.userCity2, ".result2");
	});
};

//document ready
$(document).ready(function() {
	app.init();
});
// end of document ready
