import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Button,
  Alert,
} from 'react-native';
// @ts-ignore
import { SDKAPPID } from './debug/config';
// @ts-ignore
import getLatestUserSig from './debug/index';

import TrtcReactNativeSdk, {
  TRTCParams,
} from 'react-native-trtc-react-native-sdk';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();

  // React.useEffect(() => {
  //   //TrtcReactNativeSdk.multiply(3, 7).then(setResult);
  //   // .then(setResult);
  //   TrtcReactNativeSdk.invokeMethod('test', {
  //     a: 'x',
  //   }).then(setResult);
  //   const eventEmitter = new NativeEventEmitter(
  //     NativeModules.TrtcReactNativeSdk
  //   );
  //   eventEmitter.addListener('EventReminder', (event) => {
  //     console.log(event.eventProperty); // "someValue"
  //     // Alert.alert(event.eventProperty);
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <Text>+++Result: {result}</Text>
      {/* <Button
        title="getSDKVersion"
        onPress={async () => {
          const version = await TrtcReactNativeSdk.getSDKVersion();
          Alert.alert(version);
        }}
      /> */}
      <Button
        title="enterRoom"
        onPress={async () => {
          // const userId = '4445';
          // console.log('niuzan');
          // var userI = getLatestUserSig(userId);
          // console.log('userI', userI);
          // const params = new TRTCParams({
          //   sdkAppId: SDKAPPID,
          //   userId: userId,
          //   userSig: getLatestUserSig(userId).userSig,
          //   roomId: 5666,
          // });
          // TrtcReactNativeSdk.enterRoom(params, 3);

          const params: enterRoomParams = {
            sdkAppId: 1400579833,
            userId: "lexuslin",
            userSig: "eJwtzEELgjAYxvHvsnPI63Q6hQ6FB8mitNFd2pK3zNZcJUXfPVOPz**B-4eI9d55KkNiQh0gs2GjVI3FEw5cq*7R1thMXysvpdYoSez6ACyMuOeNj*o0GtU7Y4wCwKgWr38LPBqBzyCYKlj16TA-L*6V3b2TZCXMUqfHtCy2PGgOmpuX2eS*dQuWYSZuc-L9AQ6YMvY_",
            roomId: 2366,
            strRoomId: "string",
            role: 1,
            streamId: "string",
            userDefineRecordId: "string",
            privateMapKey: "string",
            businessInfo: "string"
          }
          TrtcReactNativeSdk.enterRoom(params).then((res) => {
            Alert.alert("success: " + res)
          }).catch(() => {
            Alert.alert("error")
          })
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
