import SceneShell from "./SceneShell";

/**
 * 본문 대응: #read-write "read_file의 offset과 limit은 line 기준이다".
 * 6줄 file(가정). offset은 zero-based, startLine = offset + 1(one-based), 최대 limit줄.
 * offset 2·limit 3 → index 2..4, startLine 3, numLines 3. offset 4·limit 3 → index 4..5, numLines 2.
 * offset 8 → 빈 range. CRLF file은 lines() 뒤 \n으로 다시 이어 원본 bytes와 달라질 수 있다.
 */
const TOTAL = 6;

const SCENES = [
  {
    label: "offset 2 · limit 3",
    summary: "startLine 3 · numLines 3",
    offset: 2,
    limit: 3,
    crlf: false,
    note: "offset은 0부터 세므로 offset 2는 세 번째 줄입니다. 거기서 최대 3줄을 고르면 index 2·3·4이고, 사람에게 보이는 startLine은 1부터 센 3입니다. totalLines는 file 전체 6입니다.",
  },
  {
    label: "offset 4 · limit 3",
    summary: "startLine 5 · numLines 2",
    offset: 4,
    limit: 3,
    crlf: false,
    note: "limit은 최대 개수입니다. index 4 뒤에는 두 줄만 남아 numLines는 3이 아니라 2입니다.",
  },
  {
    label: "offset 8 · limit 3",
    summary: "빈 range · 오류 아님",
    offset: 8,
    limit: 3,
    crlf: false,
    note: "offset이 끝(index 5)을 넘으면 오류 대신 아무 줄도 고르지 않은 빈 range가 돌아옵니다. '없는 위치를 요청했다'는 신호를 오류로 받지 못한다는 뜻입니다.",
  },
  {
    label: "CRLF file 전체",
    summary: "다시 이은 문자열 ≠ 원본 bytes",
    offset: 0,
    limit: 6,
    crlf: true,
    note: "같은 6줄이 줄마다 CRLF(\\r\\n)로 끝난다고 가정하면, lines()로 나눈 줄을 \\n으로 다시 잇기 때문에 반환 문자열에는 \\r도 마지막 줄바꿈도 남지 않습니다. 그래서 이 결과를 byte 그대로의 snapshot으로 쓰면 안 됩니다.",
  },
] as const;

export default function ReadRangeViz() {
  return (
    <SceneShell
      eyebrow="Line range"
      title="offset은 0부터, startLine은 1부터 센다"
      description="6줄짜리 file(가정)에서 read_file이 고르는 줄입니다. 왼쪽 숫자는 offset이 세는 index, 오른쪽 숫자는 1부터 센 사람용 줄 번호입니다. 고른 첫 줄의 오른쪽 번호가 결과의 startLine입니다."
      ariaLabel="read_file의 offset과 limit이 6줄 file에서 고르는 범위"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const end = Math.min(scene.offset + scene.limit, TOTAL);
        const picked = Array.from({ length: TOTAL }, (_, i) => i >= scene.offset && i < end);
        const lineEnd = scene.crlf ? "\\r\\n" : "\\n";
        const joined = Array.from({ length: Math.max(end - scene.offset, 0) }, (_, i) => `L${scene.offset + i + 1}`).join("\\n");
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] gap-x-2 text-[11px] font-bold text-muted-foreground">
              <span>offset index</span>
              <span>file 내용</span>
              <span className="text-right">줄 번호</span>
            </div>
            <ol className="mt-1 space-y-1">
              {picked.map((on, i) => (
                <li
                  key={i}
                  className={`grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-x-2 rounded border px-2 py-1 font-mono text-xs ${
                    on ? "border-[#2563eb] bg-[#dbeafe] text-[#1e3a8a] dark:bg-[#172554] dark:text-[#bfdbfe]" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  <span>{i}</span>
                  <span className="truncate">
                    L{i + 1}
                    <span className="ml-1 text-muted-foreground">{lineEnd}</span>
                  </span>
                  <span className="text-right">{i + 1}</span>
                </li>
              ))}
              <li className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-x-2 rounded border border-dashed border-border/60 px-2 py-1 font-mono text-xs text-muted-foreground">
                <span className={scene.offset >= TOTAL ? "font-bold text-[#b45309]" : ""}>6 이상</span>
                <span className="truncate">{scene.offset >= TOTAL ? `offset ${scene.offset}: 줄 없음` : "file 끝"}</span>
                <span />
              </li>
            </ol>
            <div className="mt-3 rounded border border-border px-2 py-2 font-mono text-xs leading-5">
              <span className="font-sans font-bold text-muted-foreground">반환 content </span>
              <span className="break-all">{joined === "" ? '""' : `"${joined}"`}</span>
              <span className="block font-sans text-muted-foreground">
                {end > scene.offset
                  ? `startLine ${scene.offset + 1} · numLines ${end - scene.offset} · totalLines ${TOTAL}`
                  : `numLines 0 · totalLines ${TOTAL}`}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
