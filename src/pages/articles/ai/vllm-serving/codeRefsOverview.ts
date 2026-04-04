import type { CodeRef } from './codeRefs';

export const engineCoreInit: CodeRef = {
  id: 'engine-core-init',
  title: 'EngineCore.__init__',
  file: 'vllm/v1/engine/core.py',
  startLine: 85,
  code: `class EngineCore:
    """Inner loop of vLLM's Engine."""

    def __init__(
        self,
        vllm_config: VllmConfig,
        executor_class: type[Executor],
        log_stats: bool,
    ):
        self.vllm_config = vllm_config

        # Setup Model.
        self.model_executor = executor_class(vllm_config)

        # Setup KV Caches and update CacheConfig.
        kv_cache_config = self._initialize_kv_caches(vllm_config)

        # Setup scheduler.
        Scheduler = vllm_config.scheduler_config.get_scheduler_cls()
        self.scheduler: SchedulerInterface = Scheduler(
            vllm_config=vllm_config,
            kv_cache_config=kv_cache_config,
            structured_output_manager=self.structured_output_manager,
        )

        # Batch queue for pipeline parallelism
        self.batch_queue_size = self.model_executor.max_concurrent_batches
        self.step_fn = (
            self.step if self.batch_queue is None
            else self.step_with_batch_queue
        )`,
  annotations: [
    { lines: [96, 96], color: 'sky', note: 'Executor: GPU Worker 관리' },
    { lines: [100, 100], color: 'emerald', note: 'KV 캐시 프로파일링 & 초기화' },
    { lines: [103, 107], color: 'amber', note: '스케줄러 생성 (KV config 기반)' },
    { lines: [110, 114], color: 'violet', note: 'PP 배치 큐 설정' },
  ],
};

const inputProcessor: CodeRef = {
  id: 'input-processor',
  title: 'InputProcessor.process_inputs()',
  file: 'vllm/v1/engine/input_processor.py',
  startLine: 187,
  code: `def process_inputs(
    self,
    request_id: str,
    prompt: PromptType | ProcessorInputs,
    params: SamplingParams | PoolingParams,
    supported_tasks: tuple[SupportedTask, ...],
) -> EngineCoreRequest:
    self._validate_params(params, supported_tasks)

    # 프롬프트 전처리 (토크나이징)
    processed_inputs = self.input_preprocessor.preprocess(prompt)

    encoder_inputs, decoder_inputs = split_enc_dec_inputs(
        processed_inputs
    )

    # SamplingParams 설정
    sampling_params = params.clone()
    if sampling_params.max_tokens is None:
        sampling_params.max_tokens = (
            self.model_config.max_model_len - seq_len
        )

    return EngineCoreRequest(
        request_id=request_id,
        prompt_token_ids=prompt_token_ids,
        sampling_params=sampling_params,
        arrival_time=arrival_time,
    )`,
  annotations: [
    { lines: [194, 194], color: 'sky', note: '파라미터 유효성 검증' },
    { lines: [197, 197], color: 'emerald', note: '프롬프트 → 토큰 ID 변환' },
    { lines: [205, 208], color: 'amber', note: 'max_tokens 자동 계산' },
    { lines: [210, 214], color: 'violet', note: 'EngineCoreRequest 생성' },
  ],
};

export const overviewRefs: CodeRef[] = [engineCoreInit, inputProcessor];
