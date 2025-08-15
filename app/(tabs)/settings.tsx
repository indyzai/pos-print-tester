import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Printer, 
  Save, 
  Trash2, 
  Settings as SettingsIcon, 
  FileText,
  Zap,
  Shield
} from 'lucide-react-native';

interface PrinterProfile {
  id: string;
  name: string;
  connectionType: 'bluetooth' | 'wifi' | 'usb';
  commandLanguage: 'ESC/POS' | 'ZPL' | 'EPL' | 'CPCL';
  paperWidth: string;
  address?: string;
}

export default function SettingsTab() {
  const [profiles, setProfiles] = useState<PrinterProfile[]>([
    {
      id: '1',
      name: 'TVS RP-45 Receipt',
      connectionType: 'bluetooth',
      commandLanguage: 'ESC/POS',
      paperWidth: '58mm',
      address: '00:11:22:33:44:55',
    },
    {
      id: '2',
      name: 'Zebra Label Printer',
      connectionType: 'wifi',
      commandLanguage: 'ZPL',
      paperWidth: '4"',
      address: '192.168.1.100:9100',
    },
  ]);

  const [newProfile, setNewProfile] = useState<Partial<PrinterProfile>>({
    name: '',
    connectionType: 'bluetooth',
    commandLanguage: 'ESC/POS',
    paperWidth: '80mm',
  });

  const [settings, setSettings] = useState({
    autoConnect: true,
    enableLogging: true,
    soundEnabled: false,
    vibrateOnError: true,
    defaultTemplate: 'quick',
    logRetentionDays: 7,
  });

  const [showNewProfileForm, setShowNewProfileForm] = useState(false);

  const handleSaveProfile = () => {
    if (!newProfile.name?.trim()) {
      Alert.alert('Error', 'Please enter a profile name');
      return;
    }

    const profile: PrinterProfile = {
      id: Date.now().toString(),
      name: newProfile.name!,
      connectionType: newProfile.connectionType!,
      commandLanguage: newProfile.commandLanguage!,
      paperWidth: newProfile.paperWidth!,
      address: newProfile.address,
    };

    setProfiles([...profiles, profile]);
    setNewProfile({
      name: '',
      connectionType: 'bluetooth',
      commandLanguage: 'ESC/POS',
      paperWidth: '80mm',
    });
    setShowNewProfileForm(false);
    Alert.alert('Success', 'Printer profile saved successfully');
  };

  const handleDeleteProfile = (id: string) => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this printer profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setProfiles(profiles.filter(p => p.id !== id)),
        },
      ]
    );
  };

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure app preferences and printer profiles</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Printer Profiles Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Printer Profiles</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowNewProfileForm(!showNewProfileForm)}
            >
              <Text style={styles.addButtonText}>
                {showNewProfileForm ? 'Cancel' : 'Add New'}
              </Text>
            </TouchableOpacity>
          </View>

          {showNewProfileForm && (
            <View style={styles.profileForm}>
              <Text style={styles.formTitle}>New Printer Profile</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profile Name</Text>
                <TextInput
                  style={styles.input}
                  value={newProfile.name}
                  onChangeText={(text) => setNewProfile({ ...newProfile, name: text })}
                  placeholder="Enter profile name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Connection Type</Text>
                <View style={styles.buttonGroup}>
                  {['bluetooth', 'wifi', 'usb'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton,
                        newProfile.connectionType === type && styles.optionButtonActive,
                      ]}
                      onPress={() => setNewProfile({ ...newProfile, connectionType: type as any })}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          newProfile.connectionType === type && styles.optionButtonTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Command Language</Text>
                <View style={styles.buttonGroup}>
                  {['ESC/POS', 'ZPL', 'EPL', 'CPCL'].map((lang) => (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.optionButton,
                        newProfile.commandLanguage === lang && styles.optionButtonActive,
                      ]}
                      onPress={() => setNewProfile({ ...newProfile, commandLanguage: lang as any })}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          newProfile.commandLanguage === lang && styles.optionButtonTextActive,
                        ]}
                      >
                        {lang}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Paper Width</Text>
                <TextInput
                  style={styles.input}
                  value={newProfile.paperWidth}
                  onChangeText={(text) => setNewProfile({ ...newProfile, paperWidth: text })}
                  placeholder="e.g., 80mm, 4 inch"
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Save size={16} color="#fff" />
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.profilesList}>
            {profiles.map((profile) => (
              <View key={profile.id} style={styles.profileCard}>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileDetails}>
                    {profile.connectionType.toUpperCase()} • {profile.commandLanguage} • {profile.paperWidth}
                  </Text>
                  {profile.address && (
                    <Text style={styles.profileAddress}>{profile.address}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProfile(profile.id)}
                >
                  <Trash2 size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Zap size={20} color="#2196F3" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Auto Connect</Text>
                <Text style={styles.settingDescription}>
                  Automatically connect to last used printer
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoConnect}
              onValueChange={(value) => updateSetting('autoConnect', value)}
              trackColor={{ false: '#E0E0E0', true: '#BBDEFB' }}
              thumbColor={settings.autoConnect ? '#2196F3' : '#BDBDBD'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <FileText size={20} color="#2196F3" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Enable Logging</Text>
                <Text style={styles.settingDescription}>
                  Save communication logs for troubleshooting
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enableLogging}
              onValueChange={(value) => updateSetting('enableLogging', value)}
              trackColor={{ false: '#E0E0E0', true: '#BBDEFB' }}
              thumbColor={settings.enableLogging ? '#2196F3' : '#BDBDBD'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <SettingsIcon size={20} color="#2196F3" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Sound Alerts</Text>
                <Text style={styles.settingDescription}>
                  Play sound for print completion and errors
                </Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) => updateSetting('soundEnabled', value)}
              trackColor={{ false: '#E0E0E0', true: '#BBDEFB' }}
              thumbColor={settings.soundEnabled ? '#2196F3' : '#BDBDBD'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Shield size={20} color="#2196F3" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Vibrate on Error</Text>
                <Text style={styles.settingDescription}>
                  Vibrate device when printing errors occur
                </Text>
              </View>
            </View>
            <Switch
              value={settings.vibrateOnError}
              onValueChange={(value) => updateSetting('vibrateOnError', value)}
              trackColor={{ false: '#E0E0E0', true: '#BBDEFB' }}
              thumbColor={settings.vibrateOnError ? '#2196F3' : '#BDBDBD'}
            />
          </View>
        </View>

        {/* Additional Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Settings</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Default Test Template</Text>
            <View style={styles.buttonGroup}>
              {['quick', 'detailed', 'minimal'].map((template) => (
                <TouchableOpacity
                  key={template}
                  style={[
                    styles.optionButton,
                    settings.defaultTemplate === template && styles.optionButtonActive,
                  ]}
                  onPress={() => updateSetting('defaultTemplate', template)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      settings.defaultTemplate === template && styles.optionButtonTextActive,
                    ]}
                  >
                    {template.charAt(0).toUpperCase() + template.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Log Retention (Days)</Text>
            <TextInput
              style={styles.input}
              value={settings.logRetentionDays.toString()}
              onChangeText={(text) => updateSetting('logRetentionDays', parseInt(text) || 7)}
              keyboardType="numeric"
              placeholder="7"
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
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileForm: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
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
    backgroundColor: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  optionButtonTextActive: {
    color: '#2196F3',
  },
  formActions: {
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profilesList: {
    gap: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  profileAddress: {
    fontSize: 12,
    color: '#BDBDBD',
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#757575',
  },
});