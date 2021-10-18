import * as React from 'react';

import {
  StyleSheet,
  View,
  NativeEventEmitter,
  NativeModules,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
// @ts-ignore
import { SDKAPPID } from './debug/config';
// @ts-ignore
import getLatestUserSig from './debug/index';
import { demoParamsGroup } from './demoParamsGroup';
 
// import TRTCCloud, {
//   TRTCParams,
//   TRTCCloudListener, 
// } from 'react-native-trtc-react-native-sdk';

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
    // const trtcCloud = (await TRTCCloud.sharedInstance())!;
    // trtcCloud.registerListener((type: TRTCCloudListener, params: any) => {
    //   console.log('type', type);
    //   console.log('params', params);
    //   if (type === TRTCCloudListener.onEnterRoom) {
    //     console.log('enterRoom', params);
    //   }
    // });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
           {demoParamsGroup.map(value => {
            return <Button
              title={value.title}
              key={value.title}
              onPress={() => {
                value.handler(); 
              }}
            />
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