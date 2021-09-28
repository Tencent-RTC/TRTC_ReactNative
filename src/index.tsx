import { NativeModules } from 'react-native';

type TrtcReactNativeSdkType = {
  multiply(a: number, b: number): Promise<number>;
};

const { TrtcReactNativeSdk } = NativeModules;

export default TrtcReactNativeSdk as TrtcReactNativeSdkType;
