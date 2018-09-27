import React from 'react';
import { View } from 'react-native';
import Forecast from './Forecast';

const ForecastList = ({ readings }) => (
  <View style={{ marginBottom: 20 }}>
    {
      readings.map(data => (
        <Forecast key={JSON.stringify(data)} forecast={data} />
      ))
    }
  </View>
);

export default ForecastList;
