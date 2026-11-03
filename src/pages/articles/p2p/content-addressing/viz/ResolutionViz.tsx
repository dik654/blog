import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "수정하면 새 root CID가 생깁니다",
    body: "Project v1의 C_root1은 사라지지 않습니다. lib.rs를 고친 v2는 C_root2라는 새 immutable root를 만듭니다.",
  },
  {
    label: "IPNS resolver가 서명된 최신 record를 고릅니다",
    body: "같은 public-key name 아래 seq 7과 seq 8을 받으면 signature·validity를 검증하고 유효한 후보 중 더 높은 sequence를 고릅니다.",
  },
  {
    label: "DNSLink는 DNS 이름에서 content path를 얻습니다",
    body: "_dnslink.docs.example TXT가 /ipfs/C_root2를 가리킵니다. 권한의 뿌리는 IPNS key가 아니라 DNS zone 운영과 DNS 보안 설정입니다.",
  },
  {
    label: "이름 해석 뒤에도 CID 검증은 다시 합니다",
    body: "IPNS든 DNSLink든 결과는 content path입니다. Provider에서 block을 받은 뒤 C_root2와 맞는지 hash 검증해야 합니다.",
  },
] as const;

const COLORS = {
  old: "#94a3b8",
  current: "#d97706",
  ipns: "#4f46e5",
  dns: "#0284c7",
  verify: "#059669",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="resolution-arrow"
        viewBox="0 0 8 8"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="context-stroke" />
      </marker>
    </defs>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth="1.2"
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd="url(#resolution-arrow)"
    />
  );
}

function Box({
  x,
  y,
  w,
  title,
  sub,
  color,
  opacity = 1,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
  color: string;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height="44"
        rx="7"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + w / 2}
        y={y + 18}
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="700"
        fill={color}
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + 34}
        textAnchor="middle"
        fontSize="8.5"
        fill={color}
      >
        {sub}
      </text>
    </g>
  );
}

export default function ResolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 520 248"
          aria-label="새 Merkle DAG root를 IPNS와 DNSLink로 가리키고 CID로 검증"
        >
          <ArrowDefs />

          <Box
            x={360}
            y={14}
            w={140}
            title="project v1"
            sub="C_root1 · immutable"
            color={COLORS.old}
            opacity={step === 0 ? 1 : 0.28}
          />
          <Box
            x={360}
            y={72}
            w={140}
            title="project v2"
            sub="C_root2 · current"
            color={COLORS.current}
          />

          {step >= 1 && (
            <>
              <Box
                x={20}
                y={14}
                w={150}
                title="/ipns/k51…"
                sub="public-key name"
                color={COLORS.ipns}
              />
              <Box
                x={190}
                y={14}
                w={140}
                title="candidate records"
                sub="seq 7 · seq 8"
                color={COLORS.ipns}
              />
              <Arrow x1={176} y1={36} x2={184} y2={36} color={COLORS.ipns} />
              <Arrow x1={336} y1={36} x2={382} y2={66} color={COLORS.ipns} />
              <text
                x="260"
                y="69"
                textAnchor="middle"
                fontSize="8.3"
                fill={COLORS.ipns}
              >
                signature + validity + sequence
              </text>
            </>
          )}

          {step >= 2 && (
            <>
              <Box
                x={20}
                y={92}
                w={150}
                title="docs.example"
                sub="_dnslink TXT"
                color={COLORS.dns}
              />
              <Arrow
                x1={176}
                y1={114}
                x2={354}
                y2={96}
                color={COLORS.dns}
                dashed
              />
              <text
                x="256"
                y="103"
                textAnchor="middle"
                fontSize="8.3"
                fill={COLORS.dns}
              >
                dnslink=/ipfs/C_root2
              </text>
            </>
          )}

          {step >= 3 && (
            <>
              <Box
                x={188}
                y={164}
                w={144}
                title="Provider에서 fetch"
                sub="root와 child blocks"
                color={COLORS.verify}
              />
              <Box
                x={360}
                y={184}
                w={140}
                title="CID 재검증"
                sub="hash(bytes) = digest"
                color={COLORS.verify}
              />
              <Arrow
                x1={404}
                y1={122}
                x2={316}
                y2={158}
                color={COLORS.verify}
              />
              <Arrow
                x1={338}
                y1={190}
                x2={354}
                y2={199}
                color={COLORS.verify}
              />
            </>
          )}

          <text
            x="260"
            y="241"
            textAnchor="middle"
            fontSize="8.5"
            fill="var(--muted-foreground)"
          >
            이름은 최신 pointer를 고르고 · CID는 최종 bytes를 검증합니다
          </text>
        </svg>
      )}
    </StepViz>
  );
}
