import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  NativeEventEmitter,
  NativeModules,
  Alert,
} from 'react-native';
import TrtcReactNativeSdk from 'react-native-trtc-react-native-sdk';

export default function App() {
  const [result, setResult] = React.useState<string | undefined>();

  React.useEffect(() => {
    //TrtcReactNativeSdk.multiply(3, 7).then(setResult);
    TrtcReactNativeSdk.test();
    // .then(setResult);
    TrtcReactNativeSdk.invokeMethod('test', {
      a: 'x',
    }).then(setResult);
    const eventEmitter = new NativeEventEmitter(
      NativeModules.TrtcReactNativeSdk
    );
    eventEmitter.addListener('EventReminder', (event) => {
      console.log(event.eventProperty); // "someValue"
      Alert.alert(event.eventProperty);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>+++Result: {result}</Text>
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
