#import <MapKit/MapKit.h>
#import <React/RCTViewManager.h>
#import "TRTCVideoView.h"
#import "TXVideoView.h"

@implementation RNTViewManager : RCTViewManager

RCT_EXPORT_MODULE(TXVideoView)

RCT_CUSTOM_VIEW_PROPERTY(data, NSDictionary, TRTCVideoView)
{
	view.data = [RCTConvert NSDictionary:json];
}

RCT_CUSTOM_VIEW_PROPERTY(renderParams, NSDictionary, TRTCVideoView)
{
	view.renderParams = [RCTConvert NSDictionary:json];
}

- (UIView *)view
{
//	TRTCVideoView *videoView = [TRTCVideoView new];
	return [TRTCVideoView new];
}

@end
