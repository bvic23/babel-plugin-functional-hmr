const jsx = require('babel-plugin-syntax-jsx');

const createImportDeclaration = (t, identifier, pageName) => {
    const specifiers = [t.importDefaultSpecifier(identifier)];
    return t.importDeclaration(specifiers, t.stringLiteral(pageName));
}

function wrapComponent(t, className) {
    const declares = [
        t.variableDeclarator(
            t.identifier(className),
            t.callExpression(t.identifier('wrapComponent'), [
                t.stringLiteral(className),
                t.identifier('__' + className)
            ])
        )
    ];

    return t.variableDeclaration('const', declares);
}

function declareWrapComponent(t, className, filename, ReactId, ReactTransformId) {
    const displayNameProp = t.objectProperty(t.identifier('displayName'), t.identifier('id'));
    const displayNameObject = t.objectExpression([displayNameProp]);

    const idProp = t.objectProperty(t.identifier('[id]'), displayNameObject);
    const idObject = t.objectExpression([idProp]);

    const localsProp = t.objectProperty(t.identifier('locals'), t.arrayExpression([t.identifier('module')]));
    const reactProp = t.objectProperty(t.identifier('imports'), t.arrayExpression([ReactId]));
    const filenameProp = t.objectProperty(t.identifier('filename'), t.stringLiteral(filename));

    const componentsProp = t.objectProperty(t.identifier('components'), idObject);
    const componentsObject = t.objectExpression([componentsProp, localsProp, reactProp, filenameProp]);

    const declares = [
        t.variableDeclarator(t.identifier('t'), t.callExpression(ReactTransformId, [componentsObject]))
    ];
    const declareT = t.variableDeclaration('const', declares);

    const callT = t.callExpression(t.identifier('t'), [t.identifier('Component'), t.identifier('id')]);
    const returnStatement = t.returnStatement(callT);

    const params = [t.identifier('id'), t.identifier('Component')];
    const body = t.blockStatement([declareT, returnStatement]);
    return t.functionDeclaration(t.identifier('wrapComponent'), params, body);
}

function renderFunction(t, arrowFunction, params, isEmbeddedReturn) {
    const noParam = arrowFunction.params.length === 0;

    const arrowBody = arrowFunction.body;
    const lastIndex = arrowBody.body ? arrowBody.body.length - 1 : 0;
    const returnBody = isEmbeddedReturn ? arrowBody.body[lastIndex].argument : arrowBody;
    const returnStatement = t.returnStatement(t.parenthesizedExpression(returnBody));

    const blocks = [];
    if (!noParam) {
        var declar = t.variableDeclaration("let", [t.variableDeclarator(params[0].node, t.memberExpression(t.identifier('this'), t.identifier('props')))]);
        blocks.push(declar);
    }
    if (arrowBody.body && arrowBody.body.length > 1) {
        for (let i = 0, l = lastIndex; i < l; i++) {
            blocks.push(arrowBody.body[i]);
        }
    }
    blocks.push(returnStatement);

    const renderBody = t.blockStatement(blocks);
    return t.classMethod('method', t.identifier('render'), [], renderBody);
}

module.exports = function({ Plugin, types: t, template }) {
    const visitor = {};
    const arrowVisitor = function(state, ReactId, ReactTransformId) {
        return function(path) {
            if (process.env.BABEL_ENV === 'production') return;

            const filename = state.file.opts.filename;
            const arrowFunction = path.node;
            const arrowBody = arrowFunction.body;

            if (filename.indexOf('node_modules') > -1) return;
            if (arrowFunction.params.length > 1) return;
            if (arrowFunction.params[0] && arrowFunction.params[0].type !== 'ObjectPattern') return;

            const isJSXElement = arrowBody.type === 'JSXElement';
            const lastIndex = arrowBody.body ? arrowBody.body.length - 1 : 0;
            const lastStatement = arrowBody.body && arrowBody.body[lastIndex];

            const isEmbeddedReturn =
                lastStatement &&
                arrowBody.type === 'BlockStatement' &&
                lastStatement.type === 'ReturnStatement' &&
                lastStatement.argument.type === 'JSXElement';
            const isExportDefaultOrVariable = ['ExportDefaultDeclaration', 'VariableDeclarator'].includes(path.parentPath.type)
            if (!(isJSXElement || isEmbeddedReturn)) return;
            if (!isExportDefaultOrVariable) return;

            if (path.parent.id) {
                const code = state.file.code;
                const functionName = path.parent.id.name;
                const isExportConst = path.parentPath.parentPath.parentPath.type === 'ExportNamedDeclaration';
                if (!isExportConst && code.indexOf("export default " + functionName) === -1) return
            }

            const id = path.parentPath.node.id;
            const className = id ? id.name : 'Comp';
            const isDeclaredAsConstant = id !== undefined;

            const renderMethod = renderFunction(t, arrowFunction, path.get('params'), isEmbeddedReturn);
            const classBody = t.classBody([renderMethod]);
            const classDeclaration = t.classDeclaration(
                t.identifier('__' + className),
                t.memberExpression(ReactId, t.identifier('Component')),
                classBody,
                []
            );

            const addImports = (base) => {
                if (!state.cache[filename]) {
                    state.cache[filename] = true;
                    base.insertBefore(createImportDeclaration(t, ReactId, 'react'));
                    base.insertBefore(createImportDeclaration(t, ReactTransformId, 'react-transform-hmr'));
                    base.insertBefore(declareWrapComponent(t, className, filename, ReactId, ReactTransformId));
                }
            }

            if (isDeclaredAsConstant) {
                const isExportDefault = path.parentPath.parentPath.parent.type === 'Program';
                const base = isExportDefault ? path.parentPath.parentPath : path.parentPath.parentPath.parentPath;
                let wrapComp = wrapComponent(t, className);
                if (!isExportDefault) {
                    wrapComp = t.exportNamedDeclaration(wrapComp, []);
                }

                addImports(base);

                base.replaceWith(classDeclaration);
                base.insertAfter(wrapComp);
            } else {
                path.parentPath.replaceWith(classDeclaration);
                path.parentPath.insertAfter(t.exportDefaultDeclaration(t.identifier(className)));

                addImports(path.parentPath);

                path.parentPath.insertAfter(wrapComponent(t, className));
            }
        };
    };

    visitor.Program = function(path, state) {
        // create unique identifers from the imports of react and react transform
        const ReactId = path.scope.generateUidIdentifier('react');
        const ReactTransformId = path.scope.generateUidIdentifier('reactTransform');

        path.traverse({ ArrowFunctionExpression: arrowVisitor(state, ReactId, ReactTransformId) });
    };

    return {
        pre(state) {
            this.cache = {};
        },
        inherits: jsx,
        visitor
    };
};
