export interface ProofSystem {
  name: string;
  href: string | null;
  property: string;
  proofSize: string;
  verify: string;
  setup: boolean;
  color: string;
}

// ── 증명 시스템 (이론/프로토콜) ──
export const coreSystems: ProofSystem[] = [
  {
    name: "Groth16",
    href: "/cs/crypto/groth16",
    property: "최소 증명 크기, 최고 검증 속도",
    proofSize: "128 B",
    verify: "O(1)",
    setup: true,
    color: "border-sky-500/40",
  },
  {
    name: "PLONK",
    href: "/cs/crypto/plonk",
    property: "Universal setup, 커스텀 게이트",
    proofSize: "~400 B",
    verify: "O(1)",
    setup: true,
    color: "border-emerald-500/40",
  },
  {
    name: "FFLONK",
    href: "/cs/crypto/plonk#fflonk",
    property: "PLONK 변형, 단일 다항식 opening",
    proofSize: "~256 B",
    verify: "O(1)",
    setup: true,
    color: "border-emerald-500/40",
  },
  {
    name: "HyperPLONK",
    href: "/cs/crypto/hyperplonk",
    property: "다중선형 확장, FFT 불필요",
    proofSize: "~수 KB",
    verify: "O(1)",
    setup: true,
    color: "border-teal-500/40",
  },
  {
    name: "Halo2",
    href: "/cs/crypto/halo2",
    property: "IPA 기반 재귀, trusted setup 불필요",
    proofSize: "~수 KB",
    verify: "O(n)",
    setup: false,
    color: "border-violet-500/40",
  },
  {
    name: "STARK",
    href: "/cs/crypto/stark-theory",
    property: "양자 안전, trusted setup 불필요",
    proofSize: "50-200 KB",
    verify: "O(log\u00B2 n)",
    setup: false,
    color: "border-amber-500/40",
  },
  {
    name: "Bulletproofs",
    href: "/cs/crypto/bulletproofs",
    property: "Range proof 특화, 작은 증명",
    proofSize: "~600 B",
    verify: "O(n)",
    setup: false,
    color: "border-rose-500/40",
  },
  {
    name: "Nova / SuperNova",
    href: "/cs/crypto/nova",
    property: "Folding scheme, IVC",
    proofSize: "~수 KB",
    verify: "O(1)",
    setup: true,
    color: "border-indigo-500/40",
  },
];

// ── 프로젝트/구현체 (위 시스템 기반) ──
export const implProjects: ProofSystem[] = [
  {
    name: "Plonky2 / Plonky3",
    href: "/cs/crypto/plonky3",
    property: "STARK + PLONK 결합, 재귀 증명",
    proofSize: "~수십 KB",
    verify: "O(log n)",
    setup: false,
    color: "border-cyan-500/40",
  },
  {
    name: "RISC Zero",
    href: "/cs/crypto/risc0",
    property: "STARK 기반 zkVM",
    proofSize: "~수십 KB",
    verify: "O(log n)",
    setup: false,
    color: "border-orange-500/40",
  },
  {
    name: "SP1",
    href: "/cs/crypto/sp1",
    property: "STARK 기반 zkVM (Succinct)",
    proofSize: "~수십 KB",
    verify: "O(log n)",
    setup: false,
    color: "border-orange-500/40",
  },
  {
    name: "Jolt",
    href: "/cs/crypto/jolt",
    property: "Lookup 기반 zkVM (a16z)",
    proofSize: "~수십 KB",
    verify: "O(log n)",
    setup: false,
    color: "border-orange-500/40",
  },
];
