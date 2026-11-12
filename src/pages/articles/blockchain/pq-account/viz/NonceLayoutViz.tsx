import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #names — nonce = 상위 192비트 key | 하위 64비트 sequence.
 * 192 + 64 = 256비트. 본문의 7→8은 key=0의 sequence 변화이므로 nonce 값 자체도 7→8로 읽힌다.
 */
const KEY_BITS = 192;
const SEQ_BITS = 64;
const TOTAL_BITS = KEY_BITS + SEQ_BITS;

const ROWS = [
  { name: "요청에 적힌 nonce", key: "0", seq: "7", tone: "#2563eb" },
  { name: "검증 뒤 이 key의 다음 값", key: "0", seq: "8", tone: "#16a34a" },
] as const;

export default function NonceLayoutViz() {
  const keyWidth = `${(KEY_BITS / TOTAL_BITS) * 100}%`;
  const seqWidth = `${(SEQ_BITS / TOTAL_BITS) * 100}%`;
  return (
    <VizFrame
      eyebrow="nonce 한 칸의 구조"
      title="nonce 하나는 key 칸과 순번 칸으로 나뉩니다"
      description={`nonce는 같은 요청의 재사용을 막는 순번 값입니다. 가로 길이는 비트 수에 비례합니다: key ${KEY_BITS}비트 + sequence ${SEQ_BITS}비트 = ${TOTAL_BITS}비트.`}
      documentFlow
    >
      <div className="min-w-0 space-y-4">
        <div className="flex text-xs text-muted-foreground">
          <span className="text-center" style={{ width: keyWidth }}>상위 {KEY_BITS}비트 · key</span>
          <span className="text-center" style={{ width: seqWidth }}>하위 {SEQ_BITS}비트 · sequence</span>
        </div>
        {ROWS.map((row) => (
          <div key={row.name} className="min-w-0">
            <p className="mb-1 text-xs font-semibold">{row.name}</p>
            <div className="flex h-10 overflow-hidden rounded-md border border-border font-mono text-sm">
              <div className="flex items-center justify-center border-r border-border bg-muted/40" style={{ width: keyWidth }}>
                key = {row.key}
              </div>
              <div className="flex items-center justify-center font-bold text-white" style={{ width: seqWidth, backgroundColor: row.tone }}>
                {row.seq}
              </div>
            </div>
          </div>
        ))}
        <p className="text-xs leading-5 text-muted-foreground">
          key가 0이면 상위 칸이 모두 0이라 nonce 값이 곧 sequence입니다. 그래서 본문은 이 요청을 “nonce 7”이라고 부르고,
          통과하면 같은 key의 다음 값이 8이 됩니다. 순번은 계정과 key마다 따로 관리됩니다.
        </p>
      </div>
    </VizFrame>
  );
}
