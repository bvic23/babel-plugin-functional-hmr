import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

const Button = ({ title }) => {
    return (
        <Text style={{ color: 'blue' }}>
            {title}
        </Text>
    );
};

export default Button;
