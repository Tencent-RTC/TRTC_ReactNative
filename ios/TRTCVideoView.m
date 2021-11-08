//
//  TRTCVideoView.m
//  RNTRTC
//
//

#import "TRTCVideoView.h"
#import <Foundation/Foundation.h>
#import "TXLiteAVSDK_TRTC/TRTCCloud.h"

@implementation TRTCVideoView

- (instancetype)init{
  
  if (self == [super init]) {
    _rtcEngine = [TRTCCloud sharedInstance];
  }
  
  return self;
}
-(void)setData:(NSDictionary*)data{
	NSString *userId = [data objectForKey:@"userId"];
	int streamType = [data[@"streamType"] intValue];
	
	if(![@"" isEqual: userId]){
		[self.rtcEngine startRemoteView:userId streamType: streamType view:self];
	}else{
		[self.rtcEngine startLocalPreview: YES  view:self];
	}
}

-(void)setRenderParams:(NSDictionary*)renderParams{
	NSString *userId = [renderParams objectForKey:@"userId"];
	int streamType = [renderParams[@"streamType"] intValue];
	
	TRTCRenderParams *params = [TRTCRenderParams new];
	
	if ([renderParams objectForKey:@"rotation"]) {
		params.rotation = [renderParams[@"rotation"] intValue];
	}
	if ([renderParams objectForKey:@"fillMode"]) {
		params.fillMode = [renderParams[@"fillMode"] intValue];
	}
	if ([renderParams objectForKey:@"mirrorType"]) {
		params.mirrorType = [renderParams[@"mirrorType"] intValue];
	}
	
	if(![@"" isEqual: userId]){
		[self.rtcEngine setRemoteRenderParams:userId streamType: streamType params:params];
	}else{
		[self.rtcEngine setLocalRenderParams: params];
	}
}

@end
