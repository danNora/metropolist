const app = {};
//Instead of taking query parameters, this API requires different endpoints for different queries.
//The endpoints here fetch city name, city image, and city scores respectively.
app.apiDataPoints = ['/', '/images', '/scores'];

//a method to return an ajax call promise for each query
app.getCityPromise = function(cityEndpoint, dataPoint) {
	const endpoint = cityEndpoint + dataPoint;
	return $.ajax({
		url: endpoint,
		method: 'GET',
		dataType: 'json'
	});
};

app.getAllCityData = cityEndpoints => {
	const cityPromises = [];

	cityEndpoints.forEach(async function(cityEndpoint) {
		for (let i = 0; i < app.apiDataPoints.length; i++) {
			const cityDataPoint = app.getCityPromise(
				cityEndpoint,
				app.apiDataPoints[i]
			);
			cityPromises.push(cityDataPoint);
		}
	});

	Promise.all(cityPromises)
		.then(results => {
			$('.resultsHidden').toggleClass('resultsHidden results');
			$('.result1, .result2').empty();
			// const cityResults = results.map(result => result[0]);
			const cityResults = results;

			const cityObjects = [];
			for (let i = 0; i < cityResults.length; i += app.apiDataPoints.length) {
				const cityObject = {};

				for (let j = 0; j < app.apiDataPoints.length; j++) {
					cityObject[app.apiDataPoints[j]] = cityResults[i + j];
				}

				cityObjects.push(cityObject);
			}

			app.displayAllCityData(cityObjects);
		})
		.catch(() => {
			$('main').append(`<p>Please try a different city</p>`);
		});
};

app.displayAllCityData = function(cities) {
	//An overall score of the city given by Teleport
	// const cityTeleportScore = cityData['/scores']['teleport_city_score'].toFixed(1)

	// A div>ul to house all the <li>
	// const $result = $(`<div class="result ${cssClasses}">`);

	cities.forEach((city, index) => {
		const $scoresList = $('<ul class="lQItems">');

		// Get city image url
		const cityImageUrl = city['/images'].photos[0].image.mobile;

		// Get data out of objects
		const fullCityName = city['/']['full_name'];
		const $cityNameHtml = $(
			`<div class="cityNameFlexbox"><h2>${fullCityName}</h2></div>`
		).css(
			'background-image',
			`linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${cityImageUrl})`
		);

		const cityScoreArray = city['/scores']['categories'];

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

		if (cities.length === 2) {
			$(`.result${index + 1}`).append($cityNameHtml, $scoresList);
		} else {
			$('.result1, .result2, .restart').remove();
			const $result = $('<div class="result">');
			$result.append($cityNameHtml, $scoresList);
			$('.results').append($result);
		}
	});
};

// app.cleanUserInput = function(inputValue) {
// 	return inputValue
// 		.trim()
// 		.toLowerCase()
// 		.split(' ')
// 		.join('-');
// };

app.restart = function() {
	$('.restart').on('click', function() {
		app.smoothScroll('header');
		$('input[type=text]').val('');
		setTimeout(function() {
			$('.results').toggleClass('results resultsHidden');
		}, 1500);
	});
};

app.init = function() {
	app.addDropdowns();

	$('#submit').on('click', function(e) {
		e.preventDefault();

		app.cityEndpoint1 = $('.location1').val();
		app.cityEndpoint2 = $('.location2').val();

		if (app.cityEndpoint1 && app.cityEndpoint2) {
			app.getAllCityData([app.cityEndpoint1, app.cityEndpoint2]);
			app.smoothScroll('#results');
		} else {
			$('main').append('<p>Please choose some cities!</p>');
		}
	});
	app.restart();
};

app.addDropdowns = function() {
	const urbanAreasPromise = $.ajax({
		url: 'https://api.teleport.org/api/urban_areas/',
		method: 'GET',
		dataType: 'json'
	});

	urbanAreasPromise.then(urbanAreas => {
		urbanAreas['_links']['ua:item'].forEach(urbanArea => {
			$('.location1').append(
				$(`<option value=${urbanArea.href}>`).text(urbanArea.name)
			);
			$('.location2').append(
				$(`<option value=${urbanArea.href}>`).text(urbanArea.name)
			);
		});
	});
};

app.smoothScroll = function(elementId) {
	$('html, body')
		.delay(500)
		.animate(
			{
				scrollTop: $(elementId).offset().top
			},
			600
		);
};

//document ready
$(document).ready(function() {
	app.init();
});
// end of document ready
