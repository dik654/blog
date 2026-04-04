// encoding/ssz/htrutils.go — PackByChunk + BitwiseMerkleize (prysm v5.x)

// PackByChunk packs a list of byte slices into 32-byte chunks.
// 각 요소를 32바이트 청크로 패딩하여 머클 트리 리프를 준비한다.
func PackByChunk(serializedItems [][]byte) ([][32]byte, error) {
	emptyChunk := [32]byte{}
	if len(serializedItems) == 0 {
		return [][32]byte{emptyChunk}, nil
	}
	// 각 아이템을 32바이트 경계에 맞춰 패킹
	var chunks [][32]byte
	for _, item := range serializedItems {
		chunk := [32]byte{}
		copy(chunk[:], item)
		chunks = append(chunks, chunk)
	}
	return chunks, nil
}

// BitwiseMerkleize computes the Merkle root of packed chunks.
// 바이너리 머클 트리를 상향식으로 구축한다.
func BitwiseMerkleize(chunks [][32]byte, count, limit uint64) ([32]byte, error) {
	if limit == 0 {
		return [32]byte{}, nil
	}
	// 다음 2의 거듭제곱으로 올림 → 완전 이진 트리 보장
	depth := bits.Len64(limit - 1)
	layers := make([][][32]byte, depth+1)
	layers[0] = chunks
	// 상향식: 인접 청크 쌍을 SHA256으로 해시
	for d := 0; d < depth; d++ {
		layer := layers[d]
		var next [][32]byte
		for i := 0; i < len(layer); i += 2 {
			left, right := layer[i], zeroHash(d)
			if i+1 < len(layer) {
				right = layer[i+1]
			}
			next = append(next, sha256.Sum(left, right))
		}
		layers[d+1] = next
	}
	return layers[depth][0], nil
}
