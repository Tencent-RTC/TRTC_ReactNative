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
import { config } from './config';

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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
         {config.map(value => {
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