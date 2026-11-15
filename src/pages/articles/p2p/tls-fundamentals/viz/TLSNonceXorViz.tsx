import SceneShell from "./SceneShell";

/**
 * 본문 대응: #record-protocol — 12바이트 IV와 64비트 순번 i=5를 왼쪽 0 채움으로 맞춰 XOR한다.
 * IV 바이트 값은 설명용 가정이다. 마지막 바이트 0xc5 XOR 0x05 = 0xc0.
 * 순번 0~5의 마지막 바이트: c5, c4, c7, c6, c1, c0. 순번만 3으로 되돌리면 c6이 다시 나온다.
 */
const IV: readonly number[] = [0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x6f, 0x70, 0x81, 0x92, 0xa3, 0xb4, 0xc5];
const IV_LEN = IV.length;
const SEQ = 5;
const COUNTER = Array.from({ length: IV_LEN }, (_, index) => (index === IV_LEN - 1 ? SEQ : 0));
const NONCE = IV.map((byte, index) => byte ^ COUNTER[index]);
const LAST_BYTES = Array.from({ length: 6 }, (_, i) => IV[IV_LEN - 1] ^ i);
const REPLAY_SEQ = 3;

const hex = (value: number) => value.toString(16).padStart(2, "0");

const SCENES = [
  {
    label: "방향별 고정 IV는 12바이트입니다",
    summary: "IV = 12B (값은 가정)",
    note: "서버 쓰기 방향 traffic secret에서 파생한 IV입니다. 16진수 값은 설명용 가정이며, 같은 traffic key 아래에서는 레코드마다 바뀌지 않습니다.",
  },
  {
    label: "순번 5를 64비트로 쓰고 왼쪽을 0으로 채웁니다",
    summary: "4B 0 채움 + 8B 순번",
    note: "순번은 64비트(8바이트) network byte order로 쓰고, IV가 12바이트이므로 왼쪽에 0 바이트 4개를 붙입니다. i=5는 0부터 센 여섯 번째 레코드입니다.",
  },
  {
    label: "XOR하면 순번이 닿는 바이트만 바뀝니다",
    summary: `0x${hex(IV[IV_LEN - 1])} ⊕ 0x05 = 0x${hex(NONCE[IV_LEN - 1])}`,
    note: "0과 XOR한 바이트는 IV 그대로이고 마지막 바이트만 바뀝니다. 아래 줄처럼 레코드마다 다른 nonce가 나오며, i=0의 nonce는 IV 자체입니다.",
  },
  {
    label: "순번만 되돌리고 같은 키를 쓰면 nonce가 겹칩니다",
    summary: `복원 후 i=3 → 0x${hex(LAST_BYTES[REPLAY_SEQ])} 재사용`,
    note: "스냅샷 복원처럼 순번만 3으로 되돌리고 같은 키를 쓰면 이미 보낸 i=3과 같은 nonce가 다시 나옵니다. 키가 바뀌어 순번이 0이 될 때는 IV와 키도 함께 바뀌어야 합니다.",
  },
] as const;

function ByteRow({
  label,
  bytes,
  visible,
  tone,
}: {
  label: string;
  bytes: readonly number[];
  visible: boolean;
  tone: (index: number) => string;
}) {
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-20"}`}>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="grid grid-cols-12 gap-0.5">
        {bytes.map((byte, index) => (
          <span
            key={index}
            className={`rounded-sm border py-1 text-center font-mono text-[10px] leading-4 sm:text-xs ${tone(index)}`}
          >
            {visible ? hex(byte) : "··"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TLSNonceXorViz() {
  return (
    <SceneShell
      eyebrow="레코드 nonce"
      title="여섯 번째 레코드의 nonce를 바이트 단위로 만들어 봅니다"
      description="칸 하나가 1바이트(16진수 두 자리)입니다. IV 값은 설명용 가정이고, 순번 5와 12바이트 길이는 본문의 사례입니다. nonce는 같은 key 아래에서 반복되면 안 되는 레코드별 입력값입니다."
      ariaLabel="12바이트 IV와 왼쪽 0 채움한 순번 5를 XOR해 nonce를 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const plain = "border-border bg-background";
        const pad = "border-dashed border-slate-400 text-slate-500";
        const seq = "border-blue-600 text-blue-700 dark:text-blue-400 font-bold";
        const changed = "border-amber-600 text-amber-700 dark:text-amber-400 font-bold";
        return (
          <div className="min-w-0 space-y-3">
            <ByteRow label="IV (12B, 가정한 값)" bytes={IV} visible tone={() => plain} />
            <ByteRow
              label="⊕ 순번 i=5 (왼쪽 0 4B + uint64 8B)"
              bytes={COUNTER}
              visible={active >= 1}
              tone={(index) => (index < IV_LEN - 8 ? pad : index === IV_LEN - 1 ? seq : plain)}
            />
            <ByteRow
              label="= nonce N₅"
              bytes={NONCE}
              visible={active >= 2}
              tone={(index) => (index === IV_LEN - 1 ? changed : plain)}
            />
            <div className={`transition-opacity duration-300 motion-reduce:transition-none ${active >= 2 ? "opacity-100" : "opacity-20"}`}>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">레코드별 nonce의 마지막 바이트</p>
              <div className="grid grid-cols-7 gap-1">
                {LAST_BYTES.map((byte, i) => (
                  <span
                    key={i}
                    className={`rounded-sm border px-0.5 py-1 text-center font-mono text-[10px] leading-4 sm:text-xs ${
                      active === 3 && i === REPLAY_SEQ ? "border-red-600 font-bold text-red-700 dark:text-red-400" : i === SEQ ? changed : plain
                    }`}
                  >
                    i={i}
                    <br />
                    {hex(byte)}
                  </span>
                ))}
                <span
                  className={`rounded-sm border px-0.5 py-1 text-center font-mono text-[10px] leading-4 sm:text-xs ${
                    active === 3 ? "border-red-600 font-bold text-red-700 dark:text-red-400" : "border-dashed border-border/40 text-transparent"
                  }`}
                >
                  복원 i={REPLAY_SEQ}
                  <br />
                  {hex(LAST_BYTES[REPLAY_SEQ])}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
