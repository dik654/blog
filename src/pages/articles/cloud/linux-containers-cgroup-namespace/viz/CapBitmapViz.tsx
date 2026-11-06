import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #capabilities — CapEff 00000000a80425fb를 비트 칸에 펼친다. capability는 0~40번 41개.
 * fb = 0,1,3,4,5,6,7 / 25 = 8,10,13 / 04 = 18 / a8 = 27,29,31 → 7 + 3 + 1 + 3 = 14개.
 * runAsUser가 0이 아니면 execve 때 비워지고, capabilities.add로 10번만 돌려준다.
 */
interface Scene extends ShellScene {
  lit: readonly number[];
  warn: readonly number[];
  list: string;
}

const FB = [0, 1, 3, 4, 5, 6, 7];
const X25 = [8, 10, 13];
const REST = [18, 27, 29, 31];
const ALL = [...FB, ...X25, ...REST];
const BIND = 10;

const ROWS: readonly { hex: string; bits: readonly number[] }[] = [
  { hex: "fb", bits: [7, 6, 5, 4, 3, 2, 1, 0] },
  { hex: "25", bits: [15, 14, 13, 12, 11, 10, 9, 8] },
  { hex: "04", bits: [23, 22, 21, 20, 19, 18, 17, 16] },
  { hex: "a8", bits: [31, 30, 29, 28, 27, 26, 25, 24] },
  { hex: "00…", bits: [40, 39, 38, 37, 36, 35, 34, 33, 32] },
];

const SCENES: readonly Scene[] = [
  { label: "오른쪽 끝 fb", summary: "1111 1011 → 7개", lit: FB, warn: [], list: "CHOWN · DAC_OVERRIDE · FOWNER · FSETID · KILL · SETGID · SETUID", note: "16진수 두 자리는 비트 여덟 칸입니다. 줄의 왼쪽이 높은 번호입니다. fb를 2진수로 풀면 2번만 꺼져 있습니다." },
  { label: "그다음 25", summary: "0010 0101 → 10번이 켜짐", lit: [...FB, ...X25], warn: [], list: "SETPCAP(8) · NET_BIND_SERVICE(10) · NET_RAW(13)", note: "10번이 1024 미만 포트에 bind하는 능력입니다. 이 비트가 있어 root로 도는 기본 컨테이너는 80번에 bind할 수 있습니다." },
  { label: "남은 04와 a8", summary: "18 · 27 · 29 · 31", lit: ALL, warn: [12, 21], list: "SYS_CHROOT(18) · MKNOD(27) · AUDIT_WRITE(29) · SETFCAP(31)", note: "점선은 꺼져 있는 12번 NET_ADMIN과 21번 SYS_ADMIN입니다. 그래서 라우팅 표를 바꾸거나 mount할 수 없습니다." },
  { label: "켜진 칸 세기", summary: "7 + 3 + 1 + 3 = 14 / 41", lit: ALL, warn: [], list: "켜짐 14개 · 꺼짐 27개", note: "32번 위쪽은 00000000이라 모두 꺼져 있습니다. 41칸 가운데 14칸이 켜져 있으며, Kubernetes 문서의 기본 컨테이너 예제 값입니다." },
  { label: "runAsUser 1000", summary: "CapEff 비워짐 → bind EACCES", lit: [], warn: [BIND], list: "켜진 칸 없음", note: "UID가 0이 아니면 execve 때 Permitted·Effective가 비워집니다. 10번이 없어 bind()가 EACCES를 돌려주는 것이 1절의 실패입니다." },
  { label: "10번 돌려주기", summary: "10번 하나만 → bind 가능", lit: [BIND], warn: [], list: "NET_BIND_SERVICE(10)", note: "capabilities.add로 필요한 비트 하나만 돌려줍니다. 나머지는 drop: [ALL]로 비우는 것이 가장 좁은 설정입니다." },
];

export default function CapBitmapViz() {
  return (
    <SceneShell
      eyebrow="CapEff bitmap"
      title="16진수 하나를 풀면 켜진 능력 칸이 보입니다"
      description="칸 하나가 capability 번호 하나이고 진한 칸이 켜진 비트입니다. CapEff 00000000a80425fb를 오른쪽 두 자리부터 펼쳤습니다."
      ariaLabel="capability 41개 칸에서 켜진 비트와 사용자 ID에 따른 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="space-y-1">
              {ROWS.map((row) => (
                <div key={row.hex} className="grid grid-cols-[2rem_repeat(9,minmax(0,1fr))] items-center gap-0.5 sm:gap-1">
                  <span className="font-mono text-xs font-bold">{row.hex}</span>
                  {row.bits.length === 8 && <span />}
                  {row.bits.map((bit) => {
                    const on = scene.lit.includes(bit);
                    const warn = scene.warn.includes(bit);
                    const key = bit === BIND && on;
                    return (
                      <span
                        key={bit}
                        className={`flex h-6 min-w-0 items-center justify-center rounded-sm border font-mono text-[11px] ${
                          key
                            ? "border-[#b45309] bg-[#b45309] font-bold text-white"
                            : on
                              ? "border-[#2563eb] bg-[#2563eb] font-bold text-white"
                              : warn
                                ? "border-dashed border-[#dc2626] font-bold text-[#dc2626]"
                                : "border-border/70 text-muted-foreground/70"
                        }`}
                      >
                        {bit}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs leading-5 sm:min-h-0">{scene.list}</p>
          </div>
        );
      }}
    />
  );
}
