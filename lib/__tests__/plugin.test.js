const plugin = require('../');
const fs = require('fs');
const path = require('path');
const core = require('babel-core');

const f = file => path.join(__dirname, '..', '__fixtures__', file);
const read = file => fs.readFileSync(f(file), 'utf8');
const given = file => ({ source: read(`${file}.js`), target: read(`${file}-output.js`) });
const l = string => string.trim().split('\n').filter(l => l !== '/* eslint-disable */');
const transform = source => core.transform(source, { plugins: [plugin] }).code;

test('already a class, should not transform anything', () => {
    // Given
    const { source, target } = given('class-already');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('function, should transform', () => {
    // Given
    const { source, target } = given('export-default-param');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('function as const, should transform', () => {
    // Given
    const { source, target } = given('declared-as-const');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('simple function, should not change', () => {
    // Given
    const { source, target } = given('simplefunction');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('simple function with more than on 1 parameter, should not change', () => {
    // Given
    const { source, target } = given('simplefunction-multiple-param');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('functional component like function with non-jsx body, should not change', () => {
    // Given
    const { source, target } = given('non-jsx-body');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('multiple components, should change', () => {
    // Given
    const { source, target } = given('multiple-components');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('non default components, should change', () => {
    // Given
    const { source, target } = given('nondefault-components');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

test('no parameters, should change', () => {
    // Given
    const { source, target } = given('declared-as-const-no-param');

    // When
    const code = transform(source);

    // When
    expect(l(code)).toEqual(l(target));
});

// TODO: test convert with function with one render function inside
