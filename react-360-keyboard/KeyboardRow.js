import * as React from 'react';
import {StyleSheet, View} from 'react-360';

export default props => (
  <View style={[styles.row, {paddingHorizontal: props.margin || 0}]}>
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  row: {
    height: '25%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
