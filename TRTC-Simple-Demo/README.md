[简体中文](./README-zh_CN.md) | English

# Run Demo(React Native)

This document describes how to quickly run the TRTC demo for React Native.

## Environment Requirements

- React Native 0.63 or above
- Node (above v12) & Watchman
- **Developing for Android:**
  - Android Studio 3.5 or above
  - Devices with Android 4.1 or above
- **Developing for iOS and macOS:**
  - Xcode 11.0 or above
  - OS X 10.11 or above
  - A valid developer signature for your project
- For how to set up the environment, see the React Native [official document](https://reactnative.dev/docs/environment-setup).

## Prerequisites

You have [signed up for a Tencent Cloud account](https://intl.cloud.tencent.com) and verified your identity.

## Directions

[](id:step1)

### Step 1. Create an application

1. Log in to the TRTC console and select **Application Management** > **[Create application](https://console.tencentcloud.com/trtc/app/create)**.
2. Select **Create Application** and enter the application name such as `APIExample`. If you have already created an application, click **Select Existing Application**.
   ![#900px](https://qcloudimg.tencent-cloud.cn/raw/30fddb57f90491c7c94fd1cdfdde9a81.png)
3. Add or edit tags according to your actual business needs and click **Create**.

> An application name can contain up to 15 characters. Only digits, letters, Chinese characters, and underscores are allowed.

> Tags are used to identify and organize your Tencent Cloud resources. For example, an enterprise may have multiple business units, each of which has one or more TRTC applications. In this case, the enterprise can tag TRTC applications to mark out the unit information. Tags are optional and can be added or edited according to your actual business needs.

[](id:step2)

### Step 2. Download the SDK and demo source code

1. Download the SDK and [demo source code](https://github.com/LiteAVSDK/TRTC_ReactNative/tree/main/TRTC-Simple-Demo) for your platform.
2. Click **Next**.
   ![#900px](https://qcloudimg.tencent-cloud.cn/raw/a5bfe5b0664f05772b8172c29117ac13.png)

[](id:step3)

### Step 3. Configure demo project files

1. In the **Modify Configuration** step, select the development platform in line with the source package downloaded.
   ![#900px](https://qcloudimg.tencent-cloud.cn/raw/fa059c7b0dc9f601dbe1dc9b6548dd90.png)
2. Find and open `/TRTC-Simple-Demo/src/debug/config.js`.
3. Set the `SDKAPPID` and `SECRETKEY` parameters:

> - SDKAPPID: a placeholder by default. Set it to the actual `SDKAppID`.
> - SECRETKEY: a placeholder by default. Set it to the actual key.

4. Click **Next** to complete the creation.
5. After compilation, click **Return to Overview Page**.

> The method for generating `UserSig` described in this document involves configuring `SECRETKEY` in client code. In this method, `SECRETKEY` may be easily decompiled and reversed, and if your key is leaked, attackers can steal your Tencent Cloud traffic. Therefore, **this method is only suitable for the local execution and debugging of the demo**.

> The correct `UserSig` distribution method is to integrate the calculation code of `UserSig` into your server and provide an application-oriented API. When `UserSig` is needed, your application can send a request to the business server for a dynamic `UserSig`. For more information, please see [How do I calculate UserSig on the server?](https://intl.cloud.tencent.com/document/product/647/35166).

[](id:step4)

### Step 4. Configure permission requests

You need to configure permission requests in order to run the demo.

#### Android

1. Configure application permissions in `AndroidManifest.xml`. The TRTC SDK requires the following permissions:

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

> - Do not set `android:hardwareAccelerated="false"`. Disabling hardware acceleration will result in failure to render remote users’ videos.
> - Manually configure audio and video permission requests.

```Java
if (Platform.OS === 'android') {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //For audio calls
    PermissionsAndroid.PERMISSIONS.CAMERA, // For video calls
  ]);
}
```

#### iOS

1. Configure application permissions in `Info.plist`. The TRTC SDK requires the following permissions:

```ObjectiveC
<key>NSCameraUsageDescription</key>
<string>Video calls are possible only with camera permission.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Audio calls are possible only with mic access.</string>
```

### Step 5. Build and run the demo

#### Android

1. First execute "npm install" to install dependencies.
2. Launch Metro and run `npx react-native start` under your React Native project directory.
3. Open a new window and start debugging:

```
npx react-native run-android
```

#### iOS

1. First execute "npm install" to install dependencies.
2. Run `pod install` in the iOS directory to install dependencies.
3. Launch Metro and run `npx react-native start` under your React Native project directory.
4. Open a new window in the demo directory and start development debugging (if an error is reported, please open Xcode compilation and debugging)

```
npx react-native run-ios
```

​
