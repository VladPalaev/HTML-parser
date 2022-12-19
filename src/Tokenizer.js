const Spec = [
    // SYMBOLS: WHITESPACE etc
    [/^\s+/, null],
    [/^=/, 'ASSIGN'],
    // TAG
    [/^<\//, 'CLOSED_TAG'],
    [/^</, 'OPEN_TAG'],
    [/^>/, 'CLOSED_OPEN_TAG'],
    // CHILDREN
    [/^\w+.[^>]*(?=<\/)/, 'CHILDREN_TEXT'], // TODO ПРОВЕРИТЬ ЕСЛИ НЕТ ПРОБЛЕМОВ МЕЖДУ ТЕГАМИ S+
    // WORD
    [/^\w+(?==)/, 'KEY_PROPERTY'],
    [/^\w+/, 'TAG_NAME'], // todo isComponent /[A-Z]\w+/
    [/^"\w+"/, 'STRING_PROPERTY'],
    [/^\{.*\}/, 'JSX_EXPRESSION_CONTAINER'],

];
// <h1 title="header__title" onclick={clickHandler}>Hello world!</h1>
/* 
OPEN_TAG
TAG_NAME -> KEY_PROPERTY -> 
    WHILE !== CLOSED_OPEN_TAG 
        KEY_PROPERTY = STRING_PROPERTY | JS_PROPERTY

SET_CHILDREN -> 

*/

class Tokenizer {
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    EOF() {
        return this._cursor === this._string.length;
    }

    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regExp, tokenType] of Spec) {
            const tokenValue = this._match(regExp, string);

            if (tokenValue === null) {
                continue;
            }

            if (tokenType === null) {
                return this.getNextToken();
            }

            return {
                type: tokenType,
                value: tokenValue,
            }
        }
    }

    _match(regExp, string) {
        const matched = regExp.exec(string);

        if (matched === null) {
            return null;
        }

        this._cursor += matched[0].length;

        return matched[0];
    }
}

module.exports = {
    Tokenizer
}

// const str = ' Hello </h1>';
// const regExp = /^\s+\w+\s+(?=<\/)/;

// console.log(regExp.exec(str))
