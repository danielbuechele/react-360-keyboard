import * as React from 'react';
import PropTypes from 'prop-types';
import EmojiText from './EmojiText';
import {StyleSheet, VrButton, Text, View, Image, asset, NativeModules} from 'react-360';
const {AudioModule} = NativeModules;

type Props = {|
  placeholder: ?string,
  typed: ?string,
  onChange: (value: ?string) => mixed,
|};

type State = {|
  hover: boolean,
|};

export default class Keyboard extends React.Component<Props, State> {
  static contextTypes = {
    tintColor: PropTypes.string,
    sound: PropTypes.bool,
  };

  state = {
    hover: false,
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
    const {tintColor} = this.context;
    return (
      <View
        style={[
          styles.placeholder,
          {
            borderColor: tintColor,
          },
        ]}
      >
        <EmojiText
          style={[
            styles.placeholderText,
            {
              color: tintColor,
              opacity: this.props.typed ? 1 : 0.3,
              fontWeight: this.props.typed ? '500' : '300',
            },
          ]}
        >
          {this.props.typed || this.props.placeholder || ''}
        </EmojiText>
        <VrButton
          hitSlop={10}
          onButtonPress={this.onButtonPress}
          onEnter={() => this.setState({hover: true})}
          onExit={() => this.setState({hover: false})}
          style={[
            styles.clear,
            {
              backgroundColor: this.state.hover ? '#3C3D3F' : '#2D2E30',
            },
          ]}
          onClick={() => this.props.onChange(null)}
        >
          <Image
            source={asset('react-360-keyboard/x.png')}
            style={[
              styles.clearText,
              {
                tintColor: this.state.hover ? tintColor : 'rgba(255, 255, 255, 0.3)',
              },
            ]}
          />
        </VrButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    width: 700,
    height: 60,
    backgroundColor: '#262729',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    flexDirection: 'row',
  },
  placeholderText: {
    fontSize: 40,
    alignSelf: 'flex-start',
    flexGrow: 1,
    textAlign: 'center',
    marginLeft: 20,
  },
  clear: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    width: 30,
    height: 30,
  },
});
