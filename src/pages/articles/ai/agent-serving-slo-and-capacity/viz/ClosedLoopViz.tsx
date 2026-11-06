import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: measure 절의 닫힌 루프 — 응답을 받고, 기록된 대기만큼 쉬고, 도구 결과 크기의 텍스트를 붙여 다음 요청.
 * 조각 길이는 그림용 가정(시작 문맥 40, 응답 8, 도구 결과 14)이며 측정값이 아니다.
 * 요청 1 = 40, 요청 2 = 62, 요청 3 = 84.
 */
const BASE = 40;
const REPLY = 8;
const TOOL = 14;
const FULL = BASE + 2 * (REPLY + TOOL) + REPLY;

const SCENES = [
  { label: "요청 1", summary: "문맥을 보내고 응답을 받음", note: "세션은 첫 문맥을 보내고 답을 받습니다. 답이 끝나기 전에는 다음 요청을 보내지 않으므로 서버가 느려지면 세션도 함께 늦어집니다." },
  { label: "기다린 뒤 붙이기", summary: "기록된 대기 → 도구 결과 크기 텍스트", note: "기록에 남은 대기만큼 쉰 뒤 도구 결과 크기의 텍스트를 만듭니다. 기록에는 토큰 수만 있어 내용은 의미 없는 단어열입니다." },
  { label: "요청 2", summary: "앞 턴의 실제 응답이 문맥에 들어감", note: "앞 턴의 실제 응답과 도구 결과가 다음 요청에 붙어 문맥이 진짜로 자랍니다. 이것을 되풀이하면 턴마다 입력이 길어집니다." },
  { label: "요청 3과 서버", summary: "앞부분 기록이 남았나, 지워졌나", note: "앞부분 기록이 서버에 남아 있으면 새로 붙은 도구 결과만 계산하고, 지워졌다면 문맥 전체를 다시 읽습니다. 문맥이 실제로 자라기 때문에 앞부분을 재사용하는 접두 캐시와 KV 한계가 결과에 그대로 드러납니다." },
] as const;

function Segment({ width, color, children, show = true }: { width: number; color: string; children?: ReactNode; show?: boolean }) {
  return (
    <span
      className="flex h-full items-center justify-center overflow-hidden text-[11px] font-semibold text-white"
      style={{ width: `${(width / FULL) * 100}%`, backgroundColor: show ? color : "transparent" }}
    >
      {show ? children : null}
    </span>
  );
}

function Row({ label, children, muted = false }: { label: string; children: ReactNode; muted?: boolean }) {
  return (
    <div className={`grid grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-2 text-xs ${muted ? "invisible" : ""}`}>
      <span className="font-semibold">{label}</span>
      <div className="flex h-7 min-w-0 rounded-sm bg-muted/40">{children}</div>
    </div>
  );
}

const CONTEXT = "#64748b";
const REPLY_COLOR = "#2563eb";
const TOOL_COLOR = "#b45309";
const REUSE = "#64748b";
const NEW = "#0f766e";

export default function ClosedLoopViz() {
  return (
    <SceneShell
      eyebrow="닫힌 루프"
      title="응답을 받아야 다음 요청이 나가고 그 응답이 문맥을 키웁니다"
      description="회색 조각이 서버로 보낸 입력, 파란 조각이 받은 응답, 주황 조각이 다음 요청 전에 붙인 도구 결과입니다."
      note="조각 길이는 그림용 가정이며 측정값이 아닙니다. 실제 스모크 시험에서는 프롬프트가 턴마다 1,571에서 1,808토큰으로 자랐습니다."
      ariaLabel="닫힌 루프 재생에서 요청이 턴마다 길어지는 과정과 앞부분 기록의 재사용"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          <Row label="요청 1">
            <Segment width={BASE} color={CONTEXT}>문맥</Segment>
            <Segment width={REPLY} color={REPLY_COLOR} show={active >= 0}>답</Segment>
            <Segment width={TOOL} color={TOOL_COLOR} show={active >= 1}>도구</Segment>
          </Row>
          <Row label="요청 2" muted={active < 2}>
            <Segment width={BASE + REPLY + TOOL} color={CONTEXT}>앞 턴까지</Segment>
            <Segment width={REPLY} color={REPLY_COLOR} show={active >= 3}>답</Segment>
            <Segment width={TOOL} color={TOOL_COLOR} show={active >= 3}>도구</Segment>
          </Row>
          <div className={`pt-3 text-xs font-bold ${active === 3 ? "" : "invisible"}`}>요청 3에서 서버가 계산하는 부분</div>
          <Row label="기록 남음" muted={active < 3}>
            <Segment width={BASE + 2 * REPLY + TOOL} color={REUSE}>앞부분 재사용</Segment>
            <Segment width={TOOL} color={NEW}>새로</Segment>
          </Row>
          <Row label="기록 지워짐" muted={active < 3}>
            <Segment width={BASE + 2 * (REPLY + TOOL)} color={NEW}>전체를 새로 계산</Segment>
          </Row>
        </div>
      )}
    />
  );
}
