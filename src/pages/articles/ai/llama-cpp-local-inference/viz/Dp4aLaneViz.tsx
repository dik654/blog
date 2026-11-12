import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #integer-dot — 4비트 값 여덟 개가 든 32비트에서 0x0F0F0F0F로 네 개를 byte 칸에 꺼내고,
 * dp4a가 byte 네 쌍을 곱해 더한다. 가중치 자리에 1 네 개를 넣으면 활성값의 합이 나온다.
 * q = [3, 0, 15, 7], u = [1, −2, 3, 4] → 76, 6 (본문 12절 예).
 * 각 byte의 위 4비트에 든 나머지 값 넷은 이 예에서 쓰지 않아 "?"로 둔다.
 */
const Q: readonly number[] = [3, 0, 15, 7];
const U: readonly number[] = [1, -2, 3, 4];
const DOT = Q.reduce<number>((sum, q, i) => sum + q * U[i], 0);
const SUM_U = U.reduce<number>((sum, u) => sum + u, 0);

const nib = (value: number) => value.toString(2).padStart(4, "0");
const signed = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

const SCENES = [
  { label: "32비트 하나에 4비트 값 8개", summary: "byte 하나 = 4비트 값 두 개", mode: "packed", note: "Q4_K의 값은 4비트라 byte 하나에 두 개, 32비트 정수 하나에 여덟 개가 들어 있습니다. 아래 4비트에 이 예의 [3, 0, 15, 7]이 있고, 위 4비트의 나머지 넷은 이 예에서 쓰지 않습니다." },
  { label: "& 0x0F0F0F0F", summary: "byte마다 아래 4비트만 남김", mode: "mask", note: "byte마다 0x0F = 0000 1111을 AND하면 위 4비트는 0이 되고 아래 4비트만 남습니다. 4비트 값 넷이 byte 네 칸에 하나씩 놓여 dp4a가 읽을 모양이 됩니다." },
  { label: "dp4a 한 번", summary: `3 + 0 + 45 + 28 = ${DOT}`, mode: "dot", note: "dp4a는 두 32비트를 byte 네 칸씩으로 보고 같은 칸끼리 곱해 더한 뒤 누적값에 더합니다. 누적값을 0으로 주면 결과가 정수 곱의 합 76입니다." },
  { label: "가중치 자리에 1 넷", summary: `1 − 2 + 3 + 4 = ${SUM_U}`, mode: "sum", note: "가중치 대신 0x01010101, 곧 byte마다 1을 넣으면 같은 명령이 u를 그대로 더합니다. 빼는 값 dmin·m에 곱할 활성값 합 6이 이렇게 나옵니다." },
] as const;

function Cell({ top, bottom, tone }: { top: string; bottom?: string; tone: "plain" | "dim" | "accent" | "result" }) {
  const cls =
    tone === "accent"
      ? "border-blue-600 text-blue-700 dark:text-blue-300"
      : tone === "result"
        ? "border-emerald-600 text-emerald-700 dark:text-emerald-300"
        : tone === "dim"
          ? "border-dashed border-border text-muted-foreground/70"
          : "border-border";
  return (
    <div className={`min-w-0 whitespace-nowrap rounded-md border px-0.5 py-1 text-center font-mono text-[11px] leading-4 sm:py-1.5 sm:text-xs ${cls}`}>
      <span className="block font-semibold">{top}</span>
      {bottom !== undefined && <span className="block text-[9px] text-muted-foreground sm:text-[10px]">{bottom}</span>}
    </div>
  );
}

function Row({ label, short, children }: { label: string; short: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[2.75rem_repeat(4,minmax(0,1fr))] items-center gap-1 sm:grid-cols-[6.5rem_repeat(4,minmax(0,1fr))] sm:gap-2">
      <span className="text-[11px] leading-4 text-muted-foreground sm:text-xs">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
      {children}
    </div>
  );
}

export default function Dp4aLaneViz() {
  return (
    <SceneShell
      eyebrow="dp4a byte 칸"
      title="AND 한 번으로 4비트 값 넷을 byte 칸에 놓고, dp4a 한 번이 네 쌍을 곱해 더합니다"
      description="열 하나가 byte 하나(왼쪽부터 byte 0~3)입니다. 칸의 위 줄은 값, 아래 줄은 2진수입니다. v는 4비트 가중치 값이 든 32비트 정수, u는 int8 활성값이며, ?는 이 예에서 쓰지 않는 다른 4비트 값입니다."
      ariaLabel="32비트 정수의 4비트 값을 0x0F0F0F0F로 꺼내 dp4a로 곱해 더하는 과정"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const masked = mode !== "packed";
        return (
          <div className="min-w-0 space-y-1.5 sm:space-y-2">
            <Row label="byte" short="">
              {[0, 1, 2, 3].map((b) => (
                <span key={b} className="text-center text-[10px] text-muted-foreground">
                  byte {b}
                </span>
              ))}
            </Row>
            <Row label="v (가중치)" short="v">
              {Q.map((q, i) => (
                <Cell key={i} top={`?|${q}`} bottom={`???? ${nib(q)}`} tone={mode === "packed" ? "accent" : "plain"} />
              ))}
            </Row>
            <Row label={mode === "packed" ? "AND할 값" : "0x0F0F0F0F"} short="AND">
              {[0, 1, 2, 3].map((i) => (
                <Cell key={i} top={mode === "packed" ? "−" : "0x0F"} bottom={mode === "packed" ? "" : "0000 1111"} tone={mode === "mask" ? "accent" : "dim"} />
              ))}
            </Row>
            <Row label={mode === "sum" ? "0x01010101" : "vi (꺼낸 값)"} short={mode === "sum" ? "1넷" : "vi"}>
              {Q.map((q, i) =>
                mode === "sum" ? (
                  <Cell key={i} top="1" bottom="0000 0001" tone="accent" />
                ) : (
                  <Cell key={i} top={masked ? `${q}` : "−"} bottom={masked ? `0000 ${nib(q)}` : ""} tone={mode === "mask" ? "result" : masked ? "plain" : "dim"} />
                ),
              )}
            </Row>
            <Row label="u (int8)" short="u">
              {U.map((u, i) => (
                <Cell key={i} top={signed(u)} tone={mode === "dot" || mode === "sum" ? "accent" : "dim"} />
              ))}
            </Row>
            <Row label="칸끼리 곱" short="곱">
              {Q.map((q, i) => {
                const show = mode === "dot" || mode === "sum";
                const value = mode === "sum" ? U[i] : q * U[i];
                return <Cell key={i} top={show ? signed(value) : "−"} tone={show ? "result" : "dim"} />;
              })}
            </Row>
            <div className="flex flex-wrap items-baseline justify-end gap-x-2 pt-1 font-mono text-sm">
              <span className="text-muted-foreground">네 칸 합 + 누적 0 =</span>
              <span className="min-w-[2.5rem] text-right font-bold text-emerald-700 dark:text-emerald-300">
                {mode === "dot" ? DOT : mode === "sum" ? SUM_U : "−"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
