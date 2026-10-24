import { Link } from "react-router-dom";

const STEPS = [
  {
    key: "boundary",
    label: "역할 경계",
    detail: "지시와 외부 자료를 서로 다른 영역으로 표시합니다.",
    href: "#overview",
  },
  {
    key: "syntax",
    label: "문법·직렬화",
    detail: "Root·중첩·escaping으로 자료가 구조를 깨지 않게 합니다.",
    href: "#basic-tags",
  },
  {
    key: "identity",
    label: "반복 자료",
    detail: "문서와 예시에 안정된 ID를 붙여 순서 의존성을 없앱니다.",
    href: "#advanced-tags",
  },
  {
    key: "validation",
    label: "출력 검증",
    detail: "문법·스키마·업무 규칙·권한을 서로 다른 단계에서 판정합니다.",
    href: "#parsing",
  },
  {
    key: "selection",
    label: "형식 선택",
    detail: "같은 요청으로 XML과 대안 형식의 품질·비용을 비교합니다.",
    href: "#best-practices",
  },
] as const;

export function XmlPromptPathLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="XML 요청 경로에서 현재 글의 위치"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/ai" className="hover:text-primary">인공지능</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/ai/prompt-engineering#overview" className="hover:text-primary">Prompt 요청 설계</Link>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">XML 요청 계약</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">
            XML 태그는 어디까지 책임지고, 무엇을 parser와 runtime에 넘겨야 합니까?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link
            to="/cs/ai/prompt-engineering#overview"
            className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary"
          >
            목표·근거·출력 조건을 정하는 Prompt 요청 계약 ↗
          </Link>
        </div>
      </div>

      <div
        className="mt-5 grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-5"
        aria-label="XML 요청을 경계 표시부터 형식 선택까지 따라가는 다섯 단계"
      >
        {STEPS.map((step, index) => (
          <a key={step.key} href={step.href} className="min-w-0 bg-background px-3 py-3 hover:text-primary">
            <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-1 block break-keep text-xs leading-5">{step.label}</strong>
            <span className="mt-1 hidden break-keep text-[10px] leading-4 text-muted-foreground md:block">{step.detail}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function XmlPromptPathMapReturn() {
  return (
    <aside
      id="xml-prompt-path-return"
      className="not-prose my-8 border-y border-border py-5"
      aria-label="확인한 사실을 XML 요청 지도에 되돌려 놓기"
    >
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        XML 태그는 지시·자료·예시의 경계를 보이게 하지만 권한을 만들지는 않습니다. 동적 자료는 serializer로 넣고, 모델 출력은 문법·스키마·업무 규칙·권한을 모두 통과한 뒤에만 실행에 사용합니다.
      </p>
      <Link
        to="/cs/ai/context-engineering"
        className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary"
      >
        다음 묶음 · Context engineering으로 이동 →
      </Link>
    </aside>
  );
}
