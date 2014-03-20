function kimono (req) {
  return "http://sochi.kimonolabs.com/api/" + req + "apikey=4152bed5732942b0d6dc190dceea2a51";
}

function medalStream (medal) {
  return {
    "title": medal + " medal",
    "values": []
  }
}

function getCountry (id, callback) {
  $.getJSON(kimono("countries/"+id+"?"), function (data) {
    callback(data);
  });
}

function getMedalsByCountries (offset, callback) {
  if (offset === undefined) offset = 0;

  $.getJSON(kimono("countries?sort=medals.total,-1&fields=name,medals.gold,medals.silver,medals.bronze&limit=10&offset="+offset+"&"), function (data) {
    callback(data);
  });
}

function getMedalsByAthletes (offset, callback) {
  if (offset === undefined) offset = 0;

  $.getJSON(kimono("athletes?sort=medals.total,-1&fields=name,medals.gold,medals.silver,medals.bronze&limit=10&offset="+offset+"&"), function (data) {
    callback(data);
  });
}

function parseMedals (data) {
  var bronze = medalStream("Bronze")
  , silver = medalStream("Silver")
  , gold = medalStream("Gold")
  ;

  $.each(data.data, function (i, country) {

    bronze.values.push({
      "label": country.name,
      "value": country.medals.bronze
    });
    silver.values.push({
      "label": country.name,
      "value": country.medals.silver
    });
    gold.values.push({
      "label": country.name,
      "value": country.medals.gold
    });
  });
  return [bronze, silver, gold];
}

function parsePieMedals (country, medals) {
  var result = [];

  for (key in medals) {
    if (key == "total")
      continue; // dovidenia
    result.push({
      title: key + "medals",
      values: [{
        label: country,
        value: medals[key]
      }]
    })
  }
  
  return result;
}


  ///////////////////////////////
  // UI
  ///////////////////////////////

  $(function(){

    var $rangeValue = $('.js-range .value');

    $('.js-move').on('click', function () {
      var offset = $(this).data('offset')
        , current = $rangeValue.text().split("-")
        , from, to
        ;

      // bariera
      if (current[0] == 1 && offset < 0 || current[1] == 30 && offset > 0)
        return true;
      else {
        from = Number(current[0])+offset;
        to = Number(current[1])+offset;
        $rangeValue.text(from + " - " + to);
      }

      getMedalsByCountries(from-1, function (chartData) {
        Chartmander.addChart(function(){
          var chart = Chartmander.select("top-countries", "categoryBar");
          var medals = parseMedals(chartData);
            chart
              .fontColor("#fff")
              .margin({left: 30})
              .colors(["yellow", "orangered"])
              ;

            console.log(medals)
            chart.render(medals);
            return chart;
        });
      });


    });
  });


// function getTopAthletes () {
//   var bronze = medalStream("Bronze")
//     , silver = medalStream("Silver")
//     , gold = medalStream("Gold")
//     ;

//   $.getJSON(kimono("athletes?sort=medals.total,-1&limit=10"), function (data) {
//     data.data.each(function (athlete) {

//     })
//   });
//   return [bronze, silver, gold];
// }
