import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

export const Button = ({ children, onPress }) =>
    <TouchableNativeFeedback onPress={onPress}>
        <Text style={{ color: 'blue' }}>
            {children}
        </Text>
    </TouchableNativeFeedback>;
