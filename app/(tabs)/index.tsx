import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';

// NOTE: You must install these libraries before running this code.
// For autolinking to work correctly, run the following:
// npm install react-native-tcp-socket react-native-ping react-native-usb-serialport-for-android
// For iOS, you may also need to run:
// cd ios && npx pod-install
import TcpSocket from 'react-native-tcp-socket';
import ping from 'react-native-ping';
// The USB library requires specific permissions and setup.
// This is the starting point for USB printer testing.
import {
    Parity,
  UsbSerialManager,
} from 'react-native-usb-serialport-for-android';

// Define a type for the port status to ensure type safety.
type PortStatus = {
  port?: number | string;
  result: string;
};

// Define a type for USB device information.
type UsbDevice = {
  deviceId: number;
  deviceName: string;
};

// The main App component that contains all the UI and logic.
const App = () => {
  // State variables with explicit type annotations.
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.100');
  const [ports, setPorts] = useState<string>('9100, 80, 443');
  const [portStatus, setPortStatus] = useState<PortStatus[]>([]);
  const [pingStatus, setPingStatus] = useState<string>('');
  const [isPortTesting, setIsPortTesting] = useState<boolean>(false);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [isIpPrinting, setIsIpPrinting] = useState<boolean>(false);
  const [ipPrintStatus, setIpPrintStatus] = useState<string>('');
  
  // Refactored state for USB functionality
  const [usbState, setUsbState] = useState<{
    devices: UsbDevice[];
    status: string;
    selectedDevice: UsbDevice | null;
    isTesting: boolean;
  }>({
    devices: [],
    status: '',
    selectedDevice: null,
    isTesting: false,
  });

  // Function to handle the port connectivity test.
  const testPorts = async (): Promise<void> => {
    setPortStatus([]);
    setIsPortTesting(true);

    if (!ipAddress || !ports) {
      setPortStatus([{ result: 'Please enter both IP address and port(s).' }]);
      setIsPortTesting(false);
      return;
    }

    const portList = ports.split(',').map((p: string) => p.trim()).filter((p: string) => p);
    
    for (const portStr of portList) {
      const port = parseInt(portStr, 10);
      if (isNaN(port)) {
        setPortStatus(prev => [...prev, { port: portStr, result: 'Invalid port number.' }]);
        continue;
      }

      setPortStatus(prev => [...prev, { port, result: 'Testing...' }]);

      try {
        const result: string = await new Promise((resolve) => {
          const client = TcpSocket.createConnection({
            host: ipAddress,
            port: port,
            timeout: 5000, // Timeout in milliseconds
          }, () => {
            client.destroy();
            resolve('Connection successful!');
          });

          client.on('error', (error: { message: string }) => {
            resolve(`Connection failed: ${error.message}`);
          });

          client.on('timeout', () => {
            client.destroy();
            resolve('Connection timed out.');
          });
        });
        
        // Update the status for the specific port
        setPortStatus(prev => prev.map(item => 
          item.port === port ? { ...item, result: result } : item
        ));
      } catch (e: any) {
        setPortStatus(prev => prev.map(item => 
          item.port === port ? { ...item, result: `Connection failed: ${e.message}` } : item
        ));
      }
    }
    
    setIsPortTesting(false);
  };

  // Function to handle the ping test.
  const testPing = async (): Promise<void> => {
    setPingStatus('');
    setIsPinging(true);

    if (!ipAddress) {
      setPingStatus('Please enter an IP address.');
      setIsPinging(false);
      return;
    }

    setPingStatus(`Pinging ${ipAddress}...`);
    
    try {
      // The ping library returns true for success.
      const successful: boolean = await ping.ping(ipAddress, { timeout: 1000 });
      if (successful) {
        setPingStatus(`Ping successful: ${ipAddress} is reachable.`);
      } else {
        setPingStatus(`Ping failed: ${ipAddress} is unreachable.`);
      }
    } catch (e: any) {
      setPingStatus(`Ping failed: ${e.message}`);
    }

    setIsPinging(false);
  };
  
  // Function to send a print job over IP.
  const sendIpPrintJob = async (): Promise<void> => {
    setIpPrintStatus('');
    setIsIpPrinting(true);

    const port = parseInt(ports.split(',')[0].trim(), 10);
    if (!ipAddress || isNaN(port)) {
      setIpPrintStatus('Please enter a valid IP address and port.');
      setIsIpPrinting(false);
      return;
    }

    try {
      const client = TcpSocket.createConnection({
        host: ipAddress,
        port: port,
        // timeout: 10000, // Increased timeout for printing
      }, () => {
        setIpPrintStatus('Connected. Sending print job...');
        // A simple text print job.
        const printData = 'Hello, this is a test print job!\n\n\n\n\n\n\n';
        client.write(printData);
        client.destroy();
        setIpPrintStatus('Print job sent successfully!');
      });

      client.on('error', (error: { message: string }) => {
        setIpPrintStatus(`Print job failed: ${error.message}`);
        client.destroy();
      });

      client.on('timeout', () => {
        setIpPrintStatus('Connection timed out.');
        client.destroy();
      });

    } catch (e: any) {
      setIpPrintStatus(`Print job failed: ${e.message}`);
    }

    setIsIpPrinting(false);
  };

  // Function to list connected USB devices.
  const findUsbPrinters = async (): Promise<void> => {
    setUsbState(prev => ({ ...prev, isTesting: true, status: 'Scanning for USB devices...' }));
    
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
        // Use the correct method from UsbSerialManager
        const devicesRaw = await UsbSerialManager.list();
        // Map the returned devices to the UsbDevice type
        const devices: UsbDevice[] = devicesRaw.map((d: any) => ({
          deviceId: d.deviceId,
          deviceName: d.deviceName,
        }));
        if (devices.length > 0) {
          setUsbState(prev => ({
            ...prev,
            devices,
            status: `Found ${devices.length} USB device(s).`,
            isTesting: false,
          }));
        } else {
          setUsbState(prev => ({
            ...prev,
            devices: [],
            status: 'No USB devices found.',
            isTesting: false,
          }));
        }
      } else {
        setUsbState(prev => ({
          ...prev,
          status: 'USB permission denied. Cannot scan for printers.',
          isTesting: false,
        }));
      }
    } catch (e: any) {
      setUsbState(prev => ({
        ...prev,
        status: `Error listing USB devices: ${e.message}`,
        isTesting: false,
      }));
    }
  };

  // Function to send a test print job to the selected USB printer.
  const testUsbPrint = async (): Promise<void> => {
    if (!usbState.selectedDevice) {
      setUsbState(prev => ({ ...prev, status: 'Please select a USB device first.' }));
      return;
    }

    setUsbState(prev => ({ ...prev, isTesting: true, status: 'Sending USB print job...' }));

    try {
      // Connect to the selected device using the correct method from UsbSerialManager
      const usbSerialport = await UsbSerialManager.open(usbState.selectedDevice.deviceId, {
        baudRate: 9600, // Common baud rate for printers
        dataBits: 8,
        stopBits: 1,
        parity: Parity.None,
      });

      setUsbState(prev => ({ ...prev, status: 'Sending data...' }));
      // Simple test print command
      const printData = "Hello, this is a test print over USB!\n\n\n\n\n\n\n";
      // Use the 'send' method on the opened port instance
      await usbSerialport.send(printData);
      
      setUsbState(prev => ({ ...prev, status: 'Disconnecting...' }));
      // Disconnect by closing the port instance
      await usbSerialport.close();
      
      setUsbState(prev => ({
        ...prev,
        status: 'USB print job sent successfully!',
        isTesting: false,
        selectedDevice: null,
      }));
    } catch (e: any) {
      setUsbState(prev => ({
        ...prev,
        status: `USB print job failed: ${e.message}`,
        isTesting: false,
      }));
    }
  };

  // Helper function to set the selected USB device
  const handleSelectUsbDevice = (device: UsbDevice) => {
    setUsbState(prev => ({ ...prev, selectedDevice: device }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Printer Connectivity Test</Text>

        <TextInput
          style={styles.input}
          onChangeText={setIpAddress}
          value={ipAddress}
          placeholder="Printer IP Address"
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          onChangeText={setPorts}
          value={ports}
          placeholder="Port(s) (e.g., 9100, 80)"
          keyboardType="default"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isPortTesting && styles.buttonDisabled]} 
            onPress={testPorts}
            disabled={isPortTesting}>
            <Text style={styles.buttonText}>
              {isPortTesting ? 'Testing...' : 'Test Port(s) Connection'}
            </Text>
          </TouchableOpacity>
          {isPortTesting && <ActivityIndicator style={styles.activityIndicator} size="small" color="#007AFF" />}

          <TouchableOpacity 
            style={[styles.button, styles.pingButton, isPinging && styles.buttonDisabled]} 
            onPress={testPing}
            disabled={isPinging}>
            <Text style={styles.buttonText}>
              {isPinging ? 'Pinging...' : 'Ping IP Address'}
            </Text>
          </TouchableOpacity>
          {isPinging && <ActivityIndicator style={styles.activityIndicator} size="small" color="#007AFF" />}
        </View>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Port Test Status</Text>
          {portStatus.map((item: PortStatus, index: number) => (
            <Text key={index} style={styles.statusText}>
              <Text style={{ fontWeight: 'bold' }}>Port {item.port || 'N/A'}:</Text> {item.result}
            </Text>
          ))}
          <Text style={styles.statusText}>{pingStatus}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.printButton, isIpPrinting && styles.buttonDisabled]} 
            onPress={sendIpPrintJob}
            disabled={isIpPrinting}>
            <Text style={styles.buttonText}>
              {isIpPrinting ? 'Sending...' : 'Send IP Print Job'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.statusText}>{ipPrintStatus}</Text>

        <Text style={styles.sectionTitle}>USB Printer Testing</Text>
        <TouchableOpacity 
          style={[styles.button, usbState.isTesting && styles.buttonDisabled]} 
          onPress={findUsbPrinters}
          disabled={usbState.isTesting}>
          <Text style={styles.buttonText}>
            {usbState.isTesting ? 'Scanning...' : 'Find USB Printers'}
          </Text>
        </TouchableOpacity>
        
        {usbState.devices.length > 0 && (
          <View style={styles.usbDeviceList}>
            <Text style={styles.usbDeviceTitle}>Select a Device:</Text>
            {usbState.devices.map((device) => (
              <TouchableOpacity
                key={device.deviceId}
                style={[styles.usbDeviceButton, usbState.selectedDevice?.deviceId === device.deviceId && styles.selectedUsbDevice]}
                onPress={() => handleSelectUsbDevice(device)}>
                <Text style={styles.usbDeviceText}>{device.deviceName}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[
                styles.button,
                styles.printButton,
                (!usbState.selectedDevice || usbState.isTesting) && styles.buttonDisabled
              ]}
              onPress={testUsbPrint}
              disabled={!usbState.selectedDevice || usbState.isTesting}>
              <Text style={styles.buttonText}>
                {usbState.isTesting ? 'Sending...' : 'Send USB Print Job'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.statusText}>{usbState.status}</Text>
        {usbState.isTesting && <ActivityIndicator style={styles.activityIndicator} size="small" color="#007AFF" />}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  pingButton: {
    backgroundColor: '#4CDA64',
  },
  printButton: {
    backgroundColor: '#FF9500',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  activityIndicator: {
    marginTop: 10,
  },
  usbDeviceList: {
    width: '100%',
    backgroundColor: '#e9e9e9',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },
  usbDeviceTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usbDeviceButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedUsbDevice: {
    backgroundColor: '#c0e0ff',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  usbDeviceText: {
    fontSize: 16,
  },
});

export default App;
