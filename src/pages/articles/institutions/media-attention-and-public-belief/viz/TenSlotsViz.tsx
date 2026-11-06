import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { FlowArrow, FlowLine, FlowNode } from "./Flow";
import SceneShell from "./SceneShell";

/** 본문 대응: #source — 같은 10칸을 채우는 두 방법(가정)과 DSA 제33·38조의 4,500만 명 경계, 법이 정하지 않는 것. */
const SCENES = [
  { label: "기록으로 채웁니다", summary: "프로파일링 (가정 사례)", note: "프로파일링은 개인정보로 그 사람의 관심·행동 등을 평가하거나 예측하는 자동 처리입니다(GDPR 제4조 4호)." },
  { label: "기록 없이 채웁니다", summary: "최신순 (가정 사례)", note: "같은 10칸이지만 이 사람의 기록을 쓰지 않습니다. 최신순은 그런 방법의 한 예로 놓았습니다." },
  { label: "누구에게 요구할까요", summary: "EU 월평균 활성 이용자 4,500만 명", note: "이 수 이상이어서 지정된 초대형 온라인 플랫폼·검색엔진이 대상입니다(2026-10-09 원문 확인). 적용 대상과 예외, 관할은 먼저 확인합니다." },
  { label: "고를 수 있어도 남는 것", summary: "방식은 선택, 내용은 미정", note: "이용자는 10칸을 채우는 방식을 고를 수 있게 됩니다. 어떤 게시물을 보여 줄지, 게시물이 참인지는 이 규칙이 정해 주지 않습니다." },
] as const;

function Card({ heading, tone, lines }: { heading: string; tone: "accent" | "muted"; lines: readonly string[] }) {
  return (
    <div className={`min-w-0 flex-1 rounded-lg border px-3 py-3 ${tone === "accent" ? "border-primary bg-primary/5" : "border-dashed border-border"}`}>
      <p className={`text-sm font-bold leading-5 ${tone === "accent" ? "text-primary" : "text-muted-foreground"}`}>{heading}</p>
      <ul className="mt-2 space-y-1 text-sm leading-6">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default function TenSlotsViz() {
  return (
    <SceneShell
      eyebrow="EU 디지털서비스법"
      title="같은 10칸을 채우는 방법과 그 선택권의 범위"
      description="10칸과 두 방법은 설명을 위한 가정이며, 법 내용은 EU 디지털서비스법 기준입니다."
      ariaLabel="프로파일링과 비프로파일링 추천, 선택지 의무의 대상과 한계"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <FlowLine key="profile">
              <FlowNode title="지난주 본 영상 기록" />
              <FlowArrow />
              <FlowNode title="관심사 추정 · 순서 결정" />
              <FlowArrow />
              <FlowNode title="화면 10칸" tone="accent" />
            </FlowLine>,
            <FlowLine key="latest">
              <FlowNode title="개인 기록 쓰지 않음" tone="muted" />
              <FlowArrow />
              <FlowNode title="최신순 정렬" />
              <FlowArrow />
              <FlowNode title="화면 10칸" tone="accent" />
            </FlowLine>,
            <div key="threshold" className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Card heading="4,500만 명 이상 · 지정됨 (제33·38조)" tone="accent" lines={["추천 시스템마다 프로파일링에 기반하지 않은 선택지를 적어도 하나"]} />
              <Card heading="그렇게 지정되지 않은 서비스" tone="muted" lines={["제38조의 이 선택지 요구 대상에 들지 않음", "제27조 대상인지는 따로 확인"]} />
            </div>,
            <div key="scope" className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <Card heading="규칙이 요구하는 것" tone="accent" lines={["주요 기준 설명(제27조)", "비프로파일링 선택지(제38조)"]} />
              <Card heading="규칙이 대신하지 않는 것" tone="muted" lines={["어떤 게시물을 보여 줄지", "모든 게시물의 진위 보증"]} />
            </div>,
          ]}
        />
      )}
    />
  );
}
