This document mainly introduces how to quickly integrate Tencent Cloud TRTC SDK (ReactNative) into your project. Just follow the steps below for configuration, and you can complete the SDK integration.



## Environment Requirements
- ReactNative 0.63 or above.

- Node (above v12) & Watchman

- **Developing for Android:**

- Android Studio 3.5 or above.

- Devices with Android 4.1 or above.

- Java Development Kit

- **Developing for iOS and macOS:**

- Xcode 11.0 or above.

- OS X 10.11 or above

- Please ensure your project is set up with a valid developer signature.

- For environment setup, please refer to the [official documentation](https://reactnative.cn/docs/environment-setup)




## Integrating SDK

We have released the TRTC SDK for React Native to [npm](https://www.npmjs.com/package/trtc-react-native). You can install it by configuring `package.json`.
1. Add the following dependencies in your project's `package.json`:

   ``` bash
   "dependencies": {
     "trtc-react-native": "^2.5.0"
   },
   ```
2. Grant **camera** and **microphone** permissions to enable voice call features.


   <dx-tabs>


   ::: iOS

3. Add requests for camera and mic permissions in `Info.plist`:

   ``` bash
   <key>NSCameraUsageDescription</key>
   <string>Video calls require camera permission.</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>Voice calls require microphone permission.</string>
   ```
4. Link native libraries, refer to [Link Native Libraries](https://reactnative.cn/docs/linking-libraries-ios)
::: 
::: Android\sSide

5. Configure app permissions in `AndroidManifest.xml`, the TRTC SDK requires the following permissions.

   ``` bash
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
   <uses-permission android:name="android.permission.RECORD_AUDIO" />
   <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
   <uses-permission android:name="android.permission.BLUETOOTH" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.READ_PHONE_STATE" />
   <uses-feature android:name="android.hardware.camera" />
   <uses-feature android:name="android.hardware.camera.autofocus" />
   ```   

   > ! Do not set `android:hardwareAccelerated="false"`. Disabling hardware acceleration will result in the failure to render the other party's video stream.
   > 

6. Manual application of audio and video permissions is needed for Android

   ``` bash
   if (Platform.OS === 'android') {
     await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //For audio calls
    PermissionsAndroid.PERMISSIONS.CAMERA, // For video calls
     ]);
   }
   ```
   :::
</dx-tabs>









