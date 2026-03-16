const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend/src/pages/tools');

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.jsx')) return;
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Matches the pipe separator span, optional whitespace/newlines, and the tool-page-desc paragraph
    const regex = /<span className="hidden sm:inline text-border">\|<\/span>[\s\r\n]*<p className="tool-page-desc">.*?<\/p>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, '');
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    }
});
