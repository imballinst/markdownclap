const fs = require('fs/promises');
const path = require('path');

async function main() {
  console.log(JSON.parse(await fs.readFile(path.join(process.cwd(), 'package.json'))).version);
}

main();
