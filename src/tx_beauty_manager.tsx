import { NativeModules } from 'react-native';
const { TrtcReactNativeSdk } = NativeModules;

/// 美颜及动效参数管理
export default class TXBeautyManager {
  constructor() {}

  /**
  - 设置美颜类型
  @param beautyStyle	美颜风格.三种美颜风格：0 ：光滑 1：自然 2：朦胧
  */
  setBeautyStyle(beautyStyle: number): Promise<void> {
    return TrtcReactNativeSdk.setBeautyStyle({ beautyStyle });
  }

  /**
  - 设置色彩滤镜效果
  - 色彩滤镜，是一副包含色彩映射关系的颜色查找表图片，您可以在我们提供的官方 Demo 中找到预先准备好的几张滤镜图片。 SDK 会根据该查找表中的映射关系，对摄像头采集出的原始视频画面进行二次处理，以达到预期的滤镜效果。
  - 暂时只支持网络图片
  @param image	包含色彩映射关系的颜色查找表图片，必须是 png 格式。
  */
  setFilter(image: string): Promise<void> {
    return TrtcReactNativeSdk.setFilter({ imageUrl: image });
  }

  /**
  - 设置色彩滤镜的强度
  - 在美女秀场等应用场景里，滤镜浓度的要求会比较高，以便更加突显主播的差异。 我们默认的滤镜浓度是0.5，如果您觉得滤镜效果不明显，可以使用下面的接口进行调节。
  @param strength	从0到1，越大滤镜效果越明显，默认值为0.5。
  */
  setFilterStrength(strength: number): Promise<void> {
    return TrtcReactNativeSdk.setFilterStrength({
      strength: strength.toString(),
    });
  }

  /**
  - 设置美颜级别
  @param beautyLevel	美颜级别，取值范围0 - 9； 0表示关闭，9表示效果最明显。
  */
  setBeautyLevel(beautyLevel: number): Promise<void> {
    return TrtcReactNativeSdk.setBeautyLevel({
      beautyLevel,
    });
  }

  /**
  - 设置美白级别
  @param whitenessLevel	美白级别，取值范围0 - 9； 0表示关闭，1 - 9值越大，效果越明显。
  */
  setWhitenessLevel(whitenessLevel: number): Promise<void> {
    return TrtcReactNativeSdk.setWhitenessLevel({
      whitenessLevel,
    });
  }

  /**
  - 设置红润级别
  @param ruddyLevel	红润级别，取值范围0 - 9；0表示关闭，9表示效果最明显。
  */
  setRuddyLevel(ruddyLevel: number): Promise<void> {
    return TrtcReactNativeSdk.setRuddyLevel({
      ruddyLevel,
    });
  }

  /**
  - 开启清晰度增强
  @param enable	true：开启清晰度增强；false：关闭清晰度增强。默认值：true
  */
  enableSharpnessEnhancement(enable: boolean): Promise<void> {
    return TrtcReactNativeSdk.enableSharpnessEnhancement({
      enable,
    });
  }
}
