// encoding/ssz/merkleize.go — Merkleize + MixInLength (prysm v5.x)

// Merkleize hashes a list of chunks into a single Merkle root.
// SSZ 스펙의 merkleize() 함수 구현
func Merkleize(chunks [][32]byte, limit uint64) ([32]byte, error) {
	count := uint64(len(chunks))
	if count > limit {
		return [32]byte{}, fmt.Errorf(
			"chunk count %d exceeds limit %d", count, limit,
		)
	}
	return BitwiseMerkleize(chunks, count, limit)
}

// MixInLength mixes a Merkle root with a length value.
// 가변 길이 리스트: root와 길이를 해시하여 최종 해시 생성
// hash_tree_root(List[T, N]) = H(merkleize(elements), len)
func MixInLength(root [32]byte, length []byte) [32]byte {
	var lengthChunk [32]byte
	copy(lengthChunk[:], length)
	return sha256.Sum(root, lengthChunk)
}

// HashTreeRoot computes the hash tree root for a container.
// 컨테이너: 각 필드의 HTR을 리프로 사용하여 머클라이즈
func HashTreeRoot(fields ...[32]byte) ([32]byte, error) {
	chunks := make([][32]byte, len(fields))
	copy(chunks, fields)
	return Merkleize(chunks, uint64(len(fields)))
}
