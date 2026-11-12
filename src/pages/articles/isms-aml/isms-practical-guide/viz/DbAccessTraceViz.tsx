import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #access-db — 운영자의 DB 직접 접속을 개인 identity, 승인된 ticket, 짧게 만료되는 credential,
 * 감사 log 한 줄로 묶고, 같은 경계가 우회 port·cloud console·replica·backup에도 적용되는지 시험한다.
 * 만료 시간이나 시험 결과는 본문이 정하지 않으므로 그리지 않는다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const MUTED = "#cbd5e1";

const BYPASS = ["우회 port", "cloud console", "replica", "backup"] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  focus: "request" | "credential" | "log" | "bypass";
}

const SCENES: readonly Scene[] = [
  {
    label: "개인 identity로 신청합니다",
    summary: "gateway 인증 + ticket",
    note: "운영자는 공용 계정이 아니라 자기 identity로 bastion이나 DB access gateway에 인증하고, ticket에 접속 목적·대상 DB·필요한 role·허용 시간창을 적습니다.",
    focus: "request",
  },
  {
    label: "승인된 뒤에만 credential이 나옵니다",
    summary: "승인 → 발급 → 짧게 만료",
    note: "승인이 끝나기 전에는 DB로 가는 credential이 없습니다. 승인 뒤에 발급되는 credential도 오래 남지 않고 짧게 만료됩니다.",
    focus: "credential",
  },
  {
    label: "감사 log 한 줄이 앞의 단계를 묶습니다",
    summary: "누가 · ticket · 어디서 → 무엇을",
    note: "log는 누가, 어떤 ticket으로, 어디에서 접속했는지부터 보여 주고 session ID·행위 유형·대상·결과·시각·적용한 policy revision을 붙입니다. SQL 전문은 개인정보가 들어갈 수 있어 masking·접근권한·무결성·보관기간을 따로 정합니다.",
    focus: "log",
  },
  {
    label: "같은 경계가 우회로에도 있는지 시험합니다",
    summary: "port · console · replica · backup",
    note: "접근제어 제품을 설치했다는 사실보다 우회 port, cloud console, replica, backup에도 같은 경계가 적용되는지가 중요하므로, 경로마다 따로 시험합니다.",
    focus: "bypass",
  },
];

function Node({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`min-w-0 rounded-md border px-2 py-1 text-center text-[11px] leading-4 sm:text-xs ${active ? "font-semibold" : "text-muted-foreground"}`}
      style={{ borderColor: active ? BLUE : MUTED }}
    >
      {label}
    </span>
  );
}

function Fields({ items, color }: { items: readonly string[]; color: string }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-md border px-2 py-0.5 text-[11px] sm:text-xs" style={{ borderColor: color }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

const PANELS = [
  <div key="request" className="space-y-2">
    <p className="text-xs font-semibold sm:text-sm">ticket에 적는 것</p>
    <Fields items={["접속 목적", "대상 DB", "필요한 role", "허용 시간창"]} color={BLUE} />
  </div>,
  <div key="credential" className="space-y-2">
    <p className="text-xs font-semibold sm:text-sm">시간 순서</p>
    <ol className="grid grid-cols-3 gap-1 text-center text-[11px] sm:text-xs">
      <li className="rounded-md border px-1 py-1" style={{ borderColor: MUTED }}>
        승인 전<span className="block text-muted-foreground">credential 없음</span>
      </li>
      <li className="rounded-md border px-1 py-1" style={{ borderColor: BLUE }}>
        승인 후<span className="block">짧은 credential</span>
      </li>
      <li className="rounded-md border px-1 py-1" style={{ borderColor: MUTED }}>
        만료<span className="block text-muted-foreground">더 쓸 수 없음</span>
      </li>
    </ol>
  </div>,
  <div key="log" className="space-y-2">
    <p className="text-xs font-semibold sm:text-sm">한 줄에 연결되는 값</p>
    <Fields items={["누가", "어떤 ticket", "어디에서"]} color={BLUE} />
    <Fields items={["session ID", "행위 유형", "대상", "결과", "시각", "policy revision"]} color={MUTED} />
  </div>,
  <div key="bypass" className="space-y-2">
    <p className="text-xs font-semibold sm:text-sm">경로마다 시험할 질문</p>
    <p className="text-[11px] text-muted-foreground sm:text-xs">위 네 경로 각각에 아래가 똑같이 걸리는가?</p>
    <Fields items={["개인 identity", "승인", "짧은 만료", "감사 log"]} color={AMBER} />
  </div>,
];

export default function DbAccessTraceViz() {
  return (
    <SceneShell
      eyebrow="DB 접근 trace"
      title="사람의 DB 접속은 신청·승인·만료·log가 한 경로에 묶이고, 우회로도 같은 경계를 지나야 합니다"
      description="위 줄이 정해진 접속 경로, 아래 줄이 그 경로 밖의 다른 경로입니다. 각 장면에서 강조된 칸을 봅니다."
      ariaLabel="운영자 DB 접속의 신청, 승인, 짧은 credential, 감사 log와 우회 경로 시험"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
                <Node label="개인 identity" active={focus === "request" || focus === "log"} />
                <span className="text-xs text-muted-foreground" aria-hidden>→</span>
                <Node label="bastion · gateway" active={focus !== "bypass"} />
                <span className="text-xs text-muted-foreground" aria-hidden>→</span>
                <Node label="운영 DB" active={focus === "credential" || focus === "log" || focus === "bypass"} />
              </div>
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                {BYPASS.map((path) => (
                  <span
                    key={path}
                    className={`rounded-md border border-dashed px-2 py-1 text-center text-[11px] sm:text-xs ${focus === "bypass" ? "font-semibold" : "text-muted-foreground/60"}`}
                    style={{ borderColor: focus === "bypass" ? AMBER : MUTED }}
                  >
                    {path} 경유 접근 ?
                  </span>
                ))}
              </div>
            </div>
            <StableSceneStack active={active} scenes={PANELS} className="rounded-lg border border-border/80 px-3 py-3" />
          </div>
        );
      }}
    />
  );
}
