import * as React from 'react';
import PropTypes from 'prop-types';
import Key from './Key';
import KeyboardRow from './KeyboardRow';
import {emojiUnicode} from './EmojiText';
import {StyleSheet, Image, View, VrButton, NativeModules, asset} from 'react-360';
const {AudioModule} = NativeModules;

type Props = {|
  onType: (letter: string) => mixed,
|};

type State = {|
  hover: ?string,
|};
//,
const EMOJI_LAYOUT = [
  ['😀', '😅', '😂', '😇', '😍', '😘', '😛', '😎', '😟', '😑'],
  ['😢', '😭', '😡', '😱', '😬', '😴', '👻', '😈', '💩', '🙈'],
  ['👏', '👍', '👎', '🎉', '🌈', '🔥', '🌟', '🍔', '🚗', '💙'],
];

export default class EmojiKeyboard extends React.Component<Props, State> {
  static contextTypes = {
    sound: PropTypes.bool,
  };

  state = {
    hover: null,
  };

  onButtonPress = () => {
    if (this.context.sound) {
      AudioModule.playOneShot({
        source: asset('react-360-keyboard/Click.m4a'),
        volume: 0.15,
      });
    }
  };

  render() {
    return EMOJI_LAYOUT.map((row, i) => (
      <KeyboardRow key={`row${i}`}>
        {row.map((k, i) => (
          <VrButton
            hitSlop={10}
            key={i}
            onClick={() => this.props.onType(k)}
            onButtonPress={this.onButtonPress}
            onEnter={() => this.setState({hover: k})}
            onExit={() => this.setState({hover: null})}
          >
            <Image
              source={asset(`react-360-keyboard/emoji/${emojiUnicode(k)}.png`)}
              style={[styles.emoji, {transform: [{scale: this.state.hover === k ? 1.2 : 1}]}]}
            />
          </VrButton>
        ))}
      </KeyboardRow>
    ));
  }
}

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: '#262729',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 5,
  },
  emoji: {
    marginLeft: 10,
    marginRight: 10,
    width: 36,
    height: 36,
  },
});
