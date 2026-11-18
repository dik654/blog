import SceneShell from "./SceneShell";

/**
 * 본문 대응: #components 되돌리기 문단과 v2.8.1 릴리스 사례.
 * 실행 파일과 저장소 형식의 짝으로 "복구"를 판정하고, 체인 일정은 따로 본다.
 * 장면 1~4의 "형식 A/B"와 바이너리 이름은 가정, 장면 5는 본문이 인용한 v2.8.1 릴리스 노트 내용이다.
 */
type Mark = "ok" | "bad" | "na";

interface Row {
  value: string;
  mark: Mark;
}

interface SceneDef {
  label: string;
  short: string;
  summary: string;
  note: string;
  binary: Row;
  storage: Row;
  chain: Row;
  kept: string;
}

const MARK_TEXT: Record<Mark, string> = { ok: "맞음", bad: "어긋남", na: "이 예에서 안 봄" };
const MARK_COLOR: Record<Mark, string> = { ok: "#10b981", bad: "#ef4444", na: "#94a3b8" };

const SCENES: readonly SceneDef[] = [
  {
    short: "전",
    label: "업그레이드 전",
    summary: "이전 바이너리 + 형식 A",
    note: "되돌리기에 필요한 네 가지(이전 바이너리, 설정 요약값, 호환되는 저장소 복사본, 저장 형식 변경 기록)를 업그레이드 전에 보관해 둡니다. 형식 A·B라는 이름은 설명용 가정입니다.",
    binary: { value: "이전 바이너리", mark: "ok" },
    storage: { value: "저장소 · 형식 A", mark: "ok" },
    chain: { value: "—", mark: "na" },
    kept: "이전 바이너리 · 설정 요약값 · 형식 A 복사본 · 변경 기록(비어 있음)",
  },
  {
    short: "업그레이드",
    label: "새 바이너리가 저장소를 바꿈",
    summary: "새 바이너리 + 형식 B",
    note: "새 바이너리가 저장소를 형식 B로 바꿨고, 이 변경은 되돌릴 수 없다고 가정합니다. 저장 형식 변경 기록에 A → B가 남습니다.",
    binary: { value: "새 바이너리", mark: "ok" },
    storage: { value: "저장소 · 형식 B (되돌릴 수 없음, 가정)", mark: "ok" },
    chain: { value: "—", mark: "na" },
    kept: "이전 바이너리 · 설정 요약값 · 형식 A 복사본 · 변경 기록 A → B",
  },
  {
    short: "파일만",
    label: "실행 파일만 되돌림",
    summary: "이전 바이너리 + 형식 B",
    note: "실행 파일만 예전 것으로 바꾸면 이전 바이너리가 만들던 형식 A와 지금 저장소의 형식 B가 짝을 이루지 않습니다. 본문은 이 방식이 복구가 아니라고 말합니다.",
    binary: { value: "이전 바이너리", mark: "ok" },
    storage: { value: "저장소 · 형식 B", mark: "bad" },
    chain: { value: "—", mark: "na" },
    kept: "형식 A 복사본을 쓰지 않음",
  },
  {
    short: "짝 맞춤",
    label: "짝을 맞춘 되돌리기",
    summary: "이전 바이너리 + 형식 A 복사본",
    note: "이전 바이너리와 함께 보관해 둔 호환 저장소 복사본과 설정 요약값을 되살려야 실행 파일과 저장 형식이 다시 짝을 이룹니다. 변경 기록은 어느 복사본이 맞는지 판단하는 근거입니다.",
    binary: { value: "이전 바이너리", mark: "ok" },
    storage: { value: "형식 A 복사본으로 교체", mark: "ok" },
    chain: { value: "—", mark: "na" },
    kept: "이전 바이너리 · 설정 요약값 · 형식 A 복사본 사용",
  },
  {
    short: "v2.8.1",
    label: "v2.8.1 → v2.8.0 (Hoodi)",
    summary: "버전은 내려가도 일정은 어긋남",
    note: "v2.8.1 릴리스 노트는 데이터베이스 변경이 없어 v2.8.0으로 내릴 수 있다고 명시합니다. 그러나 Hoodi에서는 v2.8.0 자체가 v2.8.1이 제거한 잘못된 Amsterdam 활성화 일정을 포함합니다. 저장소 짝이 맞는 것과 체인 규칙까지 안전한 것은 따로 판단합니다.",
    binary: { value: "v2.8.0으로 내림", mark: "ok" },
    storage: { value: "데이터베이스 변경 없음", mark: "ok" },
    chain: { value: "Hoodi Amsterdam 일정이 v2.8.0에 남아 있음", mark: "bad" },
    kept: "v2.8.1 릴리스 노트 · 2026-10-23",
  },
];

const ROW_LABELS: readonly string[] = ["실행 파일", "저장소 형식", "체인 일정"];

export default function RollbackPairViz() {
  return (
    <SceneShell
      eyebrow="되돌리기 · 실행 파일과 저장소의 짝"
      title="실행 파일만 예전 것으로 바꾸면 저장소와 짝이 어긋날 수 있습니다"
      description="실행 파일과 저장소 형식이 짝을 이뤄야 되돌리기가 복구이고, 체인 일정이 안전한지는 따로 판단합니다. 장면 1~4의 형식 A·B와 바이너리 이름은 가정이고, 마지막 장면은 본문이 인용한 v2.8.1 릴리스 사례입니다."
      ariaLabel="실행 파일, 저장소 형식, 체인 일정의 짝으로 되돌리기가 복구인지 판정하는 장면"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const rows: readonly Row[] = [scene.binary, scene.storage, scene.chain];
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 gap-px bg-border p-px">
              {rows.map((row, i) => (
                <div key={ROW_LABELS[i]} className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-2 bg-background px-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
                  <span className="text-[11px] font-bold text-muted-foreground">{ROW_LABELS[i]}</span>
                  <span className="min-w-0 break-keep text-sm font-bold">{row.value}</span>
                  <span
                    className="whitespace-nowrap rounded border px-2 py-0.5 text-[10px] font-bold"
                    style={{ borderColor: MARK_COLOR[row.mark], color: MARK_COLOR[row.mark] }}
                  >
                    {MARK_TEXT[row.mark]}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 break-keep border-y border-border py-2 text-xs leading-5">
              <span className="font-bold text-muted-foreground">보관·근거 · </span>
              {scene.kept}
            </p>
          </div>
        );
      }}
    />
  );
}
