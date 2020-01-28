const Inky = require('inky').Inky;
const fs = require('fs');
const marked = require('marked');
const glob = require('glob');
const fm = require('front-matter');
const Handlebars = require('handlebars');

const template = Handlebars.compile('Name: {{fm.title}}');

//----------- Hijack markdown renderer -------------//

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

//----------- Build the page data object -------------//

function renderDocs(data) {
  const source = fs.readFileSync('./src/template/index.hbs', 'utf8').toString();
  const template = Handlebars.compile(source);
  const html = template(data);
  fs.writeFileSync('./dist/index.html', html, 'utf8');
}

function buildPageData(files) {
  const allEntryData = [];

  files.forEach(function(file) {
    const content = fs.readFileSync(file, 'utf8').toString();
    const filedata = fm(content);
    const markdownHtml = marked(filedata.body, { renderer: renderer });

    const data = {
      fm: filedata.attributes,
      body: markdownHtml,
    };

    allEntryData.push(data);
  });

  renderDocs(allEntryData);
}

glob('./components/**/*md', function(er, files) {
  buildPageData(files);
});
