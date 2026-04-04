export const bundleCode = `// Runtime Bundle (.orc) 구조
runtime.orc (ZIP 아카이브)
+-- META-INF/
|   +-- MANIFEST.MF  // 매니페스트 (JSON)
+-- runtime.elf       // ELF 실행 파일
+-- runtime.sgxs      // SGX 엔클레이브 파일
+-- runtime.sig       // SGX 서명 파일

// 매니페스트 핵심 필드
type Manifest struct {
  ID         common.Namespace  // 런타임 식별자
  Components []*Component      // RONL, ROFL 등
  Digests    map[string]Hash   // 파일 무결성 해시
}

// 컴포넌트 종류: RONL (일반), ROFL (오프체인)
type Component struct {
  Kind component.Kind   // RONL | ROFL
  ELF  *ELFMetadata     // ELF 실행 파일 정보
  SGX  *SGXMetadata     // SGX 엔클레이브 정보
}`;

export const bundleAnnotations = [
  { lines: [1, 7] as [number, number], color: 'sky' as const, note: '.orc 번들 파일 구조' },
  { lines: [9, 14] as [number, number], color: 'emerald' as const, note: '매니페스트 타입 정의' },
  { lines: [16, 21] as [number, number], color: 'amber' as const, note: '컴포넌트 SGX/ELF 분기' },
];
