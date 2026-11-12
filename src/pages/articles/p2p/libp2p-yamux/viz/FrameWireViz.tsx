import SceneShell from "./SceneShell";

/**
 * 본문 대응: #connection-poll — 한 DATA payload는 기본 최대 16 KiB라 40 KiB write는 16 + 16 + 8로 나뉘어 여러 poll에 간다.
 * 두 stream의 frame은 같은 ordered TCP byte stream으로 직렬화된다. receipt 크기와 끼어드는 순서는 본문이 정하지 않아 가정으로 표시.
 * TCP send buffer 막힘, poll() 미호출, connection I/O error면 stream 3도 진행하지 못한다.
 */
const PARTS = [16, 16, 8] as const;
const WRITE = PARTS.reduce<number>((sum, part) => sum + part, 0);

const SCENES = [
  { label: "40 KiB write 하나", summary: "16 + 16 + 8 KiB", note: "현재 구현은 DATA frame 하나의 payload를 기본 최대 16 KiB로 자릅니다. 그래서 stream 1의 40 KiB write는 frame 세 개가 되고 여러 poll에 나뉘어 나갑니다." },
  { label: "한 줄의 wire로 직렬화", summary: "frame 사이에 stream 3이 낄 수 있음", note: "두 stream의 frame은 결국 같은 ordered TCP byte stream에 한 줄로 실립니다. 큰 write가 거대한 frame 하나로 socket을 독점하지 않으므로 stream 3의 receipt frame이 사이에 들어갈 수 있습니다." },
  { label: "공유 연결이 막힘", summary: "stream 1 · stream 3 모두 대기", note: "TCP send buffer가 막히거나, connection의 poll()을 호출하지 않거나, connection I/O error가 나면 줄 전체가 멈춥니다. stream 3에 credit가 있어도 진행하지 못합니다." },
] as const;

const S1 = "#2563eb";
const S3 = "#0d9488";

function Split() {
  return (
    <div className="min-w-0 text-sm">
      <p className="text-xs font-bold text-muted-foreground">stream 1 application의 write 하나 ({WRITE} KiB)</p>
      <div className="mt-2 flex h-9 w-full overflow-hidden rounded-sm border" style={{ borderColor: S1 }}>
        <div className="h-full w-full" style={{ backgroundColor: `${S1}33` }} />
      </div>
      <p className="my-2 text-center text-xs text-muted-foreground">↓ 최대 16 KiB씩 자름 · 여러 poll에 나뉘어 나감</p>
      <div className="flex h-9 w-full gap-1">
        {PARTS.map((part, index) => (
          <div
            key={index}
            className="flex h-full items-center justify-center rounded-sm font-mono text-xs font-bold text-white"
            style={{ width: `${(part / WRITE) * 100}%`, backgroundColor: S1 }}
          >
            {part}
          </div>
        ))}
      </div>
      <div className="mt-1 flex w-full gap-1 text-[11px] text-muted-foreground">
        {PARTS.map((part, index) => (
          <span key={index} className="text-center" style={{ width: `${(part / WRITE) * 100}%` }}>
            frame {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function Wire({ blocked }: { blocked: boolean }) {
  const frames = [
    { who: "s1", text: "S1 · 16" },
    { who: "s3", text: "S3 · receipt" },
    { who: "s1", text: "S1 · 16" },
    { who: "s1", text: "S1 · 8" },
  ];
  return (
    <div className="min-w-0 text-sm">
      <p className="text-xs font-bold text-muted-foreground">공유 Noise/TCP 연결 · 한 줄로 순서대로 나가는 frame</p>
      <div
        className="mt-2 grid grid-cols-2 gap-1 rounded-md border p-1.5 sm:grid-cols-4"
        style={{ borderColor: blocked ? "#dc2626" : "#94a3b8", borderStyle: blocked ? "dashed" : "solid" }}
      >
        {frames.map((frame, index) => {
          const color = frame.who === "s1" ? S1 : S3;
          return (
            <div
              key={index}
              className="flex h-10 items-center justify-center rounded-sm border font-mono text-xs font-bold"
              style={{ borderColor: color, color: blocked ? "#94a3b8" : color, backgroundColor: blocked ? "transparent" : `${color}1a` }}
            >
              {index + 1}. {frame.text}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        칸 너비는 크기와 무관합니다. receipt의 크기와 끼어드는 자리는 설명용 가정입니다.
      </p>
      <p className="mt-2 text-xs font-bold" style={{ color: blocked ? "#dc2626" : "#16a34a" }}>
        {blocked ? "socket 막힘 · poll 없음 · I/O error → 모든 칸이 대기" : "credit가 있는 stream은 자기 frame을 제출"}
      </p>
    </div>
  );
}

export default function FrameWireViz() {
  return (
    <SceneShell
      eyebrow="frame과 공유 wire"
      title="큰 write는 16 KiB 조각으로 나뉘지만 결국 한 줄의 연결을 탑니다"
      description="파란 칸은 stream 1(payroll), 청록 칸은 stream 3(receipt)의 DATA frame입니다. 숫자 단위는 KiB입니다."
      ariaLabel="40 KiB write가 16 KiB frame으로 나뉘어 공유 연결에 직렬화되는 과정"
      scenes={SCENES}
      render={(active) => (active === 0 ? <Split /> : <Wire blocked={active === 2} />)}
    />
  );
}
