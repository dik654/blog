# freeCodeCamp Fine-tuning · MLOps · Kubernetes gap ledger

확인일은 2026-10-08이다. 이 문서는 공개 강의 네 편을 블로그의 새 목차로 복사하는 목록이 아니다.
강의로 전체 흐름을 훑고, 기존 정본에서 실제로 끊긴 인과·실물·실패 경계를 찾은 뒤 공식 문서로
다시 확인한 기록이다.

## 독자와 한 문장 답

- 독자 질문: “강의를 다 본 뒤 무엇을 직접 설명하고 재현해야 지원용 지식이 되는가?”
- 한 문장 답: fine-tuning은 학습 재개와 승격까지, MLflow는 실행에서 endpoint까지, Kubernetes는 API
  요청에서 노드 실행과 장애 복구까지 한 사건을 끊김 없이 추적해야 한다.
- 내릴 판단: 강의 시청 완료가 아니라 아래 산출물과 실패 시험이 남았을 때 해당 학습 단위를 닫는다.

## 1. LLM Fine-Tuning Course

- 강의: [LLM Fine-Tuning Course – From Supervised Fine-Tuning to RLHF, LoRA, and Multimodal](https://www.youtube.com/watch?v=CcrC5zSv1iA)
- 강의가 보여 준 지도: SFT data와 tokenization, full fine-tuning과 PEFT, LoRA·QLoRA, instruction
  tuning, DPO·RLHF, LLaMA Factory·Unsloth, hosted fine-tuning, embedding·multimodal fine-tuning.
- 기존 정본: `supervised-fine-tuning`, `lora-finetuning`, `dpo`, `rlhf`, `embedding-finetuning`,
  image/video LoRA 글이 방법·목적·memory·evaluation을 이미 나눠 맡는다.
- 실제 빈칸: adapter 파일을 저장하는 일과 중단된 optimizer step을 이어 가는 일을 같은 checkpoint로
  부르고 있었다. Resume에는 weight만 아니라 optimizer·scheduler·RNG와 data position이 필요하며,
  `save_only_model`처럼 일부 state가 없으면 같은 학습 궤적의 재개가 아니다. 학습 완료 뒤에도
  base/tokenizer/template/dataset/code revision과 held-out 결과를 한 promotion 후보로 묶는 경로가 필요했다.
- 이번 보강: `lora-finetuning#practice`에 전원 차단 사건, checkpoint manifest, 실제
  `resume_from_checkpoint` 호출, 정상·실패 판독과 승격 영수증을 추가한다. 방법별 사용법을 다시
  나열하지 않는다.
- 넣지 않는 범위: LLaMA Factory·Axolotl·Unsloth의 모든 UI와 flag, hosted provider별 가격·현재 모델
  목록, 하나의 축소 notebook 성능을 production sizing 근거로 쓰는 일.
- 1차 근거: Hugging Face Transformers의 Trainer checkpoint recipe와 PEFT checkpoint format. 현재
  문서는 optimizer·scheduler·RNG 복원 및 adapter가 base model을 별도로 필요로 한다는 경계를 밝힌다.

## 2. Learn MLOps with MLflow and Databricks

- 강의: [Learn MLOps with MLflow and Databricks – Full Course for Machine Learning Engineers](https://www.youtube.com/watch?v=tVskbekONlw)
- 강의가 보여 준 지도: local tracking server, SQLite backend, parameter·metric·artifact logging,
  autologging, registry·version·alias, serving, prompt registry, GenAI evaluation, Unity Catalog와
  Databricks Model Serving.
- 기존 정본: `experiment-tracking`이 run ID·artifact digest·failure provenance를, `model-artifact-registry`가
  metadata/object store·immutable version·alias·endpoint parity를 맡는다.
- 실제 빈칸: local SQLite 실습이 팀용 tracking server와 어떻게 달라지는지, Unity Catalog의 세 단계
  이름과 실행 권한이 어디서 작동하는지, judge prompt가 바뀐 점수를 같은 실험처럼 비교하지 않으려면
  무엇을 versioning해야 하는지가 본문에 없었다.
- 이번 보강: 실험 추적 글에 `dataset·trace·prompt·judge·scorer version`을 고정한 GenAI 평가 실행을,
  registry 글에 local→shared store 전환, `catalog.schema.model`, alias resolve, endpoint attestation의
  실제 명령과 실패 경계를 넣는다.
- 넣지 않는 범위: Databricks 화면을 순서대로 따라 하는 제품 투어, workspace별 과금·SKU, 강의 시점의
  deprecated API를 현재 정본처럼 고정하는 일. `custom_prompt_judge` 대신 현재 공식 권고인
  `make_judge`를 기준으로 쓴다.
- 1차 근거: MLflow backend/artifact store·tracking server·scorer versioning 문서, Databricks Unity
  Catalog model lifecycle·privilege·Model Serving 문서.

## 3. Learn Kubernetes in 6 Hours

- 강의: [Learn Kubernetes in 6 Hours – Full Course with Real-World Project](https://www.youtube.com/watch?v=_4uQI4ihGVU)
- 실습 저장소: [saiyam1814/Kubernetes-crash-course-2025](https://github.com/saiyam1814/Kubernetes-crash-course-2025)
- 강의가 보여 준 지도: self-managed/managed cluster, YAML·kubeconfig, control plane, CRI·CNI·CSI,
  kube-proxy·CoreDNS·RBAC, Pod·Deployment·DaemonSet·StatefulSet·Service, volume, Gateway API와 monitoring.
- 기존 정본: GPU workload 관점의 `onprem-k8s-inference-platform`, Operator와 Slurm 비교는 있지만,
  일반 Pod 한 개가 저장된 의도에서 node process와 network endpoint가 되는 전체 경로 정본은 없었다.
- 실제 빈칸: 객체 이름은 알지만 `Pending`, `ContainerCreating`, `Running but NotReady`, Service 503이
  각각 어느 owner와 evidence를 가리키는지 한 사건에서 설명할 글이 없었다.
- 이번 보강: 새 `kubernetes-request-path-and-cka` 글에서 3-replica 배포가 2개만 Ready인 사건을
  API→scheduler→kubelet→runtime/network/storage→Service/DNS/Gateway 순서로 추적한다. 명령·event·
  component log와 정상/실패 출력을 같은 시간축에 놓는다.
- 넣지 않는 범위: 특정 managed service의 버튼 순서, 모든 CNI·CSI 제품 비교, GPU Operator·Slurm의
  중복 설명. GPU scheduling은 기존 정본으로 연결한다.
- 1차 근거: Kubernetes Components, API concepts, Scheduler, Services/Networking, Storage와 cluster
  troubleshooting 공식 문서.

## 4. Certified Kubernetes Administrator Course

- 강의: [Kubernetes Course – Certified Kubernetes Administrator Exam Preparation (2026 Update)](https://www.youtube.com/watch?v=l57xKN6OBhY)
- companion: [freeCodeCamp CKA 2026 commands and demos](https://www.freecodecamp.org/news/prepare-for-the-kubernetes-administrator-certification-and-pass-2026-update)
- 보충 노트: [KodeKloud CKA 공개 저장소](https://github.com/kodekloudhub/certified-kubernetes-administrator-course)
- 원본 그림 찾아보기: [KodeKloud CKA image index](https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/images)
- 강의가 보여 준 지도: kubeadm lab, lifecycle·upgrade, HA control plane, RBAC, Helm·Kustomize,
  workloads·rollout·autoscaling·scheduling, Service·Ingress·Gateway·NetworkPolicy·CoreDNS, storage와
  cluster/node/component/network troubleshooting.
- 현재 공식 범위: Linux Foundation 확인일 기준 CKA는 Kubernetes v1.35, 2시간 performance-based
  exam이다. 영역은 Storage 10%, Troubleshooting 30%, Workloads & Scheduling 15%, Cluster
  Architecture/Installation/Configuration 25%, Services & Networking 20%다. 시험 환경은 release 뒤
  바뀔 수 있으므로 접수 직전에 다시 확인한다.
- 실제 빈칸: 범위표는 있어도 장애를 좁히는 반복 lab과 증거 파일이 없었다. 시험에서 빠르게 푸는 명령과
  production에서 승인·backup·복구 검증을 거쳐 바꾸는 절차도 분리돼 있지 않았다.
- 이번 보강: 같은 Kubernetes 글의 후반부에 공식 비중을 40시간 학습 장부로 바꾸고, `context 확인 →
  symptom 재현 → object/event → node service/log → 수정 → acceptance`를 반복하는 6-lab 경로를 둔다.
  etcd snapshot과 kubeadm HA는 시험 연습과 production runbook의 차이를 함께 적는다.
- KodeKloud 반영: Core concepts → scheduling → maintenance → security → storage → networking →
  design/kubeadm → troubleshooting 폴더를 같은 요청 경로에 배치한 링크 지도를 추가했다. 저장소 루트에서
  명시적 license 파일을 확인하지 못했으므로 PNG를 복사하지 않고, 원본 이미지 모음은 링크하며 본문 도해는
  React/CSS로 새로 작성한다.
- 브라우저 실습 반영: `bmuschko/cka-crash-course`, `chadmcrowell/CKA-Exercises`,
  `xooooooooox/cka-exercises`, `devopshubproject/cka-lab`, `edixos/cka-labs`,
  `simonbbbb/CKA-Hand-on-lab`, `sailor-sh/CK-X`, `stephrobert/kubernetes-dsoxlab-training`의
  self-contained task·시간 제한·terminal·결과 상태 검증 구조를 비교했다. 문제 문장은 복사하지 않고 이 글의
  Pending scheduling, Service selector, NotReady runtime 사건을 상태형 CLI simulator로 새로 작성했다.
- 실행 경계: 본문 CLI는 임의 shell이나 실제 cluster가 아니라 허용된 명령과 상태 전이만 재현한다. 실제
  kubectl·kubelet·network·storage 동작은 연결한 원본 lab을 kind 또는 kubeadm 환경에서 다시 수행해야 한다.
- 넣지 않는 범위: 시험 유출 문제, 암기 dump, 현재 가격을 고정한 구매 조언, 단일-node lab 성공을 HA
  운영 경력으로 표현하는 일.
- 1차 근거: Linux Foundation CKA 공식 페이지·CNCF curriculum, Kubernetes kubeadm·HA·debug 문서.

## 보강 뒤 남겨야 할 산출물

1. Fine-tuning: 중단 직전/재개 직후 step·learning rate·data position을 대조한 resume receipt와
   base+adapter+evaluation promotion manifest.
2. MLflow: backend DB와 artifact object를 함께 복구하고 한 run에서 model version·endpoint까지
   역추적한 lifecycle receipt.
3. Kubernetes: `Pending → Running → Ready → endpoint`의 각 전환과 실패 owner를 적은 request-path
   worksheet.
4. CKA: 6개 장애 lab마다 context, 수정 전 증거, 변경, 수정 후 acceptance, 되돌리기를 남긴 기록.

이 네 산출물을 만들 수 있어야 “강의를 봤다”가 “시스템을 설명하고 고칠 수 있다”로 바뀐다.
