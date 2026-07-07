const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/lib/pre-generated');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts'));

const additionalHtml = `<h3>🌌 Cosmic Connection</h3><p>Beyond its precise measurements, this instrument embodies the deep philosophical connection between humanity and the cosmos. In traditional Indian astronomy, the alignment of such monumental structures with the heavens was believed to reflect the profound interconnectedness of the terrestrial and celestial realms, acting as a physical manifestation of Vedic astronomical principles.</p>`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the description string and append the additional HTML before the closing quote
    content = content.replace(/(description:\s*".*?)(",\s*dimensions:)/s, `$1${additionalHtml}$2`);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
