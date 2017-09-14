/* eslint-disable */
import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

const renderItem = ({ item: { date } }) => <View>{date}</View>;

export default class Button extends Component {
    render() {
        return <TouchableNativeFeedback onPress={this.props.onPress}>
                <Text style={{ color: 'green' }}>
                    {this.props.title}
                </Text>
            </TouchableNativeFeedback>;
    }
}

