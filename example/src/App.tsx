import React, { useState } from 'react';
import {
  StyleSheet,
  // View,
  // NativeEventEmitter,
  // NativeModules,
  Button,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import TRTCCloud, {
  TRTCCloudDef,
  TRTCCloudListener,
  TXVideoView,
} from '../../src/trtc_cloud';
import { demoParamsGroup } from './demoParamsGroup';

// import TRTCCloud, {
//   TRTCParams,
//   TRTCCloudListener,
// } from 'trtc-react-native';

export default function App() {
  const [isEnter, setIsEnter] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState(null);
  React.useEffect(() => {
    initInfo();
  }, []);

  async function initInfo() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //音频需要
        PermissionsAndroid.PERMISSIONS.CAMERA, // 视频需要
      ]);
    }
    const trtcCloud = (await TRTCCloud.sharedInstance())!;
    trtcCloud.registerListener(onRtcListener);
  }

  function onRtcListener(type: TRTCCloudListener, params: any) {
    if (type === TRTCCloudListener.onEnterRoom) {
      console.log('===onEnterRoom');
      if (params.result > 0) {
        setIsEnter(true);
      }
    }
    if (type === TRTCCloudListener.onExitRoom) {
      setIsEnter(false);
    }
    if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
      setRemoteUserId(params.userId);
    }
    if (type === TRTCCloudListener.onRemoteUserLeaveRoom) {
      setRemoteUserId(null);
    }
    if (
      type !== TRTCCloudListener.onNetworkQuality &&
      type !== TRTCCloudListener.onStatistics
    ) {
      console.log(type, params);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {isEnter && (
        <TXVideoView.LocalView
          style={styles.video}
          renderParams={{
            rotation: TRTCCloudDef.TRTC_VIDEO_ROTATION_0,
          }}
        />
      )}
      {remoteUserId && (
        <TXVideoView.RemoteView
          userId={remoteUserId}
          viewType={TRTCCloudDef.TRTC_VideoView_SurfaceView}
          streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
          renderParams={{
            rotation: TRTCCloudDef.TRTC_VIDEO_ROTATION_90,
            // mirrorType: TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_ENABLE
          }}
          style={styles.video}
        />
      )}
      <ScrollView style={styles.scrollView}>
        {demoParamsGroup.map((value) => {
          return (
            <Button
              title={value.title}
              key={value.title}
              onPress={() => {
                value.handler();
              }}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  video: {
    width: 240,
    height: 240,
  },
});
