[简体中文](./README-zh_CN.md) | English

# TRTC SDK （ReactNative）
The SDK for React Native is packaged from the TRTC SDK for iOS and Android. 

[API OverView-English](https://intl.cloud.tencent.com/document/product/647/43300)

Note: Demo does not support simulator operation. Please use real machine development and debugging.

### SDK npm
[SDK npm](https://www.npmjs.com/package/trtc-react-native)

### SDK class files

* trtc_cloud: main TRTC API classes
* tx_audio_effect_manager: music and audio effect APIs
* tx_device_manager: device management class
* trtc_cloud_def: definitions of key TRTC types
* trtc_cloud_listener: TRTC event callback APIs

### Sample calls

1. Initialization
```
// Create a `TRTCCloud` singleton
const trtcCloud = TRTCCloud.sharedInstance();
// Get the device management module
const txDeviceManager = trtcCloud.getDeviceManager();
// Get the audio effect management class
const txAudioManager = trtcCloud.getAudioEffectManager();
```

2. Room entry/exit
```
// Enter a room
const params = new TRTCParams({
        sdkAppId: SDKAPPID,//Application ID
        userId,//User ID
        userSig,//User signature
        roomId: 2366,//Room ID
      });
      trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);
// Leave a room
trtcCloud.exitRoom();
```

3. Listener registration
```
// Register a listener
trtcCloud.registerListener(onRtcListener);

function onRtcListener(type: TRTCCloudListener, params: any) {
  // Callback for room entry
  if (type === TRTCCloudListener.onEnterRoom) {
    if (params.result > 0) {
      // Entered room successfully
    }
  }
  // Callback for the entry of a remote user
  if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
    //params.userId: ID of the remote user
  }
  //Whether a remote user’s mic is turned on
  if (type === TRTCCloudListener.onUserAudioAvailable) {
    //param.userId: ID of the remote user
    //param.visible: `true` indicates that the user’s mic is turned on.
  }
}
// Unregister a listener
trtcCloud.unRegisterListener(onRtcListener);
```

4. Playing local video
```
<TXVideoView.LocalView />
```

5. Playing the video of a remote user
```
<TXVideoView.RemoteView
  userId={remoteUserId}
  streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
/>
```

6. Playing the Screen sharing of a remote user
```
<TXVideoView.RemoteView
  userId={remoteUserId}
  streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB}
/>
```
### Android development environment
You can refer to React Native’s [official document](https://reactnative.dev/docs/environment-setup) to set up a development environment for Android.
Note: You must debug your project on a real device.
#### Configuring app permissions
Configure application permissions in `AndroidManifest.xml`. The TRTC SDK requires the following permissions:

```
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

>! Do not set `android:hardwareAccelerated="false"`. Disabling hardware acceleration will result in failure to render remote users’ videos.

```
// You need to request audio and video permissions manually for Android.
if (Platform.OS === 'android') {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //For audio calls
    // PermissionsAndroid.PERMISSIONS.CAMERA, // For video calls
  ]);
}
```

#### Developing and debugging
1.To start Metro, run npx react-native start inside your React Native project folder
```
npx react-native start
```
2.Let Metro Bundler run in its own terminal. Open a new terminal inside your React Native project folder. Run the following
```
npx react-native run-android
```

### iOS development environment
You can refer to React Native’s [official document](https://reactnative.dev/docs/environment-setup) to set up a development environment for iOS.
#### Configuring app permissions
Configure application permissions in `Info.plist`. The TRTC SDK requires the following permissions:

```
<key>NSCameraUsageDescription</key>
<string>Authorize the camera permission to make a normal video call</string>
<key>NSMicrophoneUsageDescription</key>
<string>Authorize microphone permissions to make normal voice calls</string>
```

#### Developing and debugging

1. To start Metro, run npx react-native start inside your React Native project folder
```
npx react-native start
```
2. Let Metro Bundler run in its own terminal. Open a new terminal inside your React Native project folder. Run the following
```
npx react-native run-ios
```
3. If there are any changes to the iOS directory, just run `yarn ios` again.

4. If you need to debug iOS, in the ios directory, open `.xcworkspace` to run
