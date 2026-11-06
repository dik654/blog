import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 바깥에서 본 여섯 칸과, 그 칸들이 VFS·mount·page cache·writeback·장치로 묶이는 방식.
 * 칸 번호는 본문의 "첫 두 칸", "셋째 칸", "넷째·다섯째 칸", "여섯째 칸"을 그대로 따른다.
 */
const CELLS = [
  { name: "이름", role: "경로를 조각내 찾기 시작", where: "3절" },
  { name: "inode", role: "이름이 가리키는 파일", where: "3절" },
  { name: "mount", role: "이 경로를 맡을 파일시스템을 정함", where: "4·5절" },
  { name: "page cache", role: "write()가 바이트를 적고 dirty 표시", where: "6절" },
  { name: "writeback", role: "커널 스레드가 블록 층으로 내려보냄", where: "6·7절" },
  { name: "블록 층·장치", role: "장치에 요청, 장치가 완료를 알림", where: "9절" },
] as const;

const SCENES = [
  { label: "여섯 칸 전체", summary: "위에서 아래로 내려갑니다", on: [0, 1, 2, 3, 4, 5], outage: false, note: "open()부터 장치의 완료 통지까지 한 바이트가 지나는 길입니다. 오른쪽 숫자는 그 칸을 자세히 보는 절입니다. 앞으로 각 칸에서 어디서 멈추는지를 표시하면서 내려갑니다." },
  { label: "첫 두 칸 · VFS", summary: "파일시스템이 달라도 같은 호출", on: [0, 1], outage: false, note: "VFS(Virtual File System)는 파일시스템들 위에 놓인 공통 층입니다. ext4, xfs, tmpfs, overlay, nfs가 전부 다른 코드인데도 프로그램이 같은 open/read/write를 쓰는 이유가 이 층입니다." },
  { label: "셋째 칸 · mount", summary: "볼륨과 이미지 layer가 걸리는 곳", on: [2], outage: false, note: "컨테이너 볼륨과 이미지 layer가 여기 걸립니다. 1절에서 한 줄을 덧붙이는 데 1초가 걸린 사건은 이 칸에 얹힌 overlayfs의 copy_up이며 5절에서 풉니다." },
  { label: "넷째·다섯째 칸", summary: "1절의 정전은 이 사이", on: [3, 4], outage: true, note: "dirty는 디스크 원본과 내용이 달라졌다는 표시입니다. write()는 넷째 칸에서 돌아오므로 다섯째 칸으로 내려가기 전에 전원이 나가면 그 바이트는 RAM과 함께 사라집니다. 공간이 남는데 쓰기가 멈춘 세 번째 사건도 6절에서 이 구간을 따라 풉니다." },
  { label: "여섯째 칸", summary: "iostat가 보는 곳", on: [5], outage: false, note: "블록 층이 장치에 요청을 보내고 장치가 완료를 알립니다." },
] as const;

export default function StackPathViz() {
  return (
    <SceneShell
      eyebrow="여섯 칸"
      title="바이트가 지나는 여섯 칸과 사건이 걸리는 자리"
      description="한 줄이 한 칸입니다. 위가 프로그램 쪽, 아래가 장치 쪽이고, 진한 테두리가 지금 보는 칸입니다."
      ariaLabel="이름, inode, mount, page cache, writeback, 블록 층과 장치의 여섯 칸"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = new Set<number>(scene.on);
        return (
          <ol className="min-w-0 space-y-1.5">
            {CELLS.map((cell, index) => (
              <li key={cell.name} className="min-w-0">
                <div
                  className={`grid grid-cols-[1.25rem_minmax(0,1fr)_2.75rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors duration-300 motion-reduce:transition-none ${
                    on.has(index) ? "border-primary bg-primary/5" : "border-border/60 text-muted-foreground"
                  }`}
                >
                  <span className="font-mono text-xs tabular-nums">{index + 1}</span>
                  <span className="min-w-0">
                    <span className={`block text-sm leading-5 ${on.has(index) ? "font-bold" : ""}`}>{cell.name}</span>
                    <span className="block text-xs leading-5 text-muted-foreground">{cell.role}</span>
                  </span>
                  <span className="text-right font-mono text-xs">{cell.where}</span>
                </div>
                {index === 3 && (
                  <p className={`mt-1.5 border-t border-dashed border-red-600 pt-0.5 text-center text-xs font-bold leading-5 text-red-700 dark:text-red-400 ${scene.outage ? "" : "invisible"}`}>
                    여기서 정전: 내려가기 전의 dirty page는 사라짐
                  </p>
                )}
              </li>
            ))}
          </ol>
        );
      }}
    />
  );
}
