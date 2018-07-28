const parse = jsonObject => {
  return jsonObject.map((data) => {
    const { date } = data;
    const temperatures = data.readings.map(dataTemp => dataTemp.temperature);
    const sumTemp = temperatures.reduce((a, b) => a + b);
    const avgTemp = isNaN(sumTemp) ? 0 : sumTemp / temperatures.length;

    const heatindexes = data.readings.map(dataTemp => dataTemp.heat_index);
    const sumHeatIndexes = heatindexes.reduce((a, b) => a + b);
    const avgHeatIndex = isNaN(sumHeatIndexes) ? 0 : sumHeatIndexes / heatindexes.length;

    const rainFalls = data.readings.map(dataTemp => dataTemp.rainfall);
    const sumRainFalls = rainFalls.reduce((a, b) => a + b);
    const avgRainFalls = isNaN(sumRainFalls) ? 0 : sumRainFalls / rainFalls.length;

    return {
      date,
      avgTemp,
      avgHeatIndex,
      avgRainFalls,
    };
  });
}

const filter = (locations,flag )=> locations.filter(pplace => pplace.verbose_name.includes(flag))
  .map(pplace => ({
    value: pplace.url,
    label: pplace.verbose_name.replace(/_Cebu/, '').split(/(?=[A-Z])/).join(' '),
  }));

const callNoahAPI = (endpoint) => 
  fetch(`http://noah.up.edu.ph/${endpoint}`)
    .then(data => data.text())
    .then((json) => {
      const parsed = JSON.parse(json);
      const readings = parse(parsed.data);
      return Promise.resolve(readings);
    })
    .catch((err) => Promise.reject(err));

const funcs = {
    parse, 
    filter,
    callNoahAPI
}

export default funcs;
