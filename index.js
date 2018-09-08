import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  VrButton,
  NativeModules,
} from 'react-360';
import {registerKeyboard} from './react-360-keyboard';

type State = {|
  name: ?string,
|};

export default class Keyboard360 extends React.Component<{||}, State> {
  state = {
    name: null,
  };
  onClick = () => {
    NativeModules.Keyboard.startInput({
      initialValue: this.state.name,
      placeholder: 'Your name',
      emoji: false,
    }).then(name => this.setState({name}));
  };
  render() {
    console.log(NativeModules.Keyboard);
    return (
      <View style={styles.panel}>
        <VrButton style={styles.greetingBox} onClick={this.onClick}>
          <Text style={styles.greeting}>
            {this.state.name || 'Enter your name'}
          </Text>
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
