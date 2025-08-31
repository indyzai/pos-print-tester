import { Platform, PermissionsAndroid } from 'react-native';
import UsbPrinter from 'react-native-usb-printer';
// import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';

export interface Device {
  id: string;
  name: string;
  type: 'bluetooth' | 'wifi' | 'usb';
  status: 'connected' | 'available' | 'error';
  address?: string;
}

export const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
  }
  return true;
};

export const scanDevices = async (type: 'bluetooth' | 'usb' | 'wifi'): Promise<Device[]> => {
  if (type === 'bluetooth') {
    // Uncomment and implement when BluetoothManager is available
    // await BluetoothManager.enableBluetooth();
    // const paired = await BluetoothManager.getBondedDevices();
    // return paired.map((dev: any) => ({
    //   id: dev.address,
    //   name: dev.name || dev.address,
    //   type: 'bluetooth',
    //   status: 'available',
    //   address: dev.address,
    // }));
    return [];
  } else if (type === 'usb') {
    try {
      const usbDevices = await UsbPrinter.getDeviceList();
      return usbDevices.map((dev: any) => ({
        id: String(dev.device_id || dev.deviceId || dev.id),
        name: dev.device_name || dev.deviceName || 'USB Printer',
        type: 'usb',
        status: 'available',
      }));
    } catch {
      return [];
    }
  }
  return [];
};
