import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 상담원용 고객 문의 요약. 네 질문을 채우면 판정 가능한 계약이 되고,
 * schema validator는 field·type을, 인용 검사는 실제 span 존재를 판정한다.
 * 출력 값은 판정을 보이기 위한 가정이다.
 */
const SCENES = [
  { label: "빈칸인 요청", summary: "“이 문서를 잘 요약해 줘”", note: "사람은 뜻을 짐작할 수 있어도 model과 downstream program에는 완료 기준이 없습니다. 네 질문이 비어 있습니다." },
  { label: "채운 계약", summary: "상담원용 고객 문의 요약", note: "같은 요약 요청을 네 질문으로 채웠습니다. 이제 출력을 통과시킬지 판정할 수 있습니다." },
  { label: "둘 다 통과", summary: "schema ✓ · 인용 ✓", note: "세 field가 있고, 인용한 문장이 원문에 실제로 있습니다." },
  { label: "field가 빠진 출력", summary: "schema ✗ · 인용 ✓", note: "인용은 원문에 있지만 urgency field가 없어 schema validator에서 걸립니다." },
  { label: "원문에 없는 인용", summary: "schema ✓ · 인용 ✗", note: "형식이 맞아 schema는 통과하지만 인용한 문장이 원문에 없어 인용 검사에서 걸립니다. schema 통과는 형식 판정입니다." },
  { label: "근거가 없을 때", summary: "추측 대신 unknown", note: "근거가 없으면 추측해서 채우지 않고 unknown을 반환합니다. 이때의 검사 결과는 글에 없어 비워 두었습니다." },
] as const;

const ROWS = [
  { q: "누구를 위해 무엇을 바꾸나", a: "상담원이 고객 문의를 30초 안에 파악" },
  { q: "무엇을 읽고 판단하나", a: "문의 원문만 evidence로 사용" },
  { q: "어디서 멈추거나 거부하나", a: "근거가 없으면 unknown 반환" },
  { q: "무엇을 내고 누가 통과시키나", a: "issue·urgency·근거 인용 / schema validator·인용 검사" },
] as const;

type Mark = "pass" | "fail" | "skip";
const QUOTED = "“환불이 아직 안 됐어요”";
const CASES = [
  { source: QUOTED, fields: [["issue", "환불 지연"], ["urgency", "높음"], ["근거 인용", "“환불이 아직 안 됐어요”"]], schema: "pass", span: "pass" },
  { source: QUOTED, fields: [["issue", "환불 지연"], ["urgency", "(없음)"], ["근거 인용", "“환불이 아직 안 됐어요”"]], schema: "fail", span: "pass" },
  { source: QUOTED, fields: [["issue", "환불 지연"], ["urgency", "높음"], ["근거 인용", "“환불을 두 번 요청했어요”"]], schema: "pass", span: "fail" },
  { source: "판단할 근거가 없는 문의", fields: [["issue", "unknown"], ["urgency", "unknown"], ["근거 인용", "unknown"]], schema: "skip", span: "skip" },
] as const satisfies readonly { source: string; fields: readonly (readonly [string, string])[]; schema: Mark; span: Mark }[];

const MARK_TEXT: Record<Mark, string> = { pass: "통과", fail: "걸림", skip: "−" };
const MARK_COLOR: Record<Mark, string> = { pass: "#16a34a", fail: "#dc2626", skip: "#94a3b8" };

function Questions({ filled }: { filled: boolean }) {
  return (
    <div className="min-w-0 divide-y divide-border border-y border-border">
      {ROWS.map((row) => (
        <div key={row.q} className="py-2">
          <p className="break-keep text-xs leading-5 text-muted-foreground">{row.q}</p>
          <p className={`break-keep text-sm font-semibold leading-5 ${filled ? "" : "text-muted-foreground/60"}`}>{filled ? row.a : "?"}</p>
        </div>
      ))}
    </div>
  );
}

function Gate({ name, what, mark }: { name: string; what: string; mark: Mark }) {
  return (
    <div className="min-w-0 rounded-lg border px-3 py-2" style={{ borderColor: MARK_COLOR[mark] }}>
      <strong className="block text-xs leading-5 sm:text-sm">{name}</strong>
      <span className="block break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs">{what}</span>
      <strong className="mt-1 block text-sm" style={{ color: MARK_COLOR[mark] }}>{MARK_TEXT[mark]}</strong>
    </div>
  );
}

function Output({ item }: { item: (typeof CASES)[number] }) {
  return (
    <div className="min-w-0">
      <p className="break-keep text-xs leading-5 text-muted-foreground">문의 원문(가정): {item.source}</p>
      <div className="mt-2 divide-y divide-border rounded-lg border border-border px-3">
        {item.fields.map(([field, value]) => (
          <div key={field} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 py-1.5 text-xs leading-5 sm:text-sm">
            <span className="font-mono text-muted-foreground">{field}</span>
            <span className="break-keep font-semibold">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Gate name="Schema validator" what="field와 type" mark={item.schema} />
        <Gate name="인용 검사" what="실제 span 존재" mark={item.span} />
      </div>
    </div>
  );
}

export default function RequestGateViz() {
  return (
    <SceneShell
      eyebrow="계약과 판정"
      title="빈칸을 채운 요청은 출력을 통과시킬지 판정할 수 있습니다"
      description="글의 상담원용 문의 요약 예를 따라갑니다. 출력 네 개는 판정을 보이려고 만든 예입니다(가정)."
      ariaLabel="빈칸 요청을 계약으로 채우고 출력 네 가지를 두 검사로 판정하는 여섯 장면"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <Questions key="q0" filled={false} />,
            <Questions key="q1" filled />,
            ...CASES.map((item) => <Output key={item.source + item.fields[1][1] + item.fields[2][1]} item={item} />),
          ]}
        />
      )}
    />
  );
}
