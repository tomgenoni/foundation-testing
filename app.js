const Inky = require('inky').Inky;
const pretty = require('pretty');
const fs = require('fs');
const marked = require('marked');
const glob = require('glob');

const inky = new Inky();

function htmlEntities(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const renderer = new marked.Renderer();
renderer.code = function(text, lang) {
  // If language is empty or `inky`, set it to HTML, otherwise pass through language
  const language = lang === '' || 'inky' ? 'html' : lang;
  // For the code example escape the left/right brackets
  const escapedHtml = htmlEntities(text);
  // Construct the pre HTML code
  const preCode = `<pre class="language-${language}"><code>${escapedHtml}</code></pre>`;
  // Output will always include at least the pre HTML code
  let output = preCode;
  // If we have an `inky` language build the example and prepend it to the pre HTML code
  if (lang === 'inky') {
    const inkyHtml = inky.releaseTheKraken(text);
    const exampleHtml = `<div class="inky-example">${inkyHtml}</div>`;
    output = exampleHtml + output;
  }
  return output;
};

function doStuff(files) {
  files.forEach(function(file) {
    fs.readFile(file, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        const html = marked(data.toString(), { renderer: renderer });
        console.log(pretty(html));
      }
    });
  });
}

glob('./components/**/*md', function(er, files) {
  doStuff(files);
});
