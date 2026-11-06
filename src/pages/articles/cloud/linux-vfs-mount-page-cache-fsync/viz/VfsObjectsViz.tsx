import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vfs-objects — open("/var/log/app.log")이 만드는 dentry 넷, inode, file, fd의 연결.
 * lookup_fast(모두 dcache에 있음)와 lookup_slow(없는 조각만 디스크에서 읽음)의 분기를 같은 칸에서 비교한다.
 */
const PIECES = ["/", "var", "log", "app.log"] as const;

type Piece = "idle" | "hit" | "miss" | "added";

const SCENES: readonly {
  label: string;
  summary: string;
  pieces: readonly Piece[];
  disk: string;
  diskUsed: boolean;
  inode: boolean;
  link: boolean;
  file: boolean;
  note: string;
}[] = [
  { label: "경로가 네 조각으로", summary: "조각마다 dentry 하나", pieces: ["idle", "idle", "idle", "idle"], disk: "아직 안 봄", diskUsed: false, inode: false, link: false, file: false, note: "dentry(directory entry)는 이름 하나와 그 이름이 가리키는 inode의 쌍입니다. RAM에만 있고 디스크에 저장되지 않으며, 다음 조회를 빠르게 하려고 존재합니다. 이 dentry들의 모음이 dcache입니다." },
  { label: "넷 다 cache에 있을 때", summary: "lookup_fast · 디스크 읽기 0번", pieces: ["hit", "hit", "hit", "hit"], disk: "읽기 0번", diskUsed: false, inode: true, link: false, file: false, note: "조각마다 lookup_fast가 먼저 dcache를 봅니다. 네 조각이 모두 있으면 디스크를 한 번도 읽지 않은 채 inode까지 이어집니다." },
  { label: "없는 조각이 있을 때", summary: "lookup_slow · 그 조각만 디스크로", pieces: ["hit", "hit", "hit", "miss"], disk: "디렉터리 읽기", diskUsed: true, inode: true, link: false, file: false, note: "(가정) 마지막 조각만 cache에 없는 경우입니다. lookup_slow가 그 파일시스템의 lookup()을 불러 디스크에서 디렉터리를 읽은 뒤 새 dentry를 cache에 넣습니다. 파일이 수백만 개인 디렉터리의 ls가 느린 것은 이 경로가 이름마다 불리기 때문입니다." },
  { label: "inode는 파일 자체", summary: "이름이 여럿이어도 파일은 하나", pieces: ["hit", "hit", "hit", "hit"], disk: "inode 원본", diskUsed: true, inode: true, link: true, file: false, note: "inode는 크기·권한·시각·데이터 블록 위치를 들고 있으며, 디스크의 것을 메모리로 복사해 쓰다가 바뀌면 되씁니다. 하드 링크처럼 여러 dentry가 한 inode를 가리킬 수 있고, 이름이 다 지워져도 누군가 열어 둔 동안에는 inode가 남습니다." },
  { label: "file과 fd", summary: "write(fd) → file → 함수 표", pieces: ["hit", "hit", "hit", "hit"], disk: "아직 안 씀", diskUsed: false, inode: true, link: false, file: true, note: "open()은 마지막으로 file 구조를 만들어 dentry를 가리키게 하고, inode에서 가져온 file_operations(그 파일시스템의 read·write·fsync 함수 표)를 채운 뒤 fd 표에 넣습니다. 그 뒤 write(fd, …)는 fd로 file을 찾아 그 표의 write를 부르므로, 어느 파일시스템 코드가 실행될지는 이미 정해져 있습니다." },
];

const PIECE_TEXT: Record<Piece, string> = { idle: "찾는 중", hit: "cache 있음", miss: "없음 → 추가", added: "추가됨" };

function Down({ label, show }: { label: string; show: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 py-1 text-xs leading-5 text-muted-foreground ${show ? "" : "invisible"}`}>
      <svg aria-hidden="true" viewBox="0 0 12 16" width="10" height="14" fill="none" stroke="#64748b" strokeWidth="1.25">
        <path d="M6 1v13M2 10l4 4 4-4" />
      </svg>
      {label}
    </div>
  );
}

export default function VfsObjectsViz() {
  return (
    <SceneShell
      eyebrow="open() 한 번"
      title="경로 하나가 dentry 넷, inode 하나, file 하나가 됩니다"
      description="위에서 아래로 open()이 지나는 순서입니다. 네 칸이 경로 조각이고, 맨 아래 줄이 write(fd)가 함수를 찾는 길입니다."
      ariaLabel="경로 조각별 dentry 조회와 inode, file, fd의 연결"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-1 font-mono text-xs text-muted-foreground">dcache · RAM에만 있음</p>
            <div className="grid grid-cols-4 gap-1.5">
              {PIECES.map((piece, i) => (
                <div
                  key={piece}
                  className={`rounded-lg border px-1 py-1.5 text-center ${
                    s.pieces[i] === "miss" ? "border-dashed border-red-600" : s.pieces[i] === "hit" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <span className="block font-mono text-xs font-bold">{piece}</span>
                  <span className={`block text-[11px] leading-4 ${s.pieces[i] === "miss" ? "text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{PIECE_TEXT[s.pieces[i]]}</span>
                </div>
              ))}
            </div>
            <Down label="app.log의 dentry가 가리킴" show={s.inode} />
            <div className="grid grid-cols-2 gap-1.5">
              <div className={`rounded-lg border px-2 py-1.5 ${s.inode ? "border-primary bg-primary/5" : "border-dashed border-border"}`}>
                <span className={`block text-xs font-bold ${s.inode ? "" : "text-muted-foreground"}`}>inode 하나</span>
                <span className="block text-[11px] leading-4 text-muted-foreground">{s.link ? "크기·권한·시각·블록 위치 / 하드 링크의 다른 dentry도 여기로" : "크기·권한·시각·블록 위치"}</span>
              </div>
              <div className={`rounded-lg border px-2 py-1.5 ${s.diskUsed ? "border-amber-600" : "border-dashed border-border"}`}>
                <span className="block text-xs font-bold">디스크</span>
                <span className={`block text-[11px] leading-4 ${s.diskUsed ? "font-semibold text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>{s.disk}</span>
              </div>
            </div>
            <Down label="open()이 마지막에 만듦" show={s.file} />
            <div className="grid grid-cols-[0.8fr_1fr_1.8fr] gap-1.5">
              {[
                { name: "fd 표", text: "프로세스별" },
                { name: "file", text: "dentry를 가리킴" },
                { name: "file_operations", text: "read·write·fsync 함수" },
              ].map((item) => (
                <div key={item.name} className={`min-w-0 rounded-lg border px-1.5 py-1.5 ${s.file ? "border-primary bg-primary/5" : "border-dashed border-border/60"}`}>
                  <span className={`block break-words font-mono text-[11px] font-bold leading-4 ${s.file ? "" : "text-muted-foreground/60"}`}>{item.name}</span>
                  <span className={`block text-[11px] leading-4 ${s.file ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
