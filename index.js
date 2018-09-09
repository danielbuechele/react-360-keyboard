import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  VrButton,
  NativeModules,
} from 'react-360';
import {EmojiText, registerKeyboard} from './react-360-keyboard';

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
      emoji: true,
    }).then(name => {
      console.log(name);
      this.setState({name});
    });
  };
  render() {
    return (
      <VrButton style={styles.greetingBox} onClick={this.onClick}>
        <EmojiText style={styles.greeting}>
          {this.state.name || 'Click to enter your name'}
        </EmojiText>
      </VrButton>
    );
  }
}

const styles = StyleSheet.create({
  greetingBox: {
    marginLeft: 350,
    marginTop: 150,
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
