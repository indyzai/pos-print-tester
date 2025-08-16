const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

function withBluetoothPrinter(config) {
  // Patch the build.gradle of the library itself
  config = withProjectBuildGradle(config, (gradleConfig) => {
    const buildGradlePath = 'node_modules/react-native-bluetooth-escpos-printer/android/build.gradle';
    let content = gradleConfig.contents;

    console.log(content);
    
    if (content.includes('jcenter()')) {
      content = content.replace(/jcenter\(\)/g, 'mavenCentral()');
      console.log('Patched JCenter in react-native-bluetooth-escpos-printer');
    }

    if (content.includes('compile(')) {
      content = content.replace(/compile\(/g, 'implementation(');
      console.log('Patched compile in react-native-bluetooth-escpos-printer');
    }

    gradleConfig.modResults = content;
    return gradleConfig;
  });

  return config;
}

module.exports = withBluetoothPrinter;