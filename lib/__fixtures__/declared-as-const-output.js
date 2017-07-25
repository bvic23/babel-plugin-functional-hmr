/* eslint-disable */
import { TouchableNativeFeedback, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';

import reactTransform from 'react-transform-hmr';

function wrapComponent(id, Component) {
    const t = reactTransform({
        components: {
            [id]: {
                displayName: id
            }
        },
        locals: [module],
        imports: [require("react")]
    });
    return t(Component, id);
}

class __Button extends require("react").Component {
    render() {
        const children = this.props.children,
              onPress = this.props.onPress;
        return (<TouchableNativeFeedback onPress={onPress}>
        <Text style={{ color: 'blue' }}>
            {children}
        </Text>
    </TouchableNativeFeedback>);
    }

}

const Button = wrapComponent('Button', __Button);


export default Button;
