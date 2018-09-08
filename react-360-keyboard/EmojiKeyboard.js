import * as React from 'react';
import Key from './Key';
import KeyboardRow from './KeyboardRow';
import {StyleSheet, Image, View, asset} from 'react-360';

type Props = {};

function emojiUnicode(input) {
  if (input.length === 1) {
    return input.charCodeAt(0);
  }
  let comp =
    (input.charCodeAt(0) - 0xd800) * 0x400 +
    (input.charCodeAt(1) - 0xdc00) +
    0x10000;
  if (comp < 0) {
    return input.charCodeAt(0);
  }
  return comp.toString('16');
}

export default class EmojiKeyboard extends React.Component<Props> {
  render() {
    return [
      <KeyboardRow key="1">
        <Image source={asset('emoji/1f600.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f601.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f602.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f603.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f604.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f605.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f606.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f607.png')} style={styles.emoji} />
      </KeyboardRow>,
      <KeyboardRow key="2">
        <Image source={asset('emoji/1f608.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f609.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f610.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f611.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f612.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f613.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f614.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f615.png')} style={styles.emoji} />
      </KeyboardRow>,
      <KeyboardRow key="3">
        <Image source={asset('emoji/1f616.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f617.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f618.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f619.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f620.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f621.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f622.png')} style={styles.emoji} />
        <Image source={asset('emoji/1f623.png')} style={styles.emoji} />
      </KeyboardRow>,
    ];
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
    width: 40,
    height: 40,
  },
});
