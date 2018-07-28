import React from 'react';
import { View, Text } from 'react-native';
import ForecastItem from './ForecastItem';

class Forecast extends React.PureComponent {
  render() {
    const { forecast } = this.props;
    return (
      <View style={{
        margin: 5,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        borderWidth: 0.5,
      }}
      >
        <View style={{ width: '100%' }}>
          <Text style={{ color: 'red' }}>
            {forecast.date}
          </Text>
        </View>

        <ForecastItem label="Av. Temp" value={JSON.stringify(forecast.avgTemp)} />
        <ForecastItem label="Av. Heat Idx" value={JSON.stringify(forecast.avgHeatIndex)} />
        <ForecastItem label="Av. Rainfall" value={JSON.stringify(forecast.avgRainFalls)} />

      </View>
    );
  }
}

export default Forecast;
