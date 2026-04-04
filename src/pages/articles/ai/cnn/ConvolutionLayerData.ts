export const convCode = `import torch.nn as nn

# 입력: 3채널(RGB), 출력: 16개 특징 맵
conv = nn.Conv2d(
    in_channels=3,
    out_channels=16,
    kernel_size=3,      # 3x3 필터
    stride=1,           # 이동 간격
    padding=1,          # zero-padding (same)
)
# 파라미터 수: 3 * 16 * 3 * 3 + 16(bias) = 448개
# 전결합층이라면: 224*224*3 * 뉴런수 = 수백만 개`;

export const convAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: '입력/출력 채널 정의' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '커널 크기, 스트라이드, 패딩' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: 'FC 대비 파라미터 절감' },
];

export const poolCode = `# Max Pooling: 2x2 윈도우에서 최댓값 선택
pool = nn.MaxPool2d(kernel_size=2, stride=2)
# 입력: [B, C, 224, 224] → 출력: [B, C, 112, 112]
# 공간 해상도 절반, 채널 수 유지

# 활성화 함수: ReLU
relu = nn.ReLU(inplace=True)
# max(0, x) — 음수를 0으로 클리핑
# 계산이 빠르고 기울기 소실(vanishing gradient) 완화`;

export const poolAnnotations = [
  { lines: [1, 3] as [number, number], color: 'violet' as const, note: 'Max Pooling 다운샘플링' },
  { lines: [6, 9] as [number, number], color: 'rose' as const, note: 'ReLU 비선형 활성화' },
];
