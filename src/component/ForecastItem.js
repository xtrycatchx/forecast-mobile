import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

class ForecastItem extends React.PureComponent {
  render() {
    const { label, value } = this.props;
    return (
      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: 'red' }}>
          {label}
        </Text>
        <Text style={{ alignSelf: 'flex-end' }}>
          {value}
        </Text>
      </View>
    );
  }
}

ForecastItem.propsType = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default ForecastItem;
