import VizFrame from "@/components/viz/VizFrame";

const STEPS = [
  ["입력 고정", "같은 image · 같은 preprocessing → x′"],
  ["두 번 실행", "reference(x′) · target(x′) → B×K logits"],
  ["축 확인", "shape · dtype · class order가 같은지 검사"],
  ["오차 판정", "max |zref−ztarget| ≤ ε이면 통과"],
] as const;

export default function CheckpointParityViz() {
  return (
    <VizFrame
      eyebrow="Checkpoint parity"
      title="같은 입력을 두 구현에 넣고 모든 class logit을 비교합니다"
      description="Weight를 읽었다는 메시지가 아니라 입력 계약부터 출력 vector까지 같은지 확인합니다."
      className="my-8 !h-auto !max-h-none"
      canvasClassName="!h-auto !max-h-none !flex-none"
    >
      <ol className="divide-y divide-border border-y border-border">
        {STEPS.map(([title, detail], index) => (
          <li
            key={title}
            className="grid min-w-0 gap-1 py-4 sm:grid-cols-[2.5rem_7rem_minmax(0,1fr)] sm:items-center sm:gap-4"
          >
            <span className="font-mono text-xs font-bold text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong className="text-sm">{title}</strong>
            <code className="break-words text-xs leading-5 text-muted-foreground">
              {detail}
            </code>
          </li>
        ))}
      </ol>
      <p className="mt-5 border-l-2 border-primary/50 pl-3 text-sm leading-6 text-muted-foreground">
        통과 기록에는 checkpoint revision, preprocessing digest, class map,
        dtype, ε와 실제 maximum error를 함께 남깁니다.
      </p>
    </VizFrame>
  );
}
