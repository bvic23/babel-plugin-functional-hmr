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
        const title = this.props.title;

        const string = title.toUpperCase();
        const sum = 1 + 2;
        return (<Text style={{ color: 'blue' }}>
            {string}
        </Text>);
    }

}

const Button = wrapComponent('Button', __Button);


export default Button;
