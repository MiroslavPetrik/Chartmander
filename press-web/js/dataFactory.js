function dataFactory (datasets, categories, range) {
  var data = []
    ;
  for (var i = 0; i < datasets.length; i++) {

    data.push({
      title: datasets[i],
      values: stream(categories, range)
    })
  };

  return data;
}

function stream (cats, range) {
  var result = []
    ;

  for (var i = 0; i < cats.length; i++) {
    result.push({
      label: cats[i],
      value: Math.ceil( 30+Math.random()*range )
    })
  };

  return result;
}

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

function months (count) {
  var dates = []
    ;
  
  for (var i=0; i<count; i++) {
    dates.push(new Date(2014, 1+i).getTime());
  }
  return dates;
}

function bonvoyage (sets, months) {
  return [{
    label: sets[0],
    values: stream(months, 400)
  }, {
    label: sets[1],
    values: stream(months, 50)
  }];
}
