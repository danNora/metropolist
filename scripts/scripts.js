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

app.displayCityData = async function(cityName, cssClass) {
	const cityData = await app.getCityData(cityName);

	//An overall score of the city given by Teleport
	// const cityTeleportScore = cityData['/scores']['teleport_city_score'].toFixed(1);

	// A div>ul to house all the <li>
	// const $result = $(`<div class="result ${cssClasses}">`);
	const $scoresList = $('<ul class="lQItems">');

	// Get city image url
	const cityImageUrl = cityData['/images'].photos[0].image.mobile;

	// Get data out of objects
	const fullCityName = cityData['/']['full_name'];
	const $cityNameHtml = $(`<h2>${fullCityName}</h2>`).css(
		'background-image',
		`linear-gradient(rgba(30, 30, 30, 0.2),rgba(30, 30, 30, 0.2)),url(${cityImageUrl})`
	);

	// Create div.imgWrapper>img
	// const $imageHtml = $(
	// 	`<div class="imgWrapper"><img src="${cityImage}" alt="Landscape of the city of ${cityName}"></div>`
	// );

	const cityScoreArray = cityData['/scores']['categories'];

	cityScoreArray.forEach(function(score) {
		//creating li.lQItem
		const $score = $('<li class="lQItem">');

		const $itemTitle = $('<h3 class="itemTitle">').text(score.name);

		const $scoreNum = $('<span class="scoreNum">').text(
			score['score_out_of_10'] ? score['score_out_of_10'].toFixed(1) : 'N/A'
		);
		//score bar
		const $scoreBarFull = $('<div class="scoreBar scoreBarFull">');
		const $scoreBarFill = $('<div class="scoreBar scoreBarFill">').css({
			width: score['score_out_of_10'] * 10 + '%',
			background: score['color']
		});
		$scoreBarFull.html($scoreBarFill);

		//appending itemTitle, score number, score bar to an li.lQItem
		$score.append($itemTitle, $scoreNum, $scoreBarFull);

		//appending li.lQItem to ul.lQItems
		$scoresList.append($score);
	});

	// $result.append($cityNameHtml, $scoresList);
	$(cssClass).append($cityNameHtml, $scoresList);
};

app.cleanUserInput = function(inputValue) {
	return inputValue
		.trim()
		.toLowerCase()
		.split(' ')
		.join('-');
};

app.init = function() {
	$('#submit').on('click', function(e) {
		e.preventDefault();
		//todo: function
		app.userCity1 = app.cleanUserInput($('#location1').val());
		app.userCity2 = app.cleanUserInput($('#location2').val());

		$('.result1, .result2').empty();
		app.displayCityData(app.userCity1, '.result1');
		app.displayCityData(app.userCity2, '.result2');
	});
};

//document ready
$(document).ready(function() {
	app.init();
});
// end of document ready
