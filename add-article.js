const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function addArticle() {
    console.log('📝 Adding a new article...\n');
    
    const title = await prompt('Article title: ');
    const date = await prompt('Publication date: ');
    const url = await prompt('Article URL: ');
    const image = await prompt('Image path (e.g., resources/images/article.webp): ');
    const imageAlt = await prompt('Image alt text: ');
    const intro = await prompt('Article introduction: ');
    
    // Generate ID from title
    const id = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    
    const newArticle = {
        id,
        title,
        date,
        image,
        imageAlt,
        url,
        intro
    };
    
    // Read existing articles
    const articlesData = JSON.parse(fs.readFileSync('src/articles.json', 'utf8'));
    
    // Add new article
    articlesData.articles.push(newArticle);
    
    // Write back to file
    fs.writeFileSync('src/articles.json', JSON.stringify(articlesData, null, 2));
    
    console.log('\n✅ Article added successfully!');
    console.log('🔨 Run "npm run build" to regenerate the website.');
    
    rl.close();
}

addArticle().catch(console.error);
