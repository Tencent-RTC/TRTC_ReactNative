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
public class TXVideoView extends FrameLayout {

    private boolean mLayoutEnqueued = false;
    private TXCloudVideoView surface;
    private Context trtcContext;
    public TXVideoView(Context context) {
        super(context);
        trtcContext = context;
//        SurfaceView mSurfaceView = new SurfaceView(context);
//        surface = new TXCloudVideoView(mSurfaceView);
        surface = new TXCloudVideoView(context);
        addView(surface);
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
            // we use NATIVE_ANIMATED_MODULE choreographer queue because it allows us to catch the current
            // looper loop instead of enqueueing the update in the next loop causing a one frame delay.
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
        surface.setUserId(userId);
        if(!"".equals(userId)){
            getEngine().startRemoteView(userId, surface);
        }else{
            getEngine().startLocalPreview(true, surface);
        }
    }
    public void setRenderMode(int renderMode){
        String userId = surface.getUserId();
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
        String userId = surface.getUserId();
        if("".equals(userId)){
            getEngine().stopLocalPreview();
        }else{
            getEngine().stopRemoteView(userId);
        }
    }
}
