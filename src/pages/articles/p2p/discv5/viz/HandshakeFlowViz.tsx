import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const C = {
  alice: "#4f46e5",
  bob: "#0f766e",
  challenge: "#b45309",
  session: "#7c3aed",
  line: "#475569",
  muted: "#64748b",
  panel: "#f8fafc",
  border: "#cbd5e1",
  white: "#ffffff",
};

const STEPS = [
  {
    label: "1 · 열쇠가 없으면 해독 가능한 FINDNODE를 보내지 못합니다",
    body: "Alice는 FINDNODE 요청을 로컬에 보관하고 nonce N₀인 ordinary packet을 보냅니다. 세션이 없으므로 wire body는 무작위 probe입니다. Bob은 Alice의 node ID는 읽지만 body는 인증·복호화할 수 없습니다.",
  },
  {
    label: "2 · Bob은 N₀를 가리키는 WHOAREYOU를 보냅니다",
    body: "Bob은 N₀를 그대로 돌려주고, 16-byte id-nonce C와 자신이 보관한 Alice ENR sequence 7을 붙입니다. 이 packet에는 암호화된 message body가 없습니다.",
  },
  {
    label: "3 · Alice는 challenge에 신원과 새 열쇠 재료를 묶습니다",
    body: "Alice의 현재 ENR sequence는 8입니다. 따라서 서명된 ENR 8, 64-byte ID signature, 33-byte ephemeral public key를 handshake authdata에 넣고 두 방향 16-byte key를 유도합니다.",
  },
  {
    label: "4 · 원래 FINDNODE가 handshake body로 다시 갑니다",
    body: "처음 probe에 실리지 못한 FINDNODE를 initiator key로 AES-GCM 암호화해 보냅니다. Bob은 ENR→ID signature→ECDH/HKDF→GCM tag 순으로 검증한 뒤에만 요청을 처리합니다.",
  },
  {
    label: "5 · 이후에는 같은 endpoint의 session key를 바로 씁니다",
    body: "Bob은 recipient key로 NODES를 돌려줍니다. 다음 요청은 handshake 없이 ordinary packet으로 갈 수 있습니다. 다만 node ID가 같아도 IP·UDP port가 바뀌면 새 session이 필요합니다.",
  },
];

function Arrow({
  from,
  y,
  color,
  label,
  detail,
}: {
  from: "alice" | "bob";
  y: number;
  color: string;
  label: string;
  detail: string;
}) {
  const left = from === "alice";
  const x1 = left ? 116 : 244;
  const x2 = left ? 238 : 122;
  return (
    <motion.g
      initial={{ opacity: 0, x: left ? -8 : 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28 }}
    >
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={color}
        strokeWidth={1.25}
        markerEnd={`url(#arrow-${color.replace("#", "")})`}
      />
      <text
        x={180}
        y={y - 10}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={color}
      >
        {label}
      </text>
      <text
        x={180}
        y={y + 18}
        textAnchor="middle"
        fontSize={8.5}
        fill={C.muted}
      >
        {detail}
      </text>
    </motion.g>
  );
}

function Peer({
  x,
  name,
  subtitle,
  color,
}: {
  x: number;
  name: string;
  subtitle: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={38}
        width={98}
        height={62}
        rx={14}
        fill={C.white}
        stroke={color}
        strokeWidth={1.25}
      />
      <circle cx={x + 18} cy={58} r={8} fill={color} opacity={0.16} />
      <circle cx={x + 18} cy={58} r={3.5} fill={color} />
      <text x={x + 32} y={61} fontSize={12} fontWeight={800} fill={color}>
        {name}
      </text>
      <text x={x + 49} y={80} textAnchor="middle" fontSize={9} fill={C.muted}>
        {subtitle}
      </text>
    </g>
  );
}

function StateCard({
  y,
  title,
  lines,
  color,
}: {
  y: number;
  title: string;
  lines: string[];
  color: string;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <rect
        x={22}
        y={y}
        width={316}
        height={72}
        rx={12}
        fill={C.panel}
        stroke={C.border}
      />
      <rect x={22} y={y} width={5} height={72} rx={2.5} fill={color} />
      <text x={38} y={y + 21} fontSize={10.5} fontWeight={800} fill={color}>
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={line}
          x={38}
          y={y + 40 + index * 15}
          fontSize={9.5}
          fill={C.line}
        >
          {line}
        </text>
      ))}
    </motion.g>
  );
}

