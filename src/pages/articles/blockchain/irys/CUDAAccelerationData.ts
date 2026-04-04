export const CUDA_INTERFACE_CODE = `// Rust → CUDA FFI (irys-packing/src/cuda.rs)
#[cfg(feature = "nvidia")]
pub fn capacity_pack_range_cuda_c(
    num_chunks: u32,
    mining_address: Address,
    chunk_offset: c_ulong,
    partition_hash: PartitionHash,
    entropy: &mut Vec<u8>,
    entropy_packing_iterations: u32,
    irys_chain_id: u64,
) -> u32 {
    unsafe {
        // CUDA C 함수 호출
        capacity_cuda::compute_entropy_chunks_cuda(
            mining_addr, mining_addr_len,
            chunk_offset, irys_chain_id,
            num_chunks as i64, partition_hash,
            partition_hash_len, entropy_ptr, iterations,
        )
    }
}`;

export const CUDA_INTERFACE_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'nvidia feature 게이트' },
  { lines: [13, 19] as [number, number], color: 'emerald' as const, note: 'unsafe FFI 호출' },
];

export const KERNEL_CODE = `// CUDA 커널 (capacity_cuda.cu)
__global__ void compute_entropy_chunks_cuda_kernel(
    unsigned char *chunk_id,
    unsigned long int chunk_offset_start,
    long int chunks_count,
    unsigned char *chunks,      // 출력 버퍼
    unsigned int packing_sha_1_5_s
) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < chunks_count) {
        unsigned char *output = chunks + idx * DATA_CHUNK_SIZE;
        // 스레드별 청크 ID 생성 → 시드 해시 → 엔트로피 계산
        compute_seed_hash_cuda(chunk_id_thread, CHUNK_ID_LEN, seed_hash);
        compute_entropy_chunk_cuda(seed_hash, output, packing_sha_1_5_s);
    }
}`;

export const KERNEL_ANNOTATIONS = [
  { lines: [9, 10] as [number, number], color: 'sky' as const, note: '스레드-청크 1:1 매핑' },
  { lines: [13, 14] as [number, number], color: 'emerald' as const, note: 'GPU에서 시드 해시 + 엔트로피 계산' },
];

export const MEMORY_CODE = `// GPU 메모리 관리
// 1. 메모리 할당
cudaMalloc(&d_chunks, DATA_CHUNK_SIZE * chunks_count);
cudaMalloc(&d_chunk_id, CHUNK_ID_LEN);

// 2. 호스트 → 디바이스 전송
cudaMemcpy(d_chunk_id, mining_addr, mining_addr_size,
    cudaMemcpyHostToDevice);

// 3. 커널 실행
#define THREADS_PER_BLOCK 10
int blocks = (chunks_count + THREADS_PER_BLOCK - 1)
    / THREADS_PER_BLOCK;
compute_entropy_chunks_cuda_kernel<<<blocks, THREADS_PER_BLOCK>>>(
    d_chunk_id, chunk_offset_start, chunks_count, d_chunks,
    packing_sha_1_5_s);

// 4. 디바이스 → 호스트 복사
cudaMemcpy(chunks, d_chunks, DATA_CHUNK_SIZE * chunks_count,
    cudaMemcpyDeviceToHost);`;

export const MEMORY_ANNOTATIONS = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: 'GPU 메모리 할당' },
  { lines: [10, 16] as [number, number], color: 'emerald' as const, note: '커널 실행 설정' },
  { lines: [19, 21] as [number, number], color: 'amber' as const, note: '결과 호스트 복사' },
];
