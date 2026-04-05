import CodePanel from '@/components/ui/code-panel';

const transferCode = `import torchvision.models as models
import torch.nn as nn

# 1. 사전학습된 ResNet50 로드
model = models.resnet50(pretrained=True)

# 2. Feature extractor 동결
for param in model.parameters():
    param.requires_grad = False

# 3. 분류 헤드만 교체 (1000 → 10 클래스)
model.fc = nn.Linear(model.fc.in_features, 10)

# 전체 파라미터: 2,550만, 학습 대상: ~2만 (FC만)
# → 소량 데이터로도 높은 정확도 달성`;

const transferAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: 'ImageNet 사전학습 가중치 로드' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '기존 층 가중치 동결' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: '새로운 분류 헤드로 교체' },
];

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CNN 응용 분야</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이미지 분류 (Image Classification)</h3>
        <p>
          CNN의 가장 기본적인 응용 — 입력 이미지를 사전 정의된 클래스 중 하나로 분류<br />
          ImageNet 벤치마크에서 인간 수준(Top-5 에러 ~5%)을 넘어선 것이 CNN의 위력을 증명
        </p>

        <h3>객체 탐지 (Object Detection)</h3>
        <p>
          이미지 내 여러 객체의 위치(바운딩 박스)와 클래스를 동시에 예측<br />
          <strong>R-CNN → Fast R-CNN → Faster R-CNN → YOLO</strong> 순으로 발전<br />
          YOLO — 실시간 탐지 가능. CNN 백본이 특징 추출, 탐지 헤드가 박스 좌표와 클래스 출력
        </p>

        <h3>시멘틱 세그멘테이션 (Semantic Segmentation)</h3>
        <p>
          픽셀 단위로 클래스를 할당<br />
          <strong>FCN(Fully Convolutional Network)</strong> — FC 층을 1x1 합성곱으로 대체하여 임의 크기 입력 처리 가능<br />
          <strong>U-Net</strong> — 인코더-디코더 구조와 스킵 연결로 의료 영상 분석에서 혁신적 성과
        </p>

        <h3>전이학습 (Transfer Learning)</h3>
        <p>
          ImageNet 등 대규모 데이터셋에서 학습한 CNN 가중치를 새로운 태스크의 초기값으로 활용<br />
          앞단의 합성곱 층은 범용적인 시각 특징(엣지, 텍스처)을 학습<br />
          뒷단 분류 헤드만 교체하면 소량 데이터로도 높은 성능 달성 가능
        </p>
        <CodePanel title="PyTorch 전이학습 예시" code={transferCode} annotations={transferAnnotations} />

        <p>
          CNN은 전이학습을 통해 소량 데이터에서도 뛰어난 성능을 보여줌<br />
          ImageNet에서 학습한 범용 시각 피처(엣지, 텍스처, 도형)를 그대로 활용 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 응용 사례 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. 의료 영상 분석
//    - X-ray 병변 검출 (CheXNet, DeepMind)
//    - MRI/CT 3D CNN으로 종양 탐지
//    - 피부암 분류 (dermatology)
//    - 병리 이미지 세포 분석
//
// 2. 자율주행
//    - 카메라 기반 객체 탐지 (YOLO, Tesla FSD)
//    - Lane detection (도로 차선 인식)
//    - Semantic segmentation (주행 가능 영역)
//    - Depth estimation (거리 추정)
//
// 3. 제조업
//    - 품질 검사 (불량품 탐지)
//    - PCB 결함 검출
//    - Anomaly detection
//
// 4. 보안/감시
//    - 얼굴 인식 (FaceNet, ArcFace)
//    - 행동 인식 (action recognition)
//    - 군중 밀도 추정
//
// 5. 농업
//    - 작물 질병 식별
//    - 과일 성숙도 판별
//    - 드론 영상 분석
//
// 6. 위성 영상
//    - 토지 이용 분류
//    - 재해 피해 평가
//    - 건물/도로 segmentation`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">전이학습 세부 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Transfer Learning 3가지 전략
//
// [전략 1] Feature Extraction (동결)
//   - 사전학습 모델의 모든 conv층 동결
//   - 마지막 FC만 새로 학습
//   - 데이터: 1K~10K 샘플
//   - 학습 시간: 짧음 (분~시간)
//
// [전략 2] Fine-tuning (일부/전체 학습)
//   - 마지막 몇 층만 학습 (partial)
//   - 또는 전체 재학습 (full)
//   - 낮은 learning rate (1e-4 ~ 1e-5)
//   - 데이터: 10K~100K 샘플
//
// [전략 3] Train from Scratch
//   - 사전학습 가중치 사용 안 함
//   - 모든 층 랜덤 초기화
//   - 데이터: 100K+ 샘플
//   - 학습 시간: 며칠~주

// 도메인별 권장 사전학습 모델:
//   일반 이미지:       ResNet, EfficientNet, ConvNeXt
//   의료 영상:         RadImageNet, MedCLIP
//   위성 영상:         SatMAE, GRN
//   자율주행:          CLIP-based, DINOv2
//   작은 데이터:       Self-supervised (MAE, DINO)
//
// Domain Adaptation 기법:
//   - Gradual unfreezing (점진적 해동)
//   - Discriminative LR (층별 다른 학습률)
//   - Data augmentation 강화
//   - Mixup, CutMix 등 regularization

// 배포 최적화:
//   - 양자화 (FP32 → INT8): 4배 빠름
//   - Pruning: 파라미터 제거
//   - Knowledge Distillation: 작은 모델로 증류
//   - ONNX / TensorRT로 추론 최적화`}
        </pre>
        <p className="leading-7">
          요약 1: CNN은 <strong>의료·자율주행·제조·보안</strong> 등 핵심 산업에서 여전히 주력.<br />
          요약 2: 전이학습 전략은 <strong>데이터 규모</strong>에 따라 Feature extraction / Fine-tuning / Scratch 선택.<br />
          요약 3: 배포 단계에서는 <strong>양자화·증류·프루닝</strong>으로 추론 최적화 필수.
        </p>
      </div>
    </section>
  );
}
