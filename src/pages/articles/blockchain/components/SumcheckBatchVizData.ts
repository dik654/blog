export const STAGES = [
  {
    id: 'stage1', label: 'Stage 1', name: 'Spartan Outer Sumcheck',
    color: '#6366f1',
    instances: ['OuterRemainingStreaming (UniSkip 적용)'],
    desc: 'R1CS를 다변량 Sumcheck로 환원. 첫 라운드는 UniSkip 최적화(16× 속도).',
    claim: 'Σ_x eq(τ,x) · (Az·Bz - Cz) = 0',
  },
  {
    id: 'stage2', label: 'Stage 2', name: 'RAM & Lookup 결합',
    color: '#0ea5e9',
    instances: [
      'RamReadWriteChecking', 'ProductVirtualRemainder',
      'InstructionLookupsClaimReduction', 'RamRafEvaluation', 'OutputSumcheck',
    ],
    desc: '5개 Sumcheck를 α₁…α₅로 선형 결합하여 단일 증명으로 배치.',
    claim: 'Σᵢ αᵢ · claimᵢ',
  },
  {
    id: 'stage3-7', label: 'Stage 3–7', name: '서브테이블 클레임 감소',
    color: '#10b981',
    instances: ['Instruction eval', 'RAM chunks', 'Register reads', 'Bytecode', 'Output check'],
    desc: 'Lasso 서브테이블 평가 및 메모리 정확성 감소 Sumcheck.',
    claim: 'subtable_evals / memory_evals',
  },
  {
    id: 'stage8', label: 'Stage 8', name: 'Dory PCS 공동 개구',
    color: '#f59e0b',
    instances: ['joint_opening_proof'],
    desc: '모든 평가 클레임을 Dory 다변량 커밋으로 단일 개구 증명 생성.',
    claim: '∀ poly p: p(r) = eval',
  },
];
