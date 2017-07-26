import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

const Button = ({ title }) => {
    const string = title.toUpperCase();
    const sum = 1 + 2;
    return (
        <Text style={{ color: 'blue' }}>
            {string}
        </Text>
    );
};

export default Button;
