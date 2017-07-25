/* eslint-disable */
import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

export default (({ children, onPress }) => <TouchableNativeFeedback onPress={onPress}>
        <Text style={{ color: 'blue' }}>
            {children}
        </Text>
    </TouchableNativeFeedback>);
