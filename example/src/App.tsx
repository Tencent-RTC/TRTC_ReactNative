import * as React from 'react';
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
  StatusBar,
} from 'react-native';
import TRTCCloud, {
  TRTCCloudListener,
} from 'src/trtc_cloud';
// @ts-ignore
// import { SDKAPPID } from './debug/config';
// @ts-ignore
// import getLatestUserSig from './debug/index';
import { demoParamsGroup } from './demoParamsGroup';

// import TRTCCloud, {
//   TRTCParams,
//   TRTCCloudListener,
// } from 'react-native-trtc-react-native-sdk';

export default function App() {
  React.useEffect(() => {
    initInfo();
  }, []);

  async function initInfo() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //音频需要
        // PermissionsAndroid.PERMISSIONS.CAMERA, // 视频需要
      ]);
    }
    const trtcCloud = (await TRTCCloud.sharedInstance())!;
    trtcCloud.registerListener(onRtcListener);
  }

  function onRtcListener(type: TRTCCloudListener, params: any) {
    if (
      type !== TRTCCloudListener.onNetworkQuality &&
      type !== TRTCCloudListener.onStatistics
    ) {
      console.log(type, params);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
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
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
