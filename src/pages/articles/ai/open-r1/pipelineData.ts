export const pipelineSteps = [
  {
    label: '1. vLLM 서버 시작',
    body: 'DeepSeek-R1 모델을 텐서 병렬(TP=4)로 로드합니다. max_model_len=32768, 포트 8000에서 OpenAI 호환 API를 제공합니다.',
  },
  {
    label: '2. 데이터셋 준비',
    body: 'HuggingFace Hub에서 수학/코딩 데이터셋을 로드합니다. prompt_column 지정으로 다양한 데이터셋 형식을 지원합니다.',
  },
  {
    label: '3. Distilabel 파이프라인',
    body: 'Ray 기반 분산 처리로 TextGeneration 파이프라인을 구축합니다. input_batch_size=64, 복수 생성 결과를 그룹화합니다.',
  },
  {
    label: '4. 비동기 생성',
    body: 'aiohttp + asyncio로 동시성 제어하며 병렬 생성합니다. retry_budget=10, 세마포어로 동시 요청 수를 제한합니다.',
  },
  {
    label: '5. 필터링 & 업로드',
    body: '생성 결과를 검증하고 JSONL로 저장합니다. finish_reason, api_metadata를 함께 기록하여 품질 관리합니다.',
  },
];

export const distilabelParams = [
  { param: 'model', desc: '사용할 모델명 (vLLM 서버에 로드된 모델)' },
  { param: 'max_new_tokens', default: '8192', desc: '최대 생성 토큰 수' },
  { param: 'num_generations', default: '1', desc: '문제당 생성할 응답 수' },
  { param: 'input_batch_size', default: '64', desc: '입력 배치 크기' },
  { param: 'timeout', default: '900', desc: '요청 타임아웃 (초)' },
];
