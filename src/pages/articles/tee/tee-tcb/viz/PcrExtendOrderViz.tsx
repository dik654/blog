import type { ReactNode } from "react";
import TcbSceneShell from "./TcbSceneShell";

/**
 * 본문 대응: #secure-measured-boot — Secure Boot는 허용 여부만 정하고,
 * Measured Boot는 PCR_i = H(PCR_{i-1} || H(e_i))로 실제 선택과 순서를 접는다.
 * bootloader A·B와 revoked image는 장면을 위한 이름이다(가정).
 */
const SCENES = [
  {
    label: "Secure Boot: 실행해도 되는가",
    summary: "A 허용 · B 허용 · revoked 차단",
    note: "Secure Boot는 다음 image의 signature와 allow/revoke policy를 검사해 실행 여부만 결정합니다. 허용된 bootloader가 A와 B 둘이면 어느 쪽이든 실행될 수 있고, 이 단계만으로는 실제로 어느 쪽이 실행됐는지 남지 않습니다.",
  },
  {
    label: "Measured Boot 1: firmware",
    summary: "PCR₁ = H(PCR₀ ‖ H(firmware))",
    note: "Measured Boot는 실행 여부를 정하는 대신 실행한 것을 기록합니다. 초기값 PCR₀ 뒤에 firmware digest를 이어 붙여 다시 hash한 값이 PCR₁이 되고, event log에는 ‘firmware’라는 설명이 한 줄 남습니다.",
  },
  {
    label: "Measured Boot 2: bootloader A",
    summary: "PCR₂ = H(PCR₁ ‖ H(A))",
    note: "다음 event는 PCR₁을 통째로 안쪽에 넣고 bootloader A의 digest를 뒤에 붙여 접습니다. PCR₂ 하나 안에 firmware와 A가 이 순서대로 들어 있습니다.",
  },
  {
    label: "B가 실행됐다면",
    summary: "H(PCR₁ ‖ H(B)) — A일 때와 구분",
    note: "Secure Boot에서는 A와 B가 똑같이 ‘허용’이었지만, 접히는 digest가 H(A)에서 H(B)로 바뀌므로 PCR₂도 달라집니다. Measured Boot는 둘 중 실제로 어느 image가 선택됐는지 구분합니다.",
  },
  {
    label: "순서를 뒤집으면",
    summary: "같은 두 digest, 보통 다른 PCR₂",
    note: "Bootloader를 먼저, firmware를 나중에 extend하면 안쪽과 바깥쪽 자리가 바뀝니다. 같은 두 digest를 써도 보통 다른 최종 PCR이 나옵니다. 거꾸로 PCR 값 하나만 보고는 안에 어떤 event가 접혔는지 풀어낼 수 없어서, 순서를 설명하는 event log가 함께 필요합니다.",
  },
] as const;

function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "accent" | "changed" }) {
  const cls =
    tone === "accent"
      ? "border-[#2563eb] text-[#1d4ed8] dark:text-[#93c5fd]"
      : tone === "changed"
        ? "border-[#d97706] text-[#b45309] dark:text-[#fbbf24]"
        : "border-border text-foreground";
  return <span className={`inline-block rounded-md border bg-background px-2 py-1 font-mono text-xs ${cls}`}>{children}</span>;
}

/** H( inner ‖ digest ) 한 번의 extend를 상자 하나로 그립니다. 안쪽 상자가 이전 PCR입니다. */
function Fold({ name, inner, digest, tone }: { name: string; inner: ReactNode; digest: ReactNode; tone: "plain" | "accent" | "changed" }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-2 sm:p-3">
      <p className="text-xs font-bold text-muted-foreground">
        {name} = H( … ‖ … )
      </p>
      <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
        <div className="min-w-0 flex-1">{inner}</div>
        <span className="font-mono text-xs text-muted-foreground">‖</span>
        <Chip tone={tone}>{digest}</Chip>
      </div>
    </div>
  );
}

