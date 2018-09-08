import * as React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Image, View, Text, asset} from 'react-360';

export default class Dictation extends React.Component<{||}> {
  static contextTypes = {
    tintColor: PropTypes.string,
  };

  render() {
    const {tintColor} = this.context;
    return (
      <View style={styles.container}>
        <View style={styles.bars}>
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
          <View style={[styles.bar, {backgroundColor: tintColor}]} />
        </View>
        <Text style={styles.text}>Listening...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#262729',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  bar: {
    width: 10,
    borderRadius: 5,
    height: 80,
    margin: 10,
  },
  text: {
    fontSize: 30,
    color: '#6C6D6E',
  },
});
