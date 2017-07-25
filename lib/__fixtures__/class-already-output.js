/* eslint-disable */
import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';
export default class Button extends Component {
    render() {
        return <TouchableNativeFeedback onPress={this.props.onPress}>
                <Text style={{ color: 'green' }}>
                    {this.props.title}
                </Text>
            </TouchableNativeFeedback>;
    }
}