function EventLog({ rows }: { rows: readonly string[] }) {
  return (
    <div className="min-w-0 rounded-lg border border-dashed border-border p-3">
      <p className="text-xs font-bold text-muted-foreground">Event log (설명)</p>
      <ol className="mt-2 space-y-1 text-xs">
        {rows.map((row, index) => (
          <li key={row} className="font-mono">
            {index + 1}. {row}
          </li>
        ))}
      </ol>
    </div>
  );
}

function SecureBootPanel() {
  const rows = [
    ["bootloader A", "allow list에 있음", "실행 허용", "#16a34a"],
    ["bootloader B", "allow list에 있음", "실행 허용", "#16a34a"],
    ["revoked image", "revoke list에 있음", "실행 차단", "#dc2626"],
  ] as const;
  return (
    <div className="grid min-w-0 gap-3">
      {rows.map(([name, reason, verdict, color]) => (
        <div key={name} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border p-3">
          <div className="min-w-0">
            <p className="font-mono text-sm font-semibold">{name}</p>
            <p className="text-xs text-muted-foreground">signature 검사 · {reason}</p>
          </div>
          <span className="rounded-md border px-2 py-1 text-xs font-bold" style={{ borderColor: color, color }}>
            {verdict}
          </span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">기록: 없음 — A와 B 중 무엇이 실행됐는지 이 단계는 말하지 않습니다.</p>
    </div>
  );
}

function Stage({ fold, log }: { fold: ReactNode; log: readonly string[] }) {
  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
      <div className="min-w-0">{fold}</div>
      <EventLog rows={log} />
    </div>
  );
}

const PCR0 = <Chip>PCR₀ (초기값)</Chip>;

function render(active: number) {
  if (active === 0) return <SecureBootPanel />;
  if (active === 1) return <Stage fold={<Fold name="PCR₁" inner={PCR0} digest="H(firmware)" tone="accent" />} log={["firmware"]} />;
  if (active === 2 || active === 3) {
    const isB = active === 3;
    return (
      <Stage
        fold={
          <Fold
            name="PCR₂"
            inner={<Fold name="PCR₁" inner={PCR0} digest="H(firmware)" tone="plain" />}
            digest={isB ? "H(B)" : "H(A)"}
            tone={isB ? "changed" : "accent"}
          />
        }
        log={["firmware", isB ? "bootloader B" : "bootloader A"]}
      />
    );
  }
  return (
    <div className="grid min-w-0 gap-3 md:grid-cols-2">
      <div className="min-w-0">
        <p className="mb-2 text-xs font-bold text-muted-foreground">firmware → bootloader A</p>
        <Fold name="PCR₂" inner={<Fold name="PCR₁" inner={PCR0} digest="H(firmware)" tone="plain" />} digest="H(A)" tone="plain" />
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-xs font-bold text-muted-foreground">bootloader A → firmware</p>
        <Fold name="PCR₂" inner={<Fold name="PCR₁" inner={PCR0} digest="H(A)" tone="changed" />} digest="H(firmware)" tone="changed" />
      </div>
    </div>
  );
}

export default function PcrExtendOrderViz() {
  return (
    <TcbSceneShell
      eyebrow="Secure Boot vs Measured Boot"
      title="허용은 둘 다 받아도, PCR에는 실제로 고른 image와 순서가 접힌다"
      description="PCR(Platform Configuration Register)은 TPM 안의 측정용 register로, 값을 덮어쓰지 않고 extend만 합니다. extend는 지금 값 뒤에 새 event의 digest(hash 결과)를 이어 붙여(‖) 다시 hash하는 동작입니다. 상자 하나가 extend 한 번이고, 안쪽 상자가 이전 PCR입니다. bootloader A·B와 revoked image는 설명용 이름입니다(가정)."
      ariaLabel="Secure Boot의 허용 판정과 Measured Boot의 PCR extend 중첩, 선택과 순서에 따른 차이"
      scenes={SCENES}
      render={render}
    />
  );
}
