import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mount — 경로를 따라가다 다른 파일시스템으로 갈아타는 지점, bind mount가 만드는 두 이름, 서브마운트의 재귀.
 * /var/log 파티션과 /data/logs → /srv/app/logs는 본문 예시, archive 서브마운트만 설명용 가정이다.
 */
const SCENES = [
  { label: "경로 중간에서 갈아타기", summary: "log에서 다른 superblock으로", note: "/var/log가 별도 파티션이면 \"log\" 조각에 ext4가 얹혀 있습니다. 커널은 여기서 그 파일시스템의 루트 dentry로 갈아타고 이어 갑니다. superblock은 파일시스템 하나를 대표하는 구조입니다. 어느 dentry 위에 무엇이 얹혔는지 적어 둔 것이 mount 표입니다." },
  { label: "bind mount", summary: "데이터 한 벌, 이름 둘", note: "mount --bind /data/logs /srv/app/logs는 새 파일시스템을 만들지 않습니다. do_loopback이 원본 mount 구조를 clone_mnt로 복제해 새 지점에 접붙이므로 두 이름이 같은 dentry 트리를 봅니다. 컨테이너 볼륨이 이것이라 쓰는 속도는 호스트 파일시스템 속도 그대로입니다." },
  { label: "기본 --bind", summary: "서브마운트는 안 따라옴", note: "서브마운트는 그 디렉터리 아래에 또 얹힌 mount입니다. (가정) /data/logs/archive가 별도 mount일 때, 기본 bind는 그 디렉터리만 보이게 하므로 archive에 얹힌 mount는 새 지점으로 오지 않습니다." },
  { label: "--rbind (MS_REC)", summary: "서브마운트까지 재귀로", note: "MS_REC(mount --rbind)를 주면 아래의 서브마운트까지 재귀로 따라옵니다. 같은 가정에서 archive에 얹힌 mount도 새 지점에서 보입니다." },
] as const;

const W = 360;
const H = 196;
const INK = "#475569";
const ACCENT = "#2563eb";
const WARN = "#dc2626";

function Node({ x, y, w, label, color = "#94a3b8", dashed = false, ink = INK, bold = false }: { x: number; y: number; w: number; label: string; color?: string; dashed?: boolean; ink?: string; bold?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={28} rx={6} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize={12} fontWeight={bold ? 700 : 500} fill={ink}>
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = "#94a3b8", dashed = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a = 6;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <path
        d={`M${x2 - a * Math.cos(angle - 0.5)} ${y2 - a * Math.sin(angle - 0.5)} L${x2} ${y2} L${x2 - a * Math.cos(angle + 0.5)} ${y2 - a * Math.sin(angle + 0.5)}`}
        fill="none"
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
}

function Crossing() {
  return (
    <>
      <text x={12} y={16} fontSize={11} fill="#64748b">루트 파일시스템</text>
      <Node x={12} y={24} w={100} label="/" />
      <Arrow x1={62} y1={52} x2={62} y2={70} />
      <Node x={12} y={70} w={100} label="var" />
      <Arrow x1={62} y1={98} x2={62} y2={116} />
      <Node x={12} y={116} w={100} label="log" color={ACCENT} ink={ACCENT} bold />
      <text x={228} y={16} fontSize={11} fill="#64748b">별도 파티션 ext4</text>
      <Node x={228} y={116} w={120} label="그쪽의 루트 dentry" color={ACCENT} ink={ACCENT} bold />
      <Arrow x1={288} y1={144} x2={288} y2={160} />
      <Node x={228} y={160} w={120} label="app.log" />
      <Arrow x1={112} y1={130} x2={228} y2={130} color={ACCENT} />
      <text x={170} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>갈아탐</text>
      <rect x={120} y={24} width={228} height={72} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <text x={234} y={48} textAnchor="middle" fontSize={11} fill="#64748b">mount 표</text>
      <text x={234} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>log 위 → ext4(다른 superblock)</text>
    </>
  );
}

function Bind() {
  return (
    <>
      <text x={12} y={16} fontSize={11} fill="#64748b">이름 둘(mount 구조 둘)</text>
      <Node x={12} y={28} w={136} label="/data/logs" />
      <text x={80} y={73} textAnchor="middle" fontSize={11} fill="#64748b">clone_mnt로 복제</text>
      <Arrow x1={80} y1={56} x2={80} y2={62} />
      <Arrow x1={80} y1={78} x2={80} y2={92} />
      <Node x={12} y={92} w={136} label="/srv/app/logs" color={ACCENT} ink={ACCENT} bold />
      <text x={222} y={16} fontSize={11} fill="#64748b">데이터 한 벌</text>
      <rect x={222} y={28} width={126} height={92} rx={8} fill="none" stroke={ACCENT} strokeWidth={1} />
      <text x={285} y={64} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>같은 dentry 트리</text>
      <text x={285} y={84} textAnchor="middle" fontSize={11} fill="#64748b">원래 파일시스템 그대로</text>
      <Arrow x1={148} y1={42} x2={222} y2={58} />
      <Arrow x1={148} y1={106} x2={222} y2={92} color={ACCENT} />
      <rect x={12} y={140} width={336} height={34} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <text x={180} y={162} textAnchor="middle" fontSize={11} fill={INK}>새 superblock 없음 · 컨테이너 볼륨이 이 모양</text>
    </>
  );
}

function Sub({ follows }: { follows: boolean }) {
  const color = follows ? ACCENT : WARN;
  return (
    <>
      <text x={12} y={16} fontSize={11} fill="#64748b">원본</text>
      <Node x={12} y={28} w={136} label="/data/logs" />
      <Arrow x1={80} y1={56} x2={80} y2={84} />
      <Node x={12} y={84} w={136} label="archive" />
      <Arrow x1={80} y1={112} x2={80} y2={140} />
      <Node x={12} y={140} w={136} label="얹힌 서브마운트 (가정)" />
      <text x={212} y={16} fontSize={11} fill="#64748b">새 지점</text>
      <Node x={212} y={28} w={136} label="/srv/app/logs" color={ACCENT} ink={ACCENT} bold />
      <Arrow x1={280} y1={56} x2={280} y2={84} color={ACCENT} />
      <Node x={212} y={84} w={136} label="archive" color={ACCENT} ink={ACCENT} />
      <Arrow x1={280} y1={112} x2={280} y2={140} color={color} dashed={!follows} />
      <Node x={212} y={140} w={136} label={follows ? "서브마운트도 보임" : "서브마운트 없음"} color={color} ink={color} dashed={!follows} bold />
      <Arrow x1={148} y1={42} x2={212} y2={42} />
      <Arrow x1={148} y1={154} x2={212} y2={154} color={color} dashed={!follows} />
      <text x={180} y={180} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{follows ? "따라옴" : "안 따라옴"}</text>
    </>
  );
}

export default function MountTreeViz() {
  return (
    <SceneShell
      eyebrow="mount 표"
      title="경로 중간에서 갈아타고, 같은 트리를 두 이름으로 봅니다"
      description="상자 하나가 dentry 또는 그 위에 얹힌 파일시스템입니다. 화살표는 경로를 따라가는 방향이고, 원본에서 새 지점으로 건너가는 화살표만 복제입니다."
      ariaLabel="mount 갈아타기, bind mount, 서브마운트 재귀"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && <Crossing />}
          {active === 1 && <Bind />}
          {active === 2 && <Sub follows={false} />}
          {active === 3 && <Sub follows />}
        </svg>
      )}
    />
  );
}
