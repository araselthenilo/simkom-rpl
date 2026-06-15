const fs = require('fs');
const path = require('path');

const routesDir = 'routes';
const controllersDir = 'app/Http/Controllers';
const pagesDir = 'resources/js/pages';

function getFiles(dir, ext) {
    let results = [];

    if (!fs.existsSync(dir)) {
return results;
}

    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);

        if (stat && stat.isDirectory()) { 
            results = results.concat(getFiles(file, ext));
        } else { 
            if (file.endsWith(ext)) {
results.push(file);
}
        }
    });

    return results;
}

const routeFiles = getFiles(routesDir, '.php');
const routeContents = routeFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

// Find all controllers used in routes
const controllerFiles = getFiles(controllersDir, '.php');
const usedControllers = [];
controllerFiles.forEach(f => {
    const basename = path.basename(f, '.php');

    if (routeContents.includes(basename)) {
        usedControllers.push(f);
    }
});

// Now gather all text from used controllers + route files
const activeContents = routeContents + '\n' + usedControllers.map(f => fs.readFileSync(f, 'utf8')).join('\n');
const activeContentsLower = activeContents.toLowerCase();

// Check pages
const pages = getFiles(pagesDir, '.tsx');
const unusedPages = [];
pages.forEach(p => {
    let relPath = path.relative(pagesDir, p).replace('.tsx', '').replace(/\\/g, '/');

    if (!activeContentsLower.includes(relPath.toLowerCase())) {
        unusedPages.push(p);
    }
});

console.log("=== UNCONNECTED PAGES BASED ON ROUTES ===");
unusedPages.forEach(p => console.log(p));
