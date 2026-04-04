export const encCode = `// SEV 메모리 암호화 흐름 (하드웨어 레벨)
CPU Write(data, GPA) {
    c_bit = page_table[GPA].c_bit;   // 암호화 플래그
    if (c_bit) {
        key = ASID_key_table[current_ASID]; // VM별 키
        ciphertext = AES_128_ECB(key, data); // 하드웨어 가속
        mem_controller.write(GPA, ciphertext);
    } else {
        mem_controller.write(GPA, data);     // 평문 (공유 메모리)
    }
}

// 특징: 소프트웨어 수정 없이 투명하게 동작
// 성능: 메모리 컨트롤러 통합으로 ~2% 오버헤드`;

export const encAnnotations = [
  { lines: [3, 3] as [number, number], color: 'sky' as const, note: 'C-bit로 암호화 여부 결정' },
  { lines: [5, 6] as [number, number], color: 'emerald' as const, note: 'VM별 고유 AES-128 키' },
  { lines: [13, 14] as [number, number], color: 'amber' as const, note: '투명 암호화, 낮은 오버헤드' },
];
