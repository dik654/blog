import SceneShell from "./SceneShell";

/**
 * 본문 대응: #secure-development 둘째 문단 "SAST는 source·intermediate representation에서 … DAST는 실행 중인 endpoint에 …
 * SCA는 dependency identity·version·known advisory와 license를, secret scan은 credential pattern을 다룹니다. … 결과를 한 숫자로
 * 합치지 않고 finding별 reproduction, reachability, exploit precondition과 owner를 기록합니다."
 * 왼쪽 네 칸은 글 첫머리의 급여 API pull request 하나가 가진 서로 다른 층입니다.
 */
type Layer = "source" | "deps" | "text" | "runtime";

const LAYERS: readonly { key: Layer; name: string; detail: string }[] = [
  { key: "source", name: "Source code", detail: "급여 API handler와 그 중간 표현" },
  { key: "deps", name: "Dependency 목록", detail: "가져다 쓴 library의 이름·version·license" },
  { key: "text", name: "Commit 안의 문자열", detail: "key·token·password처럼 생긴 값" },
  { key: "runtime", name: "실행 중인 endpoint", detail: "고정한 시험 환경에서 띄운 API에 보내는 요청과 응답" },
];

type Scene = {
  label: string;
  summary: string;
  note: string;
  layer: Layer | null;
  tool: string;
  reads: string;
  finds: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "SAST",
    summary: "실행하지 않고 source를 읽음",
    note: "SAST는 code를 실행하지 않고 source나 intermediate representation(분석 도구가 source를 바꿔 둔 중간 형태)을 읽어 위험한 pattern과 data flow를 찾습니다. 실행 중인 API가 실제로 어떻게 응답하는지는 보지 않습니다.",
    layer: "source",
    tool: "SAST · 정적 분석",
    reads: "Source·intermediate representation",
    finds: "위험 pattern, 입력이 어디로 흘러가는지(data flow)",
  },
  {
    label: "SCA",
    summary: "가져다 쓴 dependency를 봄",
    note: "SCA(software composition analysis)는 직접 쓴 code가 아니라 가져다 쓴 dependency의 identity·version을 알려진 advisory와 대조하고 license도 확인합니다.",
    layer: "deps",
    tool: "SCA · dependency 분석",
    reads: "Dependency identity·version",
    finds: "Known advisory, license",
  },
  {
    label: "Secret scan",
    summary: "credential처럼 생긴 문자열",
    note: "Secret scan은 commit에 섞여 들어간 credential pattern을 찾습니다. 같은 pull request라도 SAST·SCA와는 다른 층을 봅니다.",
    layer: "text",
    tool: "Secret scan",
    reads: "Commit 안의 문자열",
    finds: "Credential pattern",
  },
  {
    label: "DAST",
    summary: "실행 중인 endpoint에 입력",
    note: "DAST는 source를 읽지 않고 실행 중인 endpoint에 입력을 보내 관측 가능한 동작을 봅니다. 앞의 세 검사와 달리 결과는 code를 실제로 띄운 환경의 응답에서 나옵니다. 글의 통제 표처럼 이 환경과 account fixture는 고정(pinned)해 둡니다.",
    layer: "runtime",
    tool: "DAST · 동적 분석",
    reads: "실행 중인 endpoint의 요청·응답",
    finds: "관측 가능한 동작",
  },
  {
    label: "결과를 합치지 않음",
    summary: "finding마다 따로 기록",
    note: "네 검사는 서로 다른 층에서 나온 signal이므로 하나의 점수로 더하지 않습니다. Finding 하나마다 reproduction(다시 일으키는 방법), reachability(실제 경로로 닿는지), exploit precondition(악용에 필요한 조건)과 owner를 남깁니다.",
    layer: null,
    tool: "Finding 기록",
    reads: "검사 하나가 낸 finding 하나",
    finds: "Reproduction · reachability · exploit precondition · owner",
  },
];

export default function ScannerSignalViz() {
  return (
    <SceneShell
      eyebrow="Layered checks"
      title="검사 도구마다 같은 pull request의 다른 층을 봅니다"
      description="왼쪽 네 칸은 급여 API의 권한 누락을 고치는 pull request 하나가 가진 층입니다. 테두리를 칠한 칸이 지금 검사가 읽는 층입니다."
      ariaLabel="SAST, SCA, secret scan, DAST가 읽는 대상과 finding 기록 방식"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const all = scene.layer === null;
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0 space-y-2">
              {LAYERS.map((layer) => {
                const on = all || layer.key === scene.layer;
                return (
                  <div
                    key={layer.key}
                    className={`min-w-0 rounded-lg border bg-background px-3 py-2 ${on ? "border-[#2563eb]" : "border-border"}`}
                  >
                    <p className={`text-xs font-bold ${on ? "text-[#2563eb] dark:text-[#60a5fa]" : "text-muted-foreground"}`}>{layer.name}</p>
                    <p className={`mt-0.5 break-keep text-[11px] leading-4 ${on ? "text-foreground" : "text-muted-foreground/70"}`}>{layer.detail}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex min-w-0 flex-col rounded-lg border border-border bg-background p-3">
              <p className="text-[10px] font-black text-muted-foreground">검사</p>
              <p className="mt-1 text-sm font-bold">{scene.tool}</p>
              <p className="mt-3 text-[10px] font-black text-muted-foreground">읽는 대상</p>
              <p className="mt-1 break-keep text-xs font-semibold leading-5">{scene.reads}</p>
              <p className="mt-3 text-[10px] font-black text-muted-foreground">{all ? "남기는 항목" : "찾는 것"}</p>
              <p className="mt-1 break-keep text-xs font-semibold leading-5">{scene.finds}</p>
              <p className={`mt-3 rounded border px-2 py-1 text-[11px] font-bold ${all ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-transparent text-transparent"}`} aria-hidden={!all}>
                네 검사의 결과를 하나의 점수로 더하지 않음
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
