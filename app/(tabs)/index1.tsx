import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bluetooth, Wifi, Usb, Search, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface Device {
  id: string;
  name: string;
  type: 'bluetooth' | 'wifi' | 'usb';
  status: 'connected' | 'available' | 'error';
  address?: string;
}

export default function ConnectTab() {
  const [activeTab, setActiveTab] = useState<'bluetooth' | 'wifi' | 'usb'>('bluetooth');
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'TVS RP-45', type: 'bluetooth', status: 'available', address: '00:11:22:33:44:55' },
    { id: '2', name: 'Zebra ZD420', type: 'bluetooth', status: 'connected', address: '00:11:22:33:44:56' },
    { id: '3', name: 'Epson TM-T20III', type: 'usb', status: 'available' },
  ]);
  const [scanning, setScanning] = useState(false);
  const [wifiIP, setWifiIP] = useState('192.168.1.100');
  const [wifiPort, setWifiPort] = useState('9100');

  const handleScan = () => {
    setScanning(true);
    // Mock scanning process
    setTimeout(() => {
      setScanning(false);
      Alert.alert('Scan Complete', 'Found 3 available devices');
    }, 2000);
  };

  const handleConnect = (device: Device) => {
    const updatedDevices = devices.map(d =>
      d.id === device.id
        ? { ...d, status: d.status === 'connected' ? 'available' : 'connected' as const }
        : d.status === 'connected' ? { ...d, status: 'available' as const } : d
    );
    setDevices(updatedDevices);
  };

  const handleWifiConnect = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: `Network Printer (${wifiIP})`,
      type: 'wifi',
      status: 'connected',
      address: `${wifiIP}:${wifiPort}`,
    };
    setDevices([...devices.filter(d => d.type !== 'wifi'), newDevice]);
    Alert.alert('Connected', `Successfully connected to ${wifiIP}:${wifiPort}`);
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={20} color="#4CAF50" />;
      case 'error':
        return <XCircle size={20} color="#F44336" />;
      default:
        return null;
    }
  };

  const filteredDevices = devices.filter(device => device.type === activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Printer Connection</Text>
        <Text style={styles.subtitle}>Connect to your thermal or label printer</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bluetooth' && styles.activeTab]}
          onPress={() => setActiveTab('bluetooth')}
        >
          <Bluetooth size={20} color={activeTab === 'bluetooth' ? '#2196F3' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'bluetooth' && styles.activeTabText]}>
            Bluetooth
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'wifi' && styles.activeTab]}
          onPress={() => setActiveTab('wifi')}
        >
          <Wifi size={20} color={activeTab === 'wifi' ? '#2196F3' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'wifi' && styles.activeTabText]}>
            Wi-Fi / LAN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'usb' && styles.activeTab]}
          onPress={() => setActiveTab('usb')}
        >
          <Usb size={20} color={activeTab === 'usb' ? '#2196F3' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'usb' && styles.activeTabText]}>
            USB OTG
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'wifi' ? (
          <View style={styles.wifiSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>IP Address</Text>
              <TextInput
                style={styles.input}
                value={wifiIP}
                onChangeText={setWifiIP}
                placeholder="192.168.1.100"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Port</Text>
              <TextInput
                style={styles.input}
                value={wifiPort}
                onChangeText={setWifiPort}
                placeholder="9100"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={handleWifiConnect}>
              <Text style={styles.connectButtonText}>Connect to Network Printer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.scanSection}>
              <TouchableOpacity
                style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
                onPress={handleScan}
                disabled={scanning}
              >
                {scanning ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Search size={20} color="#fff" />
                )}
                <Text style={styles.scanButtonText}>
                  {scanning ? 'Scanning...' : `Scan for ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Devices`}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.deviceList}>
              <Text style={styles.sectionTitle}>Available Devices</Text>
              {filteredDevices.map((device) => (
                <View key={device.id} style={styles.deviceCard}>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    {device.address && (
                      <Text style={styles.deviceAddress}>{device.address}</Text>
                    )}
                  </View>
                  <View style={styles.deviceActions}>
                    {getStatusIcon(device.status)}
                    <TouchableOpacity
                      style={[
                        styles.deviceButton,
                        device.status === 'connected' && styles.deviceButtonDisconnect,
                      ]}
                      onPress={() => handleConnect(device)}
                    >
                      <Text
                        style={[
                          styles.deviceButtonText,
                          device.status === 'connected' && styles.deviceButtonTextDisconnect,
                        ]}
                      >
                        {device.status === 'connected' ? 'Disconnect' : 'Connect'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  activeTabText: {
    color: '#2196F3',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  wifiSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  connectButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanSection: {
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  scanButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 14,
    color: '#757575',
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  deviceButtonDisconnect: {
    backgroundColor: '#F44336',
  },
  deviceButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deviceButtonTextDisconnect: {
    color: '#fff',
  },
});