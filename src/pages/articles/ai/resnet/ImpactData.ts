export const imagenetData = [
  { year: 2012, model: 'AlexNet', error: 16.4, color: '#6366f1' },
  { year: 2013, model: 'ZFNet', error: 11.7, color: '#6366f1' },
  { year: 2014, model: 'VGGNet', error: 7.3, color: '#6366f1' },
  { year: 2014.5, model: 'GoogLeNet', error: 6.7, color: '#f59e0b' },
  { year: 2015, model: 'ResNet', error: 3.57, color: '#10b981' },
];

export const impactSteps = [
  {
    label: 'ImageNet Top-5 Error 추세 (2012-2015)',
    body: 'AlexNet(16.4%) → VGGNet(7.3%) → ResNet(3.57%). 인간(5.1%)을 돌파',
  },
  {
    label: 'ResNet: 3.57% (인간 5.1% 돌파)',
    body: '152층 네트워크로 ILSVRC 2015 우승. 최초로 인간 수준 이미지 분류 달성',
  },
  {
    label: '스킵 커넥션의 파급 효과',
    body: 'DenseNet, ResNeXt, EfficientNet + Transformer의 잔차 연결 = ResNet에서 유래',
  },
];

export const HUMAN_ERROR = 5.1;
