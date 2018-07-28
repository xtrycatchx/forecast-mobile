import React, { Component } from 'react';
import {
  Text, View, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import ForecastList from './component/ForecastList';
import PickerWrapper from './component/PickerWrapper';
import forecastUtil from './utils/forecastParser';

class App extends Component {
  state = {
    fetching: false,
    readings: null,
    places: null,
    selectedPlace: {
      value: 'api/seven_day_forecast/457', label: 'Cebu City',
    },
  };

  componentDidMount() {
    const places = forecastUtil.filter(require('../places'), '_Cebu')
    this.setState({ places });
  }

  fetchData = () => {
    const { selectedPlace } = this.state;
    this.setState({ fetching: true });
    const apiCall = forecastUtil.callNoahAPI(selectedPlace.value)
    apiCall.then(readings => {
      this.setState({
        readings,
        fetching: false,
      });
    }).catch(err=> {
      this.setState({
        error: true,
        fetching: false,
      });
    })
  }

  render() {
    const {
      places, selectedPlace, readings, error, fetching,
    } = this.state;
    return (
      <ScrollView style={{ flex: 1 }} automaticallyAdjustContentInsets>
        <View style={{ flex: 1, margin: 20, flexDirection: 'column' }}>
          <Text style={{ alignSelf: 'center' }}>
          Cebu 7 Day Forecast
          </Text>
          <View style={{ flexDirection: 'row', alignSelf: 'center', padding: 20 }}>
            {places && 
            <PickerWrapper
              style={{ width: '45%', marginRight: 5 }}
              data={places}
              initValue={selectedPlace.label}
              onChange={(option) => {
                this.setState({
                  selectedPlace: option,
                });
              }}
            />
            }
            <TouchableOpacity
              activeOpacity={60}
              style={{
                borderColor: '#ddd', borderRadius: 5, borderWidth: 1, marginLeft: 5, width: '45%',
              }}
              onPress={this.fetchData}
            >
              { fetching
                ? (
                  <View style={{ alignSelf: 'center', padding: 5 }}>
                    <ActivityIndicator size="small" color="red" />
                  </View>
                )
                : (
                  <Text style={{ alignSelf: 'center', padding: 10 }}>
            Get Forecast
                  </Text>
                )
          }
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 20 }}>
            {readings
              ? <ForecastList readings={readings} />
              : (
                <Text style={{ color: 'red' }}>
                  {error ? 'Data from NOAH.edu.ph not yet ready' : ''}
                </Text>
              )
            }
          </View>
          {readings && (
          <Text style={{
            fontSize: 11, fontStyle: 'italic', margin: 20, position: 'absolute', bottom: 0, alignSelf: 'center',
          }}
          >
            Readings for
            {selectedPlace.label}
            , data is provided by NOAH.ph
          </Text>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default App;
