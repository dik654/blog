export const benchmarkTable = [
  { name: 'MATH-500', domain: '수학', count: 500, level: '고등~대학', method: '정확도' },
  { name: 'AIME 2024', domain: '수학', count: 30, level: '올림피아드', method: '정확도' },
  { name: 'AIME 2025', domain: '수학', count: 30, level: '올림피아드', method: '정확도' },
  { name: 'GPQA Diamond', domain: '과학', count: 198, level: '대학원', method: '정확도' },
  { name: 'LiveCodeBench', domain: '코딩', count: 400, level: '경쟁', method: '실행 결과' },
];

export const evalPipelineSteps = [
  { label: '모델 로드', sub: 'vLLM 서버', color: '#6366f1' },
  { label: 'LightEval', sub: '벤치마크 태스크', color: '#10b981' },
  { label: '결과 수집', sub: 'JSON 출력', color: '#f59e0b' },
  { label: 'Hub 업로드', sub: '리더보드', color: '#8b5cf6' },
];

export const evalConfig = `# Slurm 평가 작업
#SBATCH --gres=gpu:8
#SBATCH --partition=hopper-prod
#SBATCH --time=1-00:00:00

lighteval vllm "$MODEL_ARGS" $TASKS \\
  --use-chat-template \\
  --output-dir $OUTPUT_DIR \\
  --save-details`;
