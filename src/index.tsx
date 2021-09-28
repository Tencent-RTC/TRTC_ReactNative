import { NativeModules } from 'react-native';

type TrtcReactNativeSdkType = {
  multiply(a: number, b: number): Promise<number>;
  test(): Promise<string>;
  invokeMethod(method: string, _arguments: any): Promise<string>;
};

const { TrtcReactNativeSdk } = NativeModules;

export default TrtcReactNativeSdk as TrtcReactNativeSdkType;
