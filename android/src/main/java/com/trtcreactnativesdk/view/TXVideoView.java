package com.trtcreactnativesdk.view;

import android.content.Context;
import android.view.SurfaceView;
import android.widget.FrameLayout;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.ChoreographerCompat;
import com.facebook.react.modules.core.ReactChoreographer;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.tencent.trtc.TRTCCloudDef;

/**
 * @Description TextureView
 */
public class TXVideoView extends FrameLayout {

    private boolean mLayoutEnqueued = false;
    private TXCloudVideoView txView;
    private Context trtcContext;
    private int txStreamType;
    public TXVideoView(Context context) {
        super(context);
        trtcContext = context;
        SurfaceView mSurfaceView = new SurfaceView(context);
        txView = new TXCloudVideoView(mSurfaceView);
        addView(mSurfaceView);
    }
    private final ChoreographerCompat.FrameCallback mLayoutCallback = new ChoreographerCompat.FrameCallback() {
        @Override
        public void doFrame(long frameTimeNanos) {
            mLayoutEnqueued = false;
            measure(
                    MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
            layout(getLeft(), getTop(), getRight(), getBottom());
        }
    };
    @Override
    public void requestLayout() {
        super.requestLayout();

        if (!mLayoutEnqueued && mLayoutCallback != null) {
            mLayoutEnqueued = true;
            ReactChoreographer.getInstance().postFrameCallback(
                    ReactChoreographer.CallbackType.NATIVE_ANIMATED_MODULE,
                    mLayoutCallback);
        }
    }
    private TRTCCloud getEngine(){
        return TRTCCloud.sharedInstance(trtcContext);
    }
    public void startView(ReadableMap params) {
        String userId = params.getString("userId");
        int streamType = params.getInt("streamType");
        System.out.println("userId====" + userId.toString());
        txView.setUserId(userId);
        if(!"".equals(userId)) {
            txStreamType = streamType;
            getEngine().startRemoteView(userId, streamType, txView);
        } else {
            getEngine().startLocalPreview(true, txView);
        }
    }
    public void setRenderMode(int renderMode){
        String userId = txView.getUserId();
        if("".equals(userId)){
            getEngine().setLocalViewFillMode(renderMode);
        }else{
            getEngine().setRemoteViewFillMode(userId, renderMode);
        }
    }

    public void setRenderParams(ReadableMap params) {
        String userId = params.getString("userId");
        System.out.println(userId);
        TRTCCloudDef.TRTCRenderParams renderParams = new TRTCCloudDef.TRTCRenderParams();
        renderParams.rotation = params.getInt("rotation");
        renderParams.fillMode = params.getInt("fillMode");
        renderParams.mirrorType = params.getInt("mirrorType");
        int streamType = params.getInt("streamType");
        if("".equals(userId)) {
            getEngine().setLocalRenderParams(renderParams);
        } else {
            getEngine().setRemoteRenderParams(userId, streamType, renderParams);
        }
    }

    public void stopPlayView() {
        String userId = txView.getUserId();
        if("".equals(userId)) {
            getEngine().stopLocalPreview();
        } else {
            getEngine().stopRemoteView(userId, txStreamType);
        }
    }
}
