import DecisionMatrixViz from './viz/DecisionMatrixViz';

export default function DecisionMatrix() {
  return (
    <section id="decision-matrix" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">해법 선택 매트릭스</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          지금까지 네 가지 해법을 봤다 — 프롬프트 가드레일, 런타임 가드, Smoothie-Qwen, RL fine-tune.<br />
          각 해법은 "어디에서 개입하는가"가 다르고, 그 개입 지점이 비용과 강도를 결정한다.<br />
          이 섹션은 지금까지 흩어져 있던 판단 기준을 하나의 매트릭스로 묶는다.
        </p>
        <p className="leading-7">
          결론부터 말하면 — 4가지는 배타적이 아니다.<br />
          대부분의 프로덕션 워크로드는 2~3개를 <strong>쌓아서</strong> 쓴다.<br />
          어떤 조합을 쓸지는 가중치 접근성, 워크로드 특성, GPU 예산, latency budget이 함께 결정한다.
        </p>

        <div className="not-prose my-8"><DecisionMatrixViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">개입 지점의 지도</h3>
        <p className="leading-7">
          모든 해법을 "어디에서 개입하는가" 축으로 일렬로 세울 수 있다.
        </p>
        <ul className="leading-7">
          <li><strong>프롬프트</strong> — 입력 시퀀스를 수정. 모델 밖, 가장 약함.</li>
          <li><strong>런타임 가드</strong> — 출력 사후 검사. 모델 밖, 걸러내기만 하면 뭐든 막음.</li>
          <li><strong>Smoothie-Qwen</strong> — lm_head 가중치를 직접 만짐. 모델 안, logit 격차의 부호를 뒤집음.</li>
          <li><strong>RL fine-tune</strong> — policy 전체를 재학습. 모델 가장 깊은 곳, 사고 attractor까지 재정렬.</li>
        </ul>
        <p className="leading-7">
          이 축의 일반 법칙: 개입 지점이 lm_head에 가까울수록 강도가 크고 비용이 높다.<br />
          모델 밖에서 시작해서 모델 안으로 들어갈수록 성공률이 올라가지만, 요구되는 리소스(가중치 접근, 학습 인프라, 데이터셋)도 동시에 올라간다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용은 두 종류 — 1회 vs 지속</h3>
        <p className="leading-7">
          "비용"을 한 숫자로 비교하면 틀린다. 개발 비용과 운영 비용을 분리해야 한다.
        </p>
        <p className="leading-7">
          <strong>프롬프트</strong>: 개발 0, 운영 0. 가장 싼 것처럼 보이지만 효과가 약해서 실질 비용(실패로 인한 손실)이 숨어 있다.<br />
          <strong>런타임 가드</strong>: 개발 1~2일, 운영 지속 (매 요청에 latency + LLM judge 호출 비용).<br />
          <strong>Smoothie-Qwen</strong>: 개발 1회 (GPU 몇 분 또는 그냥 HF에서 다운로드), 운영 0. 장기적으로 가장 저렴.<br />
          <strong>RL fine-tune</strong>: 개발 4~5일 (GPU 며칠 + 데이터셋 구축), 운영 0.
        </p>
        <p className="leading-7">
          지속 비용은 scale 할수록 누적된다.<br />
          하루 100만 요청을 처리하는 워크로드에서 런타임 가드의 LLM judge 호출이 15%만 돼도 매일 15만 번의 추가 추론이 필요하다.<br />
          같은 워크로드에서 Smoothie-Qwen은 1회 변환 후 추가 비용 0 — 둘의 총비용 격차가 몇 주 만에 벌어진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">커버리지 히트맵 — 어떤 실패 모드를 잡나</h3>
        <p className="leading-7">
          PromptLevel 섹션에서 본 5가지 실패 모드(reasoning bypass, position decay, domain trigger, few-shot 오염, instruction conflict) 각각에 해법 4개의 효과를 점수화해 보자.
        </p>
        <ul className="leading-7">
          <li><strong>Reasoning bypass</strong>: prompt 0.2 / runtime 0.5 / Smoothie 0.7 / RL 0.95. think 블록은 가장 어려운 영역이고 RL이 확실히 강하다.</li>
          <li><strong>Position decay</strong>: prompt 0.2 / runtime 0.6 / Smoothie 0.8 / RL 0.9. 길이 문제는 Smoothie가 상당 부분 잡는다.</li>
          <li><strong>Domain trigger</strong>: prompt 0.3 / runtime 0.5 / Smoothie 0.9 / RL 0.9. 코드 주변 한자는 lm_head 보정이 거의 완벽히 잡는다.</li>
          <li><strong>Few-shot 오염</strong>: prompt 0.1 / runtime 0.4 / Smoothie 0.85 / RL 0.9. prompt 자체가 원인이라 prompt 기반 해법이 최악.</li>
          <li><strong>Instruction conflict</strong>: prompt 0.2 / runtime 0.3 / Smoothie 0.9 / RL 0.95. 정확성 vs 한국어 충돌은 lm_head에서만 해소.</li>
        </ul>
        <p className="leading-7">
          흥미로운 관찰 — Smoothie와 RL의 격차가 "reasoning bypass" 한 축에만 집중된다.<br />
          그 외 네 모드는 Smoothie만으로도 0.8 이상 커버가 가능하다.<br />
          그래서 "긴 사고가 워크로드의 핵심인가"가 RL을 정당화하는 유일한 기준이라고 봐도 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">배포 제약 — 무엇을 요구하는가</h3>
        <p className="leading-7">
          해법마다 요구하는 인프라가 다르다. 네 가지 요건으로 분해해 보자.
        </p>
        <ul className="leading-7">
          <li><strong>가중치 접근</strong> — 모델 파라미터를 직접 로드/수정할 수 있는가.</li>
          <li><strong>학습 인프라</strong> — training loop, optimizer, distributed training을 돌릴 수 있는가.</li>
          <li><strong>데이터셋</strong> — 한국어 reasoning 문제 + 정답 + judge prompt 세트가 있는가.</li>
          <li><strong>운영 인프라</strong> — 런타임에 추가 서비스(judge LLM, 가드 파이프라인)를 운영할 수 있는가.</li>
        </ul>
        <p className="leading-7">
          요건 매트릭스:
        </p>
        <ul className="leading-7">
          <li>프롬프트: 아무것도 필요 없음. API 기반 모델에서도 작동.</li>
          <li>런타임 가드: 운영 인프라만 필요. API 기반 모델에서도 작동.</li>
          <li>Smoothie-Qwen: 가중치 접근 필요. 오픈웨이트 모델 한정. 하지만 Qwen 전 사이즈는 이미 변환 배포돼 있어서 가중치 접근 = "HF에서 다운로드"로 축소된다.</li>
          <li>RL fine-tune: 4가지 모두 필요.</li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>현실적 상한</strong> — 대부분의 팀은 Smoothie까지가 현실적인 최대치다.<br />
          RL은 "한국어 품질이 제품의 핵심 차별점이고, GPU 예산과 데이터셋이 확보돼 있으며, 긴 reasoning이 워크로드의 중심"인 경우에만 정당화된다.<br />
          이 세 조건을 모두 만족하는 팀은 실제로 많지 않다.<br />
          그 외는 Smoothie + 런타임 가드 2층이 sweet spot.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Stacking — 해법은 쌓아쓴다</h3>
        <p className="leading-7">
          4가지 해법은 서로를 대체하지 않는다. 쌓아쓰는 게 정상 사용법이다.<br />
          각 layer가 다른 층의 잔여 문제를 잡는다.
        </p>
        <ul className="leading-7">
          <li><strong>Layer 1 — 프롬프트 가드레일 (최소)</strong>: "한국어로 답변" 한 줄. 비용 0, 효과 약하지만 심리적 안전망.</li>
          <li><strong>Layer 2 — Smoothie-Qwen 모델</strong>: 기본 모델을 변환본으로 교체. logit 격차를 뒤집는 핵심 레이어.</li>
          <li><strong>Layer 3 — 런타임 hybrid 가드</strong>: regex fast path + 의심 시 LLM judge. 잔여 5%를 잡는 안전망.</li>
          <li><strong>Layer 4 — RL fine-tune (선택)</strong>: 긴 reasoning에서 잔여 문제가 있을 때만 추가.</li>
        </ul>
        <p className="leading-7">
          Layer 1~3의 3층 조합이 대부분의 프로덕션 에이전트에게 sweet spot이다.<br />
          Layer 4는 특수 워크로드에만 — 그 외에는 비용 대비 효과가 떨어진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">상황별 추천 조합</h3>
        <p className="leading-7">
          구체적인 상황별로 stack 깊이를 다르게 잡는 가이드:
        </p>
        <ul className="leading-7">
          <li>
            <strong>POC / 프로토타입</strong> — 프롬프트 + 런타임 regex.<br />
            "이 문제가 실제로 발생하는지" 측정하는 단계. 모델 변환까지 안 가도 됨.
          </li>
          <li>
            <strong>내부 도구 / 소규모 프로덕션</strong> — Smoothie + 프롬프트.<br />
            사용자가 정해져 있고 latency 요구가 느슨하면 런타임 가드는 오버헤드.
          </li>
          <li>
            <strong>대규모 프로덕션</strong> — Smoothie + 런타임 hybrid 가드.<br />
            기본 조합. 대부분의 에이전트가 여기에 해당.
          </li>
          <li>
            <strong>Reasoning-heavy 에이전트 (한국어 핵심 차별점)</strong> — Smoothie + 런타임 + RL.<br />
            긴 사고, 한국어 품질이 제품 가치의 중심, GPU 예산 확보. 이때만 RL을 추가.
          </li>
          <li>
            <strong>API 기반 (가중치 접근 불가)</strong> — 프롬프트 + 런타임 hybrid 가드.<br />
            Smoothie/RL이 불가능하므로 런타임 가드의 중요도가 압도적. regex + LLM judge + retry를 공격적으로 튜닝.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">최종 권장 경로 — 순서가 중요</h3>
        <p className="leading-7">
          이 글을 읽고 지금 한국어 에이전트에서 leakage로 고민하는 사람이 있다면, 이 순서로 시도하길 권한다.
        </p>
        <ol className="leading-7">
          <li>
            <strong>Smoothie-Qwen 교체부터</strong> — 코드에서 모델 이름 한 줄만 바꾼다.<br />
            <code>Qwen/Qwen3-8B</code> → <code>dnotitia/Smoothie-Qwen3-8B</code>. 비용 0, 효과 95%.
          </li>
          <li>
            <strong>잔여 문제 측정</strong> — 며칠간 실제 트래픽으로 한자 비율, retry rate, judge pass rate를 계측한다.<br />
            직관이 아니라 숫자로 판단해야 다음 스텝의 크기를 정할 수 있다.
          </li>
          <li>
            <strong>측정 결과에 따라 가드 추가</strong>:
            <ul>
              <li>잔여 leakage &lt; 5% → 런타임 regex만 추가 (단순 안전망).</li>
              <li>5~20% → hybrid 가드 (regex + LLM judge) 추가.</li>
              <li>&gt; 20% → 워크로드 자체를 재검토. 프롬프트/데이터가 근본 원인일 가능성이 높다.</li>
            </ul>
          </li>
          <li>
            <strong>RL은 마지막 옵션</strong> — 위 단계를 모두 거친 후에도 잔여 문제가 있고, 그게 reasoning bypass에 집중되고, GPU·데이터셋이 확보돼 있을 때만.
          </li>
        </ol>
        <p className="leading-7">
          이 순서의 핵심은 <strong>측정 기반 에스컬레이션</strong>이다.<br />
          각 스텝의 효과를 숫자로 확인한 후 다음 스텝을 결정한다.<br />
          추측으로 RL까지 달려가면 며칠을 잃고, 측정 없이 런타임 가드만 쌓으면 계속 새로운 실패 모드를 발견하는 루프에 빠진다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>마지막 경고 — 순서를 거꾸로 가지 말 것</strong><br />
          "프롬프트 → 런타임 가드 → Smoothie → 결국 RL"로 올라가는 순서는 자주 본다.<br />
          이 경로의 문제는 각 단계에서 며칠씩 낭비한다는 것이다.<br />
          프롬프트로 못 막는다는 걸 확인하는 데 1주, 런타임 가드로도 부족하다는 걸 확인하는 데 1주, 그제야 Smoothie를 검토한다.<br />
          Smoothie를 가장 먼저 시도하면 이 2주가 사라진다.<br />
          "싸고 약한 것부터 시도하라"는 일반 원칙이 이 경우에는 함정이다 — Smoothie가 동시에 가장 싸고 가장 강하기 때문이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">마무리</h3>
        <p className="leading-7">
          Qwen 한국어 leakage는 복잡해 보이지만 원인은 한 줄로 요약된다 — lm_head의 한자 토큰 logit이 한국어 토큰을 이긴다.<br />
          모든 해법은 이 한 문장의 어디를 공격할지가 다를 뿐이다.
        </p>
        <p className="leading-7">
          프롬프트는 hidden state에 약한 bias를 더한다. 런타임 가드는 출력을 사후 걸러낸다.<br />
          Smoothie-Qwen은 lm_head weight를 직접 만져서 logit을 비례 축소한다.<br />
          RL은 policy 전체를 학습으로 재정렬해 reasoning attractor 자체를 바꾼다.
        </p>
        <p className="leading-7">
          4가지 해법의 스펙트럼을 이해하면 "어느 단계에서 멈출지"를 숫자로 판단할 수 있다.<br />
          대부분의 팀은 Smoothie + 런타임 가드 2층이면 충분하다.<br />
          그 너머는 특수 워크로드의 영역이다 — 필요할 때만, 측정 기반으로, 순서를 지켜서.
        </p>
      </div>
    </section>
  );
}
