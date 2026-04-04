export const servingComponents = [
  { name: 'SGLang 서버', desc: '고성능 추론 서빙 (TP=16)', color: '#6366f1' },
  { name: 'vLLM 백엔드', desc: '효율적인 추론 엔진', color: '#10b981' },
  { name: '라우터', desc: '부하 분산 및 요청 관리', color: '#f59e0b' },
  { name: 'Slurm 통합', desc: '클러스터 작업 관리', color: '#8b5cf6' },
];

export const deploySteps = [
  {
    label: '1. SGLang 서버 배포',
    body: '2노드 x 8GPU (총 16 GPU)로 DeepSeek-R1을 텐서 병렬 서빙합니다. context-length=32768, max-running-requests=56입니다.',
  },
  {
    label: '2. 라우터 설정',
    body: 'CPU 전용 파티션에서 라우터를 실행합니다. 워커 등록, 헬스 체크, 부하 분산, 자동 재시작을 관리합니다.',
  },
  {
    label: '3. 헬스 체크',
    body: '서버 시작 대기(최대 1시간 타임아웃) 후 sanity check 요청을 보냅니다. 5분마다 지속적 모니터링합니다.',
  },
  {
    label: '4. 훈련 클러스터',
    body: 'train.slurm으로 SFT/GRPO 작업을 제출합니다. --model, --task, --config, --accelerator, --dp, --tp 옵션을 지원합니다.',
  },
];

export const slurmConfig = `#SBATCH --job-name=r1-server
#SBATCH --nodes=2
#SBATCH --gpus-per-node=8
#SBATCH --exclusive
#SBATCH --time=7-00:00:00

srun --nodes=2 --ntasks=2 \\
  python -m sglang.launch_server \\
  --model-path deepseek-ai/DeepSeek-R1 \\
  --tp 16 --context-length 32768`;
