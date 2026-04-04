import type { CodeRef } from './codeRefs';

const engineCoreStep: CodeRef = {
  id: 'engine-core-step',
  title: 'EngineCore.step()',
  file: 'vllm/v1/engine/core.py',
  startLine: 378,
  code: `def step(self) -> tuple[dict[int, EngineCoreOutputs], bool]:
    """Schedule, execute, and make output."""

    if not self.scheduler.has_requests():
        return {}, False

    # 1) 스케줄러가 다음 배치 결정
    scheduler_output = self.scheduler.schedule()

    # 2) GPU Worker에 모델 실행 요청 (non-blocking)
    future = self.model_executor.execute_model(
        scheduler_output, non_block=True
    )

    # 3) Structured output grammar bitmask
    grammar_output = self.scheduler.get_grammar_bitmask(
        scheduler_output
    )

    # 4) 결과 대기 & 샘플링
    model_output = future.result()
    if model_output is None:
        model_output = self.model_executor.sample_tokens(
            grammar_output
        )

    # 5) 스케줄러 상태 업데이트
    engine_core_outputs = self.scheduler.update_from_output(
        scheduler_output, model_output
    )
    return engine_core_outputs, True`,
  annotations: [
    { lines: [384, 385], color: 'sky', note: 'schedule(): 요청 선택 & 블록 할당' },
    { lines: [388, 390], color: 'emerald', note: 'execute_model(): 비동기 GPU 실행' },
    { lines: [398, 401], color: 'amber', note: '결과 수신 & 토큰 샘플링' },
    { lines: [404, 406], color: 'violet', note: '완료/프리엠션 등 상태 반영' },
  ],
};

const gpuWorkerExecute: CodeRef = {
  id: 'gpu-worker-execute',
  title: 'Worker.execute_model()',
  file: 'vllm/v1/worker/gpu_worker.py',
  startLine: 759,
  code: `def execute_model(
    self, scheduler_output: "SchedulerOutput"
) -> ModelRunnerOutput | None:
    # PP 이전 단계 전송 완료 대기
    if self._pp_send_work:
        for handle in self._pp_send_work:
            handle.wait()
        self._pp_send_work = []

    intermediate_tensors = None
    forward_pass = scheduler_output.total_num_scheduled_tokens > 0

    # Pipeline Parallelism: 이전 스테이지에서 텐서 수신
    if forward_pass and not get_pp_group().is_first_rank:
        tensor_dict, comm_handles, comm_postprocess = (
            get_pp_group().irecv_tensor_dict(...)
        )
        intermediate_tensors = AsyncIntermediateTensors(
            tensor_dict, comm_handles=comm_handles
        )

    # ModelRunner에 실행 위임
    with self.annotate_profile(scheduler_output):
        output = self.model_runner.execute_model(
            scheduler_output, intermediate_tensors
        )`,
  annotations: [
    { lines: [763, 766], color: 'sky', note: 'PP send 완료 보장' },
    { lines: [769, 769], color: 'emerald', note: '스케줄된 토큰 > 0이면 forward' },
    { lines: [772, 778], color: 'amber', note: 'PP: 비동기 텐서 수신 (irecv)' },
    { lines: [781, 783], color: 'violet', note: 'GPUModelRunner.execute_model 호출' },
  ],
};

export const servingArchRefs: CodeRef[] = [engineCoreStep, gpuWorkerExecute];
