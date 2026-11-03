import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const C = {
  ecdh: "#4f46e5",
  hkdf: "#0f766e",
  aes: "#b45309",
  line: "#475569",
  muted: "#64748b",
  panel: "#f8fafc",
  border: "#cbd5e1",
  white: "#ffffff",
};

const STEPS = [
  {
    label: "1 · ECDH는 둘만 같은 33-byte 공유점을 만듭니다",
    body: "Alice의 이번 handshake용 ephemeral private key와 Bob ENR의 static public key를 곱합니다. geth v1.17.8은 결과 curve point를 33-byte compressed public-key 형식으로 HKDF에 넘깁니다.",
  },
  {
    label: "2 · HKDF는 상대·방향·challenge를 key에 묶습니다",
    body: "Challenge-data가 salt이고, 고정 label 뒤에 Alice ID와 Bob ID를 순서대로 붙인 값이 info입니다. 32-byte 출력의 앞 16B는 initiator key, 뒤 16B는 recipient key입니다.",
  },
  {
    label: "3 · AES-GCM은 body를 숨기고 header 변조도 잡습니다",
    body: "12-byte nonce와 방향별 key로 message를 암호화합니다. masking IV와 unmasked header는 AAD라서 암호문은 아니지만 GCM tag 검증 대상입니다. ciphertext는 plaintext보다 16B 깁니다.",
  },
];

function PipelineArrow({ y, color }: { y: number; color: string }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <line
        x1={180}
        y1={y}
        x2={180}
        y2={y + 28}
        stroke={color}
        strokeWidth={1.25}
      />
      <path
        d={`M174 ${y + 23} L180 ${y + 31} L186 ${y + 23}`}
        fill="none"
        stroke={color}
        strokeWidth={1.25}
      />
    </motion.g>
  );
}

function Card({
  y,
  height = 66,
  title,
  lines,
  color,
}: {
  y: number;
  height?: number;
  title: string;
  lines: string[];
  color: string;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <rect
        x={25}
        y={y}
        width={310}
        height={height}
        rx={12}
        fill={C.white}
        stroke={color}
        strokeWidth={1.25}
      />
      <text x={42} y={y + 22} fontSize={10.5} fontWeight={800} fill={color}>
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={line}
          x={42}
          y={y + 42 + index * 14}
          fontSize={9}
          fill={C.line}
        >
          {line}
        </text>
      ))}
    </motion.g>
  );
}

