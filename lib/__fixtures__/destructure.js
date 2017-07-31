import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

const Button = ({ children, layout: { width, height } }) =>
    <Text style={{ color: 'blue' }} width={width} height={height}>
        {children}
    </Text>;

export default Button;
