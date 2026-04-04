import { motion } from 'framer-motion';
import { C } from './TcbCompareVizData';

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 } };
const LW = 1.2;

interface LayerProps { x: number; y: number; w: number; h: number; label: string; trusted: boolean }

function Layer({ x, y, w, h, label, trusted }: LayerProps) {
  const fill = trusted ? `${C.trusted}22` : `${C.untrusted}11`;
  const stroke = trusted ? C.trusted : C.untrusted;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={LW} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fill={stroke} fontWeight={trusted ? 700 : 400}>{label}</text>
    </g>
  );
}

function Badge({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <motion.g {...fade}>
      <rect x={x} y={y} width={90} height={18} rx={9} fill={C.trusted} />
      <text x={x + 45} y={y + 12.5} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={700}>{text}</text>
    </motion.g>
  );
}

const X = 30; const W = 420; const LH = 28; const G = 3;

export function StepSGX() {
  const layers = [
    { label: 'Application', trusted: false },
    { label: 'OS / Hypervisor', trusted: false },
    { label: 'Enclave Code', trusted: true },
    { label: 'CPU Hardware', trusted: true },
  ];
  return (
    <g>
      <text x={X} y={16} fontSize={11} fill="var(--foreground)" fontWeight={700}>Intel SGX</text>
      {layers.map((l, i) => <Layer key={i} x={X} y={24 + i * (LH + G)} w={W} h={LH} {...l} />)}
      <Badge x={X + W + 10} y={24 + 2 * (LH + G)} text="TCB 경계" />
    </g>
  );
}

export function StepTDX() {
  const layers = [
    { label: 'Guest App + OS (전체 VM)', trusted: true },
    { label: 'TDX Module (SEAM)', trusted: true },
    { label: 'Hypervisor (VMM)', trusted: false },
    { label: 'CPU Hardware', trusted: true },
  ];
  return (
    <g>
      <text x={X} y={16} fontSize={11} fill="var(--foreground)" fontWeight={700}>Intel TDX</text>
      {layers.map((l, i) => <Layer key={i} x={X} y={24 + i * (LH + G)} w={W} h={LH} {...l} />)}
      <Badge x={X + W + 10} y={24} text="TCB 경계" />
    </g>
  );
}

export function StepSEV() {
  const layers = [
    { label: 'Guest VM (메모리 암호화)', trusted: true },
    { label: 'Hypervisor', trusted: false },
    { label: 'AMD SP Firmware', trusted: true },
    { label: 'CPU + RMP', trusted: true },
  ];
  return (
    <g>
      <text x={X} y={16} fontSize={11} fill="var(--foreground)" fontWeight={700}>AMD SEV-SNP</text>
      {layers.map((l, i) => <Layer key={i} x={X} y={24 + i * (LH + G)} w={W} h={LH} {...l} />)}
      <Badge x={X + W + 10} y={24 + 2 * (LH + G)} text="TCB 경계" />
    </g>
  );
}

export function StepTZ() {
  const layers = [
    { label: 'Normal World (Android OS)', trusted: false },
    { label: 'Secure Monitor (EL3)', trusted: true },
    { label: 'Secure World OS (OP-TEE)', trusted: true },
    { label: 'Secure Hardware', trusted: true },
  ];
  return (
    <g>
      <text x={X} y={16} fontSize={11} fill="var(--foreground)" fontWeight={700}>ARM TrustZone</text>
      {layers.map((l, i) => <Layer key={i} x={X} y={24 + i * (LH + G)} w={W} h={LH} {...l} />)}
      <Badge x={X + W + 10} y={24 + (LH + G)} text="TCB 경계" />
    </g>
  );
}
