import React from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import './i18n';

import Navigation from './Navigation';
import VoiceCall from './voice_call/VoiceCallEntry';
import Room from './voice_call/VoiceCall';
import VideoCall from './video_call/VideoCallEntry';
import VideoRoom from './video_call/VideoCall';
import VoiceLiveEntry from './chat/ChatRoomEntry';
import VoiceChatRoom from './chat/ChatRoom';
import VideoLiveEntry from './live/LiveRoomEntry';
import LiveRoom from './live/LiveRoom';

type RootStackParamList = {
  Navigation: undefined;
  VoiceCall: undefined;
  Room: { roomId: string; userId: string; type: string };
  VideoCall: undefined;
  VideoRoom: { roomId: string; userId: string; type: string };
  VoiceLiveEntry: undefined;
  VoiceChatRoom: { roomId: string; userId: string; role: number };
  VideoLiveEntry: undefined;
  LiveRoom: { roomId: string; userId: string; role: number };
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const { t } = useTranslation();

  async function initInfo() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS
          .RECORD_AUDIO as 'android.permission.RECORD_AUDIO',
        PermissionsAndroid.PERMISSIONS.CAMERA as 'android.permission.CAMERA',
      ]);
      console.log('platform android');
    }
  }

  React.useEffect(() => {
    initInfo();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Navigation">
        <Stack.Screen
          name="Navigation"
          component={Navigation}
          options={{ title: t('navigation.appTitle') }}
        />
        <Stack.Screen
          name="VoiceCall"
          component={VoiceCall}
          options={{ title: t('navigation.voiceCall') }}
        />
        <Stack.Screen
          name="Room"
          component={Room}
          options={({ route }) => ({
            title: `${t('navigation.room')} (${route.params?.roomId})`
          })}
        />
        <Stack.Screen
          name="VideoCall"
          component={VideoCall}
          options={{ title: t('navigation.videoCall') }}
        />
        <Stack.Screen
          name="VideoRoom"
          component={VideoRoom}
          options={({ route }) => ({
            title: `${t('navigation.videoRoom')} (${route.params?.roomId})`
          })}
        />
        <Stack.Screen
          name="VoiceLiveEntry"
          component={VoiceLiveEntry}
          options={{ title: t('navigation.voiceLive') }}
        />
        <Stack.Screen
          name="VoiceChatRoom"
          component={VoiceChatRoom}
          options={({ route }) => ({
            title: `${t('navigation.voiceRoom')} (${route.params?.roomId})`
          })}
        />
        <Stack.Screen
          name="VideoLiveEntry"
          component={VideoLiveEntry}
          options={{ title: t('navigation.videoLive') }}
        />
        <Stack.Screen
          name="LiveRoom"
          component={LiveRoom}
          options={({ route }) => ({
            title: `${t('navigation.liveRoom')} (${route.params?.roomId})`
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
