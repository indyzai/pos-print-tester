import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Code, ChartBar as BarChart, Image, Tag, Send } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

type TestType = 'quick' | 'raw' | 'barcode' | 'image' | 'label';

export default function TestTab() {
  const [activeTest, setActiveTest] = useState<TestType>('quick');
  const [rawCommand, setRawCommand] = useState('');
  const [barcodeText, setBarcodeText] = useState('1234567890128');
  const [barcodeType, setBarcodeType] = useState('Code128');
  const [qrText, setQRText] = useState('https://example.com');

  const handleSendTest = () => {
    Alert.alert('Test Sent', `${activeTest} test has been sent to the printer.`);
  };

  const testTypes = [
    { id: 'quick', label: 'Quick Test', icon: FileText },
    { id: 'raw', label: 'Raw Commands', icon: Code },
    { id: 'barcode', label: 'Barcodes', icon: BarChart },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'label', label: 'Label Layouts', icon: Tag },
  ];

  const renderTestContent = () => {
    switch (activeTest) {
      case 'quick':
        return (
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Quick Test Page</Text>
            <Text style={styles.sectionDescription}>
              Prints a comprehensive test page with text, barcode, and QR code to verify printer functionality.
            </Text>
            <View style={styles.previewBox}>
              <Text style={styles.previewTitle}>TEST PAGE PREVIEW</Text>
              <Text style={styles.previewLine}>Date: {new Date().toLocaleDateString()}</Text>
              <Text style={styles.previewLine}>Time: {new Date().toLocaleTimeString()}</Text>
              <Text style={styles.previewLine}>Printer Test - All Functions</Text>
              <View style={styles.qrContainer}>
                <QRCode value={qrText} size={80} />
              </View>
              <Text style={styles.previewLine}>QR Code: {qrText}</Text>
              <Text style={styles.previewLine}>Barcode: 1234567890128</Text>
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendTest}>
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send Quick Test</Text>
            </TouchableOpacity>
          </View>
        );

      case 'raw':
        return (
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Raw Commands</Text>
            <Text style={styles.sectionDescription}>
              Send direct ESC/POS, ZPL, EPL/BPLE, or CPCL commands to the printer.
            </Text>
            <View style={styles.commandTabs}>
              {['ESC/POS', 'ZPL', 'EPL', 'CPCL'].map((cmd) => (
                <TouchableOpacity key={cmd} style={styles.commandTab}>
                  <Text style={styles.commandTabText}>{cmd}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.commandInput}
              multiline
              numberOfLines={8}
              value={rawCommand}
              onChangeText={setRawCommand}
              placeholder="Enter raw printer commands here...&#10;&#10;Example ESC/POS:&#10;ESC @ (Initialize)&#10;ESC a 1 (Center align)&#10;Hello World&#10;ESC d 3 (Feed 3 lines)"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendTest}>
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send Raw Command</Text>
            </TouchableOpacity>
          </View>
        );

      case 'barcode':
        return (
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Barcode Generator</Text>
            <Text style={styles.sectionDescription}>
              Generate and print various barcode formats for testing.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Barcode Type</Text>
              <View style={styles.barcodeTypes}>
                {['Code39', 'Code128', 'EAN13', 'UPC-A'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.barcodeType,
                      barcodeType === type && styles.barcodeTypeActive,
                    ]}
                    onPress={() => setBarcodeType(type)}
                  >
                    <Text style={[
                      styles.barcodeTypeText,
                      barcodeType === type && styles.barcodeTypeTextActive,
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Barcode Data</Text>
              <TextInput
                style={styles.input}
                value={barcodeText}
                onChangeText={setBarcodeText}
                placeholder="Enter barcode data"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>QR Code Data</Text>
              <TextInput
                style={styles.input}
                value={qrText}
                onChangeText={setQRText}
                placeholder="Enter QR code data"
              />
              <View style={styles.qrPreview}>
                <QRCode value={qrText} size={100} />
              </View>
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendTest}>
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Print Barcodes</Text>
            </TouchableOpacity>
          </View>
        );

      case 'image':
        return (
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Image Printing</Text>
            <Text style={styles.sectionDescription}>
              Test bitmap printing with logos and sample images.
            </Text>
            <View style={styles.imageOptions}>
              <TouchableOpacity style={styles.imageOption}>
                <Image size={40} color="#2196F3" />
                <Text style={styles.imageOptionText}>Sample Logo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageOption}>
                <Image size={40} color="#2196F3" />
                <Text style={styles.imageOptionText}>Test Pattern</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageOption}>
                <Image size={40} color="#2196F3" />
                <Text style={styles.imageOptionText}>Custom Image</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendTest}>
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Print Image</Text>
            </TouchableOpacity>
          </View>
        );

      case 'label':
        return (
          <View style={styles.testSection}>
            <Text style={styles.sectionTitle}>Label Layout Tester</Text>
            <Text style={styles.sectionDescription}>
              Test different label sizes and positioning layouts.
            </Text>
            <View style={styles.labelSizes}>
              {['2" x 1"', '4" x 2"', '4" x 6"', '6" x 4"'].map((size) => (
                <TouchableOpacity key={size} style={styles.labelSize}>
                  <Text style={styles.labelSizeText}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendTest}>
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Print Label Test</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Print Functions</Text>
        <Text style={styles.subtitle}>Verify printer quality and compatibility</Text>
      </View>

        <View style={styles.testTabs}>
          {testTypes.map((test) => {
            const IconComponent = test.icon;
            return (
              <TouchableOpacity
                key={test.id}
                style={[
                  styles.testTab,
                  activeTest === test.id && styles.activeTestTab,
                ]}
                onPress={() => setActiveTest(test.id as TestType)}
              >
                <IconComponent
                  size={20}
                  color={activeTest === test.id ? '#2196F3' : '#757575'}
                />
                <Text
                  style={[
                    styles.testTabText,
                    activeTest === test.id && styles.activeTestTabText,
                  ]}
                >
                  {test.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

      <ScrollView style={styles.content}>
        {renderTestContent()}
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
  tabScroll: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flex: 1,
    padding: 20,
    height: 60,
  },
  testTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
  },
  testTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 8,
    marginRight: 8,
  },
  activeTestTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
  },
  testTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  activeTestTabText: {
    color: '#2196F3',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  testSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  previewBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  previewLine: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  qrPreview: {
    alignItems: 'center',
    marginTop: 12,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  commandTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  commandTab: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  commandTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  commandInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  barcodeTypes: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  barcodeType: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  barcodeTypeActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  barcodeTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  barcodeTypeTextActive: {
    color: '#2196F3',
  },
  imageOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  imageOption: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  imageOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginTop: 8,
    textAlign: 'center',
  },
  labelSizes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  labelSize: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  labelSizeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
});