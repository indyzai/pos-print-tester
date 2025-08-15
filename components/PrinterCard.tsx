import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bluetooth, Wifi, Usb, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface PrinterCardProps {
  name: string;
  type: 'bluetooth' | 'wifi' | 'usb';
  status: 'connected' | 'available' | 'error';
  address?: string;
  onConnect: () => void;
}

export default function PrinterCard({ name, type, status, address, onConnect }: PrinterCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'bluetooth':
        return <Bluetooth size={20} color="#2196F3" />;
      case 'wifi':
        return <Wifi size={20} color="#2196F3" />;
      case 'usb':
        return <Usb size={20} color="#2196F3" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'error':
        return <XCircle size={16} color="#F44336" />;
      default:
        return null;
    }
  };

  const getButtonStyle = () => {
    if (status === 'connected') {
      return [styles.button, styles.buttonDisconnect];
    }
    return styles.button;
  };

  const getButtonTextStyle = () => {
    if (status === 'connected') {
      return [styles.buttonText, styles.buttonTextDisconnect];
    }
    return styles.buttonText;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {getTypeIcon()}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {address && <Text style={styles.address}>{address}</Text>}
        </View>
        {getStatusIcon()}
      </View>
      
      <TouchableOpacity style={getButtonStyle()} onPress={onConnect}>
        <Text style={getButtonTextStyle()}>
          {status === 'connected' ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  address: {
    fontSize: 12,
    color: '#757575',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonDisconnect: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisconnect: {
    color: '#fff',
  },
});