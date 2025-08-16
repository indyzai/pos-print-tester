const fs = require('fs');
const path = require('path');

const modulePath = path.join(
  __dirname,
  'node_modules',
  'react-native-bluetooth-escpos-printer', // Replace with the correct library name
  'android',
  'build.gradle'
);

if (fs.existsSync(modulePath)) {
  let content = fs.readFileSync(modulePath, 'utf8');
  content = content.replace(/jcenter\(\)/g, 'mavenCentral()');
  fs.writeFileSync(modulePath, content, 'utf8');
  console.log('Successfully patched jcenter in the library.');
} else {
  console.log('Library build.gradle not found. Skipping patch.');
}