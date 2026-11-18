import SceneShell from "./SceneShell";

/**
 * 본문 대응: #roce-gid-routing — ExplainedFormula의 해석
 * "같은 /16 안에 여러 /30 cable이 있다면 /16 비교는 엉뚱한 local GID도 통과시킨다".
 * 주소는 위 RdmaPathViz의 설명용 값(remote 10.20.30.2, 후보 10.20.30.1·10.20.31.1)을 그대로 씁니다.
 * 30 = 00011110, 31 = 00011111, 1 = 00000001, 2 = 00000010.
 * /16 → 세 주소 모두 10.20.0.0, /30 → 10.20.30.0 · 10.20.30.0 · 10.20.31.0.
 */
const ROWS = [
  { name: "remote peer", octets: [10, 20, 30, 2] },
  { name: "후보 A", octets: [10, 20, 30, 1] },
  { name: "후보 B", octets: [10, 20, 31, 1] },
] as const;

const PREFIXES: readonly number[] = [16, 30];

/** 셋째·넷째 octet의 16bit를 앞에서부터 나열합니다. 전체 주소 기준 bit 번호는 17~32입니다. */
function lowBits(octets: readonly number[]) {
  return [octets[2], octets[3]].flatMap((value) => value.toString(2).padStart(8, "0").split(""));
}

/** prefix 길이 p만 남기고 나머지 host bit를 0으로 지운 network 주소입니다. */
function network(octets: readonly number[], p: number) {
  const value = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
  const net = (value & mask) >>> 0;
  return [net >>> 24, (net >>> 16) & 255, (net >>> 8) & 255, net & 255].join(".");
}

const SCENES = [
  { label: "/16으로 자르면", summary: "A·B 모두 10.20.0.0 → 둘 다 통과", note: "앞 16bit(10.20)만 비교하면 셋째 octet은 host bit로 지워집니다. 30과 31이 다르다는 정보가 사라져 다른 cable의 주소인 후보 B도 같은 subnet으로 판정됩니다." },
  { label: "/30으로 자르면", summary: "A만 10.20.30.0으로 일치", note: "실제 link prefix인 /30을 쓰면 30과 31이 갈리는 bit가 비교 범위에 들어옵니다. 후보 B는 10.20.31.0이 되어 빠지고, 마지막 2bit만 host bit로 지워집니다." },
] as const;

export default function SubnetPrefixMaskViz() {
  return (
    <SceneShell
      eyebrow="prefix 길이"
      title="비교 범위를 /16으로 넓히면 다른 cable의 주소도 통과합니다"
      description="prefix 길이 p는 주소 32bit 가운데 앞에서부터 비교할 bit 수이고, 나머지(host bit)는 0으로 지운 뒤 비교합니다. 칸 하나가 1bit이며 앞 두 octet 10.20은 숫자로 줄였습니다. 주소는 설명용 값입니다(가정)."
      ariaLabel="같은 주소 세 개를 /16과 /30 prefix로 잘랐을 때 network 주소 비교"
      scenes={SCENES}
      render={(index) => {
        const p = PREFIXES[index];
        const remoteNet = network(ROWS[0].octets, p);
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-[#2563eb] bg-[#2563eb]/15" />비교하는 bit</span>
              <span className="inline-flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-sm border border-border bg-muted/40" />지우는 host bit</span>
            </div>
            {ROWS.map((row, rowIndex) => {
              const bits = lowBits(row.octets);
              const net = network(row.octets, p);
              const match = net === remoteNet;
              return (
                <div key={row.name} className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                    <span><strong>{row.name}</strong> <span className="font-mono text-muted-foreground">{row.octets.join(".")}/{p}</span></span>
                    <span className="font-mono">
                      → {net}
                      {rowIndex > 0 ? (
                        <strong className={match ? "ml-2 text-[#15803d] dark:text-[#4ade80]" : "ml-2 text-[#b91c1c] dark:text-[#f87171]"}>{match ? "같음 · 통과" : "다름 · 제외"}</strong>
                      ) : null}
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-[2.4rem_repeat(16,minmax(0,1fr))] gap-px">
                    <span className="grid h-7 place-items-center rounded-sm border border-[#2563eb] bg-[#2563eb]/15 font-mono text-[10px] font-bold">10.20</span>
                    {bits.map((bit, bitIndex) => {
                      const position = 17 + bitIndex;
                      const kept = position <= p;
                      const diffBit = position === 24;
                      return (
                        <span
                          key={bitIndex}
                          className={`grid h-7 place-items-center rounded-sm border font-mono text-[11px] ${kept ? "border-[#2563eb] bg-[#2563eb]/15 font-bold" : "border-border bg-muted/40 text-muted-foreground/70"} ${bitIndex === 8 ? "ml-0.5" : ""} ${diffBit ? "outline outline-1 outline-offset-1 outline-[#d97706]" : ""}`}
                        >
                          {bit}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <p className="text-[11px] leading-5 text-muted-foreground">주황 테두리 칸이 셋째 octet의 마지막 bit(전체 24번째)입니다. 30과 31은 이 bit 하나만 다릅니다. 회색 칸은 원래 bit를 흐리게 보인 것이며, 비교할 때는 0으로 지워집니다.</p>
          </div>
        );
      }}
    />
  );
}
