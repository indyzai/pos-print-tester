# pos-print-tester
POS printing tester


Android Setup for USB Serial Port LibraryTo use USB functionality in your React Native app, you need to configure the native Android project to grant the app permission to access USB devices.Step 1: Add USB Permissions to AndroidManifest.xmlOpen your android/app/src/main/AndroidManifest.xml file. Add the following line just before the closing </application> tag. This grants your app permission to access the USB device.<uses-permission android:name="android.permission.USB_DEVICE" />
Your AndroidManifest.xml should look something like this:<manifest ...>
  <uses-permission android:name="android.permission.USB_DEVICE" />

  <application ...>
    ...
  </application>
</manifest>
Step 2: Add USB Device Filter ResourceYou need to tell the Android OS which USB devices your app wants to listen for. This is done by creating an XML resource file.Create a new directory called xml inside android/app/src/main/res/.Inside this new xml directory, create a file named device_filter.xml.Add the following code to device_filter.xml.<?xml version="1.0" encoding="utf-8"?>
<resources>
  <usb-device vendor-id="YOUR_VENDOR_ID" product-id="YOUR_PRODUCT_ID" />
  <!-- You can add more usb-device tags for other printers -->
</resources>
YOUR_VENDOR_ID: This is the ID assigned by the USB organization to the manufacturer of your printer.YOUR_PRODUCT_ID: This is the ID of the specific printer model.You can find these IDs by connecting the printer to a computer and checking its properties in the device manager.After creating this file, you need to reference it in your AndroidManifest.xml. Open the file again and add an <intent-filter> to your main <activity> tag (usually the one with android.intent.action.MAIN and android.intent.category.LAUNCHER).Your <activity> tag will now look like this:<activity
  android:name=".MainActivity"
  ...
>
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
  <intent-filter>
    <action android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED" />
  </intent-filter>
  <meta-data android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"
    android:resource="@xml/device_filter" />
</activity>
Step 3: Request Runtime PermissionsOn modern Android devices, your app must request permission from the user at runtime. You can add a prompt to your React Native code to check for this permission before trying to find or connect to a USB device.You can do this by using the PermissionsAndroid API. Here is an example of how you can check and request the permission within your findUsbPrinters function.import { PermissionsAndroid } from 'react-native';

// In your App component...
const findUsbPrinters = async (): Promise<void> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.USB_DEVICE,
      {
        title: 'USB Permission',
        message: 'App needs access to USB devices to connect to printers.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Permission granted, now proceed with listing devices
      setUsbStatus('Scanning for USB devices...');
      const devices = await list();
      // ... rest of your code
    } else {
      setUsbStatus('USB permission denied. Cannot scan for printers.');
    }
  } catch (err) {
    setUsbStatus(`Failed to request permission: ${err}`);
  }
};
