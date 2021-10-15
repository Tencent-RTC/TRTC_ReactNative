import * as React from 'react';

import { StyleSheet, View, Button, Alert } from 'react-native';
// @ts-ignore
import { SDKAPPID } from './debug/config';
// @ts-ignore
import getLatestUserSig from './debug/index';

import TRTCCloud, {
  TRTCParams,
  TRTCCloudListener,
} from 'react-native-trtc-react-native-sdk';

export default function App() {
  // const [result, setResult] = React.useState<string | undefined>();

  React.useEffect(() => {
    // const eventEmitter = new NativeEventEmitter(
    //   NativeModules.TrtcReactNativeSdk
    // );
    // eventEmitter.addListener('EventReminder', (event) => {
    //   console.log(event.eventProperty); // "someValue"
    //   Alert.alert(event.eventProperty);
    // });
    initInfo();
  }, []);

  async function initInfo() {
    const trtcCloud = (await TRTCCloud.sharedInstance())!;
    trtcCloud.registerListener((type: TRTCCloudListener, params: any) => {
      console.log('type', type);
      console.log('params', params);
      if (type === TRTCCloudListener.onEnterRoom) {
        console.log('enterRoom', params);
      }
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="getSDKVersion"
        onPress={async () => {
          const trtcCloud = (await TRTCCloud.sharedInstance())!;
          const version = await trtcCloud.getSDKVersion();
          Alert.alert(version);
        }}
      />
      <Button
        title="enterRoom"
        onPress={async () => {
          const userId = '4445';
          console.log('niuzan');
          var userI = getLatestUserSig(userId);
          console.log('userI', userI);
          const params = new TRTCParams({
            sdkAppId: SDKAPPID,
            userId: userId,
            userSig: getLatestUserSig(userId).userSig,
            roomId: 5666,
          });
          const trtcCloud = (await TRTCCloud.sharedInstance())!;
          trtcCloud.enterRoom(params, 3);
        }}
      />
      <Button
        title="exitRoom"
        onPress={async () => {
          const trtcCloud = (await TRTCCloud.sharedInstance())!;
          trtcCloud.exitRoom();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
