import SceneShell from "./SceneShell";

/**
 * 본문 대응: #diagnose — logrotate create와 copytruncate.
 * 왼쪽 이름, 가운데 inode, 오른쪽 프로세스의 fd. 프로세스는 이름이 아니라 inode를 쥐고 있다.
 * inode A·B·C, app.log.1은 설명용 이름이다.
 */
type InodeId = "A" | "B" | "C";

interface State {
  names: readonly { name: string; to: InodeId }[];
  inodes: readonly { id: InodeId; text: string; warn?: boolean }[];
  fd: InodeId;
}

const STATES: readonly State[] = [
  { names: [{ name: "app.log", to: "A" }], inodes: [{ id: "A", text: "로그 쌓이는 중" }], fd: "A" },
  { names: [{ name: "app.log.1", to: "A" }, { name: "app.log", to: "B" }], inodes: [{ id: "A", text: "fd가 계속 쓰는 중" }, { id: "B", text: "새 빈 파일" }], fd: "A" },
  { names: [{ name: "app.log.1", to: "A" }, { name: "app.log", to: "B" }], inodes: [{ id: "A", text: "더 안 씀" }, { id: "B", text: "로그 쌓이는 중" }], fd: "B" },
  { names: [{ name: "app.log.1", to: "A" }, { name: "app.log", to: "B" }], inodes: [{ id: "A", text: "옛 inode에 계속 씀" }, { id: "B", text: "비어 있음" }], fd: "A" },
  { names: [{ name: "app.log", to: "B" }], inodes: [{ id: "A", text: "이름 없음 · 블록 붙잡힘", warn: true }, { id: "B", text: "비어 있음" }], fd: "A" },
  { names: [{ name: "app.log", to: "A" }, { name: "app.log.1", to: "C" }], inodes: [{ id: "A", text: "제자리에서 0으로 잘림" }, { id: "C", text: "복사본" }], fd: "A" },
];

const SCENES = [
  { label: "회전 전", summary: "이름 1개 · fd는 inode A", note: "프로세스의 fd는 이름이 아니라 inode를 쥐고 있습니다. 앞으로 이름이 바뀌어도 fd는 저절로 따라가지 않습니다." },
  { label: "create · 이름 바꾸고 새 파일", summary: "이름은 옮겨도 fd는 A", note: "logrotate의 create 방식은 로그 파일 이름을 바꾸고 같은 이름으로 새 파일을 만듭니다. 새 app.log는 새 inode이고, fd는 아직 옛 inode를 쥡니다." },
  { label: "갈래 1 · 신호 받고 다시 엶", summary: "fd → B", note: "애플리케이션이 postrotate의 신호를 받아 새 파일을 다시 열면 fd가 B로 옮겨 갑니다. 옛 A는 나중에 이름이 지워지면 쥔 fd가 없으니 6절의 규칙대로 블록이 돌아옵니다." },
  { label: "갈래 2 · 다시 안 엶", summary: "fd는 A에 그대로", note: "다시 열지 않으면 계속 옛 inode에 씁니다. 이름 app.log를 봐도 로그가 늘지 않고 app.log.1 쪽 inode가 자랍니다." },
  { label: "보관 개수를 넘어 삭제", summary: "링크 0 · fd 남음", note: "보관 개수를 넘은 옛 파일이 지워지는 순간 A는 이름이 없고 fd만 남습니다. 열린 채 지워진 파일이고 사례 A의 상태입니다." },
  { label: "copytruncate", summary: "복사 뒤 같은 inode를 자름", note: "복사본을 만든 뒤 원래 파일을 제자리에서 0으로 자르므로 fd는 같은 A를 계속 씁니다. 지운 파일이 블록을 붙잡는 문제는 생기지 않습니다. 다만 복사와 자르기 사이에 쓴 로그는 사라질 수 있고, O_APPEND 없이 연 로그면 sparse 파일이 생깁니다." },
];

const ROW_Y: readonly number[] = [52, 118];
const NAME_X = 8;
const NAME_W = 92;
const INODE_X = 128;
const INODE_W = 134;
const PROC_X = 292;
const PROC_W = 60;

export default function LogrotateViz() {
  return (
    <SceneShell
      eyebrow="로그 회전"
      title="회전 뒤에도 프로세스는 이름이 아니라 inode를 쥐고 있습니다"
      description="왼쪽은 디렉터리의 이름, 가운데는 inode, 오른쪽은 프로세스의 fd입니다. 선이 무엇을 가리키는지가 이 그림의 내용입니다. 사례 A가 생기는 근본 원인은 대개 이 설정에 있습니다."
      note="inode A·B·C와 app.log.1은 설명용 이름입니다(가정)."
      ariaLabel="logrotate create와 copytruncate에서 이름, inode, fd의 연결"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const inodeY = (id: InodeId) => ROW_Y[state.inodes.findIndex((inode) => inode.id === id)] ?? ROW_Y[0];
        const fdY = inodeY(state.fd);
        const procY = 85;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={NAME_X} y={14} fontSize={12} fontWeight={700} fill="#2563eb">이름</text>
            <text x={INODE_X} y={14} fontSize={12} fontWeight={700} fill="#7c3aed">inode</text>
            <text x={PROC_X} y={14} fontSize={12} fontWeight={700} fill="#dc2626">프로세스</text>
            {state.names.map((entry) => {
              const y = inodeY(entry.to);
              return (
                <g key={entry.name}>
                  <rect x={NAME_X} y={y - 16} width={NAME_W} height={32} rx={6} fill="#ffffff" stroke="#2563eb" strokeWidth={1} />
                  <text x={NAME_X + NAME_W / 2} y={y + 4} textAnchor="middle" fontSize={12} fill="#0f172a">{entry.name}</text>
                  <line x1={NAME_X + NAME_W} y1={y} x2={INODE_X} y2={y} stroke="#2563eb" strokeWidth={1.25} />
                </g>
              );
            })}
            {state.inodes.map((inode, index) => (
              <g key={inode.id}>
                <rect x={INODE_X} y={ROW_Y[index] - 24} width={INODE_W} height={48} rx={6} fill={inode.warn ? "#fee2e2" : "#ffffff"} stroke={inode.warn ? "#dc2626" : "#7c3aed"} strokeWidth={1} />
                <text x={INODE_X + INODE_W / 2} y={ROW_Y[index] - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">inode {inode.id}</text>
                <text x={INODE_X + INODE_W / 2} y={ROW_Y[index] + 13} textAnchor="middle" fontSize={10.5} fill="#334155">{inode.text}</text>
              </g>
            ))}
            <rect x={PROC_X} y={procY - 20} width={PROC_W} height={40} rx={6} fill="#ffffff" stroke="#dc2626" strokeWidth={1} />
            <text x={PROC_X + PROC_W / 2} y={procY + 4} textAnchor="middle" fontSize={12} fill="#0f172a">fd</text>
            <line x1={PROC_X} y1={procY} x2={INODE_X + INODE_W} y2={fdY} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
          </svg>
        );
      }}
    />
  );
}
