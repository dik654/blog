import type { CodeRef } from "@/components/code/types";

export const codeRefs: Record<string, CodeRef> = {
  "ssz-offset": {
    path: "methodical-ssz@932cc738 · ssz/marshal.go · ssz/unmarshal.go",
    lang: "go",
    code: `// 가변 필드의 시작 위치를 uint32 little-endian으로 기록합니다.
func WriteOffset(dst []byte, i int) []byte {
    return binary.LittleEndian.AppendUint32(dst, uint32(i))
}

// Decoder는 같은 4바이트를 container 시작 기준 offset으로 읽습니다.
func ReadOffset(buf []byte) uint64 {
    return uint64(binary.LittleEndian.Uint32(buf))
}`,
    highlight: [1, 9],
    desc: "Prysm v7.3.1이 고정한 methodical-ssz의 4-byte offset 읽기·쓰기",
    annotations: [
      { lines: [1, 4], color: "sky", note: "offset은 길이가 아니라 variable field의 시작 위치입니다." },
      { lines: [6, 9], color: "emerald", note: "Schema가 field 폭과 다음 offset을 알아야 실제 slice를 정할 수 있습니다." },
    ],
  },
  "ssz-list-root": {
    path: "prysm@v7.3.1 · encoding/ssz/merkleize.go · MerkleizeListSSZ()",
    lang: "go",
    code: `// 각 composite element를 먼저 32-byte root로 바꿉니다.
func MerkleizeListSSZ[T Hashable](elements []T, limit uint64) ([32]byte, error) {
    body, err := MerkleizeVectorSSZ(elements, limit)
    if err != nil {
        return [32]byte{}, err
    }

    // Data root와 실제 element 수를 서로 다른 두 chunk로 둡니다.
    chunks := make([][32]byte, 2)
    chunks[0] = body
    binary.LittleEndian.PutUint64(chunks[1][:], uint64(len(elements)))

    // H(data_root || length_chunk)가 List의 최종 root입니다.
    if err = htr.Hash(chunks, chunks); err != nil {
        return [32]byte{}, err
    }
    return chunks[0], nil
}`,
    highlight: [1, 18],
    desc: "Prysm v7.3.1의 list Merkle root와 mix-in-length 구현",
    annotations: [
      { lines: [2, 6], color: "sky", note: "Limit이 정한 capacity tree까지 element roots를 Merkleize합니다." },
      { lines: [8, 11], color: "amber", note: "현재 길이를 32-byte little-endian chunk에 기록합니다." },
      { lines: [13, 18], color: "emerald", note: "Data root와 length chunk를 hash해 다른 길이의 list를 구분합니다." },
    ],
  },
  "ssz-gindex": {
    path: "prysm@v7.3.1 · encoding/ssz/query/generalized_index.go",
    lang: "go",
    code: `// Container field 이름을 schema의 field 위치로 바꿉니다.
fieldPos, fieldSsz, err := getContainerFieldByName(currentInfo, element.Name)
if err != nil {
    return 0, fmt.Errorf("container field %s not found: %w", element.Name, err)
}

// Field 수를 담는 완전 이진 트리의 폭을 계산합니다.
chunkCount, err := getChunkCount(currentInfo)
if err != nil {
    return 0, fmt.Errorf("chunk count error: %w", err)
}

// Root gindex에 tree 폭을 곱하고 0-based field 위치를 더합니다.
currentIndex = currentIndex*nextPowerOfTwo(chunkCount) + fieldPos
currentInfo = fieldSsz`,
    highlight: [1, 15],
    desc: "Prysm v7.3.1 SSZ query가 container path를 generalized index로 바꾸는 핵심 계산",
    annotations: [
      { lines: [1, 5], color: "sky", note: "Field 이름의 의미는 고정한 schema와 fork에서만 결정됩니다." },
      { lines: [7, 11], color: "amber", note: "Field 3개도 폭 4의 완전 이진 트리에 배치됩니다." },
      { lines: [13, 15], color: "emerald", note: "Root=1, 폭=4, validators fieldPos=1이면 gindex=5입니다." },
    ],
  },
};
