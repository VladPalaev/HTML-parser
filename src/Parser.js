const { Tokenizer } = require("./Tokenizer");
// todo что если скормить Parser дерево ast, где до его вызова я замкну
// ast которое получу от babel

class Parser {
    constructor() {
        this._string = "";
        this._tokeninazer = new Tokenizer();
    }

    parse(string) {
        this._string = string;
        this._tokeninazer.init(string);

        this.lookahead = this._tokeninazer.getNextToken();

        return this.Program();
    }

    Program() {
        return {
            type: "Program",
            body: this.StatementList(),
        }
    }

    StatementList() {
        const statemeList = [this.Statement()];

        return statemeList;
    }
    /**
     * OPEN_TAG
     */
    Statement() {
        switch (this.lookahead.type) {
            case 'OPEN_TAG':
                return this.OpenTag();
        }
    }
    /**
     * OpenTag
     *  : Tag
     *  : Attr
     *  : CloseTag
     */
    OpenTag() {
        this._eat('OPEN_TAG');

        return this.TagName();
    }

    TagName() {
        const token = this._eat('TAG_NAME'); // после того проглотили нетерминал, возвращаем имя Тега

        return {
            tag: token.value, // имя тега
            props: this.SetProps(), // уставнавливаем пропсы
            children: this.SetChildren() // обрабатываем дальше детей внутри
        }
    }

    SetProps() {
        const props = {};

        while (this.lookahead.type !== 'CLOSED_OPEN_TAG') {
            const key = this._eat(this.lookahead.type).value;

            this._eat('ASSIGN'); // может  в lexer приравнять к null

            if (this.lookahead.type === 'JS_PROPERTY') {
                const tokenValue = this.lookahead.value.slice(1, -1).trim();
                props[key] = tokenValue; // todo скорее всего при парсенге бабел фиксирует перменненыне
            } else {
                const value = this.lookahead.value;
                props[key] = value;

            }

            this._eat(this.lookahead.type);
        }

        this._eat('CLOSED_OPEN_TAG')
        // если нет props возвращаем пустой объект
        return props;
    }

    SetChildren() {
        const children = [];

        if (this.lookahead.type === 'CHILDREN_TEXT') {
            return this._eat('CHILDREN_TEXT').value.trim() // обрезаю строку
        }

        return children;
    }

    _eat(tokenType) {
        const token = this.lookahead;

        if (token === null) {
            throw new SyntaxError(`Unexpected end of input: ${tokenType}`);
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: ${token.value}, expected: ${tokenType}`);
        }

        this.lookahead = this._tokeninazer.getNextToken();

        return token;
    }


}

module.exports = {
    Parser,
}