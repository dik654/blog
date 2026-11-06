import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 연결 하나를 찾는 네 값과 그중 클라이언트가 고르는 출발 포트.
 * 같은 upstream으로 가는 연결은 출발 포트로만 구분되고, 서버는 포트 8080 하나에 두 줄을 세운다.
 * 주소는 3절의 가정 사례, 41022 같은 포트 번호와 10.0.0.12는 그림용 예시다.
 */
const COLUMNS: readonly string[] = ["출발 IP", "출발 포트", "목적 IP", "목적 포트"];
const WHO: readonly string[] = ["나가는 인터페이스", "클라이언트가 고름", "호출 대상", "호출 대상"];

const ROWS: readonly (readonly (readonly string[])[])[] = [
  [["10.0.0.5", "41022", "10.0.0.11", "8080"]],
  [["10.0.0.5", "41022", "10.0.0.11", "8080"]],
  [
    ["10.0.0.5", "41022", "10.0.0.11", "8080"],
    ["10.0.0.5", "41024", "10.0.0.11", "8080"],
    ["10.0.0.5", "41026", "10.0.0.11", "8080"],
  ],
  [
    ["10.0.0.5", "41022", "10.0.0.11", "8080"],
    ["10.0.0.5", "41022", "10.0.0.12", "8080"],
  ],
];

const SCENES = [
  { label: "연결 하나는 네 값입니다", summary: "출발 IP·포트 + 목적 IP·포트", note: "커널은 연결마다 이 네 값을 묶어 table에 넣고, 들어온 packet이 어느 연결의 것인지 이 네 값으로 찾습니다. 이 묶음을 4-tuple이라고 부릅니다." },
  { label: "누가 무엇을 정합니까", summary: "클라이언트가 고르는 값은 하나", note: "출발 IP는 나가는 인터페이스가, 목적지는 호출 대상이 정합니다. 클라이언트가 고르는 값은 출발 포트 하나뿐입니다." },
  { label: "같은 upstream으로 여러 개", summary: "구분할 수 있는 칸은 출발 포트뿐", note: "세 값이 모두 같으니 연결끼리는 출발 포트로만 서로를 구분합니다. 포트를 다른 연결이 아직 쥐고 있으면 그 번호는 쓸 수 없습니다." },
  { label: "목적지가 다르면", summary: "같은 41022도 다른 연결", note: "네 값 전체가 달라지므로 목적지가 다르면 같은 출발 포트를 다시 쓸 수 있습니다. 그래서 포트 수는 목적지 묶음마다 따로 셉니다." },
  { label: "서버 쪽은 모양이 다릅니다", summary: "listen 소켓 하나 + 줄 둘", note: "listen() 중인 소켓 하나가 포트 8080을 지키고 두 줄을 세웁니다. 연결이 끝나도 서버의 8080은 그대로라서 서버는 포트가 바닥나지 않습니다." },
] as const;

function TupleTable({ active }: { active: number }) {
  const scene = Math.min(active, ROWS.length - 1);
  const rows = ROWS[scene];
  const showWho = scene === 1;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-4 gap-1 text-center text-[11px] font-semibold text-muted-foreground sm:text-xs">
        {COLUMNS.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        {[0, 1, 2].map((slot) => {
          const row = rows[slot];
          return (
            <div key={slot} className="grid h-9 grid-cols-4 gap-1">
              {row
                ? row.map((value, index) => {
                    const changesHere = (scene === 2 && index === 1) || (scene === 3 && index === 2);
                    const picked = scene === 1 && index === 1;
                    const strong = changesHere || picked;
                    return (
                      <span
                        key={index}
                        className={`flex min-w-0 items-center justify-center rounded-md border font-mono text-[11px] sm:text-sm ${strong ? "font-bold" : ""}`}
                        style={{ borderColor: strong ? "#2563eb" : undefined, color: strong ? "#2563eb" : undefined }}
                      >
                        {value}
                      </span>
                    );
                  })
                : null}
            </div>
          );
        })}
      </div>
      <div className="mt-2 grid min-h-[2.5rem] grid-cols-4 gap-1 text-center text-[11px] leading-4 text-muted-foreground sm:text-xs">
        {WHO.map((who, index) => (
          <span key={who + index} className={!showWho ? "invisible" : index === 1 ? "font-bold text-foreground" : ""}>
            {who}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServerSide() {
  return (
    <div className="min-w-0 space-y-2 text-sm">
      <div className="rounded-lg border px-3 py-2 text-center font-mono font-bold" style={{ borderColor: "#2563eb", color: "#2563eb" }}>
        listen 소켓 · 포트 8080
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="min-w-0 rounded-lg border border-border px-2 py-2 text-center">
          <p className="text-xs font-semibold">첫째 줄</p>
          <p className="mt-1 text-xs text-muted-foreground">handshake 중인 연결</p>
        </div>
        <div className="min-w-0 rounded-lg border border-border px-2 py-2 text-center">
          <p className="text-xs font-semibold">둘째 줄</p>
          <p className="mt-1 text-xs text-muted-foreground">handshake를 마치고 accept()를 기다리는 연결</p>
        </div>
      </div>
    </div>
  );
}

export default function FourTupleViz() {
  return (
    <SceneShell
      eyebrow="연결의 이름표"
      title="연결은 네 값으로 찾고, 클라이언트가 고르는 값은 출발 포트뿐입니다"
      description="칸 한 줄이 연결 하나입니다. handshake는 연결을 여는 인사 절차입니다. 주소는 3절의 사례이고 포트 번호와 10.0.0.12는 예시입니다(가정)."
      ariaLabel="4-tuple의 네 값과 클라이언트, 서버의 포트 사용 차이"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active === 4 ? 1 : 0} scenes={[<TupleTable key="table" active={active} />, <ServerSide key="server" />]} />}
    />
  );
}
