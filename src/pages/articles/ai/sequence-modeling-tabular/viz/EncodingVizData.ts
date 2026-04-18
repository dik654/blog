import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '가변 길이 문제 — 시퀀스마다 이벤트 수가 다르다',
    body: '유저 A: 이벤트 3개, 유저 B: 이벤트 12개. 모델은 고정 크기 텐서를 입력받으므로\n"최대 길이 맞추기(패딩)" 또는 "최근 N개만 자르기(트렁케이션)"가 필요.',
  },
  {
    label: '패딩 & 트렁케이션 — 고정 길이 시퀀스 만들기',
    body: 'max_len = 8로 설정. 짧은 시퀀스 → 뒤에 [PAD] 토큰 추가.\n긴 시퀀스 → 최근 8개만 유지(초기 이벤트 버림). 어텐션 마스크로 패딩 위치를 무시.',
  },
  {
    label: '이벤트 타입 임베딩 — 범주형을 벡터로 변환',
    body: '이벤트 유형(패스, 슛, 드리블 등)을 룩업 테이블로 d차원 벡터에 매핑.\nnn.Embedding(num_types, d_model). 유사한 이벤트는 벡터 공간에서 가까워진다.',
  },
  {
    label: '위치 인코딩 — 순서 정보 주입',
    body: '시퀀스 내 위치를 sin/cos로 인코딩하여 임베딩에 더한다.\npos=0,1,...,max_len-1 마다 고유한 주파수 패턴 → 모델이 "몇 번째 이벤트인지" 인식.',
  },
  {
    label: '시간 간격(Time Delta) 인코딩 — 불균등 시간 반영',
    body: '이벤트 간 시간 간격이 일정하지 않다: 패스 사이 2초 vs 30초.\nΔt를 log 변환 후 선형 레이어로 임베딩 → 위치 인코딩에 합산.\n"시간적 거리"를 모델이 학습할 수 있게 된다.',
  },
  {
    label: '최종 입력 텐서 — 임베딩 + 위치 + 시간 합산',
    body: 'input = EventEmbed(type) + PosEncode(pos) + TimeDeltaEmbed(Δt)\n형상: (batch, max_len, d_model). 이 텐서가 RNN, 1D-CNN, 또는 Transformer에 입력된다.',
  },
];

export const COLORS = {
  pad: '#94a3b8',
  event: '#6366f1',
  embed: '#3b82f6',
  pos: '#10b981',
  time: '#f59e0b',
  final: '#8b5cf6',
};
