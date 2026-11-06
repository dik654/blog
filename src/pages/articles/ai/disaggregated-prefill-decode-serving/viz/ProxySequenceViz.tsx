import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proxy-request, #proxy-output — toy_proxy_server.py의 요청 복사와 전달.
 * 위에서 아래로 시간 순서. 생성 상한 8, 128B는 R의 설명용 값.
 */
const X = { user: 28, proxy: 118, p: 218, d: 326 };

const MESSAGES: readonly { from: number; to: number; y: number; text: string; tail?: string; labelX?: number; color: string }[] = [
  { from: X.user, to: X.proxy, y: 50, text: "요청 · 상한 8", color: "#64748b" },
  { from: X.proxy, to: X.p, y: 78, text: "복사본 · 상한 1", color: "#2563eb" },
  { from: X.p, to: X.proxy, y: 106, text: "전달 정보", color: "#7c3aed" },
  { from: X.proxy, to: X.d, y: 134, text: "원래 요청", tail: "+ 전달 정보", color: "#2563eb" },
  { from: X.p, to: X.d, y: 162, text: "128B · D가 READ", color: "#d97706" },
  { from: X.d, to: X.user, y: 190, text: "D의 바이트만", labelX: 272, color: "#16a34a" },
];

const SCENES = [
  { label: "요청을 복사합니다", summary: "P 복사본만 max_tokens = 1", upto: 1, on: [0, 1], note: "max_tokens는 생성 상한입니다. 복사본은 stream을 false로, do_remote_decode를 true로 두어 다른 장치가 기록을 읽을 수 있는 응답을 요청합니다. 원래 요청의 상한 8은 D 쪽에 남습니다." },
  { label: "P의 응답에서 꺼냅니다", summary: "kv_transfer_params", upto: 2, on: [2], note: "프록시는 응답에서 원본 엔진·요청 ID·블록 번호·접속 정보가 담긴 kv_transfer_params만 꺼냅니다. P의 출력 문자열은 사용자에게 내보내지 않습니다." },
  { label: "원래 요청을 D에 보냅니다", summary: "원래 요청 + 전달 정보", upto: 3, on: [3], note: "복사본이 아니라 원래 요청 객체에 전달 정보를 붙여 D로 보냅니다. P가 만든 토큰을 입력에 이어 붙이는 코드가 아닙니다." },
  { label: "D가 기록을 읽어옵니다", summary: "P → D 128B", upto: 4, on: [4], note: "기본 NIXL 경로에서는 D가 P의 기록을 읽어옵니다. 이 길에는 프록시가 끼지 않습니다. 자세한 읽기는 10절에서 봅니다." },
  { label: "D의 출력만 나갑니다", summary: "사용자에게 가는 바이트 = D", upto: 5, on: [5], note: "사용자가 받는 바이트는 전부 D에서 옵니다. 그래서 이 예제에서는 R의 4 ms 결과가 아니라 D의 8 ms 출력이 첫 출력이 됩니다." },
] as const;

export default function ProxySequenceViz() {
  return (
    <SceneShell
      eyebrow="vLLM v0.27.1 테스트용 프록시 · 상한 8·128B·4·8 ms는 (가정)"
      title="요청 하나가 복사본과 원래 요청으로 갈라집니다"
      description="세로선 하나가 참여자이고 위에서 아래로 시간이 흐릅니다. 테스트 예제의 정책이며 모든 서비스의 규칙은 아닙니다."
      ariaLabel="사용자, 프록시, P, D 사이에서 오가는 요청과 기록의 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on: readonly number[] = scene.on;
        return (
          <svg key={scene.label} viewBox="0 0 360 202" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[{ x: X.user, t: "사용자" }, { x: X.proxy, t: "프록시" }, { x: X.p, t: "P" }, { x: X.d, t: "D" }].map((who) => (
              <g key={who.t}>
                <text x={who.x} y={16} textAnchor="middle" fontSize={13.5} fontWeight={700} fill="currentColor">{who.t}</text>
                <line x1={who.x} x2={who.x} y1={24} y2={198} stroke="#94a3b8" strokeWidth={1} />
              </g>
            ))}
            {MESSAGES.map((message, index) => {
              if (index > scene.upto) return null;
              const lit = on.includes(index);
              const color = lit ? message.color : "#94a3b8";
              const dir = message.to > message.from ? 1 : -1;
              const left = Math.min(message.from, message.to);
              const right = Math.max(message.from, message.to);
              return (
                <g key={message.text} opacity={lit ? 1 : 0.6}>
                  <line x1={message.from} x2={message.to} y1={message.y} y2={message.y} stroke={color} strokeWidth={lit ? 1.25 : 1} />
                  <path d={`M${message.to - dir * 6} ${message.y - 4} L${message.to} ${message.y} L${message.to - dir * 6} ${message.y + 4}`} fill="none" stroke={color} strokeWidth={1} />
                  <text x={message.tail ? (X.proxy + X.p) / 2 : message.labelX ?? (left + right) / 2} y={message.y - 5} textAnchor="middle" fontSize={11.5} fontWeight={lit ? 700 : 400} fill={lit ? message.color : "#64748b"}>{message.text}</text>
                  {message.tail && <text x={(X.p + X.d) / 2} y={message.y - 5} textAnchor="middle" fontSize={11.5} fontWeight={lit ? 700 : 400} fill={lit ? message.color : "#64748b"}>{message.tail}</text>}
                </g>
              );
            })}
            {active === 1 && <text x={73} y={110} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#dc2626">× P 출력 안 보냄</text>}
          </svg>
        );
      }}
    />
  );
}
