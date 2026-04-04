export const BCS_CODE = `// BCS 변환: IOP -> 비상호작용 zkSNARK
// Fiat-Shamir 변환의 확장 (공개 코인 IOP에 적용)

// 1단계: 오라클 커밋
각 라운드 i에서:
  오라클 pi_i 생성
  머클 트리 T_i = MerkleTree(pi_i)
  루트 해시 r_i = Root(T_i)

// 2단계: 챌린지 생성 (해시 체인)
state_0 = Hash(공개 입력)
c_i = Hash(state_{i-1} || r_i)
state_i = Hash(state_{i-1} || r_i || c_i)

// 3단계: 쿼리 응답
쿼리 Q = {q_1, ..., q_m}  (해시로 결정)
각 쿼리에 대한 응답 + 머클 증명 포함
최종 증명 = (루트들, 쿼리 응답, 머클 경로)`;

export const HASH_CODE = `// 해시 함수 선택 (bcs_common.hpp)
enum class hash_type {
  blake2b,     // 빠른 속도, 높은 보안성
  sha3,        // 표준화된 보안성
  poseidon     // zk-friendly (특수 용도)
};

// 머클 트리 최적화
template<typename FieldT>
class OptimizedMerkleTree {
  vector<FieldT> leaves;
  vector<hash_t> internal_nodes;

  // 배치 해싱: SIMD 병렬 해싱
  void build_parallel();
  // O(log n) 크기 증명 생성
  MerkleProof generate_proof(size_t index);
};`;
