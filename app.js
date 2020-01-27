const Inky = require('inky').Inky;
const pretty = require('pretty');
const fs = require('fs');
const marked = require('marked');
const inky = new Inky();

const md = `

# foobar

\`\`\`fnd
<button href="foo">bar</button>
\`\`\`

<div>Doctor Spielvogel, it alleviates nothing fixing the blame - blaming is still ailing, of course, of course - but nonetheless, what was it with these Jewish parents, what, that they were able to make us little Jewish boys believe ourselves to be princes on the one hand, unique as unicorns on the one hand, geniuses and brilliant like nobody has ever been brilliant and beautiful before in the history of childhood - saviors and sheer perfection on the one hand, and such bumbling, incompetent, thoughtless, helpless, selfish, evil little shits, little ingrates, on the other!</div>

\`\`\`fnd
<button href="another">zoo</button>
\`\`\`

`;

const tokens = marked.lexer(md);

tokens.forEach(function(token, index) {
  // If the language of the pre example is `fnd`
  if (token.lang === 'fnd') {
    const codeExample = token.text;

    // Explode code example to inky equivalent
    const inkyHtml = inky.releaseTheKraken(codeExample);

    const newObj = {
      type: 'html',
      pre: false,
      text: `<div class="fnd-example">${inkyHtml}</div>`,
    };

    // Insert rendered example above code example
    tokens[index - 1] = newObj;
  }
});

const html = marked.parser(tokens);
console.log(pretty(html));