function SizeRow({
  y,
  parts,
}: {
  y: number;
  parts: Array<{ label: string; width: number; color: string }>;
}) {
  return (
    <g>
      {parts.map((part, partIndex) => {
        const currentX =
          28 +
          parts
            .slice(0, partIndex)
            .reduce((offset, previous) => offset + previous.width + 4, 0);
        return (
          <g key={part.label}>
            <rect
              x={currentX}
              y={y}
              width={part.width}
              height={34}
              rx={8}
              fill={part.color}
              opacity={0.14}
            />
            <rect
              x={currentX}
              y={y}
              width={part.width}
              height={34}
              rx={8}
              fill="none"
              stroke={part.color}
            />
            <text
              x={currentX + part.width / 2}
              y={y + 21}
              textAnchor="middle"
              fontSize={8.5}
              fontWeight={700}
              fill={part.color}
            >
              {part.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function SessionKeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 360 440"
          className="mx-auto h-auto w-full max-w-[720px]"
          role="img"
          aria-label={`Discovery v5 session key 계산 장면 ${step + 1}`}
        >
          <rect
            x={10}
            y={10}
            width={340}
            height={414}
            rx={18}
            fill={C.panel}
            stroke={C.border}
          />
          {step === 0 && (
            <>
              <text
                x={180}
                y={36}
                textAnchor="middle"
                fontSize={11}
                fontWeight={800}
                fill={C.ecdh}
              >
                ECDH: 서로 다른 입력, 같은 출력
              </text>
              <Card
                y={56}
                title="Alice가 가진 값"
                lines={["ephemeral private key aₑ · handshake마다 새로 생성"]}
                color={C.ecdh}
              />
              <PipelineArrow y={122} color={C.ecdh} />
              <Card
                y={153}
                title="Bob의 ENR가 알려 준 값"
                lines={[
                  "static public key Bₛ · ENR signature로 identity에 결속",
                ]}
                color={C.ecdh}
              />
              <PipelineArrow y={219} color={C.ecdh} />
              <Card
                y={250}
                height={82}
                title="secp256k1 scalar multiplication"
                lines={[
                  "Alice: ECDH(aₑ, Bₛ)",
                  "Bob: ECDH(bₛ, Aₑ) → 같은 curve point",
                ]}
                color={C.ecdh}
              />
              <PipelineArrow y={332} color={C.ecdh} />
              <SizeRow
                y={365}
                parts={[
                  {
                    label: "compressed shared point · 33B",
                    width: 304,
                    color: C.ecdh,
                  },
                ]}
              />
            </>
          )}
          {step === 1 && (
            <>
              <text
                x={180}
                y={36}
                textAnchor="middle"
                fontSize={11}
                fontWeight={800}
                fill={C.hkdf}
              >
                HKDF-SHA256: handshake와 방향을 고정
              </text>
              <Card
                y={56}
                title="secret"
                lines={["ECDH가 만든 compressed shared point · 33B"]}
                color={C.ecdh}
              />
              <Card
                y={136}
                title="salt"
                lines={[
                  "WHOAREYOU challenge-data · IV + static header + authdata",
                ]}
                color={C.hkdf}
              />
              <Card
                y={216}
                title="info"
                lines={['"discovery v5 key agreement" + Alice ID + Bob ID']}
                color={C.hkdf}
              />
              <PipelineArrow y={282} color={C.hkdf} />
              <text
                x={180}
                y={329}
                textAnchor="middle"
                fontSize={10}
                fontWeight={800}
                fill={C.hkdf}
              >
                HKDF output · 32B
              </text>
              <SizeRow
                y={350}
                parts={[
                  { label: "Kₐ→ᵦ · 16B", width: 149, color: C.hkdf },
                  { label: "Kᵦ→ₐ · 16B", width: 149, color: C.aes },
                ]}
              />
              <text
                x={180}
                y={407}
                textAnchor="middle"
                fontSize={9}
                fill={C.muted}
              >
                Bob은 같은 두 조각을 읽기·쓰기 방향만 뒤집어 저장합니다
              </text>
            </>
          )}
          {step === 2 && (
            <>
              <text
                x={180}
                y={36}
                textAnchor="middle"
                fontSize={11}
                fontWeight={800}
                fill={C.aes}
              >
                AES-128-GCM: 암호화와 인증을 한 번에
              </text>
              <SizeRow
                y={58}
                parts={[
                  { label: "counter · 4B", width: 132, color: C.aes },
                  { label: "random · 8B", width: 172, color: C.ecdh },
                ]}
              />
              <text
                x={180}
                y={112}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={700}
                fill={C.line}
              >
                unique nonce = 12B
              </text>
              <Card
                y={132}
                title="Plaintext"
                lines={["message-type + RLP message-data"]}
                color={C.aes}
              />
              <Card
                y={212}
                title="AAD · 보이지만 변조는 못 함"
                lines={["masking IV + unmasked static header + authdata"]}
                color={C.hkdf}
              />
              <PipelineArrow y={278} color={C.aes} />
              <SizeRow
                y={312}
                parts={[
                  { label: "ciphertext · P bytes", width: 190, color: C.aes },
                  { label: "tag · 16B", width: 114, color: C.hkdf },
                ]}
              />
              <text
                x={180}
                y={377}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight={700}
                fill={C.line}
              >
                결과 길이 = plaintext P + 인증 tag 16B
              </text>
              <text
                x={180}
                y={401}
                textAnchor="middle"
                fontSize={9}
                fill={C.muted}
              >
                tag 확인 전에는 message와 session을 신뢰하지 않습니다
              </text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
