// Post-build script to fix asset paths for Chrome extension
import fs from 'fs';
import path from 'path';

const distDir = './dist';

// Fix popup HTML paths
const popupHtmlPath = path.join(distDir, 'src/popup/index.html');
if (fs.existsSync(popupHtmlPath)) {
    let html = fs.readFileSync(popupHtmlPath, 'utf8');

    // Replace absolute paths with relative paths
    html = html.replace(/src="\/assets\//g, 'src="../assets/');
    html = html.replace(/href="\/assets\//g, 'href="../assets/');

    fs.writeFileSync(popupHtmlPath, html);
    console.log('✅ Fixed popup HTML paths');
}

console.log('🎉 Post-build path fixing complete!');
