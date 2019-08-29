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
  console.log(cityScoreArray);

  // Convert to HTML
  const $scores = $('<ul>').addClass("lQItems");

  cityScoreArray.forEach(function(score) {
    const $score = $("<li>").addClass("lQitem");

    const $itemTitle = $("<h3>")
      .addClass("itemTitle")
      .text(score.name);

    const $scoreNum = $("<span>")
      .addClass("scoreNum")
      .text(Math.round(score['score_out_of_10']));
    
    const $scoreBarFull = $("<div>").addClass("scoreBar scoreBarFull");
    const $scoreBarFill = $("<div>")
      .addClass("scoreBar scoreBarFill")
      .css("width", score['score_out_of_10'] * 10);

    $scoreBarFull.html($scoreBarFill);
    $score.append($itemTitle, $scoreNum, $scoreBarFull);

    $scores.append($score);
  });

  $("body").append($scores); // temporary for demonstration
  
  // app.displayCityData(parsedData);
};

app.displayCityData = function(parsedCityData) {
  // jQuery happens here

  // app.parseCityData();
};

app.cleanUserInput = inputValue => {
  inputValue
    .trim()
    .toLowerCase()
    .split(' ')
    .join('-');
};

app.init = function() {
  $('#submit').on('click', async function(e) {
    e.preventDefault();
    //todo: function
    app.userCity1 = cleanUserInput($('#location1').val());
    app.userCity2 = cleanUserInput($('#location2').val());

    app.getCityData(app.userCity1);
    app.getCityData(app.userCity2);
  });
};

//document ready
$(document).ready(function() {
  app.init();
});
// end of document ready
