import type { CodeRef } from './codeRefs';

const blockTables: CodeRef = {
  id: 'block-tables',
  title: 'BlockTables (PagedAttention)',
  file: 'vllm/v1/worker/gpu/block_table.py',
  startLine: 13,
  code: `class BlockTables:
    def __init__(
        self,
        block_sizes: list[int],
        max_num_reqs: int,
        max_num_batched_tokens: int,
        max_model_len: int,
        device: torch.device,
    ):
        self.block_sizes = block_sizes
        self.num_kv_cache_groups = len(self.block_sizes)

        # num_kv_cache_groups x [max_num_reqs, max_num_blocks]
        self.block_tables: list[StagedWriteTensor] = []
        for i in range(self.num_kv_cache_groups):
            block_size = self.block_sizes[i]
            max_num_blocks = cdiv(max_model_len, block_size)
            block_table = StagedWriteTensor(
                (max_num_reqs, max_num_blocks),
                dtype=torch.int32, device=device,
            )
            self.block_tables.append(block_table)

        # 슬롯 매핑: 토큰 → 물리 블록 내 위치
        self.slot_mappings = torch.zeros(
            self.num_kv_cache_groups,
            max_num_batched_tokens,
            dtype=torch.int64, device=device,
        )`,
  annotations: [
    { lines: [22, 22], color: 'sky', note: 'KV 캐시 그룹별 블록 크기' },
    { lines: [26, 34], color: 'emerald', note: '논리→물리 블록 매핑 테이블' },
    { lines: [37, 41], color: 'amber', note: '토큰별 슬롯 매핑 (PagedAttention 핵심)' },
  ],
};

const modelRunnerExecute: CodeRef = {
  id: 'model-runner-execute',
  title: 'GPUModelRunner.execute_model()',
  file: 'vllm/v1/worker/gpu/model_runner.py',
  startLine: 875,
  code: `def execute_model(
    self,
    scheduler_output: SchedulerOutput,
    intermediate_tensors: IntermediateTensors | None = None,
) -> ModelRunnerOutput | IntermediateTensors | None:
    # 요청 상태 업데이트
    self.finish_requests(scheduler_output)
    self.free_states(scheduler_output)
    self.add_requests(scheduler_output)
    self.update_requests(scheduler_output)

    # Block Table 갱신 (PagedAttention 핵심)
    self.block_tables.apply_staged_writes()

    if scheduler_output.total_num_scheduled_tokens == 0:
        return self.kv_connector.no_forward(scheduler_output)

    # CUDAGraph dispatch 결정
    num_toks = scheduler_output.total_num_scheduled_tokens
    batch_desc = self.cudagraph_manager.dispatch(
        num_reqs, num_toks, uniform_tok_count
    )

    # 입력 준비 & Attention 메타데이터 구성
    input_batch = self.prepare_inputs(scheduler_output, batch_desc)
    block_tables, slot_mappings = self.prepare_attn(input_batch)`,
  annotations: [
    { lines: [881, 884], color: 'sky', note: '요청 추가/제거/갱신' },
    { lines: [887, 887], color: 'emerald', note: 'Block Table staged writes 적용' },
    { lines: [894, 896], color: 'amber', note: 'CUDAGraph 배치 최적화' },
    { lines: [899, 900], color: 'violet', note: 'PagedAttention slot mapping 생성' },
  ],
};

export const pagedAttentionRefs: CodeRef[] = [blockTables, modelRunnerExecute];
