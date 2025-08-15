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
} from 'react-native';

// NOTE: You must install these libraries and link them to your project
// before running this code.
// npm install react-native-tcp-socket react-native-ping
// npx pod-install (for iOS)
import TcpSocket from 'react-native-tcp-socket';
import ping from 'react-native-ping';

// Define a type for the port status to ensure type safety.
// The port can be a number or a string if the input is invalid.
type PortStatus = {
  port?: number | string;
  result: string;
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

        <TouchableOpacity 
          style={[styles.button, isPortTesting && styles.buttonDisabled]} 
          onPress={testPorts}
          disabled={isPortTesting}>
          <Text style={styles.buttonText}>
            {isPortTesting ? 'Testing...' : 'Test Port(s) Connection'}
          </Text>
        </TouchableOpacity>
        {isPortTesting && <ActivityIndicator style={styles.activityIndicator} size="small" color="#007AFF" />}

        <View style={styles.statusBox}>
          {portStatus.map((item: PortStatus, index: number) => (
            <Text key={index} style={styles.statusText}>
              <Text style={{ fontWeight: 'bold' }}>Port {item.port || 'N/A'}:</Text> {item.result}
            </Text>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.pingButton, isPinging && styles.buttonDisabled]} 
          onPress={testPing}
          disabled={isPinging}>
          <Text style={styles.buttonText}>
            {isPinging ? 'Pinging...' : 'Ping IP Address'}
          </Text>
        </TouchableOpacity>
        {isPinging && <ActivityIndicator style={styles.activityIndicator} size="small" color="#007AFF" />}

        <Text style={styles.statusText}>{pingStatus}</Text>
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
    marginTop: 20,
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
  statusText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  activityIndicator: {
    marginTop: 10,
  }
});

export default App;
