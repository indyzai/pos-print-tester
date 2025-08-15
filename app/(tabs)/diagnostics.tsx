import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, CircleCheck as CheckCircle, Circle as XCircle, TriangleAlert as AlertTriangle, Trash2, RefreshCw, Clock, Zap, MemoryStick } from 'lucide-react-native';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'sent' | 'received' | 'error' | 'info';
  message: string;
}

interface PrinterStatus {
  online: boolean;
  paperStatus: 'ok' | 'low' | 'out';
  error: string | null;
  temperature: 'normal' | 'high';
  batteryLevel?: number;
}

export default function DiagnosticsTab() {
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>({
    online: true,
    paperStatus: 'ok',
    error: null,
    temperature: 'normal',
    batteryLevel: 85,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 5000),
      type: 'sent',
      message: 'ESC @ - Initialize printer',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4000),
      type: 'received',
      message: 'ACK - Command acknowledged',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 3000),
      type: 'sent',
      message: 'Print test page command',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 2000),
      type: 'info',
      message: 'Print job completed successfully',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 1000),
      type: 'error',
      message: 'Paper sensor warning - Low paper detected',
    },
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState({
    printSpeed: '150 mm/s',
    bufferUsage: '45%',
    commandsProcessed: 1247,
    errorRate: '0.2%',
  });

  useEffect(() => {
    // Simulate real-time log updates
    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type: 'info',
        message: `Status check - Printer operational`,
      };
      setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const refreshStatus = () => {
    // Simulate status refresh
    setPrinterStatus(prev => ({
      ...prev,
      batteryLevel: Math.max(0, (prev.batteryLevel || 85) - Math.random() * 5),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
      case 'normal':
      case 'online':
        return '#4CAF50';
      case 'low':
      case 'high':
        return '#FF9800';
      case 'out':
      case 'offline':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status: boolean, errorStatus?: string) => {
    if (errorStatus) {
      return <XCircle size={20} color="#F44336" />;
    }
    return status ? 
      <CheckCircle size={20} color="#4CAF50" /> : 
      <XCircle size={20} color="#F44336" />;
  };

  const getLogTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'sent': return '#2196F3';
      case 'received': return '#4CAF50';
      case 'error': return '#F44336';
      case 'info': return '#757575';
      default: return '#757575';
    }
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => (
    <View style={styles.logItem}>
      <View style={[styles.logTypeIndicator, { backgroundColor: getLogTypeColor(item.type) }]} />
      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <Text style={styles.logType}>{item.type.toUpperCase()}</Text>
          <Text style={styles.logTime}>
            {item.timestamp.toLocaleTimeString()}
          </Text>
        </View>
        <Text style={styles.logMessage}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diagnostics</Text>
        <Text style={styles.subtitle}>Monitor printer status and performance</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Printer Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Printer Status</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshStatus}>
              <RefreshCw size={16} color="#2196F3" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Activity size={20} color={getStatusColor(printerStatus.online ? 'online' : 'offline')} />
                <Text style={styles.statusLabel}>Connection</Text>
              </View>
              <Text style={[styles.statusValue, { color: getStatusColor(printerStatus.online ? 'online' : 'offline') }]}>
                {printerStatus.online ? 'Online' : 'Offline'}
              </Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <MemoryStick size={20} color={getStatusColor(printerStatus.paperStatus)} />
                <Text style={styles.statusLabel}>Paper</Text>
              </View>
              <Text style={[styles.statusValue, { color: getStatusColor(printerStatus.paperStatus) }]}>
                {printerStatus.paperStatus === 'ok' ? 'OK' : 
                 printerStatus.paperStatus === 'low' ? 'Low' : 'Out'}
              </Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Zap size={20} color={getStatusColor(printerStatus.temperature)} />
                <Text style={styles.statusLabel}>Temperature</Text>
              </View>
              <Text style={[styles.statusValue, { color: getStatusColor(printerStatus.temperature) }]}>
                {printerStatus.temperature === 'normal' ? 'Normal' : 'High'}
              </Text>
            </View>

            {printerStatus.batteryLevel && (
              <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <Activity size={20} color={getStatusColor(printerStatus.batteryLevel > 30 ? 'ok' : 'low')} />
                  <Text style={styles.statusLabel}>Battery</Text>
                </View>
                <Text style={[styles.statusValue, { color: getStatusColor(printerStatus.batteryLevel > 30 ? 'ok' : 'low') }]}>
                  {Math.round(printerStatus.batteryLevel)}%
                </Text>
              </View>
            )}
          </View>

          {printerStatus.error && (
            <View style={styles.errorBox}>
              <AlertTriangle size={20} color="#F44336" />
              <Text style={styles.errorText}>{printerStatus.error}</Text>
            </View>
          )}
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Print Speed</Text>
              <Text style={styles.metricValue}>{performanceMetrics.printSpeed}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Buffer Usage</Text>
              <Text style={styles.metricValue}>{performanceMetrics.bufferUsage}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Commands</Text>
              <Text style={styles.metricValue}>{performanceMetrics.commandsProcessed.toLocaleString()}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Error Rate</Text>
              <Text style={styles.metricValue}>{performanceMetrics.errorRate}</Text>
            </View>
          </View>
        </View>

        {/* Communication Log */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Communication Log</Text>
            <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
              <Trash2 size={16} color="#F44336" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logContainer}>
            <FlatList
              data={logs}
              renderItem={renderLogItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.logList}
              scrollEnabled={false}
            />
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  refreshButton: {
    padding: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#F44336',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F44336',
  },
  logContainer: {
    maxHeight: 300,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  logList: {
    padding: 12,
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logTypeIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  logContent: {
    flex: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#757575',
  },
  logTime: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  logMessage: {
    fontSize: 14,
    color: '#212121',
    fontFamily: 'monospace',
  },
});