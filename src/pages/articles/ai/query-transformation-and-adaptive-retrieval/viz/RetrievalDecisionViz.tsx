import VizFrame from "@/components/viz/VizFrame";

const TRANSFORMATIONS = [
  {
    failure: "대상이 생략됨",
    signal: "‘그거’만 남음",
    action: "문장 다시 쓰기",
    result: "XR-17B 앱 로그인 유지",
    selected: true,
  },
  {
    failure: "표현이 한 가지뿐",
    signal: "후보가 계속 겹침",
    action: "여러 표현으로 확장",
    result: "후보 합집합",
    selected: false,
  },
  {
    failure: "요구가 둘 이상",
    signal: "설정 + 보안",
    action: "질문 나누기",
    result: "q-732a · q-732b",
    selected: true,
  },
  {
    failure: "답과 비슷한 표현이 필요",
    signal: "관련성 표본 없음",
    action: "가상 답변 생성",
    result: "HyDE 검색 벡터",
    selected: false,
  },
  {
    failure: "일반 원리가 빠짐",
    signal: "구체 조건만 반복",
    action: "한 단계 물러서기",
    result: "상위 원리 + 원 질문",
    selected: false,
  },
] as const;

export function TransformationChoiceViz() {
  return (
    <VizFrame
      eyebrow="누락 원인 → 변환 선택"
      title="방법을 전부 실행하지 않고 첫 실패가 가리키는 변환만 고릅니다"
      description="같은 q-732라도 무엇이 빠졌는지에 따라 질문을 바꾸는 방식이 달라집니다."
      note="강조한 두 줄이 이번 설명용 요청에서 실제로 선택한 경로입니다. 나머지는 서로 대체하거나 조합할 수 있는 후보이지 필수 파이프라인이 아닙니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div data-viz-canvas className="border-y border-border/70">
        <div className="hidden grid-cols-[1fr_1fr_1fr_1.15fr] gap-px bg-border text-[10px] font-bold text-muted-foreground sm:grid">
          {["관찰한 실패", "확인 신호", "바꿀 것", "새 검색 입력"].map((label) => (
            <span key={label} className="bg-background px-3 py-2">
              {label}
            </span>
          ))}
        </div>
        {TRANSFORMATIONS.map((item) => (
          <div
            key={item.failure}
            className={`grid gap-px border-b border-border/70 last:border-b-0 sm:grid-cols-[1fr_1fr_1fr_1.15fr] ${
              item.selected ? "bg-primary/35" : "bg-border"
            }`}
          >
            {[
              ["실패", item.failure],
              ["신호", item.signal],
              ["변환", item.action],
              ["출력", item.result],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`min-w-0 bg-background px-3 py-3 text-xs leading-5 ${
                  item.selected && index === 2
                    ? "font-bold text-primary"
                    : index === 0
                      ? "font-bold text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                <span className="mr-2 text-[9px] font-bold text-muted-foreground sm:hidden">
                  {label}
                </span>
                <span className="break-keep">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

export function DecisionOwnerViz() {
  return (
    <VizFrame
      eyebrow="판정 위치 · 두 대안"
      title="Self-RAG와 CRAG는 같은 판정을 같은 곳에서 수행하지 않습니다"
      description="하나는 학습된 생성 모델의 토큰 예측이 검색과 근거 사용을 제어하고, 다른 하나는 검색 뒤의 별도 평가기가 교정 동작을 고릅니다."
      note="두 방법을 한 요청 경로에 반드시 겹쳐 놓는다는 뜻이 아닙니다. 같은 상태를 둘이 동시에 바꾸지 않도록 실험에서 판정 주체 하나를 정해야 합니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div data-viz-canvas className="border-y border-border/70 px-4 py-5 sm:px-6">
        <div className="mx-auto max-w-xl border border-foreground/35 px-4 py-3 text-center">
          <p className="font-mono text-[10px] font-bold text-muted-foreground">
            q-732 · 생성할 다음 문장
          </p>
          <p className="mt-1 text-sm font-bold">검색할지, 어떤 근거를 쓸지 판정</p>
        </div>

        <div className="grid grid-cols-2 gap-6 py-3 text-center text-primary" aria-hidden>
          <span>↙</span>
          <span>↘</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="border border-primary/45 px-4 py-4">
            <p className="text-[10px] font-black text-primary">대안 A · 모델 내부</p>
            <h3 className="mt-2 text-base font-bold">Self-RAG</h3>
            <ol className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
              <li>1. Retrieve 토큰이 검색 필요 여부를 예측합니다.</li>
              <li>2. IsRel·IsSup가 근거와 생성문을 평가합니다.</li>
              <li>3. IsUse가 응답의 유용성을 평가합니다.</li>
            </ol>
            <p className="mt-3 border-t border-border pt-3 text-xs font-semibold">
              별도 학습된 생성 모델이 필요합니다.
            </p>
          </section>

          <section className="border border-primary/45 px-4 py-4">
            <p className="text-[10px] font-black text-primary">대안 B · 검색 뒤 외부</p>
            <h3 className="mt-2 text-base font-bold">CRAG</h3>
            <ol className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
              <li>1. 별도 평가기가 검색 문서의 신뢰도를 냅니다.</li>
              <li>2. 임계값이 정제·외부 검색·둘 다를 고릅니다.</li>
              <li>3. 교정된 근거를 생성 모델에 넘깁니다.</li>
            </ol>
            <p className="mt-3 border-t border-border pt-3 text-xs font-semibold">
              기존 RAG 앞뒤에 붙일 수 있지만 평가기도 운영해야 합니다.
            </p>
          </section>
        </div>
      </div>
    </VizFrame>
  );
}

export function CragThresholdViz() {
  return (
    <VizFrame
      eyebrow="검색 결과의 세 구간"
      title="가장 높은 문서 신뢰도가 두 임계값 사이 어디에 놓이는지 봅니다"
      description="CRAG의 교정 동작은 점수 크기 자체보다 하한과 상한을 넘었는지에 따라 달라집니다."
      note="0.35·0.72·0.55와 임계값 0.40·0.70은 구간을 보여 주는 가정입니다. CRAG 논문의 실제 임계값이나 대상 환경의 측정값이 아닙니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div data-viz-canvas className="border-y border-border/70 px-4 py-5 sm:px-6">
        <div className="grid gap-px bg-border sm:grid-cols-3">
          <div className="bg-background px-4 py-4">
            <p className="text-[10px] font-bold text-muted-foreground">0.00–0.39</p>
            <p className="mt-1 text-sm font-bold">부정확</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              모든 문서가 하한보다 낮으므로 외부 검색으로 교체합니다.
            </p>
          </div>
          <div className="bg-primary/10 px-4 py-4">
            <p className="text-[10px] font-bold text-primary">0.40–0.70</p>
            <p className="mt-1 text-sm font-bold">모호함 · 예시 0.55</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              내부 근거를 정제하고 외부 검색 결과도 함께 사용합니다.
            </p>
          </div>
          <div className="bg-background px-4 py-4">
            <p className="text-[10px] font-bold text-muted-foreground">0.71–1.00</p>
            <p className="mt-1 text-sm font-bold">정확</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              관련 문서가 있으므로 필요한 부분만 정제해 사용합니다.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-[10px] font-bold text-muted-foreground">
          <span>0</span>
          <div className="relative h-2 border border-border bg-background">
            <span className="absolute left-[55%] top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 border border-primary bg-primary" />
          </div>
          <span>1</span>
        </div>
      </div>
    </VizFrame>
  );
}
