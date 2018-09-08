import * as React from 'react';
import PropTypes from 'prop-types';
import {
  asset,
  VrButton,
  Text,
  StyleSheet,
  NativeModules,
  Image,
} from 'react-360';
const {AudioModule} = NativeModules;

type Props = {|
  primary?: boolean,
  grow?: ?number,
  label?: string,
  icon?: string,
  onClick?: Function,
  onButtonPress?: Function,
  onButtonRelease?: Function,
|};

type State = {
  hover: boolean,
};

export default class Key extends React.Component<Props, State> {
  static contextTypes = {
    tintColor: PropTypes.string,
  };

  static defaultProps = {
    primary: false,
    grow: 1,
  };

  state = {
    hover: false,
  };

  onEnter = () => {
    this.setState({hover: true});
  };

  onClick = () => {
    AudioModule.playOneShot({
      source: asset('Click.m4a'),
    });
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  render() {
    const {icon, grow, label, ...props} = this.props;
    const {tintColor} = this.context;
    return (
      <VrButton
        style={[
          styles.key,
          {
            backgroundColor: this.props.primary
              ? tintColor
              : this.state.hover
                ? '#3C3D3F'
                : '#2D2E30',
            flexBasis: 1,
            flexGrow: grow,
          },
        ]}
        {...props}
        onEnter={this.onEnter}
        onClick={this.onClick}
        onExit={() => this.setState({hover: false})}
      >
        {icon && (
          <Image
            source={icon}
            style={{
              tintColor: this.props.primary ? 'black' : tintColor,
              width: 40,
              height: 40,
            }}
          />
        )}
        {label && (
          <Text
            style={[
              styles.text,
              {color: this.props.primary ? 'black' : tintColor},
            ]}
          >
            {label}
          </Text>
        )}
      </VrButton>
    );
  }
}

const styles = StyleSheet.create({
  key: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 3,
    padding: 0,
  },
  text: {
    position: 'relative',
    top: -3,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '400',
  },
});
