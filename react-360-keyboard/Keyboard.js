import * as React from 'react';
import Key from './Key';
import KeyboardRow from './KeyboardRow';
import LetterKeyboard from './LetterKeyboard';
import EmojiKeyboard from './EmojiKeyboard';
import {AppRegistry, StyleSheet, Text, View, Image, asset, NativeModules, Animated} from 'react-360';

type Props = {|
  sound?: boolean,
  returnKeyLabel?: string,
  tintColor?: string,
  onChange?: (value: string) => mixed,
  onValidate?: (value: string) => boolean,
  onSubmit?: (value: string) => mixed,
|};

type State = {
  shift: boolean,
  numeric: boolean,
  typed: string,
  opacity: Object,
  placeholder: ?string,
};

export default class Keyboard extends React.Component<Props, State> {
  static defaultProps = {
    returnKeyLabel: 'Return',
    tintColor: '#81D9FD',
    sound: true,
  };

  state = {
    shift: false,
    numeric: false,
    typed: '',
    opacity: new Animated.Value(0),
    placeholder: null,
  };

  componentDidMount() {
    NativeModules.Keyboard.waitForShow().then(this.onShow);
  }

  onShow = (placeholder: ?string) => {
    this.setState({placeholder, typed: ''});
    Animated.timing(this.state.opacity, {
      toValue: 350,
      duration: 200,
    }).start();
  };

  onSubmit = () => {
    NativeModules.Keyboard.endInput(this.state.typed).then(() => {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 200,
      }).start();
      NativeModules.Keyboard.waitForShow().then(this.onShow);
    });
  };

  onType = (letter: string) => {
    let {typed} = this.state;
    if (letter === 'Backspace') {
      typed = typed.slice(0, -1);
    } else {
      typed += String(letter);
    }

    this.setState({typed, shift: false});
    if (this.props.onChange) {
      this.props.onChange(typed);
    }
  };

  render() {
    return (
      <Animated.View style={{transform: [{translateZ: this.state.opacity}]}}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{this.state.typed || this.state.placeholder || ' '}</Text>
        </View>
        <View style={styles.keyboard}>
          {this.state.emoji ? (
            <EmojiKeyboard onType={this.onType} />
          ) : (
            <LetterKeyboard
              numeric={this.state.numeric}
              onType={this.onType}
              shift={this.state.shift}
              onToggleShift={() => this.setState({shift: !this.state.shift})}
            />
          )}
          <KeyboardRow>
            <Key width={80} onClick={() => this.setState({numeric: !this.state.numeric})}>
              {this.state.numeric ? 'ABC' : '123'}
            </Key>
            <Key width={80} onClick={() => this.setState({emoji: !this.state.emoji})}>
              <Image
                source={asset('emoji.png')}
                style={{width: 40, height: 40, tintColor: this.props.tintColor}}
              />
            </Key>
            <Key width={200} onClick={() => this.onType(' ')} />
            <Key width={100} onClick={this.onSubmit}>
              {this.props.returnKeyLabel}
            </Key>
          </KeyboardRow>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    width: 600,
    height: 200,
    backgroundColor: '#262729',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 5,
    alignSelf: 'center',
  },
  placeholder: {
    width: 700,
    height: 60,
    backgroundColor: '#262729',
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#81D9FD',
    //transform: [{rotateX: '-45deg'}],
  },
  placeholderText: {
    color: '#81D9FD',
    fontWeight: '500',
    fontSize: 40,
  },
});

AppRegistry.registerComponent('HVPanel', () => Keyboard);
