import SceneShell from "./SceneShell";

/**
 * 본문 대응: #edge-mesh — 404와 SYN timeout이 조사 시작점을 가른다.
 * 404 쪽 번호는 글의 "차례로"를 따릅니다. timeout 쪽은 글이 순서를 정하지 않아 번호를 붙이지 않습니다.
 */
const EARLY = ["외부 진입", "Service", "Pod route", "policy"] as const;
const LATE = ["Gateway의 host와 route match", "mesh의 L7 route", "application route"] as const;

const SCENES = [
  {
    label: "HTTP 404",
    summary: "L7 쪽부터 차례로",
    note: "404는 server 또는 앞단 proxy가 응답을 만들었다는 증거입니다. 그래서 Gateway의 host와 route match, mesh의 L7 route, application route를 차례로 봅니다.",
  },
  {
    label: "SYN timeout",
    summary: "앞선 구간에서 첫 실패 찾기",
    note: "SYN은 TCP 연결을 여는 첫 packet입니다. 여기서 시간이 초과되면 HTTP 내용을 읽기보다 앞선 외부 진입, Service, Pod route와 policy에서 첫 실패를 찾습니다.",
  },
] as const;

function Stop({ name, on, mark }: { name: string; on: boolean; mark: string }) {
  return (
    <li className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs leading-5 sm:text-sm ${on ? "border-blue-600 font-semibold" : "border-border text-muted-foreground opacity-60"}`}>
      <span className={`w-4 shrink-0 text-center font-mono font-bold ${on ? "text-blue-700 dark:text-blue-300" : ""}`}>{mark}</span>
      <span className="min-w-0">{name}</span>
    </li>
  );
}

export default function ResponseBranchViz() {
  return (
    <SceneShell
      eyebrow="조사 시작점"
      title="같은 접속 실패라도 응답 종류가 먼저 볼 곳을 바꿉니다"
      description="요청이 지나는 구간을 연결과 HTTP 내용 두 묶음으로 나눴습니다. 줄 순서가 실제 통과 순서는 아닙니다. 파란 칸이 그 응답에서 먼저 볼 곳이고, 번호는 404에서 확인할 차례입니다."
      ariaLabel="HTTP 404와 SYN timeout에서 먼저 조사할 구간 비교"
      scenes={SCENES}
      render={(scene) => {
        const is404 = scene === 0;
        return (
          <div className="mx-auto max-w-xl space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-bold text-muted-foreground">연결까지의 구간</p>
              <ol className="space-y-1">
                {EARLY.map((name) => (
                  <Stop key={name} name={name} on={!is404} mark={is404 ? "" : "?"} />
                ))}
              </ol>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-bold text-muted-foreground">HTTP 내용을 읽는 구간</p>
              <ol className="space-y-1">
                {LATE.map((name, index) => (
                  <Stop key={name} name={name} on={is404} mark={is404 ? String(index + 1) : ""} />
                ))}
              </ol>
            </div>
          </div>
        );
      }}
    />
  );
}
