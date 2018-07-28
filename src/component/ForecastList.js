import React from 'react';
import { View } from 'react-native';

import Forecast from './Forecast';

class ForecastList extends React.PureComponent {
  render() {
    const { readings } = this.props;
    return (
      <View style={{ marginBottom: 20 }}>
        {
            readings.map(data => (
              <Forecast key={data.date} forecast={data} />
            ))
        }
      </View>
    );
  }
}

export default ForecastList;
