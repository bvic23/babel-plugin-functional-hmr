import { Text } from 'react-native';
import React from 'react';

const withNumber = number => {
    return BaseComponent => {
        return props => <BaseComponent {...props} number={number} />;
    };
};

const Test = ({ number }) => {
    return (
        <Text>
            Test {number}
        </Text>
    );
};

export default withNumber(3)(Test);
