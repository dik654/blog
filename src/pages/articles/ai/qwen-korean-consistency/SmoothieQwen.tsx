import SmoothieQwenViz from './viz/SmoothieQwenViz';

export default function SmoothieQwen() {
  return (
    <section id="smoothie-qwen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Smoothie-Qwen: lm_head 재가중치</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          dnotitia가 만든 Smoothie-Qwen은 정확히 우리가 본 진단에서 출발한다.<br />
          "lm_head의 한자 토큰 row가 한국어 토큰 row보다 강하게 학습돼 있다 → 한자 logit이 한국어 logit을 이긴다."<br />
          그럼 그 row를 직접 줄이면 되지 않냐. 이 한 문장이 알고리즘 전부다.
        </p>
        <p className="leading-7">
          재학습이 없다. fine-tuning도 없다. RL도 없다.<br />
          기존 Qwen 모델 가중치를 한 번 변환하고, 변환된 가중치를 그대로 배포한다.<br />
          비용은 GPU 한 장으로 몇 분, 효과는 한자 leakage 95%+ 감소.
        </p>

        <div className="not-prose my-8"><SmoothieQwenViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">lm_head는 row 단위로 만질 수 있다</h3>
        <p className="leading-7">
          출발은 lm_head의 형태를 정확히 보는 것이다.<br />
          Qwen3-8B를 예로 들면 lm_head는 약 (152K, 4096) 모양의 Linear 한 장이다.<br />
          행렬 W의 각 row 가 토큰 하나에 대응한다 — token id <code>t</code>의 row <code>W[t, :]</code> 가 그 토큰의 "의미 벡터"다.
        </p>
        <p className="leading-7">
          디코딩 마지막 단계는 <code>z[t] = W[t, :] · h</code> 그리고 <code>softmax(z)</code> 위의 sampling.<br />
          여기서 핵심 관찰: <strong>row 하나를 만져도 다른 row는 전혀 영향받지 않는다</strong>.<br />
          한자 토큰 row만 줄이면 한자 토큰의 logit만 줄어든다. 한국어 토큰의 절대 logit은 보존된다.
        </p>
        <p className="leading-7">
          이게 왜 중요한가.<br />
          fine-tuning은 모든 파라미터를 동시에 움직인다. 한국어 표현을 학습하다가 영어 reasoning이 망가질 수 있다.<br />
          row 단위 스케일링은 부작용이 row 하나에 갇힌다. 다른 능력을 건드릴 경로가 구조적으로 차단된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">한자 토큰 ID 수집 — vocab 한 번 순회</h3>
        <p className="leading-7">
          첫 단계는 어떤 row를 손댈지 결정하는 것이다.<br />
          tokenizer.get_vocab()을 돌면서 각 토큰 문자열을 디코딩한다. 그 안에 U+4E00~9FFF 범위 문자가 포함되면 "한자 토큰"으로 분류한다.
        </p>
        <p className="leading-7">
          BBPE(Byte-level BPE) 토크나이저는 일부 토큰이 바이트 조각이라 단순 비교가 안 된다.<br />
          하지만 Smoothie-Qwen은 디코딩 후 검사하므로 바이트 조각도 정상적으로 분류된다.<br />
          결과: Qwen3 vocab 152K 중 약 2~3만 개가 한자 토큰. 전체의 15~20%.
        </p>
        <p className="leading-7">
          이 분류 단계에서 흥미로운 디테일 하나 — 한 토큰 안에 한자와 한글이 섞인 케이스가 있다.<br />
          예를 들어 BBPE 병합 결과 "한자漢" 같은 토큰이 vocab에 들어 있을 수 있다.<br />
          이런 토큰을 어떻게 처리하느냐가 다음 단계 "purity" 개념의 출발점이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스케일링 곡선 — purity와 smoothness</h3>
        <p className="leading-7">
          모든 한자 토큰을 똑같이 절반으로 줄이면 거친 cutoff가 생긴다.<br />
          경계 토큰 — 한자가 한 글자만 섞인 토큰 — 도 똑같이 강하게 줄이면 자연스러운 한국어 표현이 손상될 수 있다.<br />
          그래서 Smoothie-Qwen은 토큰 안 한자 비율(purity)에 따라 스케일을 부드럽게 변화시킨다.
        </p>
        <p className="leading-7">
          공식은 시그모이드 한 줄이다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          α(p) = min_scale + (1 − min_scale) · σ(−smoothness · (p − 0.5))
        </pre>
        <p className="leading-7">
          여기서 <code>p</code>는 토큰의 한자 purity, <code>α</code>는 그 토큰 row에 곱할 스케일이다.<br />
          <strong>min_scale</strong>은 최대로 깎였을 때 도달하는 바닥값 (권장 0.5).<br />
          <strong>smoothness</strong>는 시그모이드의 가파름 (권장 10.0).
        </p>
        <p className="leading-7">
          곡선의 형태:<br />
          순한국어 토큰 (p≈0) → α≈1, 거의 손대지 않음.<br />
          순한자 토큰 (p≈1) → α=0.5, 절반으로 축소.<br />
          경계 토큰 (p=0.5 부근) → 시그모이드의 부드러운 전이 구간.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>왜 곡선인가</strong> — 단순 binary 컷오프 (한자 토큰은 무조건 0.5)는 경계에서 두 가지 문제를 만든다.<br />
          (1) "한자가 한 글자만 섞인" 한국 단어 표기 토큰까지 강하게 깎임 → 자연스러운 한국어 표현 손상.<br />
          (2) 같은 의미의 토큰이 토크나이저 분할에 따라 강하게/약하게 깎이는 비대칭 → 출력 일관성 저하.<br />
          smoothness 파라미터로 전이 구간을 부드럽게 만들면 두 문제가 동시에 완화된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">한 줄짜리 weight 변환</h3>
        <p className="leading-7">
          α를 정했으면 적용은 한 줄이다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`for t in cjk_token_ids:
    W[t, :] *= alpha[t]`}
        </pre>
        <p className="leading-7">
          linear 연산이라 logit이 정확히 비례 축소된다.<br />
          <code>z_new[t] = (α · W[t]) · h = α · z_old[t]</code>.<br />
          α &lt; 1 이면 z[t]가 작아지고, softmax에서 그 토큰의 확률이 줄어든다.
        </p>
        <p className="leading-7">
          중요한 건 다른 토큰의 logit은 손대지 않는다는 점이다.<br />
          한국어 토큰의 절대 logit은 변환 전과 정확히 같다 — bias도 없고 hidden state도 그대로다.<br />
          그런데도 softmax 분포에서 한국어 토큰의 확률은 올라간다. 어떻게?
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">분포가 어떻게 뒤집히는가</h3>
        <p className="leading-7">
          softmax는 분자/분모 구조다. 분모는 모든 토큰의 exp(logit) 합이다.<br />
          한자 토큰의 logit이 일괄로 낮아지면 exp(z[한자])들이 작아지고, 분모 자체가 작아진다.<br />
          한국어 토큰의 분자 exp(z[한국어])는 그대로인데 분모만 작아지므로 — 확률이 자동으로 올라간다.
        </p>
        <p className="leading-7">
          구체적인 수치로 보자.<br />
          가드 전: P(分析)=0.55, P(분석)=0.30, 격차 0.25.<br />
          α=0.5 적용 후: P(分析)=0.32, P(분석)=0.42. 격차 0.10, 부호가 뒤집혔다.
        </p>
        <p className="leading-7">
          prompt 한 줄로는 절대 못 건드렸던 0.1 logit 격차를, weight 한 번 만져서 끝낸다.<br />
          이게 "입력단보다 출력단에 가까운 해법이 더 강력하다"는 명제의 가장 깔끔한 사례다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 일반 태스크 정확도는 거의 보존되는가</h3>
        <p className="leading-7">
          여기서 자연스럽게 따라오는 의문 — "한자 logit을 깎으면 중국어 능력은 망가지지 않나? 다른 reasoning에는 영향 없나?"<br />
          답은 영향이 미미하다는 것인데, 그 이유가 흥미롭다.
        </p>
        <p className="leading-7">
          첫째, 한자 토큰만 손대므로 한국어/영어/코드 토큰의 분포는 그대로 살아 있다.<br />
          MMLU(영어 reasoning), HumanEval(코드)는 한자를 거의 안 쓰므로 영향이 없다.<br />
          KMMLU(한국어 reasoning)는 오히려 leakage가 줄어 가독성이 개선되는 효과까지 있다.
        </p>
        <p className="leading-7">
          둘째, α를 너무 낮추지 않는 게 핵심이다. min_scale=0.5는 "한자를 못 쓰게" 만드는 게 아니라 "한국어와 동등한 경쟁자로 끌어내리는" 수준이다.<br />
          중국어 컨텍스트가 입력으로 들어오면 hidden state h가 한자 친화적으로 형성되고, 그 h는 α가 적용된 W[한자, :]에 대해서도 충분히 큰 inner product를 만든다.<br />
          즉 중국어 입력에는 여전히 중국어 출력이 나온다.
        </p>
        <p className="leading-7">
          저자 보고에 따르면 min_scale=0.5, smoothness=10.0 조합에서 의도치 않은 중국어 생성 95%+ 감소, 일반 태스크 정확도 손실 평균 2~3% 이내.<br />
          비대칭적으로 좋은 trade — 잃는 게 거의 없고 얻는 게 매우 크다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">하이퍼파라미터를 더 만지면 어떻게 되는가</h3>
        <p className="leading-7">
          min_scale을 더 낮추면 (예: 0.2) 한자 leakage가 거의 0에 가까워진다.<br />
          하지만 일반 태스크 정확도 손실이 5%를 넘기 시작한다. 한자 토큰이 정상적으로 등장해야 할 자리(중국어 입력, 고유명사)도 망가진다.
        </p>
        <p className="leading-7">
          smoothness를 낮추면 (예: 3.0) 전이 구간이 넓어져서 경계 토큰이 더 부드럽게 처리된다.<br />
          반대로 높이면 (예: 20.0) 거의 binary cutoff에 가까워져서 leakage 제거 효과는 강해지지만 경계 토큰 손상이 커진다.
        </p>
        <p className="leading-7">
          저자가 권장하는 0.5 / 10.0 조합은 sweet spot이다.<br />
          더 손대지 않고 그대로 쓰는 게 가장 안전하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">배포 — 변환된 모델을 그대로 받기</h3>
        <p className="leading-7">
          좋은 소식: 직접 변환할 필요가 없다.<br />
          dnotitia가 변환을 끝낸 모델을 Hugging Face에 올려뒀다. 모델 이름만 바꾸면 끝이다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`# 기존
model_name = "Qwen/Qwen3-8B"

# 교체
model_name = "dnotitia/Smoothie-Qwen3-8B"`}
        </pre>
        <p className="leading-7">
          지원 사이즈는 거의 전체다.<br />
          Qwen3: 0.6B / 1.7B / 4B / 8B / 14B / 32B / 235B.<br />
          Qwen2.5: 0.5B ~ 72B 전 사이즈.<br />
          라이선스는 Apache 2.0 — 상용 사용 가능.
        </p>
        <p className="leading-7">
          자체 변환이 필요한 경우(파인튜닝된 커스텀 모델 등)는 smoothie-qwen 패키지를 쓰면 함수 한 번 호출로 변환된다.<br />
          GPU 한 장에서 몇 분이면 끝난다 — lm_head 행렬 한 장만 만지므로 메모리도 적게 든다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>실전 권장</strong> — 한국어 에이전트로 Qwen을 쓰고 있다면, 우선 Smoothie-Qwen 변형으로 갈아끼우는 것부터 해보자.<br />
          코드 변경: 모델 이름 한 줄. 비용: 0. 효과: 한자 leakage 95%+ 감소.<br />
          이걸 해본 다음에도 남는 leakage(주로 reasoning 깊숙한 곳)가 있다면, 그때 RL이나 런타임 가드를 검토하면 된다.<br />
          순서를 거꾸로 가면 — 프롬프트 → 런타임 가드 → 결국 Smoothie — 그 사이의 며칠을 그냥 잃는다.
        </p>
      </div>
    </section>
  );
}
