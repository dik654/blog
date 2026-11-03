import { motion, useReducedMotion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const REQUEST_STEPS = [
  {
    label: "애플리케이션이 받을 byte를 고정",
    body: "Alice는 보고서의 기대 hash와 Bob의 EndpointId를 압니다. Iroh가 이 정보를 대신 찾아 주는 것은 아닙니다.",
  },
  {
    label: "EndpointAddr에 경로 후보를 모음",
    body: "직접 IP나 relay 주소가 있으면 넣고, 주소가 없거나 실패하면 설정된 AddressLookup이 후보를 보탤 수 있습니다.",
  },
  {
    label: "Iroh가 QUIC 연결 시도를 시작",
    body: "경로 selector가 쓸 수 있는 direct·custom·relay 후보를 고르고 endpoint ID를 TLS 이름으로 사용합니다.",
  },
  {
    label: "상대 신원과 ALPN을 합의",
    body: "handshake가 끝나면 Bob의 endpoint key와 통신 중임을 확인하고 /payroll/cid-fetch/1 처리기로 보냅니다.",
  },
  {
    label: "애플리케이션이 요청 권한을 검사",
    body: "ALPN 일치만으로 파일을 내주지 않습니다. 요청자·허용 hash·크기 제한을 handler에서 다시 확인합니다.",
  },
  {
    label: "받은 byte의 hash를 다시 계산",
    body: "기대 hash와 같을 때만 보고서를 공개합니다. 연결 성공과 payload 승인은 서로 다른 영수증입니다.",
  },
] as const;

const REQUEST_X = [54, 148, 242, 336, 430, 524];
const REQUEST_LABELS = ["기대 hash", "EndpointAddr", "Connecting", "Connection", "handler", "검증된 byte"];
const REQUEST_SUB = ["앱 소유", "id + paths", "경로 시도", "id + ALPN", "권한 검사", "hash 일치"];
const REQUEST_COLORS = ["#2563eb", "#7c3aed", "#d97706", "#059669", "#0891b2", "#16a34a"];

export function IrohBoundaryViz() {
  const reduced = useReducedMotion();
  return (
    <StepViz steps={REQUEST_STEPS}>
      {(step) => (
        <svg viewBox="0 0 580 250" role="img" aria-label="하나의 hash 요청이 Iroh 연결과 애플리케이션 검증을 통과하는 과정">
          <defs>
            <marker id="iroh-request-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" />
            </marker>
          </defs>
          <text x="290" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
            연결은 Iroh가, 받을 내용과 권한 검사는 애플리케이션이 맡습니다
          </text>
          {REQUEST_X.slice(0, -1).map((x, index) => (
            <motion.line
              key={x}
              x1={x + 37}
              y1="96"
              x2={REQUEST_X[index + 1] - 45}
              y2="96"
              stroke="#94a3b8"
              strokeWidth="1.25"
              markerEnd="url(#iroh-request-arrow)"
              initial={false}
              animate={{ opacity: step > index ? 1 : 0.16, pathLength: step > index ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.28 }}
            />
          ))}
          {REQUEST_X.map((x, index) => {
            const active = step === index;
            const visible = index <= step;
            return (
              <motion.g
                key={REQUEST_LABELS[index]}
                initial={false}
                animate={{ opacity: visible ? 1 : 0.28, scale: active ? 1.035 : 1 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
                style={{ transformOrigin: `${x}px 96px` }}
              >
                <rect x={x - 37} y="64" width="74" height="64" rx="12" fill={`${REQUEST_COLORS[index]}16`} stroke={REQUEST_COLORS[index]} strokeWidth={active ? 1.25 : 1} />
                <text x={x} y="89" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={REQUEST_COLORS[index]}>{REQUEST_LABELS[index]}</text>
                <text x={x} y="108" textAnchor="middle" fontSize="8.5" fill="currentColor" opacity="0.65">{REQUEST_SUB[index]}</text>
              </motion.g>
            );
          })}
          <rect x="24" y="154" width="532" height="67" rx="11" fill="var(--muted)" opacity="0.55" />
          <text x="40" y="175" fontSize="10" fontWeight="700" fill={REQUEST_COLORS[step]}>이 단계가 새로 확정한 것</text>
          <text x="40" y="195" fontSize="11" fill="currentColor">
            {[
              "원하는 payload의 기대 hash와 연결할 endpoint identity",
              "연결을 시도할 transport 주소 후보",
              "QUIC handshake를 진행할 현재 path",
              "Bob의 endpoint identity와 합의한 application protocol",
              "이 요청자가 이 hash를 받아도 된다는 application 판단",
              "받은 byte가 기대 hash와 같다는 payload 판단",
            ][step]}
          </text>
          <text x="40" y="211" fontSize="9.5" fill="currentColor" opacity="0.62">
            앞 단계의 성공이 뒤 단계의 승인까지 대신하지 않습니다.
          </text>
        </svg>
      )}
    </StepViz>
  );
}

const PATH_STEPS = [
  {
    label: "direct가 없으므로 relay를 사용",
    body: "relay 12 ms는 backup tier지만 지금은 유일한 usable path입니다. 연결은 멈추지 않고 relay로 시작합니다.",
  },
  {
    label: "IPv4 direct 20 ms가 열림",
    body: "primary와 backup처럼 tier가 다르면 5 ms 문턱을 보지 않습니다. 더 느려 보여도 primary인 IPv4로 즉시 바꿉니다.",
  },
  {
    label: "IPv6 21 ms는 아직 부족",
    body: "IPv6의 −3 ms bias를 적용하면 18 ms입니다. 현재 IPv4 20 ms보다 2 ms만 좋아 5 ms 문턱을 못 넘습니다.",
  },
  {
    label: "IPv6 14 ms가 되면 전환",
    body: "보정 RTT는 11 ms이고 현재 20 ms보다 9 ms 좋습니다. 같은 primary tier의 5 ms 문턱을 넘어 IPv6로 바꿉니다.",
  },
] as const;

const PATH_DATA = [
  { relay: true, ipv4: false, ipv6: false, chosen: "relay · 12 ms" },
  { relay: true, ipv4: true, ipv6: false, chosen: "IPv4 · 20 ms" },
  { relay: true, ipv4: true, ipv6: true, chosen: "IPv4 · 20 ms 유지" },
  { relay: true, ipv4: true, ipv6: true, chosen: "IPv6 · 14−3 = 11 ms" },
] as const;

export function IrohPathViz() {
  const reduced = useReducedMotion();
  return (
    <StepViz steps={PATH_STEPS}>
      {(step) => {
        const state = PATH_DATA[step];
        const rows = [
          { key: "relay", label: "relay", tier: "backup", rtt: "12 ms", usable: state.relay },
          { key: "ipv4", label: "IPv4 direct", tier: "primary", rtt: "20 ms", usable: state.ipv4 },
          { key: "ipv6", label: "IPv6 direct", tier: "primary", rtt: step < 3 ? "21−3 = 18 ms" : "14−3 = 11 ms", usable: state.ipv6 },
        ] as const;
        return (
          <svg viewBox="0 0 580 276" role="img" aria-label="Iroh 기본 경로 selector가 relay에서 IPv4와 IPv6로 전환하는 과정">
            <text x="290" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">
              v1.4.1 기본값 · tier 먼저, 같은 tier에서만 5 ms 문턱
            </text>
            {rows.map((row, index) => {
              const y = 50 + index * 54;
              return (
                <motion.g key={row.key} initial={false} animate={{ opacity: row.usable ? 1 : 0.24 }} transition={{ duration: reduced ? 0 : 0.2 }}>
                  <rect x="32" y={y} width="340" height="40" rx="9" fill={row.tier === "primary" ? "#05966914" : "#d9770614"} stroke={row.tier === "primary" ? "#059669" : "#d97706"} strokeWidth="1.25" />
                  <text x="48" y={y + 25} fontSize="11" fontWeight="700" fill="currentColor">{row.label}</text>
                  <text x="175" y={y + 25} fontSize="10" fill="currentColor" opacity="0.64">{row.tier}</text>
                  <text x="275" y={y + 25} fontSize="11" fontWeight="700" fill="currentColor">{row.rtt}</text>
                  <text x="344" y={y + 25} textAnchor="end" fontSize="9" fill="currentColor" opacity="0.6">{row.usable ? "usable" : "아직 없음"}</text>
                </motion.g>
              );
            })}
            <path d="M388 70H421V124" fill="none" stroke="#94a3b8" strokeWidth="1.25" />
            <path d="M388 124H421" fill="none" stroke="#94a3b8" strokeWidth="1.25" />
            <path d="M388 178H421V124" fill="none" stroke="#94a3b8" strokeWidth="1.25" />
            <rect x="421" y="94" width="129" height="60" rx="12" fill="#2563eb14" stroke="#2563eb" strokeWidth="1.25" />
            <text x="485.5" y="116" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#2563eb">현재 선택</text>
            <text x="485.5" y="137" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">{state.chosen}</text>
            <rect x="32" y="224" width="518" height="34" rx="8" fill="var(--muted)" opacity="0.55" />
            <text x="291" y="245" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="currentColor">
              {step === 0 ? "primary가 없을 때만 backup을 사용" : step === 1 ? "tier가 좋아지면 RTT가 느려도 즉시 전환" : step === 2 ? "같은 tier의 2 ms 이득은 무시" : "같은 tier의 9 ms 이득은 5 ms 문턱을 넘어 전환"}
            </text>
          </svg>
        );
      }}
    </StepViz>
  );
}
