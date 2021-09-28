package com.reactnativetrtcreactnativesdk;

import androidx.annotation.NonNull;
import android.content.Context;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.tencent.liteav.audio.TXAudioEffectManager;
import com.tencent.liteav.beauty.TXBeautyManager;
import com.tencent.liteav.device.TXDeviceManager;
import com.tencent.rtmp.TXLog;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCCloudListener;
import android.widget.Toast;

@ReactModule(name = TrtcReactNativeSdkModule.NAME)
public class TrtcReactNativeSdkModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TrtcReactNativeSdk";
    private TRTCCloud trtcCloud;
    private Context trtcContext;
    public TrtcReactNativeSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }


    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(int a, int b, Promise promise) {
        trtcCloud = TRTCCloud.sharedInstance(getReactApplicationContext());
        String version = trtcCloud.getSDKVersion();
        Toast.makeText(getReactApplicationContext(), "message:"+version, 50000).show();
        promise.resolve(10);
    }

    public static native int nativeMultiply(int a, int b);
}
