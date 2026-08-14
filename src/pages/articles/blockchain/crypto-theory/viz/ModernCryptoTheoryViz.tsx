const rows = [
  ["정확성", "정상 key·input에서 intended output이 나오는가?"],
  ["보안 game", "누가 무엇을 보고·질의하고·출력하면 이기는가?"],
  [
    "가정·reduction",
    "공격자가 이기면 어떤 hard problem solver를 만들 수 있는가?",
  ],
  [
    "구현·운영",
    "encoding·nonce·domain·key lifecycle이 증명 전제를 보존하는가?",
  ],
] as const;

export default function ModernCryptoTheoryViz() {
  return (
    <figure
      data-viz="crypto-security-model"
      className="rounded-xl border border-border bg-card p-4 sm:p-6"
    >
      <figcaption className="mb-4">
        <p className="text-sm font-semibold text-primary">
          Primitive를 읽는 네 층
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          알고리즘 이름 하나는 correctness·security·implementation을 동시에
          보장하지 않습니다.
        </p>
      </figcaption>
      <div data-viz-canvas className="space-y-3">
        {rows.map(([a, b], i) => (
          <div
            key={a}
            className="grid min-w-0 gap-1 border-t border-border pt-3 sm:grid-cols-[7rem_1fr]"
          >
            <p className="text-sm font-semibold">
              <span className="mr-2 text-primary">{i + 1}</span>
              {a}
            </p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {b}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}
