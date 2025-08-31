import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.indyzai.pos.printsetup',
    appName: 'Printer Testing App',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    android: {
        buildOptions: {
            keystorePath: '/Users/selva/data/work/indyzai/sign-key/upload-keystore.jks', //'android/my-upload-key.jks',
            keystorePassword: process.env.KEYSTORE_PASSWORD || 'Moshika@2015',
            keystoreAlias: process.env.KEY_ALIAS || 'indyzai',
            keystoreAliasPassword: process.env.KEY_PASSWORD || 'Moshika@2015',
        }
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#2196F3',
            showSpinner: false,
            androidSpinnerStyle: 'large',
            iosSpinnerStyle: 'small',
            spinnerColor: '#ffffff'
        }
    }
};

export default config;