export const VERIFY_STEPS = [
  { label: '검증 개요', body: '검증자는 증명자와 동일한 transcript를 재구성하여 증명의 유효성을 확인합니다.' },
  { label: 'Transcript 재구성', body: 'Keccak256으로 동일한 해시 체인을 구축, Fiat-Shamir 챌린지를 재생성합니다.' },
  { label: 'Sumcheck 검증', body: '다항식의 평가값이 기대값과 일치하는지 확인합니다.' },
  { label: 'EVM 온체인 검증', body: 'Solidity Verifier.sol이 ~500,000 가스로 증명을 온체인 검증합니다.' },
];

export const VERIFY_CODE = `// EVM 온체인 검증 핵심 (Verifier.sol)
function __verify(...) public view {
  assembly {
    // 1. 첫 번째 라운드 메시지 읽기
    proof_ptr, range_length, num_challenges :=
      read_first_round_message(proof_ptr_init,
        transcript_ptr, builder_ptr)
    // 2. 최종 라운드 메시지 처리
    proof_ptr, num_constraints :=
      read_final_round_message(proof_ptr,
        transcript_ptr, builder_ptr)
    // 3. Sumcheck 증명 검증
    proof_ptr, evaluation_point_ptr :=
      read_and_verify_sumcheck_proof(proof_ptr,
        transcript_ptr, builder_ptr, num_vars)
    // 4. PCS 평가값 검증
    verify_pcs_evaluations(proof_ptr, commitments_ptr,
      transcript_ptr, builder_ptr, ...)
  }
}`;

export const VERIFY_ANNOTATIONS = [
  { lines: [4, 7] as [number, number], color: 'sky' as const, note: 'Round 1 메시지 파싱' },
  { lines: [9, 12] as [number, number], color: 'emerald' as const, note: 'Final round 처리' },
  { lines: [14, 16] as [number, number], color: 'amber' as const, note: 'Sumcheck 검증' },
  { lines: [18, 19] as [number, number], color: 'rose' as const, note: 'PCS commitment 검증' },
];

export const GAS_TABLE = [
  { op: 'ECADD', gas: '150', desc: '타원곡선 점 덧셈' },
  { op: 'ECMUL', gas: '6,000', desc: '타원곡선 스칼라 곱셈' },
  { op: 'ECPAIRING (2)', gas: '113,000', desc: '이중 페어링 연산' },
  { op: '전체 검증', gas: '~500,000', desc: '완전한 SQL 쿼리 검증' },
];
