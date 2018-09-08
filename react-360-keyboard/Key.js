import * as React from 'react';
import {asset, VrButton, Text, StyleSheet, NativeModules} from 'react-360';
const {AudioModule} = NativeModules;

type State = {
  hover: boolean,
};

export default class Key extends React.Component<Props, State> {
  static defaultProps = {
    width: 'auto',
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
    const {children, width, ...props} = this.props;
    return (
      <VrButton
        style={[
          styles.key,
          {
            width,
            minWidth: width || 'none',
            maxWidth: width || 'none',
            backgroundColor: `rgba(255, 255, 255, ${this.state.hover ? 0.1 : 0.03})`,
            flexBasis: width !== 'auto' ? 'auto' : 1,
          },
        ]}
        {...props}
        onEnter={this.onEnter}
        onClick={this.onClick}
        onExit={() => this.setState({hover: false})}
      >
        {typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
      </VrButton>
    );
  }
}

const styles = StyleSheet.create({
  key: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 3,
  },
  text: {
    position: 'relative',
    top: -3,
    textAlign: 'center',
    fontSize: 30,
    color: '#81D9FD',
    fontWeight: '400',
  },
});
