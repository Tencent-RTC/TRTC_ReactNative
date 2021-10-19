import * as React from 'react';
import {
  StyleSheet,
  // View,
  // NativeEventEmitter,
  // NativeModules,
  Button,
  // Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import TRTCCloud, {
  TRTCCloudListener,
} from 'react-native-trtc-react-native-sdk';
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
    const trtcCloud = (await TRTCCloud.sharedInstance())!;
    trtcCloud.registerListener((type: TRTCCloudListener, params: any) => {
      // if (type === TRTCCloudListener.onEnterRoom) {
      console.log(type, params);
      // }
    });
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
