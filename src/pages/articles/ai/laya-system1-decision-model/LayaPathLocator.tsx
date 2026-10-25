import { Link } from "react-router-dom";

const PATH = [
  { label: "질문 정의", detail: "choice·score·noul로 답의 모양을 정함", href: "#black-box" },
  { label: "Checkpoint", detail: "언어와 명시적 설정으로 실행할 모델을 고름", href: "#router" },
  { label: "입력 시퀀스", detail: "질문마다 선택지 marker와 같은 상태를 붙임", href: "#sequence" },
  { label: "확률 계산", detail: "marker 점수를 질문 안에서 softmax", href: "#why-markers" },
  { label: "보정과 경계", detail: "확률을 다시 맞추고 쓸 수 있는 범위를 확인", href: "#calibration" },
] as const;

export default function LayaPathLocator() {
  return (
    <aside className="not-prose mb-8 border-y border-border py-4 sm:py-5" aria-label="LLM 응용 학습 지도에서 Laya 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/llm-gateway-and-model-routing#model-cascade" className="hover:text-primary">
          모델 선택과 단계적 처리
        </Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">Laya 결정 경로</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="min-w-0">
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            글을 생성하지 않고 한 문의에 여러 확률 결정을 내리려면, 입력과 출력은 어떻게 바뀔까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to="/cs/ai/llm-gateway-and-model-routing#model-cascade" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            LLM gateway와 모델 선택 ↗
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5" aria-label="Laya 결정 경로의 다섯 구간">
        {PATH.map((item, index) => (
          <a key={item.label} href={item.href} className="min-w-0 bg-background px-3 py-3 text-muted-foreground hover:text-primary">
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5 text-foreground">{item.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 md:block">{item.detail}</span>
          </a>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-2" aria-label="같은 LLM 응용 개념 흐름의 이전 글과 다음 글">
        <Link to="/cs/ai/llm-gateway-and-model-routing#model-cascade" className="min-w-0 border-b border-border py-2 text-left text-xs leading-5 hover:border-primary hover:text-primary">
          <span className="block text-[10px] text-muted-foreground">← 이전</span>
          <strong className="block break-keep">Gateway의 모델 선택</strong>
        </Link>
        <Link to="/cs/ai/rate-limiting-and-reliability-patterns#retry-backoff" className="min-w-0 border-b border-border py-2 text-right text-xs leading-5 hover:border-primary hover:text-primary">
          <span className="block text-[10px] text-muted-foreground">다음 →</span>
          <strong className="block break-keep">요청을 지키는 신뢰성 장치</strong>
        </Link>
      </div>
    </aside>
  );
}
export function LayaPathReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="Laya에서 확인한 사실을 모델 선택 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        Laya Router는 실행할 Laya checkpoint를 고르고, decision head는 그 checkpoint 안에서 선택지 확률을 냅니다. 이 확률로 어느 LLM을 호출하거나 사람에게 넘길지는 상위 Gateway 정책의 별도 결정입니다.
      </p>
      <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">
        따라서 checkpoint 선택 근거, 모델 확률, 업무 행동을 한 값으로 합치지 않아야 각 단계의 오류와 보정 범위를 따로 확인할 수 있습니다.
      </p>
      <Link to="/cs/ai/llm-gateway-and-model-routing#model-cascade" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
        모델 선택과 단계적 처리로 돌아가기 ↗
      </Link>
    </aside>
  );
}
