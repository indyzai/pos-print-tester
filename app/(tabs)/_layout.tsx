import { Tabs } from 'expo-router';
import { Printer, TestTube, Activity, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Connect',
          tabBarIcon: ({ size, color }) => (
            <Printer size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'Test Print',
          tabBarIcon: ({ size, color }) => (
            <TestTube size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="diagnostics"
        options={{
          title: 'Diagnostics',
          tabBarIcon: ({ size, color }) => (
            <Activity size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}