export default function HandshakeFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 360 390"
          className="mx-auto h-auto w-full max-w-[720px]"
          role="img"
          aria-label={`Discovery v5 handshake 장면 ${step + 1}`}
        >
          <defs>
            {[C.alice, C.bob, C.challenge, C.session].map((color) => (
              <marker
                key={color}
                id={`arrow-${color.replace("#", "")}`}
                markerWidth="8"
                markerHeight="8"
                refX="6.5"
                refY="3.5"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,7 L7,3.5 z" fill={color} />
              </marker>
            ))}
          </defs>
          <text
            x={180}
            y={20}
            textAnchor="middle"
            fontSize={11}
            fontWeight={800}
            fill={C.line}
          >
            같은 Alice·Bob 사례를 끝까지 따라갑니다
          </text>
          <Peer x={18} name="Alice" subtitle="현재 ENR seq 8" color={C.alice} />
          <Peer
            x={244}
            name="Bob"
            subtitle="Alice ENR seq 7 보관"
            color={C.bob}
          />
          {step === 0 && (
            <>
              <Arrow
                from="alice"
                y={140}
                color={C.alice}
                label="ordinary · nonce N₀"
                detail="body는 random probe"
              />
              <StateCard
                y={188}
                title="Bob의 판단"
                lines={[
                  "src-id는 Alice지만 session key가 없음",
                  "복호화 실패 → FINDNODE를 아직 실행하지 않음",
                ]}
                color={C.alice}
              />
              <StateCard
                y={275}
                title="Alice가 보관한 상태"
                lines={[
                  "pending[N₀] = FINDNODE(request-id R₁)",
                  "WHOAREYOU가 N₀를 가리켜야만 이어서 처리",
                ]}
                color={C.muted}
              />
            </>
          )}
          {step === 1 && (
            <>
              <Arrow
                from="bob"
                y={140}
                color={C.challenge}
                label="WHOAREYOU"
                detail="N₀ · id-nonce C · seq 7"
              />
              <StateCard
                y={188}
                title="Challenge가 말하는 세 가지"
                lines={[
                  "N₀: 어떤 보류 요청의 답인지",
                  "C(16B): 서명·키 유도에 묶을 새 challenge",
                ]}
                color={C.challenge}
              />
              <StateCard
                y={275}
                title="ENR sequence 7"
                lines={[
                  "Bob이 가진 Alice 기록의 버전",
                  "Alice는 현재 seq 8이므로 새 ENR를 넣어야 함",
                ]}
                color={C.challenge}
              />
            </>
          )}
          {step === 2 && (
            <>
              <StateCard
                y={124}
                title="Alice가 만드는 handshake authdata"
                lines={[
                  "ID signature 64B · ephemeral public key 33B",
                  "signed ENR seq 8 · src-id와 길이 필드",
                ]}
                color={C.session}
              />
              <StateCard
                y={211}
                title="같은 재료에서 두 방향 key를 만듦"
                lines={[
                  "ECDH shared point 33B + challenge-data",
                  "HKDF 32B → Kₐ→ᵦ 16B + Kᵦ→ₐ 16B",
                ]}
                color={C.session}
              />
              <StateCard
                y={298}
                title="왜 ephemeral key와 signature가 둘 다 필요한가"
                lines={[
                  "ephemeral key는 새 공유 비밀을 만들고",
                  "signature는 그 재료를 Alice의 ENR identity에 결속",
                ]}
                color={C.session}
              />
            </>
          )}
          {step === 3 && (
            <>
              <Arrow
                from="alice"
                y={140}
                color={C.session}
                label="handshake + FINDNODE R₁"
                detail="AES-GCM with Kₐ→ᵦ"
              />
              <StateCard
                y={188}
                title="Bob의 검증 순서"
                lines={[
                  "ENR seq 8 서명 → ID signature → ECDH·HKDF",
                  "GCM tag와 request body가 맞아야 session 수락",
                ]}
                color={C.bob}
              />
              <StateCard
                y={275}
                title="여기서 ‘다시 보낸다’의 정확한 뜻"
                lines={[
                  "무응답 packet을 똑같이 retry하는 것이 아님",
                  "보류했던 R₁을 새 handshake packet 안에 처음으로 암호화",
                ]}
                color={C.session}
              />
            </>
          )}
          {step === 4 && (
            <>
              <Arrow
                from="bob"
                y={140}
                color={C.bob}
                label="NODES · request-id R₁"
                detail="AES-GCM with Kᵦ→ₐ"
              />
              <StateCard
                y={188}
                title="세션 cache key"
                lines={[
                  "Alice node ID + Alice IP:UDP endpoint",
                  "같은 node ID라도 endpoint가 바뀌면 다시 handshake",
                ]}
                color={C.bob}
              />
              <StateCard
                y={275}
                title="이제 빨라지는 부분"
                lines={[
                  "다음 ordinary packet은 WHOAREYOU 없이 복호화",
                  "각 방향 nonce는 같은 key 아래에서 절대 재사용 금지",
                ]}
                color={C.session}
              />
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
