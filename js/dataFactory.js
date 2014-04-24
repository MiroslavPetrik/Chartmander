function dataFactory (datasets, categories, range) {
  var data = []
    , direction = false
    ;
  for (var i = 0; i < datasets.length; i++) {
    // direction = i % 2 == 0 ? false : true
    data.push({
      title: datasets[i],
      values: stream(categories, direction, range)
    })
  };

  return data;
}

function stream (cats, dir, range) {

  var result = []
    , direction = 1
    ;

  if (dir) direction = -1;

  for (var i = 0; i < cats.length; i++) {
    result.push({
      label: cats[i],
      value: parseInt( Math.random() * range * direction)
    })
  };

  return result;
}

// function genCategories (categories, streams) {
//   categories.forEach(function(cat){
//     console.log(i,e);
//   })
// }

function sine (points) {
  var result = []
    , incrementAngle = (Math.PI*2)/points
    ;
  for (var i = 0; i < Math.PI*2; i += incrementAngle) {
    result.push({
      label: i,
      value: parseFloat(Math.sin(i).toFixed(5))
    })
  };
  return result;
}

function cosine (points) {
  var result = []
    , incrementAngle = (Math.PI*2)/points
    ;
  for (var i = 0; i < Math.PI*2; i += incrementAngle) {
    result.push({
      label: i,
      value: parseFloat(Math.cos(i).toFixed(5))
    })
  };
  return result;
}

function yearByMonths (yearCount) {
  var dates = []
    , month = 1
    , startYear = 2014 - yearCount
    ;
  
  for (var i = 0; i < yearCount; i++) {
    month = 0;
    while (month < 12) {
      dates.push(new Date(startYear+i, month).getTime());
      month++;
    }
  }
  return dates;
}
