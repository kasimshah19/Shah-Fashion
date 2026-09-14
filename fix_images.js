import fs from 'fs';

let content = fs.readFileSync('backend/src/data/products.js', 'utf8');

content = content.replace(
  /const img = \(seed, w = 600, h = 800\) =>\n  `https:\/\/picsum\.photos\/seed\/sf\$\{seed\}\/\$\{w\}\/\$\{h\}`;/,
  `const img = (seed, keyword = 'saree', w = 600, h = 800) =>\n  \`https://loremflickr.com/\${w}/\${h}/\${encodeURIComponent(keyword)}?lock=\${seed}\`;`
);

let count = 0;
content = content.replace(/fabric: '([^']+)',([\s\S]*?)images: \[img\((\d+)\), img\((\d+)\), img\((\d+)\), img\((\d+)\)\],/g, (match, fabric, middle, s1, s2, s3, s4) => {
    count++;
    const kw1 = fabric.toLowerCase() + ' saree drape';
    const kw2 = fabric.toLowerCase() + ' saree pallu';
    const kw3 = fabric.toLowerCase() + ' saree blouse close up';
    const kw4 = fabric.toLowerCase() + ' saree model';
    return `fabric: '${fabric}',${middle}images: [img(${s1}, '${kw1}'), img(${s2}, '${kw2}'), img(${s3}, '${kw3}'), img(${s4}, '${kw4}')],`;
});

content = content.replace(/photos: \[img\((\d+), 200, 200\)(, img\((\d+), 200, 200\))?\]/g, (match, p1, hasP2, p2) => {
    if (hasP2) {
       return `photos: [img(${p1}, 'saree wear', 200, 200), img(${p2}, 'saree close up', 200, 200)]`;
    }
    return `photos: [img(${p1}, 'saree wear', 200, 200)]`;
});

fs.writeFileSync('backend/src/data/products.js', content);
console.log('Updated ' + count + ' products.');
