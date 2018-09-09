import * as React from 'react';
import {asset, View, Text, StyleSheet, Image} from 'react-360';

type Props = {
  children: string,
  style: ?Object | ?Array<Object>,
};

const ALIGN_MAP = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

export function emojiUnicode(input: string) {
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
  return comp.toString(16);
}

export default (props: Props) => {
  const {
    color,
    fontSize,
    fontWeight,
    lineHeight,
    textAlign,
    ...boxStyles
  } = StyleSheet.flatten(props.style);
  const textStyles = {
    color,
    fontSize,
    fontWeight,
    lineHeight,
  };
  const textComponent = (t: string, key: number) => (
    <Text style={textStyles} key={key}>
      {t}
    </Text>
  );
  let content = [];
  let string = '';
  let k = 0;
  for (let c of Array.from(props.children)) {
    if (c.charCodeAt(0) > 256) {
      if (string.length > 0) {
        content.push(textComponent(string, k++));
      }
      string = '';
      content.push(
        <Image
          key={k++}
          style={{
            width: (fontSize || 20) * 0.7,
            height: (fontSize || 20) * 0.7,
            marginTop: fontSize * 0.3,
            marginBottom: fontSize * 0.2,
          }}
          source={asset(`react-360-keyboard/emoji/${emojiUnicode(c)}.png`)}
        />,
      );
    } else {
      string += c;
    }
  }

  if (string.length > 0) {
    content.push(textComponent(string, k++));
  }

  return (
    <View
      {...props}
      style={{
        ...boxStyles,
        flexDirection: 'row',
        justifyContent: ALIGN_MAP[textAlign],
        alignItems: 'center',
      }}
    >
      {content}
    </View>
  );
};
