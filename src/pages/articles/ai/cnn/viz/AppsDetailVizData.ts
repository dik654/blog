import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '실무 응용 사례',
    body: '의료 영상: X-ray 병변 검출(CheXNet), MRI/CT 3D CNN, 피부암 분류.\n자율주행: YOLO 객체 탐지, 차선 인식, Semantic segmentation, 거리 추정.\n제조업: 품질 검사, PCB 결함 검출, Anomaly detection.\n보안/감시: 얼굴 인식(FaceNet, ArcFace), 행동 인식.\n농업: 작물 질병 식별, 과일 성숙도 판별, 드론 영상 분석.\n위성 영상: 토지 이용 분류, 재해 피해 평가.',
  },
  {
    label: '전이학습 세부 전략',
    body: '전략 1 — Feature Extraction: conv층 동결, FC만 학습. 데이터 1K~10K.\n전략 2 — Fine-tuning: 마지막 몇 층 또는 전체 재학습. lr 1e-4~1e-5. 데이터 10K~100K.\n전략 3 — Train from Scratch: 사전학습 없이 전체 랜덤 초기화. 데이터 100K+.\n도메인별 권장: 일반(ResNet, EfficientNet), 의료(RadImageNet), 위성(SatMAE).\n배포 최적화: 양자화(4배 빠름), Pruning, Knowledge Distillation, ONNX/TensorRT.',
  },
];

export const C = {
  medical: '#ef4444',
  auto: '#3b82f6',
  mfg: '#10b981',
  security: '#8b5cf6',
  transfer: '#f59e0b',
  dim: '#94a3b8',
};
