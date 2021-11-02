import React, { Component } from 'react';
import { Platform, requireNativeComponent, ViewProps } from 'react-native';
import { TRTCCloudDef } from '../trtc_cloud_def';

export interface TXVideoViewProps {
  userId: string;
  type?: number;
}

interface TXRenderViewProps {
  userId: string;
}

/**
 * @ignore
 */
const TXSurfaceView = requireNativeComponent<TXRenderViewProps>('TXVideoView');

/**
 * @ignore
 */
export class RtcVideoView extends Component<ViewProps & TXVideoViewProps, {}> {
  render() {
    const { type, userId, ...otherProps } = this.props;
    if (
      Platform.OS === 'android' &&
      type === TRTCCloudDef.TRTC_VideoView_TextureView
    ) {
      return <TXTextureView userId={userId} {...otherProps} />;
    } else {
      return <TXSurfaceView userId={userId} {...otherProps} />;
    }
  }
}

/**
 * @ignore
 */
const TXTextureView = requireNativeComponent<TXRenderViewProps>(
  'TXVideoViewTextureView'
);
