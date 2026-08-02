import { Scene } from '@/components/scene/Scene';
import {
  EXAMPLE_QKV,
  EXAMPLE_SCALED_DOT_PRODUCT_ATTN,
  EXAMPLE_ADDITIVE_ATTN,
} from '@/components/scene/types';

export default function SceneEngineTestArticle() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1>Scene Engine 테스트 (Object × State pilot)</h1>
      <p>
        모든 학문은 "객체가 존재하고, 상태가 변한다" 로 환원된다는 원칙에서 출발한 단일 viz 엔진.
        spec 으로 의미만 적으면 같은 visual language 로 자동 렌더된다.
        이 페이지는 attention-theory 3개 케이스로 엔진을 검증한다.
      </p>

      <p>
        <strong>Phase A — 정적 레이아웃.</strong> 의존 그래프 위상정렬 → 좌→우 column flow.
        애니메이션 아직 없음 (Phase B 예정). object 모양·라벨·group bracket 만 본다.
      </p>

      <h2 id="qkv">1. Q, K, V 생성 (transition 3개, project 만)</h2>
      <p>
        가장 단순한 케이스. 입력 x 한 개가 세 개의 가중치 매트릭스를 통해 Q, K, V 로 변환된다.
        depth 0 (입력·가중치) → depth 1 (Q/K/V) 두 column.
      </p>
      <Scene spec={EXAMPLE_QKV} />

      <h2 id="sdpa">2. Scaled Dot-Product Attention (phase 3 + slicing)</h2>
      <p>
        매트릭스 곱 → scale → softmax → 가중합. phase 3개로 의미 단위 분리.
        QK^T 의 transposeB 같은 payload 처리도 spec 안에 들어간다.
      </p>
      <Scene spec={EXAMPLE_SCALED_DOT_PRODUCT_ATTN} />

      <h2 id="additive">3. Additive (Bahdanau) Attention (group iteration)</h2>
      <p>
        인코더 hidden state h_1..h_4 가 group 으로 묶이고, 같은 t 에 평행 4개 transition 발생.
        group bracket 이 시각적으로 자식들을 둘러싼다.
      </p>
      <Scene spec={EXAMPLE_ADDITIVE_ATTN} />
    </article>
  );
}
