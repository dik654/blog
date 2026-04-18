import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  dataset: '#6366f1',
  loader: '#3b82f6',
  image: '#10b981',
  table: '#f59e0b',
  text: '#ec4899',
  worker: '#8b5cf6',
  pin: '#06b6d4',
};

export const STEPS: StepDef[] = [
  {
    label: 'Dataset 기본 구조: __len__ + __getitem__',
    body: 'torch.utils.data.Dataset을 상속하고 두 메서드만 구현.\n__getitem__(idx)에서 데이터 로드 + 전처리를 한다.',
  },
  {
    label: 'DataLoader: 배치 생성 엔진',
    body: 'batch_size, shuffle, num_workers, pin_memory 4가지 핵심 인자.\nDataset을 감싸서 미니배치 이터레이터를 생성.',
  },
  {
    label: 'num_workers & pin_memory 최적화',
    body: 'num_workers: CPU 프로세스 수 (보통 CPU 코어의 2~4배).\npin_memory=True: GPU 전송 속도 향상 (페이지 잠금 메모리).\n두 설정이 GPU 유휴 시간을 줄인다.',
  },
  {
    label: '도메인별 Dataset 패턴',
    body: '이미지: PIL → transforms → tensor.\n테이블: DataFrame → __getitem__에서 행 인덱싱.\n텍스트: tokenizer → input_ids + attention_mask.\n각 도메인의 전처리 위치가 다르다.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
