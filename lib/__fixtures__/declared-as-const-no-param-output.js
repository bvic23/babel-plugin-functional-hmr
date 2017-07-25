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
    return (<Text style={{ color: 'blue' }}>Test</Text>);
  }

}

const Button = wrapComponent('Button', __Button);


export default Button;
