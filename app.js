const Inky = require('inky').Inky;
const cheerio = require('cheerio');
const pretty = require('pretty');
const fs = require('fs');
const marked = require('marked');

const md = `

# Foobbar

Oh, to be a center fielder, a center fielder and nothing more.

<div>hello</div>

\`\`\`foundation
<button href="foo">bar</button>
\`\`\`

<div>second</div>

\`\`\`foundation
<button href="another">zoo</button>
\`\`\`

`;

const tokens = marked.lexer(md);

tokens.forEach(function(token, index) {
  if (token.type === 'code' && token.lang === 'foundation') {
    const inky = new Inky();

    // Loads the text from the token into cheerio.
    const foundationPre = cheerio.load(token.text);

    // Cheerio outputs full html code, this isolates the output, removing html/body tags
    const cheerioIsolatedCode = foundationPre.html('body > *');

    console.log(cheerioIsolatedCode);

    // Converts the now isolated code to Inky friendly
    const codeExample = inky.releaseTheKraken(cheerioIsolatedCode);
    const newObj = { type: 'html', pre: false, text: codeExample };

    // Insert rendered example above code
    tokens[index - 1] = newObj;
  }
});

const html = marked.parser(tokens);
console.log(html);
