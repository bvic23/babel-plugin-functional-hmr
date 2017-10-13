const plugin = require('../');
const fs = require('fs');
const path = require('path');
const core = require('babel-core');

const f = file => path.join(__dirname, '..', '__fixtures__', file);
const read = file => fs.readFileSync(f(file), 'utf8');
const given = file => ({ source: read(`${file}.js`) });
const l = string => string.trim().split('\n').filter(l => l !== '/* eslint-disable */');
const transform = source => core.transform(source, { plugins: [plugin] }).code;

test('already a class, should not transform anything', () => {
    // Given
    const { source } = given('class-already');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('function, should transform', () => {
    // Given
    const { source } = given('export-default-param');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('function as const, should transform', () => {
    // Given
    const { source } = given('declared-as-const');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('simple function, should not change', () => {
    // Given
    const { source } = given('simplefunction');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('simple function with more than on 1 parameter, should not change', () => {
    // Given
    const { source } = given('simplefunction-multiple-param');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('functional component like function with non-jsx body, should not change', () => {
    // Given
    const { source } = given('non-jsx-body');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('multiple components, should change', () => {
    // Given
    const { source } = given('multiple-components');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('non default components, should change', () => {
    // Given
    const { source } = given('nondefault-components');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('no parameters, should change', () => {
    // Given
    const { source } = given('declared-as-const-no-param');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('non toplevel, should not change', () => {
    // Given
    const { source } = given('nontoplevel');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('embedded return, should change', () => {
    // Given
    const { source } = given('embedded-return');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('embedded return with argument, should change', () => {
    // Given
    const { source } = given('embedded-return-arguments');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('embedded return with argument, should change', () => {
    // Given
    const { source } = given('embedded-return-extra-statements');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('const with destructure in param, should change', () => {
    // Given
    const { source } = given('destructure');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});

test('simple function with destructed param', () => {
    // Given
    const { source } = given('class-and-function');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toMatchSnapshot();
});
