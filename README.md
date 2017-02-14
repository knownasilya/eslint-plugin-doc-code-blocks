# eslint-plugin-doc-code-blocks

Lint JavaScript in block comment code blocks

[![Build Status](https://travis-ci.org/knownasilya/eslint-plugin-doc-code-blocks.svg?branch=master)](https://travis-ci.org/knownasilya/eslint-plugin-doc-code-blocks)

![Screenshot](screenshot.png)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-doc-code-blocks`:

```
$ npm install eslint-plugin-doc-code-blocks --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-doc-code-blocks` globally.

## Usage

Add `doc-code-blocks` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "doc-code-blocks"
    ]
}
```

## Configuration

By default, the `doc-code-blocks` plugin uses the default ESLint rules, and the values for these could change
from one ESLint release to another. So you'd want to lock in your rules, or you might want different rules
then your code base. This is how you'd do that.

In your `.eslintrc` or equivalent, set something like:

```js
{
  plugins: [
    "doc-code-blocks"
  ],
  extends: [
    "eslint:recommended",
    "plugin:doc-code-blocks/all"
  ],
  rules: {
    "doc-code-blocks/quotes": ["error", "single"]
  }
}
```

Make sure to specify `'plugin:doc-code-blocks/all'` in the `extends` array, or your `doc-code-blocks/` namespaced rules will not work.
You can use all of the default ESLint rules here, like `quotes` above.

*Note: This plugin doesn't currently provide any rules of it's own.*
