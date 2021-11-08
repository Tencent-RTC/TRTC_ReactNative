//
//  TRTCVideoView.h
//  RNTRTC
//
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "TXLiteAVSDK_TRTC/TRTCCloud.h"
//#import "TRTCConst.h"

NS_ASSUME_NONNULL_BEGIN

@interface TRTCVideoView : UIView

@property (strong, nonatomic) TRTCCloud *rtcEngine;
@property (strong, nonatomic) NSDictionary* data;
@property (strong, nonatomic) NSDictionary* renderParams;

@end

NS_ASSUME_NONNULL_END
