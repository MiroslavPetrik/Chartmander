function kimono (req) {
  return "http://sochi.kimonolabs.com/api/" + req + "&apikey=4152bed5732942b0d6dc190dceea2a51";
}

function medalStream (medal) {
  return {
    "title": medal + " medal",
    "values": []
  }
}

function getMedalsByCountries (offset, callback) {
  if (offset === undefined) offset = 0;

  $.getJSON(kimono("countries?sort=medals.total,-1&fields=name,medals.gold,medals.silver,medals.bronze&limit=10&offset="+offset), function (data) {
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
