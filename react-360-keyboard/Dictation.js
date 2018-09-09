import * as React from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, Image, View, Text, asset} from 'react-360';

type Props = {
  isVisible: boolean,
};

type State = {
  heights: Array<Object>,
  opacity: Object,
  isVisible: boolean,
};

export default class Dictation extends React.Component<Props, State> {
  static contextTypes = {
    tintColor: PropTypes.string,
  };

  _intervalID: ?IntervalID;

  state = {
    heights: [
      new Animated.Value(Math.random()),
      new Animated.Value(Math.random()),
      new Animated.Value(Math.random()),
      new Animated.Value(Math.random()),
      new Animated.Value(Math.random()),
      new Animated.Value(Math.random()),
      new Animated.Value(Math.random()),
    ],
    opacity: new Animated.Value(this.props.isVisible ? 1 : 0),
    isVisible: this.props.isVisible,
  };

  componentDidMount() {
    if (this.props.isVisible) {
      this._intervalID = setInterval(this.randomizeBars, 100);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.isVisible !== nextProps.isVisible) {
      if (nextProps.isVisible) {
        this._intervalID = setInterval(this.randomizeBars, 100);
        this.setState({
          isVisible: true,
        });
      } else if (!nextProps.isVisible && this._intervalID) {
        clearInterval(this._intervalID);
      }

      Animated.timing(this.state.opacity, {
        toValue: nextProps.isVisible ? 1 : 0,
        duration: 300,
      }).start(() => {
        if (!nextProps.isVisible) {
          this.setState({isVisible: false});
        }
      });
    }
  }

  componentWillUnmount() {}

  randomizeBars = () => {
    this.state.heights.forEach((_, i) => {
      Animated.spring(this.state.heights[i], {
        toValue: Math.random(),
      }).start();
    });
  };

  render() {
    const {tintColor} = this.context;
    return this.state.isVisible ? (
      <Animated.View
        style={[styles.container, {opacity: this.state.opacity}]}
        pointerEvents={'none'}
      >
        <View style={styles.bars}>
          {this.state.heights.map((height, i) => (
            <Animated.View
              key={i}
              style={[
                styles.bar,
                {
                  backgroundColor: tintColor,
                  height: height.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 80],
                  }),
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.text}>Listening...</Text>
      </Animated.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#262729',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    height: 80,
  },
  bar: {
    width: 10,
    borderRadius: 5,
    height: 80,
    margin: 10,
  },
  text: {
    fontSize: 30,
    color: '#6C6D6E',
  },
});
