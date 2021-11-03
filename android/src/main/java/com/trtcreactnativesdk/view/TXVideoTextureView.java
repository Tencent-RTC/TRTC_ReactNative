package com.trtcreactnativesdk.view;

import android.content.Context;
import android.view.SurfaceView;
import android.widget.FrameLayout;

import com.facebook.react.modules.core.ChoreographerCompat;
import com.facebook.react.modules.core.ReactChoreographer;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;

/**
 * @Description TextureView
 */
public class TXVideoTextureView extends FrameLayout {

    private boolean mLayoutEnqueued = false;
    private TXCloudVideoView txView;
    private Context trtcContext;
    public TXVideoTextureView(Context context) {
        super(context);
        trtcContext = context;
        txView = new TXCloudVideoView(context);
        addView(txView);
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
    public void setUid(String userId){
        System.out.println("userId====" + userId.toString());
        txView.setUserId(userId);
        if(!"".equals(userId)){
            getEngine().startRemoteView(userId, txView);
        }else{
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

    public void setMirrorMode(int mirrorMode){
        getEngine().setLocalViewMirror(mirrorMode);
    }

    public void stopPlayView(){
        String userId = txView.getUserId();
        if("".equals(userId)){
            getEngine().stopLocalPreview();
        }else{
            getEngine().stopRemoteView(userId);
        }
    }
}
