const fs = require('fs');

// A 1x1 gray pixel PNG in base64
const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

fs.mkdirSync('d:/smart scanner/sample_docs', { recursive: true });
fs.writeFileSync('d:/smart scanner/sample_docs/dummy_rc.png', Buffer.from(base64Png, 'base64'));
fs.writeFileSync('d:/smart scanner/sample_docs/dummy_insurance.png', Buffer.from(base64Png, 'base64'));
fs.writeFileSync('d:/smart scanner/sample_docs/dummy_puc.png', Buffer.from(base64Png, 'base64'));

console.log('Dummy files created successfully!');
