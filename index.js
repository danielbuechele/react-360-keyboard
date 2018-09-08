import React from 'react';
import {AppRegistry, StyleSheet, Text, View, VrButton, NativeModules} from 'react-360';
import {registerKeyboard} from './react-360-keyboard';

export default class Keyboard360 extends React.Component {
  onClick = () => {
    NativeModules.Keyboard.startInput('Enter your name').then(console.log);
  };
  render() {
    return (
      <View style={styles.panel}>
        <VrButton style={styles.greetingBox} onClick={this.onClick}>
          <Text style={styles.greeting}>Welcome to React 360</Text>
        </VrButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    // Fill the entire surface
    width: 1000,
    height: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingBox: {
    padding: 20,
    backgroundColor: '#000000',
    borderColor: '#639dda',
    borderWidth: 2,
  },
  greeting: {
    fontSize: 30,
  },
});

AppRegistry.registerComponent('Keyboard360', () => Keyboard360);
AppRegistry.registerComponent(...registerKeyboard);
