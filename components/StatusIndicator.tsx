import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'error' | 'warning';
  label: string;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusIndicator({ status, label, size = 'medium' }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          color: '#4CAF50',
          backgroundColor: '#E8F5E8',
        };
      case 'error':
        return {
          icon: XCircle,
          color: '#F44336',
          backgroundColor: '#FFEBEE',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          color: '#FF9800',
          backgroundColor: '#FFF3E0',
        };
      default:
        return {
          icon: XCircle,
          color: '#757575',
          backgroundColor: '#F5F5F5',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;
  
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <IconComponent size={iconSize} color={config.color} />
      <Text style={[styles.label, { color: config.color, fontSize }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  label: {
    fontWeight: '600',
  },
});