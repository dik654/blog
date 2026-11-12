import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prefix-rereads — C20을 4씩 나누면 조각마다 앞 기록 0·4·8·12·16위치를 다시 읽어 누적 40위치.
 * 큰 MHA 가정 k=524288 byte, n=65536: c=2048(m=32) → 496 GiB, c=512(m=128) → 2032 GiB, 3.35 TB/s로 0.159 s·0.651 s.
 */
const N = 20;
const C = 4;
const CHUNKS = N / C;
const CELL = 11;
const GX = 66;
const RY = 28;
const ROW_H = 22;
const READS = Array.from({ length: CHUNKS }, (_, k) => k * C);
const CUM = READS.map((_, k) => READS.slice(0, k + 1).reduce<number>((sum, v) => sum + v, 0));

const KV_BYTES = 524288;
const LONG = 65536;
const BW = 3.35e12;
const GIB = 2 ** 30;
const reread = (c: number) => {
  const m = LONG / c;
  return (KV_BYTES * c * m * (m - 1)) / 2;
};
const BIG = [
  { c: 2048, bytes: reread(2048) },
  { c: 512, bytes: reread(512) },
] as const;
const GIB_MAX = 2100;
const BX0 = 20;
const BX1 = 300;
const bw = (bytes: number) => ((bytes / GIB) / GIB_MAX) * (BX1 - BX0);

const SCENES = [
  {
    label: "조각 1·2",
    summary: "앞 기록 0 → 4위치",
    note: "첫 조각은 앞 기록이 없어 새 네 위치(파랑)만 다룹니다. 두 번째 조각은 앞서 처리한 네 위치의 기록(회색)을 다시 읽습니다. (가정: 각 조각이 앞부분을 정확히 한 번 읽음)",
  },
  {
    label: "다섯 조각",
    summary: "0+4+8+12+16 = 40위치",
    note: "조각이 뒤로 갈수록 회색 띠가 4위치씩 길어집니다. 다섯 조각이 다시 읽은 앞 기록을 모두 더하면 40위치입니다.",
  },
  {
    label: "저장한 양과 읽은 양",
    summary: "저장 20위치 · 누적 읽기 40위치",
    note: "저장 공간에 남는 KV는 입력 20위치의 기록뿐입니다. 40위치는 여러 실행에 걸쳐 같은 기록을 거듭 읽은 누적 전송량이라 저장 용량과 다른 양입니다.",
  },
  {
    label: "64K · c=2048",
    summary: "32조각 → 496 GiB · 약 0.159 s",
    note: "큰 MHA 가정에서 65536위치를 2048씩 나누면 32조각입니다. 위치당 524288 byte로 앞부분 재읽기를 더하면 496 GiB이고 3.35 TB/s로 나누면 약 0.159초입니다.",
  },
  {
    label: "64K · c=512",
    summary: "128조각 → 2032 GiB · 약 0.651 s",
    note: "조각을 1/4로 줄이면 조각 수는 네 배인 128이고 재읽기는 2032 GiB, 약 0.651초로 네 배 넘게 늘어납니다. 실제 HBM 전송은 L2 재사용이나 query tile 경로에 따라 달라집니다.",
  },
] as const;

export default function PrefixRereadViz() {
  return (
    <SceneShell
      eyebrow="Prefix 재읽기"
      title="조각을 작게 나눌수록 같은 앞 기록을 더 여러 번 읽습니다"
      description="한 줄이 조각 하나의 실행입니다. 칸 하나가 한 위치이고, 회색은 그 실행이 다시 읽는 앞 조각의 KV 기록, 파랑은 이번에 새로 처리하는 위치입니다. 뒤 두 장면은 16절의 큰 MHA 가정으로 바꾼 막대입니다."
      ariaLabel="C20을 4씩 나눌 때와 64K 입력을 나눌 때의 prefix 누적 재읽기"
      scenes={SCENES}
      render={(active) => {
        const small = active < 3;
        const rows = active === 0 ? 2 : CHUNKS;
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {small ? (
              <g>
                <text x={GX} y={16} fontSize={10.5} fill="#64748b">C의 위치 1 → 20</text>
                <text x={344} y={16} textAnchor="end" fontSize={10.5} fill="#64748b">누적 읽기</text>
                {Array.from({ length: CHUNKS }, (_, k) => {
                  const y = RY + k * ROW_H;
                  const shown = k < rows;
                  return (
                    <g key={k} opacity={shown ? 1 : 0.25}>
                      <text x={GX - 8} y={y + 9} textAnchor="end" fontSize={10.5} fill="#334155">조각 {k + 1}</text>
                      {Array.from({ length: N }, (_, i) => {
                        const prev = i < READS[k];
                        const fresh = i >= READS[k] && i < READS[k] + C;
                        return (
                          <rect
                            key={i}
                            x={GX + i * CELL + 0.5}
                            y={y + 0.5}
                            width={CELL - 1}
                            height={CELL - 1}
                            rx={1.5}
                            fill={!shown ? "#e2e8f0" : prev ? "#94a3b8" : fresh ? "#2563eb" : "none"}
                            stroke={shown && !prev && !fresh ? "#e2e8f0" : "none"}
                            strokeWidth={1}
                          />
                        );
                      })}
                      {shown && (
                        <text x={344} y={y + 9} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#334155">
                          {READS[k] === 0 ? "0" : `+${READS[k]} = ${CUM[k]}`}
                        </text>
                      )}
                    </g>
                  );
                })}
                {active === 2 && (
                  <g>
                    <text x={GX - 8} y={RY + CHUNKS * ROW_H + 18} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#0f766e">저장</text>
                    {Array.from({ length: N }, (_, i) => (
                      <rect key={i} x={GX + i * CELL + 0.5} y={RY + CHUNKS * ROW_H + 9.5} width={CELL - 1} height={CELL - 1} rx={1.5} fill="none" stroke="#0f766e" strokeWidth={1} />
                    ))}
                    <text x={344} y={RY + CHUNKS * ROW_H + 18} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#0f766e">20위치</text>
                  </g>
                )}
              </g>
            ) : (
              <g>
                <text x={BX0} y={22} fontSize={10.5} fill="#64748b">n = 65536 · 위치당 524288 byte</text>
                {BIG.map((b, i) => {
                  const shown = active === 3 ? i === 0 : true;
                  const y = 44 + i * 52;
                  return (
                    <g key={b.c} opacity={shown ? 1 : 0.25}>
                      <text x={BX0} y={y} fontSize={10.5} fontWeight={700} fill="#334155">
                        c = {b.c} · {LONG / b.c}조각
                      </text>
                      <rect x={BX0} y={y + 6} width={shown ? bw(b.bytes) : 0} height={18} rx={2} fill={i === 0 ? "#94a3b8" : "#64748b"} />
                      {shown && (
                        <text x={BX0 + bw(b.bytes) + (bw(b.bytes) > 200 ? -6 : 6)} y={y + 19} textAnchor={bw(b.bytes) > 200 ? "end" : "start"} fontSize={10.5} fontWeight={700} fill={bw(b.bytes) > 200 ? "#ffffff" : "#334155"}>
                          {Math.round(b.bytes / GIB)} GiB · {(b.bytes / BW).toFixed(3)} s
                        </text>
                      )}
                    </g>
                  );
                })}
                <text x={BX0} y={160} fontSize={10.5} fill="#64748b">전송률 3.35 TB/s로 나눈 시간 · 가정 모형</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
