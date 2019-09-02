const app = {};

// method for smooth scroll
app.smoothScroll = function(element) {
	$('html, body').animate(
		{
			scrollTop: $(element).offset().top
		},
		500
	);
};

//Instead of taking query parameters, this API requires different endpoints for different queries.
//The datapoints here fetch city name, city image, and city scores respectively when added at the end of endpoints.
app.apiDataPoints = ['/', '/images', '/scores'];

//a method to return an ajax call promise for each query (endpoint + datapoint)
app.getCityPromise = function(cityEndpoint, dataPoint) {
	const endpoint = cityEndpoint + dataPoint;
	return $.ajax({
		url: endpoint,
		method: 'GET',
		dataType: 'json'
	});
};

//a method to fetch and parse data returned from ajax calls
app.getAllCityData = cityEndpoints => {
	//an array to sort promises into order
	const cityPromises = [];

	//loop through cityEndpoints array (argument to be passed by user), peform AJAX calls for every datapoint per endpoint, then push promises into cityPromises array
	cityEndpoints.forEach(function(cityEndpoint) {
		for (let i = 0; i < app.apiDataPoints.length; i++) {
			const cityDataPoint = app.getCityPromise(
				cityEndpoint,
				app.apiDataPoints[i]
			);
			cityPromises.push(cityDataPoint);
		}
	});

	//wait for all cityPromises to resolve, then display section.results; if at least one promise returns failed, show error message
	Promise.all(cityPromises)
		.then(results => {
			$('.resultsHidden').toggleClass('resultsHidden results');
			$('.result1, .result2').empty();

			const cityObjects = [];
			//every few elements in results array belong to a single city, using a for loop to sort every few elements into one cityObject, then push it into cityObjects array
			for (let i = 0; i < results.length; i += app.apiDataPoints.length) {
				const cityObject = {};

				for (let j = 0; j < app.apiDataPoints.length; j++) {
					cityObject[app.apiDataPoints[j]] = results[i + j];
				}

				cityObjects.push(cityObject);
			}
			//pass the cityObjects array into the displayAllCityData method
			app.displayAllCityData(cityObjects);
		})
		.catch(() => {
			$('.error').text(`No results returned. Please try again.`);
		});
};

// a method to turn data into HTML elements and add them onto DOM
app.displayAllCityData = function(cityObjects) {
	cityObjects.forEach((city, index) => {
		// Create jQuery element containing city name and image
		const cityImageUrl = city['/images'].photos[0].image.mobile;
		const fullCityName = city['/']['full_name'];
		const $cityNameHtml = $(
			`<div class="cityNameFlexbox"><h2 class="cityName">${fullCityName}</h2></div>`
		).css(
			'background-image',
			`linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${cityImageUrl})`
		);

		// Create ul element for every score
		const $scoresList = $('<ul class="lQItems">');

		// Loop through all scores, convert to jQuery li element, and append to ul
		const cityScoreArray = city['/scores']['categories'];
		cityScoreArray.forEach(function(score) {
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
		//append all information to div.result1 and div.result2
		$(`.result${index + 1}`).append($cityNameHtml, $scoresList);

		//if city name is too long, reduce font size
		if (fullCityName.length > 15) {
			$('.cityName').addClass('longName');
		}
	});

	// autoscrolls to section.results
	app.smoothScroll('.results');
};

// method to start another search
app.restart = function() {
	app.smoothScroll('header');
	$('select').val('');
	setTimeout(function() {
		$('.results').toggleClass('results resultsHidden');
	}, 1000);
};

//method to fetch all city options and display in select inputs
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

app.init = function() {
	app.addDropdowns();
	app.restart();

	$('#submit').on('click', function(e) {
		e.preventDefault();

		//get user input
		app.cityEndpoint1 = $('.location1').val();
		app.cityEndpoint2 = $('.location2').val();

		//if user has in fact selected 2 cities, start get city data and display on screen
		if (app.cityEndpoint1 && app.cityEndpoint2) {
			$('.error').empty();
			app.getAllCityData([app.cityEndpoint1, app.cityEndpoint2]);
			//otherwise, show an error and shake inputs that don't have a city selected
		} else {
			$('.error').text(`You're missing some cities...`);
			!$('.location1').val()
				? $('.location1').effect('shake', { distance: 5 })
				: null;
			!$('.location2').val()
				? $('.location2').effect('shake', { distance: 5 })
				: null;
		}
	});
	$('.restart').on('click', app.restart);
};

//document ready
$(document).ready(function() {
	app.init();
});
// end of document ready
