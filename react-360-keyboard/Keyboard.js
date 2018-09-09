import * as React from 'react';
import Key from './Key';
import KeyboardRow from './KeyboardRow';
import LetterKeyboard from './LetterKeyboard';
import Placeholder from './Placeholder';
import Dictation from './Dictation';
import PropTypes from 'prop-types';
import EmojiKeyboard from './EmojiKeyboard';
import {AppRegistry, StyleSheet, Text, View, Image, asset, NativeModules, Animated} from 'react-360';
const {AudioModule} = NativeModules;

type Props = {||};

type InternalConfig = {|
  initialValue: ?string,
  placeholder: ?string,
  sound: boolean,
  emoji: boolean,
  dictation: boolean,
  returnKeyLabel?: string,
  tintColor: string,
|};

export type Config = $Shape<InternalConfig>;

type State = {
  value: ?string,
  shift: boolean,
  mode: 'alphabetic' | 'numeric' | 'emoji' | 'dictation',
  opacity: Object,
  config: Config,
};

const DEFAULT_CONFIG = Object.freeze({
  initialValue: null,
  placeholder: null,
  sound: true,
  emoji: true,
  dictation: true,
  returnKeyLabel: 'Return',
  tintColor: '#81D9FD',
});

export default class Keyboard extends React.Component<Props, State> {
  static childContextTypes = {
    tintColor: PropTypes.string,
    sound: PropTypes.bool,
  };

  state = {
    shift: true,
    mode: 'alphabetic',
    opacity: new Animated.Value(0),
    value: '',
    config: {...DEFAULT_CONFIG},
  };

  componentDidMount() {
    NativeModules.Keyboard.waitForShow().then(this.onShow);
  }

  getChildContext() {
    return {
      tintColor: this.state.config.tintColor,
      sound: this.state.config.sound,
    };
  }

  onShow = (config: Config) => {
    this.setState({
      config: {
        ...DEFAULT_CONFIG,
        ...config,
      },
      mode: 'alphabetic',
      value: config.initialValue,
      shift: !Boolean(config.initialValue),
    });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
    }).start();
  };

  onSubmit = () => {
    NativeModules.Keyboard.endInput(this.state.value).then(() => {
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 200,
      }).start();
      NativeModules.Keyboard.waitForShow().then(this.onShow);
    });
  };

  onType = (letter: string) => {
    let {value} = this.state;
    value = value || '';

    if (letter === 'Backspace') {
      value = Array.from(value)
        .slice(0, -1)
        .join('');
    } else {
      value += String(letter);
    }

    this.onChange(value);
  };

  onChange = (value: ?string) => {
    if (value && value.length === 0) {
      value = null;
    }
    this.setState({value, shift: !Boolean(value)});
  };

  startDictation = () => {
    this.setState({
      mode: 'dictation',
    });
    NativeModules.Keyboard.startDictation()
      .then(result => {
        this.onChange(result);
        this.setState({
          mode: 'alphabetic',
        });

        if (this.state.config.sound) {
          AudioModule.playOneShot({
            source: asset('react-360-keyboard/Notification-02.m4a'),
            volume: 0.15,
          });
        }
      })
      .catch(() => {
        this.setState({
          mode: 'alphabetic',
        });
      });
  };

  render() {
    const tintColor = this.state.config.tintColor;

    return (
      <Animated.View
        style={{
          opacity: this.state.opacity,
          transform: [
            {
              translateY: this.state.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, 0],
              }),
            },
          ],
        }}
      >
        <Placeholder
          typed={this.state.value}
          placeholder={this.state.config.placeholder}
          onChange={this.onChange}
        />
        <View style={styles.keyboard}>
          {this.state.mode === 'emoji' ? (
            <EmojiKeyboard onType={this.onType} />
          ) : (
            <LetterKeyboard
              numeric={this.state.mode === 'numeric'}
              onType={this.onType}
              shift={this.state.shift}
              onToggleShift={() => this.setState({shift: !this.state.shift})}
            />
          )}
          <KeyboardRow>
            <Key
              grow={2}
              label={this.state.mode === 'alphabetic' ? '123' : 'ABC'}
              onClick={() =>
                this.setState({
                  mode: this.state.mode === 'alphabetic' ? 'numeric' : 'alphabetic',
                })
              }
            />
            {this.state.config.emoji && (
              <Key
                grow={2}
                onClick={() =>
                  this.setState({
                    mode: this.state.mode === 'emoji' ? 'alphabetic' : 'emoji',
                  })
                }
                icon={asset('react-360-keyboard/emoji.png')}
              />
            )}
            <Key grow={6} onClick={() => this.onType(' ')} />
            {this.state.config.dictation &&
              NativeModules.Keyboard.dictationAvailable && (
                <Key
                  grow={2}
                  onClick={this.startDictation}
                  sound={asset('react-360-keyboard/Message-02.m4a')}
                  icon={asset('react-360-keyboard/mic.png')}
                />
              )}
            <Key grow={3} onClick={this.onSubmit} label={this.state.config.returnKeyLabel} />
          </KeyboardRow>
          <Dictation isVisible={this.state.mode === 'dictation'} />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    zIndex: 100,
    width: 600,
    height: 200,
    backgroundColor: '#262729',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 5,
    alignSelf: 'center',
  },
});

AppRegistry.registerComponent('HVPanel', () => Keyboard);
