const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Read the data
const articlesData = JSON.parse(fs.readFileSync('src/articles.json', 'utf8'));

// Read templates
const layoutTemplate = fs.readFileSync('templates/layout.hbs', 'utf8');
const indexTemplate = fs.readFileSync('templates/index.hbs', 'utf8');
const articleTemplate = fs.readFileSync('templates/article.hbs', 'utf8');

// Compile templates
const layout = Handlebars.compile(layoutTemplate);
const indexPage = Handlebars.compile(indexTemplate);

// Register the article partial
Handlebars.registerPartial('article', articleTemplate);

// Generate the index page
const indexContent = indexPage(articlesData);
const indexHtml = layout({
    title: "Pagan's Blog",
    isHome: true,
    body: indexContent
});

// Write the generated HTML
fs.writeFileSync('index.html', indexHtml);

console.log('✅ Website built successfully!');
console.log('📄 Generated: index.html');
