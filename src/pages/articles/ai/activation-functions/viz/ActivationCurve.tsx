import { useState } from "react";
import { Coordinates, Mafs, Plot, Point, Theme } from "mafs";

type Curve = "sigmoid" | "tanh" | "relu" | "leaky" | "selu" | "silu";
const definitions: Record<Curve, { label: string; f: (x: number) => number; slope: (x: number) => number }> = {
  sigmoid: { label: "Sigmoid", f: x => 1 / (1 + Math.exp(-x)), slope: x => { const p = 1 / (1 + Math.exp(-x)); return p * (1 - p); } },
  tanh: { label: "Tanh", f: Math.tanh, slope: x => 1 - Math.tanh(x) ** 2 },
  relu: { label: "ReLU", f: x => Math.max(0, x), slope: x => x > 0 ? 1 : 0 },
  leaky: { label: "Leaky ReLU · a=0.01", f: x => x > 0 ? x : .01 * x, slope: x => x > 0 ? 1 : .01 },
  selu: { label: "SELU · 원문 상수", f: x => 1.0507009873554805 * (x > 0 ? x : 1.6732632423543772 * Math.expm1(x)), slope: x => 1.0507009873554805 * (x > 0 ? 1 : 1.6732632423543772 * Math.exp(x)) },
  silu: { label: "SiLU", f: x => x / (1 + Math.exp(-x)), slope: x => { const p = 1 / (1 + Math.exp(-x)); return p + x * p * (1 - p); } },
};

export default function ActivationCurve({ mode }: { mode: "foundations" | "rectifiers" | "gates" }) {
  const choices: Curve[] = mode === "foundations" ? ["sigmoid", "tanh"] : mode === "rectifiers" ? ["relu", "leaky", "selu"] : ["silu"];
  const [curve, setCurve] = useState<Curve>(choices[0]);
  const [x, setX] = useState(mode === "foundations" ? 2 : mode === "gates" ? -1 : -2);
  const definition = definitions[curve];
  const corner = x === 0 && ["relu", "leaky", "selu"].includes(curve);
  return <figure className="my-8 min-w-0 overflow-hidden rounded-lg border border-border" data-viz="activation-function-curve">
    <figcaption className="space-y-2 border-b border-border p-4">
      <p className="font-semibold">입력 위치에 따라 출력과 기울기가 함께 달라집니다</p>
      <p className="text-sm leading-7 text-muted-foreground">가로축은 입력, 세로축은 출력입니다. 아래 조절로 같은 곡선의 다른 위치를 확인합니다.</p>
    </figcaption>
    <div className="themed-mafs overflow-hidden p-3">
      <Mafs height={280} viewBox={{ x: [-4, 4], y: [-2, 3.5], padding: .35 }} pan={false} zoom={false}>
        <Coordinates.Cartesian xAxis={{ lines: false }} yAxis={{ lines: false, labels: value => value >= -2 && value <= 3 ? String(value) : "" }} />
        <Plot.OfX y={definition.f} color={Theme.blue} weight={1.25} />
        <Point x={x} y={definition.f(x)} color={Theme.blue} />
      </Mafs>
    </div>
    <div className="space-y-4 border-t border-border p-4">
      <div className="flex flex-wrap gap-2">{choices.map(choice => <button key={choice} type="button" onClick={() => setCurve(choice)} aria-pressed={curve === choice} className="rounded-lg border border-border px-3 py-2 text-sm aria-pressed:bg-muted">{definitions[choice].label}</button>)}</div>
      <label className="flex flex-col gap-2 text-sm">입력 {x.toFixed(2)}<input aria-label="활성함수 입력" type="range" min={-3} max={3} step={.05} value={x} onChange={event => setX(Number(event.target.value))} /></label>
      <p className="text-sm leading-7" aria-live="polite">출력 {definition.f(x).toFixed(6)} · {corner ? "꺾이는 점에서는 표준 미분값이 없습니다." : `이 위치의 기울기 ${definition.slope(x).toFixed(6)}`}</p>
    </div>
  </figure>;
}
