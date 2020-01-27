const Inky = require('inky').Inky;
const cheerio = require('cheerio');
const pretty = require('pretty');
const fs = require('fs');
const marked = require('marked');

const md = `

# Foobbar

Oh, to be a center fielder, a center fielder and nothing more.

<div>foo</div>

\`\`\`foundation
<button href="foo">bar</button>
\`\`\`

`;

const newTokens = [];

const tokens = marked.lexer(md);

tokens.forEach(function(token) {
  if (token.type === 'code' && token.lang === 'foundation') {
    const i = new Inky();
    const foundationPre = cheerio.load(token.text);
    const inkyCode = foundationPre.html('body > *');
    const codeExample = i.releaseTheKraken(inkyCode);
    newTokens.push({
      type: 'html',
      pre: false,
      text: codeExample,
    });
  }
  newTokens.push(token);
});

const html = marked.parser(newTokens);
console.log(html);

// console.log(tokens);

// const src = `
// title: button
// description: this is the button description
// ---

// before

// \`\`\`foundation
// <button href="#">My Button</button>
// \`\`\`

// after
// `;

// // The same plugin settings are passed in the constructor
// // const i = new Inky();
// // const html = cheerio.load(src);

// // // Now unleash the fury
// // const convertedHtml = i.releaseTheKraken(html);

// // // Prettier
// // const prettyHtml = pretty(convertedHtml);

// // console.log(prettyHtml);

// console.log(marked(src));
