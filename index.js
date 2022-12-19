const { Parser } = require("./src/Parser");



const str = `<h1 title="header__title" onclick={clickHandler}>  Hello world </h1>`;

const parser = new Parser();

const body = parser.parse(str);

console.log(body);
console.log(body.body[0])


const Test = () => {
    const clickHandler = () => {
        console.log('clicked')
    }

    //@parserJSX
    return (
    <div className="test__container">
        <ul onClick={clickHandler}>
            <li>About us</li>
            <li>Sing up</li>
        </ul>
    </div>)
}