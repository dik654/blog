import SceneShell from "./SceneShell";

/**
 * 본문 대응: #measurement-attestation — REPORT: REPORT_DATA·measurement·policy·reported TCB를 VCEK/VLEK collateral과 함께 평가.
 * CHECK 1~4(launch measurement·guest policy / reported·committed TCB·mitigation / REPORT_DATA challenge·recipient binding /
 * VCEK·VLEK certificate·revocation·firmware compatibility), 실패 표의 "Old reported TCB → quote signature가 맞아도 deny",
 * identityBoundary(launch identity만 뒷받침, application data·device path·availability·모든 firmware mitigation 적용 여부는 대신 못 함).
 */
type Mark = "ok" | "bad" | "wait";

type Scene = {
  label: string;
  summary: string;
  marks: readonly [Mark, Mark, Mark, Mark];
  detail: readonly [string, string, string, string];
  verdict: string;
  release: boolean;
  boundary: boolean;
  note: string;
};

const CHECKS = [
  "VCEK/VLEK 인증서·폐기 여부·firmware 호환",
  "Launch measurement · guest policy",
  "Reported TCB ≥ 최소 policy",
  "REPORT_DATA = 이번 challenge·수신자",
] as const;

const SCENES: readonly Scene[] = [
  {
    label: "서명만 확인한 상태",
    summary: "서명 맞음 · 지급 보류",
    marks: ["ok", "wait", "wait", "wait"],
    detail: ["서명 chain 확인", "아직 비교 안 함", "아직 비교 안 함", "아직 비교 안 함"],
    verdict: "Key 지급 보류",
    release: false,
    boundary: false,
    note: "VCEK/VLEK는 AMD 인증서 chain으로 확인하는 report 서명 key입니다. 서명이 맞다는 것은 이 report가 AMD 하드웨어·firmware에서 나왔다는 뜻일 뿐, 이 guest에 key를 줘도 된다는 결론은 아직 아닙니다.",
  },
  {
    label: "네 검사를 모두 통과",
    summary: "4/4 → key 지급",
    marks: ["ok", "ok", "ok", "ok"],
    detail: ["서명 chain 확인", "reference와 일치", "최소 이상", "이번 challenge·key와 일치"],
    verdict: "Key 지급",
    release: true,
    boundary: false,
    note: "Launch measurement와 guest policy가 reference와 맞고, report가 밝힌 TCB(firmware·microcode 보안 버전)가 최소 policy 이상이며, REPORT_DATA에 이번 challenge와 수신자 public key가 묶여 있을 때 지급합니다.",
  },
  {
    label: "Reported TCB가 낮음",
    summary: "서명 맞아도 deny",
    marks: ["ok", "ok", "bad", "ok"],
    detail: ["서명 chain 확인", "reference와 일치", "최소 policy 아래", "이번 challenge·key와 일치"],
    verdict: "Key 지급 0회 (deny)",
    release: false,
    boundary: false,
    note: "다른 세 칸이 모두 맞아도 reported TCB가 minimum policy 아래면 거부합니다. 서명이 맞다는 사실은 낡은 firmware에서 나온 report도 똑같이 만족합니다.",
  },
  {
    label: "REPORT_DATA가 이번 challenge와 다름",
    summary: "binding 불일치 → deny",
    marks: ["ok", "ok", "ok", "bad"],
    detail: ["서명 chain 확인", "reference와 일치", "최소 이상", "다른 challenge용 report"],
    verdict: "Key 지급 0회 (deny)",
    release: false,
    boundary: false,
    note: "REPORT_DATA는 guest가 report에 넣어 함께 서명받는 값입니다. 여기 이번 challenge와 수신자 key가 없으면, 서명과 measurement가 맞아도 지금 이 대화의 상대라는 근거가 없어 거부합니다.",
  },
  {
    label: "통과해도 대신하지 않는 것",
    summary: "launch identity까지만",
    marks: ["ok", "ok", "ok", "ok"],
    detail: ["서명 chain 확인", "reference와 일치", "최소 이상", "이번 challenge·key와 일치"],
    verdict: "Key 지급 · 아래 항목은 별도 evidence",
    release: true,
    boundary: true,
    note: "Report measurement는 launch identity를 뒷받침합니다. 그 뒤의 application data, device path, availability와 모든 firmware mitigation 적용 여부는 이 measurement가 대신하지 않으므로 따로 확인해야 합니다.",
  },
];

const BOUNDARY = ["launch 이후 application data", "device path", "availability", "모든 firmware mitigation 적용 여부"] as const;

const MARK: Record<Mark, { text: string; cls: string }> = {
  ok: { text: "통과", cls: "text-green-700 dark:text-green-400" },
  bad: { text: "실패", cls: "text-red-700 dark:text-red-400" },
  wait: { text: "대기", cls: "text-muted-foreground" },
};

export default function ReportAppraisalViz() {
  return (
    <SceneShell
      eyebrow="Report 평가"
      title="서명이 맞는 SNP report도 네 검사 중 하나만 틀리면 key를 받지 못합니다"
      description="Verifier가 payroll key를 주기 전에 보는 네 검사입니다. 네 줄은 아래 CHECK 1~4 카드의 항목을 서명 검사부터 다시 늘어놓은 것이고, 그 아래 칸이 지급 여부입니다."
      ariaLabel="SEV-SNP attestation report의 네 검사 결과와 key 지급 여부"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="min-w-0 overflow-hidden rounded-md border border-border">
              {CHECKS.map((check, index) => {
                const mark = MARK[scene.marks[index]];
                return (
                  <div key={check} className={`grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-2 px-3 py-2 ${index > 0 ? "border-t border-border" : ""}`}>
                    <div className="min-w-0">
                      <p className="break-keep text-xs font-semibold sm:text-sm">{check}</p>
                      <p className="truncate text-[11px] text-muted-foreground sm:text-xs">{scene.detail[index]}</p>
                    </div>
                    <span className={`text-right text-xs font-bold sm:text-sm ${mark.cls}`}>{mark.text}</span>
                  </div>
                );
              })}
            </div>
            <p className={`rounded-md border px-3 py-2 text-sm font-bold ${scene.release ? "border-green-600/60 text-green-700 dark:text-green-400" : scene.marks.includes("bad") ? "border-red-600/60 text-red-700 dark:text-red-400" : "border-border text-muted-foreground"}`}>
              {scene.verdict}
            </p>
            <div className={`rounded-md border border-dashed px-3 py-2 ${scene.boundary ? "border-amber-600/70" : "border-border opacity-40"}`}>
              <p className="text-[11px] font-bold tracking-wide text-amber-700 dark:text-amber-400">Launch measurement가 대신하지 않는 것</p>
              <ul className="mt-1 grid gap-x-3 text-xs leading-5 text-muted-foreground sm:grid-cols-2">
                {BOUNDARY.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
