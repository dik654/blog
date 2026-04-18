import CNN3DViz from './viz/CNN3DViz';

export default function CNN3D() {
  return (
    <section id="3dcnn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3D CNN & SlowFast</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          2D CNN — 이미지에서 공간 패턴(에지, 텍스처, 물체)을 추출하는 데 탁월<br />
          하지만 시간 축이 없어 프레임 간 움직임을 학습할 수 없음<br />
          해법: 2D 커널(k x k)을 3D 커널(<strong>d x k x k</strong>)로 확장 — d는 시간 방향 커널 크기
        </p>
        <p>
          <strong>C3D</strong> (Tran et al., 2015) — 최초의 실용적 3D ConvNet<br />
          모든 conv를 3x3x3으로 통일, 16프레임 입력, 5개 conv 블록 + FC 구조<br />
          단순하지만 ImageNet pretrained 가중치를 활용할 수 없어 대규모 비디오 데이터(Sports-1M)로 직접 학습
        </p>
        <p>
          <strong>I3D</strong> (Carreira & Zisserman, 2017) — 2D pretrained를 3D로 "부풀리기"(Inflation)<br />
          k x k 커널을 d x k x k로 확장, 가중치를 d로 나눠 복제해 초기화<br />
          ImageNet의 강력한 공간 피처를 그대로 계승 + 시간 축 학습을 더함<br />
          Two-Stream: RGB 스트림(외형) + Optical Flow 스트림(움직임)의 예측을 Late Fusion
        </p>
      </div>
      <div className="not-prose my-8">
        <CNN3DViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SlowFast Networks</h3>
        <p>
          Feichtenhofer et al. (2019) — 생물학적 시각 시스템에서 영감<br />
          <strong>Slow pathway</strong>: 낮은 프레임률(예: 4fps), 채널 수가 많음 → "무엇이 있는가"(공간 의미)<br />
          <strong>Fast pathway</strong>: 높은 프레임률(예: 32fps), 채널 수가 적음(Slow의 1/8) → "어떻게 움직이는가"(시간 동작)<br />
          Lateral Connection으로 Fast에서 Slow로 시간 정보를 전달
        </p>
        <p>
          설계 판단: 파라미터의 80%를 Slow에 집중 — 공간 인식이 행동 인식의 기반이기 때문<br />
          Fast는 가벼운 채널로 빠른 움직임만 포착, 효율적인 분업 구조
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">R(2+1)D — 공간/시간 분리</h3>
        <p>
          Tran et al. (2018) — 3D conv를 2D 공간 conv(1x3x3) + 1D 시간 conv(3x1x1)로 분해<br />
          파라미터: 3x3x3 = 27 → (1x3x3) + (3x1x1) = 9 + 3 = 12, <strong>56% 절감</strong><br />
          핵심: 분리 사이에 ReLU를 삽입하여 비선형성 추가 → 같은 파라미터 대비 표현력 향상<br />
          ResNet-18/34 기반으로 구현, 행동 인식에서 C3D/I3D를 능가
        </p>
      </div>
    </section>
  );
}
