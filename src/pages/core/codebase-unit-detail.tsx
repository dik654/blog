import { Link, useParams } from 'react-router-dom';
import ArticleLayout from '@/components/ArticleLayout';
import { CodeSidebar, useCodeSidebar, type CodeRef, type FileNode } from '@/components/code';
import { workspaceProjects, type WorkspaceProject, type WorkspaceStatus, type WorkspaceUnit } from '@/content/core-workspace';
import { CORE_ROOT } from '@/lib/paths';
import litellmRouter from '@/pages/articles/ai/llm-serving-ops/codebase/litellm/litellm/router.py?raw';
import openR1Grpo from '@/pages/articles/ai/open-r1/codebase/open-r1/src/open_r1/grpo.py?raw';
import rethAlloyPrimitives from '@/pages/articles/ethereum/reth-alloy-primitives/codebase/reth/primitives.rs?raw';
import rethBuilder from '@/pages/articles/ethereum/reth-cli/codebase/reth/builder.rs?raw';
import rethChainspec from '@/pages/articles/ethereum/reth-chainspec/codebase/reth/chainspec.rs?raw';
import rethComponents from '@/pages/articles/ethereum/reth-cli/codebase/reth/components.rs?raw';
import rethCursor from '@/pages/articles/ethereum/reth-db/codebase/reth/cursor.rs?raw';
import rethEip1559 from '@/pages/articles/ethereum/reth-eip1559/codebase/reth/crates/primitives-traits/src/eip1559.rs?raw';
import rethEip4844 from '@/pages/articles/ethereum/reth-eip4844/codebase/reth/crates/primitives-traits/src/eip4844.rs?raw';
import rethExecutor from '@/pages/articles/ethereum/reth-block-execution/codebase/reth/crates/evm/src/executor.rs?raw';
import rethPipeline from '@/pages/articles/ethereum/reth-pipeline/codebase/reth/crates/stages/api/src/pipeline/mod.rs?raw';
import rethProvider from '@/pages/articles/ethereum/reth-provider/codebase/reth/provider.rs?raw';
import rethRlp from '@/pages/articles/ethereum/reth-alloy-primitives/codebase/reth/rlp.rs?raw';
import rethRpcEthApi from '@/pages/articles/ethereum/reth-rpc/codebase/reth/eth_api.rs?raw';
import rethSession from '@/pages/articles/ethereum/reth-net/codebase/reth/session.rs?raw';
import rethSnapSync from '@/pages/articles/ethereum/reth-sync/codebase/reth/snap_sync.rs?raw';
import rethTables from '@/pages/articles/ethereum/reth-db/codebase/reth/tables.rs?raw';
import rethTrieStateRoot from '@/pages/articles/ethereum/reth-trie/codebase/reth/state_root.rs?raw';
import rethTxValidate from '@/pages/articles/ethereum/reth-txpool/codebase/reth/crates/transaction-pool/src/validate.rs?raw';
import heliosBootstrap from '@/pages/articles/ethereum/helios-bootstrap/codebase/helios/consensus/src/bootstrap.rs?raw';
import heliosRpc from '@/pages/articles/ethereum/helios-execution/codebase/helios/execution/src/rpc.rs?raw';
import heliosUpdate from '@/pages/articles/ethereum/helios-update/codebase/helios/consensus/src/update.rs?raw';
import lighthouseBeaconChain from '@/pages/articles/ethereum/node-architecture/codebase/lighthouse/beacon_node/beacon_chain/src/beacon_chain.rs?raw';
import lighthouseGossip from '@/pages/articles/ethereum/node-architecture/codebase/lighthouse/beacon_node/network/src/network_beacon_processor/gossip_methods.rs?raw';
import lighthouseNetwork from '@/pages/articles/ethereum/node-architecture/codebase/lighthouse/beacon_node/network/src/service.rs?raw';
import prysmBlockOperations from '@/pages/articles/ethereum/prysm-block-processing/codebase/prysm/beacon-chain/core/blocks/block_operations.go?raw';
import prysmProcessBlock from '@/pages/articles/ethereum/prysm-block-processing/codebase/prysm/beacon-chain/blockchain/process_block.go?raw';
import prysmDbBlocks from '@/pages/articles/ethereum/prysm-beacon-db/codebase/prysm/beacon-chain/db/kv/blocks.go?raw';
import prysmEngineClient from '@/pages/articles/ethereum/prysm-engine-api/codebase/prysm/beacon-chain/execution/engine_client.go?raw';
import prysmEpochProcessing from '@/pages/articles/ethereum/prysm-epoch-processing/codebase/prysm/beacon-chain/core/epoch/epoch_processing.go?raw';
import prysmRewardPenalty from '@/pages/articles/ethereum/prysm-epoch-processing/codebase/prysm/beacon-chain/core/epoch/precompute/reward_penalty.go?raw';
import prysmGossipValidation from '@/pages/articles/ethereum/prysm-gossipsub/codebase/prysm/beacon-chain/sync/validate_beacon_blocks.go?raw';
import prysmSyncCommittee from '@/pages/articles/ethereum/prysm-sync-committee/codebase/prysm/beacon-chain/core/altair/sync_committee.go?raw';
import { codeRefs as sp1CodeRefs } from '@/pages/articles/blockchain/sp1/codeRefs';
import { codeRefs as risc0CodeRefs } from '@/pages/articles/blockchain/risc0/codeRefs';
import { codeRefs as joltCodeRefs } from '@/pages/articles/blockchain/jolt/codeRefs';
import { COMPRESS_CODE as sp1CompressCode } from '@/pages/articles/blockchain/sp1/RecursionCompressionData';
import { PROVE_CORE_CODE as sp1ProveCoreCode } from '@/pages/articles/blockchain/sp1/STARKProvingData';
import { SHRINK_CODE as sp1ShrinkCode, WRAP_CODE as sp1WrapCode } from '@/pages/articles/blockchain/sp1/SNARKWrappingData';
import { codeRefs as sgxCodeRefs } from '@/pages/articles/tee/intel-sgx/codeRefs';
import { codeRefs as sevCodeRefs } from '@/pages/articles/tee/amd-sev/codeRefs';
import { codeRefs as dstackCodeRefs } from '@/pages/articles/tee/dstack/codeRefs';
import { codeRefs as opteeCodeRefs } from '@/pages/articles/tee/op-tee/codeRefs';
import { codeRefs as oasisCodeRefs } from '@/pages/articles/tee/oasis/codeRefs';

const registrySlugs = new Set([
  'ai-llm-ops-codebase',
  'cnn-deep-learning-codebase',
  'gpt2-codebase',
  'vlm-codebase',
  'stable-diffusion-codebase',
  'reth-codebase',
  'prysm-codebase',
  'helios-codebase',
  'lighthouse-codebase',
  'intel-sgx-codebase',
  'sev-snp-codebase',
  'optee-codebase',
  'dstack-codebase',
  'oasis-core-codebase',
  'sp1-codebase',
  'risc0-codebase',
  'jolt-codebase',
]);

const prefixBySlug: Record<string, string> = {
  'ai-llm-ops-codebase': 'LLMOPS',
  'cnn-deep-learning-codebase': 'CNN',
  'gpt2-codebase': 'GPT2',
  'vlm-codebase': 'VLM',
  'stable-diffusion-codebase': 'SD',
  'reth-codebase': 'RETH',
  'prysm-codebase': 'PRYSM',
  'helios-codebase': 'HELIOS',
  'lighthouse-codebase': 'LH',
  'intel-sgx-codebase': 'SGX',
  'sev-snp-codebase': 'SEV',
  'optee-codebase': 'OPTEE',
  'dstack-codebase': 'DSTACK',
  'oasis-core-codebase': 'OASIS',
  'sp1-codebase': 'SP1',
  'risc0-codebase': 'RISC0',
  'jolt-codebase': 'JOLT',
};

const commandBySlug: Record<string, string[]> = {
  'ai-llm-ops-codebase': [
    "pytest tests -k 'router or fallback or cooldown or budget' -q",
    "pytest tests -k 'sft or grpo or reward or eval' -q",
  ],
  'cnn-deep-learning-codebase': [
    "pytest tests -k 'conv or residual or forward' -q",
    "pytest tests -k 'train_step or eval_loop' -q",
  ],
  'gpt2-codebase': [
    "pytest tests -k 'attention or block or generate' -q",
    "pytest tests -k 'loss or logits' -q",
  ],
  'vlm-codebase': [
    "pytest tests -k 'vision or projector or multimodal' -q",
    "pytest tests -k 'image_token or generate' -q",
  ],
  'stable-diffusion-codebase': [
    "pytest tests -k 'vae or unet or scheduler' -q",
    "pytest tests -k 'cfg or sample_loop' -q",
  ],
  'reth-codebase': [
    "cargo test -p reth-node -p reth-provider -p reth-transaction-pool --all-features",
    "cargo test -p reth-stages -p reth-network -p reth-rpc --all-features",
  ],
  'prysm-codebase': [
    "go test ./beacon-chain/blockchain ./beacon-chain/core/blocks",
    "go test ./beacon-chain/core/epoch ./beacon-chain/sync ./beacon-chain/db/kv",
  ],
  'helios-codebase': [
    "cargo test -p helios-consensus -p helios-ethereum --all-features",
    "cargo test -p client -p common --all-features",
  ],
  'lighthouse-codebase': [
    "cargo test -p beacon_chain -p network -p store --all-features",
    "cargo test -p validator_client -p execution_layer --all-features",
  ],
  'intel-sgx-codebase': ['make test SGX_MODE=SIM', 'ctest -R sgx'],
  'sev-snp-codebase': ['make kselftest TARGETS=x86', 'cargo test --features sev-snp'],
  'optee-codebase': ['xtest regression_1000', 'make CFG_TEE_CORE_LOG_LEVEL=2'],
  'dstack-codebase': ['cargo test --workspace --features tdx,attestation', 'cargo test -p kms -p guest-agent'],
  'oasis-core-codebase': ['go test ./go/...', 'cargo test -p oasis-runtime-sdk'],
  'sp1-codebase': ['cargo test -p sp1-core --all-features', "cargo test --workspace -k 'executor or prover or recursion'"],
  'risc0-codebase': ['cargo test -p risc0-zkvm --all-features', "cargo test --workspace -k 'session or receipt or recursion'"],
  'jolt-codebase': ['cargo test -p jolt-core --all-features', "cargo test --workspace -k 'instruction or prover or sumcheck'"],
};

type SourceSpec = {
  path: string;
  code: string;
  lang: CodeRef['lang'];
  desc: string;
};

type FunctionEntry = {
  symbol: string;
  signature: string;
  context: string;
  line: number;
};

function sourceFromRef(ref: CodeRef, desc: string): SourceSpec {
  return {
    path: ref.path,
    code: ref.code,
    lang: ref.lang,
    desc,
  };
}

const cnnModelCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False)
        self.bn = nn.BatchNorm2d(out_ch)

    def forward(self, x):
        return F.relu(self.bn(self.conv(x)), inplace=True)

class BasicBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1):
        super().__init__()
        self.main = nn.Sequential(ConvBlock(in_ch, out_ch, stride), nn.Conv2d(out_ch, out_ch, 3, padding=1, bias=False), nn.BatchNorm2d(out_ch))
        self.skip = nn.Identity() if in_ch == out_ch and stride == 1 else nn.Conv2d(in_ch, out_ch, 1, stride=stride, bias=False)

    def forward(self, x):
        return F.relu(self.main(x) + self.skip(x), inplace=True)

class ImageClassifier(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.stem = ConvBlock(3, 64)
        self.block = BasicBlock(64, 128, stride=2)
        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(128, num_classes)

    def forward(self, images):
        x = self.stem(images)
        x = self.block(x)
        x = self.pool(x).flatten(1)
        return self.fc(x)`;

const cnnTrainCode = `import torch

def train_step(model, batch, optimizer, criterion, scaler=None):
    images, labels = batch
    optimizer.zero_grad(set_to_none=True)
    with torch.autocast(device_type='cuda', enabled=scaler is not None):
        logits = model(images)
        loss = criterion(logits, labels)
    if scaler is None:
        loss.backward()
        optimizer.step()
    else:
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
    return {'loss': float(loss.detach()), 'batch_size': images.size(0)}

@torch.no_grad()
def evaluate(model, loader, metric):
    model.eval()
    total = 0
    for images, labels in loader:
        logits = model(images)
        total += metric.update(logits, labels)
    return metric.compute(total)`;

const gpt2ModelCode = `import torch
import torch.nn as nn
import torch.nn.functional as F

class CausalSelfAttention(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()
        self.c_attn = nn.Linear(n_embd, 3 * n_embd)
        self.c_proj = nn.Linear(n_embd, n_embd)
        self.n_head = n_head
        self.register_buffer('bias', torch.tril(torch.ones(block_size, block_size)).view(1, 1, block_size, block_size))

    def forward(self, x):
        b, t, c = x.size()
        q, k, v = self.c_attn(x).split(c, dim=2)
        q = q.view(b, t, self.n_head, c // self.n_head).transpose(1, 2)
        k = k.view(b, t, self.n_head, c // self.n_head).transpose(1, 2)
        v = v.view(b, t, self.n_head, c // self.n_head).transpose(1, 2)
        att = (q @ k.transpose(-2, -1)) * (1.0 / (k.size(-1) ** 0.5))
        att = att.masked_fill(self.bias[:, :, :t, :t] == 0, float('-inf'))
        y = att.softmax(dim=-1) @ v
        return self.c_proj(y.transpose(1, 2).contiguous().view(b, t, c))

class Block(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()
        self.ln_1 = nn.LayerNorm(n_embd)
        self.attn = CausalSelfAttention(n_embd, n_head, block_size)
        self.ln_2 = nn.LayerNorm(n_embd)
        self.mlp = nn.Sequential(nn.Linear(n_embd, 4 * n_embd), nn.GELU(), nn.Linear(4 * n_embd, n_embd))

    def forward(self, x):
        x = x + self.attn(self.ln_1(x))
        x = x + self.mlp(self.ln_2(x))
        return x

class GPT(nn.Module):
    def __init__(self, vocab_size, block_size, n_layer, n_head, n_embd):
        super().__init__()
        self.block_size = block_size
        self.wte = nn.Embedding(vocab_size, n_embd)
        self.wpe = nn.Embedding(block_size, n_embd)
        self.blocks = nn.ModuleList([Block(n_embd, n_head, block_size) for _ in range(n_layer)])
        self.ln_f = nn.LayerNorm(n_embd)
        self.lm_head = nn.Linear(n_embd, vocab_size, bias=False)

    def forward(self, idx, targets=None):
        pos = torch.arange(0, idx.size(1), device=idx.device)
        x = self.wte(idx) + self.wpe(pos)
        for block in self.blocks:
            x = block(x)
        logits = self.lm_head(self.ln_f(x))
        loss = None if targets is None else F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))
        return logits, loss

    @torch.no_grad()
    def generate(self, idx, max_new_tokens, temperature=1.0, top_k=None):
        for _ in range(max_new_tokens):
            idx_cond = idx[:, -self.block_size:]
            logits, _ = self(idx_cond)
            logits = logits[:, -1, :] / temperature
            if top_k is not None:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = -float('Inf')
            idx = torch.cat((idx, torch.multinomial(F.softmax(logits, dim=-1), num_samples=1)), dim=1)
        return idx`;

const vlmModelCode = `import torch
import torch.nn as nn

class VisionTower(nn.Module):
    def __init__(self, clip_model):
        super().__init__()
        self.clip_model = clip_model

    def encode_images(self, images):
        return self.clip_model.vision_model(images).last_hidden_state

class MultimodalProjector(nn.Module):
    def __init__(self, vision_dim, hidden_size):
        super().__init__()
        self.proj = nn.Sequential(nn.Linear(vision_dim, hidden_size), nn.GELU(), nn.Linear(hidden_size, hidden_size))

    def forward(self, image_features):
        return self.proj(image_features)

def merge_image_tokens(input_embeds, image_embeds, image_token_mask):
    output = input_embeds.clone()
    output[image_token_mask] = image_embeds.reshape(-1, image_embeds.size(-1))
    return output

class LlavaLikeModel(nn.Module):
    def __init__(self, vision_tower, projector, language_model):
        super().__init__()
        self.vision_tower = vision_tower
        self.projector = projector
        self.language_model = language_model

    def forward(self, input_ids, images, image_token_mask, labels=None):
        text_embeds = self.language_model.get_input_embeddings()(input_ids)
        image_features = self.vision_tower.encode_images(images)
        image_embeds = self.projector(image_features)
        inputs_embeds = merge_image_tokens(text_embeds, image_embeds, image_token_mask)
        return self.language_model(inputs_embeds=inputs_embeds, labels=labels)

    def prepare_inputs_for_generation(self, input_ids, images=None, image_token_mask=None, **kwargs):
        if images is None:
            return {'input_ids': input_ids, **kwargs}
        return {'input_ids': input_ids, 'images': images, 'image_token_mask': image_token_mask, **kwargs}`;

const stableDiffusionCode = `import torch

def encode_latents(vae, images):
    posterior = vae.encode(images).latent_dist
    return posterior.sample() * vae.config.scaling_factor

def decode_latents(vae, latents):
    latents = latents / vae.config.scaling_factor
    return vae.decode(latents).sample

def encode_prompt(tokenizer, text_encoder, prompt, negative_prompt=None):
    text_inputs = tokenizer(prompt, padding='max_length', truncation=True, return_tensors='pt')
    prompt_embeds = text_encoder(text_inputs.input_ids)[0]
    if negative_prompt is None:
        return prompt_embeds
    neg_inputs = tokenizer(negative_prompt, padding='max_length', truncation=True, return_tensors='pt')
    return torch.cat([text_encoder(neg_inputs.input_ids)[0], prompt_embeds])

def predict_noise(unet, latents, timestep, encoder_hidden_states):
    return unet(latents, timestep, encoder_hidden_states=encoder_hidden_states).sample

def scheduler_step(scheduler, noise_pred, timestep, latents):
    return scheduler.step(noise_pred, timestep, latents).prev_sample

def sample_loop(unet, scheduler, latents, prompt_embeds, guidance_scale):
    for timestep in scheduler.timesteps:
        latent_model_input = torch.cat([latents] * 2)
        noise_pred = predict_noise(unet, latent_model_input, timestep, prompt_embeds)
        noise_uncond, noise_text = noise_pred.chunk(2)
        guided = noise_uncond + guidance_scale * (noise_text - noise_uncond)
        latents = scheduler_step(scheduler, guided, timestep, latents)
    return latents`;

const sourceSets: Record<string, SourceSpec[][]> = {
  'ai-llm-ops-codebase': [
    [
      { path: 'litellm/litellm/router.py', code: litellmRouter, lang: 'python', desc: 'LiteLLM router가 fallback, cooldown, budget 판단을 묶는 진입점입니다.' },
    ],
    [
      { path: 'litellm/litellm/router.py', code: litellmRouter, lang: 'python', desc: 'LiteLLM router가 latency/cost/provider strategy를 선택하는 경계입니다.' },
    ],
    [
      { path: 'litellm/litellm/router.py', code: litellmRouter, lang: 'python', desc: 'LiteLLM fallback 후보 생성과 provider 순회가 분리되는 경계입니다.' },
    ],
    [
      { path: 'litellm/litellm/router.py', code: litellmRouter, lang: 'python', desc: '실패 provider cooldown과 다음 요청 격리를 확인하는 코드입니다.' },
    ],
    [
      { path: 'litellm/litellm/router.py', code: litellmRouter, lang: 'python', desc: 'budget/rate limit 조건이 routing 전에 걸러지는지 보는 경계입니다.' },
    ],
    [
      { path: 'open-r1/src/open_r1/grpo.py', code: openR1Grpo, lang: 'python', desc: 'Open-R1 학습 entrypoint가 dataset과 trainer 구성을 고정하는 코드입니다.' },
    ],
    [
      { path: 'open-r1/src/open_r1/grpo.py', code: openR1Grpo, lang: 'python', desc: 'Open-R1 GRPO rollout과 update loop가 reward 결과를 소비하는 경계입니다.' },
    ],
    [
      { path: 'open-r1/src/open_r1/grpo.py', code: openR1Grpo, lang: 'python', desc: 'reward/eval 데이터셋 처리가 학습 업데이트와 섞이지 않는지 보는 코드입니다.' },
    ],
  ],
  'cnn-deep-learning-codebase': [
    [
      { path: 'pytorch-cnn/model.py', code: cnnModelCode, lang: 'python', desc: 'ConvBlock가 이미지 feature를 convolution, batch normalization, ReLU 활성화로 변환하는 CNN 기본 feature extractor입니다.' },
    ],
    [
      { path: 'pytorch-cnn/model.py', code: cnnModelCode, lang: 'python', desc: 'BasicBlock이 main convolution path와 skip path를 더해 residual identity를 보존하는 재사용 단위입니다.' },
    ],
    [
      { path: 'pytorch-cnn/model.py', code: cnnModelCode, lang: 'python', desc: 'ImageClassifier.forward가 stem, residual block, global pooling, classifier head를 거쳐 logits를 반환하는 inference boundary입니다.' },
    ],
    [
      { path: 'pytorch-cnn/train.py', code: cnnTrainCode, lang: 'python', desc: 'train_step이 forward, loss, backward, optimizer step, AMP scaler update를 한 학습 단위로 닫습니다.' },
    ],
    [
      { path: 'pytorch-cnn/evaluate.py', code: cnnTrainCode, lang: 'python', desc: 'evaluate가 no_grad eval mode에서 loader를 순회하며 metric aggregation만 수행하는 평가 경계입니다.' },
    ],
  ],
  'gpt2-codebase': [
    [
      { path: 'nanogpt/model.py', code: gpt2ModelCode, lang: 'python', desc: 'GPT.forward가 token embedding과 position embedding을 더해 decoder block 입력 시퀀스를 만드는 GPT-2 입력 경계입니다.' },
    ],
    [
      { path: 'nanogpt/model.py', code: gpt2ModelCode, lang: 'python', desc: 'CausalSelfAttention.forward가 QKV projection, causal mask, attention weighted sum을 수행하는 decoder self-attention 경계입니다.' },
    ],
    [
      { path: 'nanogpt/model.py', code: gpt2ModelCode, lang: 'python', desc: 'Block.forward가 pre-norm attention과 MLP를 residual stream에 더하는 Transformer block 재사용 단위입니다.' },
    ],
    [
      { path: 'nanogpt/model.py', code: gpt2ModelCode, lang: 'python', desc: 'GPT.forward가 final layer norm, LM head, cross entropy loss까지 language modeling contract를 닫습니다.' },
    ],
    [
      { path: 'nanogpt/model.py', code: gpt2ModelCode, lang: 'python', desc: 'GPT.generate가 context crop, next-token logits, temperature/top-k sampling을 반복하는 autoregressive decoding loop입니다.' },
    ],
  ],
  'vlm-codebase': [
    [
      { path: 'llava/modeling_vlm.py', code: vlmModelCode, lang: 'python', desc: 'VisionTower.encode_images가 image tensor를 CLIP visual hidden states로 변환하는 vision encoder 경계입니다.' },
    ],
    [
      { path: 'llava/modeling_vlm.py', code: vlmModelCode, lang: 'python', desc: 'MultimodalProjector.forward가 vision feature dimension을 LLM hidden size로 맞추는 modality bridge입니다.' },
    ],
    [
      { path: 'llava/modeling_vlm.py', code: vlmModelCode, lang: 'python', desc: 'merge_image_tokens가 text embedding의 image token 위치에 visual embedding을 삽입하는 multimodal merge 경계입니다.' },
    ],
    [
      { path: 'llava/modeling_vlm.py', code: vlmModelCode, lang: 'python', desc: 'LlavaLikeModel.forward가 image encoder, projector, token merge, language model loss를 연결하는 VLM forward contract입니다.' },
    ],
    [
      { path: 'llava/modeling_vlm.py', code: vlmModelCode, lang: 'python', desc: 'prepare_inputs_for_generation이 decoding 중 image inputs와 text ids를 generation API 입력으로 유지합니다.' },
    ],
  ],
  'stable-diffusion-codebase': [
    [
      { path: 'stable-diffusion/pipeline.py', code: stableDiffusionCode, lang: 'python', desc: 'encode_latents와 decode_latents가 pixel space와 latent space 사이 VAE boundary를 담당합니다.' },
    ],
    [
      { path: 'stable-diffusion/pipeline.py', code: stableDiffusionCode, lang: 'python', desc: 'encode_prompt가 prompt와 negative prompt를 text encoder hidden states로 변환하는 conditioning 경계입니다.' },
    ],
    [
      { path: 'stable-diffusion/pipeline.py', code: stableDiffusionCode, lang: 'python', desc: 'predict_noise가 latent, timestep, text conditioning을 UNet denoise prediction으로 연결합니다.' },
    ],
    [
      { path: 'stable-diffusion/pipeline.py', code: stableDiffusionCode, lang: 'python', desc: 'scheduler_step이 predicted noise를 이용해 다음 latent sample을 계산하는 sampler state transition입니다.' },
    ],
    [
      { path: 'stable-diffusion/pipeline.py', code: stableDiffusionCode, lang: 'python', desc: 'sample_loop가 classifier-free guidance와 scheduler update를 반복해 denoising trajectory를 닫습니다.' },
    ],
  ],
  'reth-codebase': [
    [
      { path: 'reth/crates/node/builder.rs', code: rethBuilder, lang: 'rust', desc: 'CLI 입력과 node config 생성이 분리되는 경계입니다.' },
    ],
    [
      { path: 'reth/crates/node/builder.rs', code: rethBuilder, lang: 'rust', desc: 'NodeBuilder가 node 구성 요소를 조립하는 경계입니다.' },
      { path: 'reth/crates/node/components.rs', code: rethComponents, lang: 'rust', desc: 'Reth node 구성 요소 trait와 provider/pool/network 연결 지점입니다.' },
    ],
    [
      { path: 'reth/chainspec.rs', code: rethChainspec, lang: 'rust', desc: 'ChainSpec이 fork schedule과 genesis 설정을 보존하는 경계입니다.' },
    ],
    [
      { path: 'alloy/rlp.rs', code: rethRlp, lang: 'rust', desc: 'RLP encode/decode가 byte 입력을 구조화 값으로 바꾸는 경계입니다.' },
      { path: 'alloy/primitives.rs', code: rethAlloyPrimitives, lang: 'rust', desc: 'alloy primitive 타입이 hash/address/integer 의미를 보존하는 경계입니다.' },
    ],
    [
      { path: 'reth/db/tables.rs', code: rethTables, lang: 'rust', desc: 'DB table 정의가 key/value schema를 고정하는 코드입니다.' },
      { path: 'reth/db/cursor.rs', code: rethCursor, lang: 'rust', desc: 'DB cursor가 range traversal과 seek 의미를 담당하는 경계입니다.' },
    ],
    [
      { path: 'reth/provider.rs', code: rethProvider, lang: 'rust', desc: 'Provider layer가 DB 읽기와 state 조회를 분리하는 경계입니다.' },
    ],
    [
      { path: 'reth/trie/state_root.rs', code: rethTrieStateRoot, lang: 'rust', desc: 'state root 계산과 trie traversal 경계를 확인하는 코드입니다.' },
    ],
    [
      { path: 'reth/stages/pipeline/mod.rs', code: rethPipeline, lang: 'rust', desc: 'Pipeline stage 실행 순서와 unwind 경계를 관리하는 코드입니다.' },
    ],
    [
      { path: 'reth/evm/executor.rs', code: rethExecutor, lang: 'rust', desc: 'Block execution이 revm 실행 결과를 BundleState로 연결하는 경계입니다.' },
    ],
    [
      { path: 'reth/transaction-pool/validate.rs', code: rethTxValidate, lang: 'rust', desc: 'Txpool admission validation이 transaction type과 blob sidecar를 분리하는 경계입니다.' },
    ],
    [
      { path: 'reth/eip1559.rs', code: rethEip1559, lang: 'rust', desc: 'EIP-1559 fee field와 fork rule을 보존하는 코드입니다.' },
      { path: 'reth/eip4844.rs', code: rethEip4844, lang: 'rust', desc: 'EIP-4844 blob primitive와 versioned hash 경계를 확인하는 코드입니다.' },
    ],
    [
      { path: 'reth/net/session.rs', code: rethSession, lang: 'rust', desc: 'Network session이 peer message와 connection state를 분리하는 경계입니다.' },
      { path: 'reth/sync/snap_sync.rs', code: rethSnapSync, lang: 'rust', desc: 'Snap sync가 peer response와 state progress를 관리하는 코드입니다.' },
      { path: 'reth/rpc/eth_api.rs', code: rethRpcEthApi, lang: 'rust', desc: 'Eth RPC API가 external request를 provider/executor 경계로 전달하는 코드입니다.' },
    ],
  ],
  'prysm-codebase': [
    [{ path: 'prysm/beacon-chain/blockchain/process_block.go', code: prysmProcessBlock, lang: 'go', desc: 'Prysm ProcessBlock가 beacon block을 state transition으로 넘기는 block processing entrypoint입니다.' }],
    [{ path: 'prysm/beacon-chain/core/blocks/block_operations.go', code: prysmBlockOperations, lang: 'go', desc: 'Prysm block operations validation이 proposer slashing, attestation, deposit 같은 consensus operation을 분리 검증합니다.' }],
    [{ path: 'prysm/beacon-chain/execution/engine_client.go', code: prysmEngineClient, lang: 'go', desc: 'Prysm Engine API client가 execution payload 조회와 execution client call boundary를 담당합니다.' }],
    [{ path: 'prysm/beacon-chain/core/epoch/epoch_processing.go', code: prysmEpochProcessing, lang: 'go', desc: 'Prysm epoch processing이 justification/finalization과 registry update를 epoch boundary로 묶습니다.' }],
    [{ path: 'prysm/beacon-chain/core/epoch/precompute/reward_penalty.go', code: prysmRewardPenalty, lang: 'go', desc: 'Prysm reward/penalty precompute가 validator balance delta 계산을 독립 경계로 유지합니다.' }],
    [{ path: 'prysm/beacon-chain/core/altair/sync_committee.go', code: prysmSyncCommittee, lang: 'go', desc: 'Prysm sync committee 처리가 aggregate signature 검증과 committee update를 담당합니다.' }],
    [{ path: 'prysm/beacon-chain/sync/validate_beacon_blocks.go', code: prysmGossipValidation, lang: 'go', desc: 'Prysm gossip validation이 네트워크에서 받은 beacon block을 fork choice/state transition 전 검증합니다.' }],
    [{ path: 'prysm/beacon-chain/db/kv/blocks.go', code: prysmDbBlocks, lang: 'go', desc: 'Prysm beacon DB block read/write가 persistent block storage boundary를 담당합니다.' }],
  ],
  'helios-codebase': [
    [{ path: 'helios/consensus/bootstrap.rs', code: heliosBootstrap, lang: 'rust', desc: 'checkpoint bootstrap과 store 초기화 경계입니다.' }],
    [{ path: 'helios/consensus/bootstrap.rs', code: heliosBootstrap, lang: 'rust', desc: 'trusted block root와 store 초기화가 분리되는 경계입니다.' }],
    [{ path: 'helios/consensus/update.rs', code: heliosUpdate, lang: 'rust', desc: 'light client update 검증과 적용 경계입니다.' }],
    [{ path: 'helios/consensus/update.rs', code: heliosUpdate, lang: 'rust', desc: 'finality update가 client state를 갱신하는 경계입니다.' }],
    [{ path: 'helios/consensus/update.rs', code: heliosUpdate, lang: 'rust', desc: 'sync committee 검증과 교체 흐름입니다.' }],
    [{ path: 'helios/consensus/update.rs', code: heliosUpdate, lang: 'rust', desc: 'committee period 전환이 검증 상태를 오염시키지 않는지 보는 코드입니다.' }],
    [{ path: 'helios/execution/rpc.rs', code: heliosRpc, lang: 'rust', desc: 'execution proof와 RPC 요청 경계입니다.' }],
    [{ path: 'helios/execution/rpc.rs', code: heliosRpc, lang: 'rust', desc: 'eth_call/RPC fallback 실패가 light client 상태와 분리되는 경계입니다.' }],
  ],
  'lighthouse-codebase': [
    [{ path: 'lighthouse/beacon_chain.rs', code: lighthouseBeaconChain, lang: 'rust', desc: 'beacon chain 상태와 block import 경계입니다.' }],
    [{ path: 'lighthouse/beacon_chain.rs', code: lighthouseBeaconChain, lang: 'rust', desc: 'block import와 fork choice 연결 경계입니다.' }],
    [{ path: 'lighthouse/network/service.rs', code: lighthouseNetwork, lang: 'rust', desc: 'network service와 sync manager 연결 경계입니다.' }],
    [{ path: 'lighthouse/network/service.rs', code: lighthouseNetwork, lang: 'rust', desc: 'sync manager의 peer/range 요청이 network lifecycle과 분리되는 경계입니다.' }],
    [{ path: 'lighthouse/network/gossip_methods.rs', code: lighthouseGossip, lang: 'rust', desc: 'gossip block 처리와 검증 입구입니다.' }],
    [{ path: 'lighthouse/network/gossip_methods.rs', code: lighthouseGossip, lang: 'rust', desc: 'gossip failure와 peer penalty가 정상 처리와 섞이지 않는지 보는 코드입니다.' }],
    [{ path: 'lighthouse/beacon_chain.rs', code: lighthouseBeaconChain, lang: 'rust', desc: 'hot/cold store read/write가 chain state 접근과 만나는 경계입니다.' }],
    [{ path: 'lighthouse/beacon_chain.rs', code: lighthouseBeaconChain, lang: 'rust', desc: 'validator duty와 execution layer 연동을 chain state 기준으로 확인합니다.' }],
  ],
  'intel-sgx-codebase': [
    [
      sourceFromRef(sgxCodeRefs['is-ecall-allowed'], 'ECALL ordinal과 privilege bit를 검사해 enclave 함수 호출 권한을 결정합니다.'),
      sourceFromRef(sgxCodeRefs['trts-ecall'], '허용된 ECALL을 실제 enclave 함수 주소로 dispatch하는 trusted runtime entry입니다.'),
      sourceFromRef(sgxCodeRefs['do-ecall'], 'untrusted host에서 들어온 ECALL을 enclave 초기화 상태와 stack boundary 기준으로 받습니다.'),
    ],
    [
      sourceFromRef(sgxCodeRefs['sgx-ocall'], 'enclave 내부 요청을 untrusted host OCALL로 넘기고 context를 보존합니다.'),
      sourceFromRef(sgxCodeRefs['do-oret'], 'OCALL 이후 untrusted return 값을 enclave stack context로 되돌립니다.'),
      sourceFromRef(sgxCodeRefs['ocall-context'], 'nested ECALL/OCALL에서 돌아갈 stack frame과 ordinal을 보존하는 구조입니다.'),
    ],
    [
      sourceFromRef(sgxCodeRefs['key-request'], 'MRENCLAVE/MRSIGNER 정책에 맞는 sealing key 요청 필드를 구성합니다.'),
      sourceFromRef(sgxCodeRefs['sealed-data'], 'plaintext를 encrypted payload와 MAC이 포함된 sealed blob으로 포장합니다.'),
    ],
    [
      sourceFromRef(sgxCodeRefs['report-body'], 'measurement, attributes, report data가 attestation claim에 담기는 구조입니다.'),
      sourceFromRef(sgxCodeRefs['target-info'], 'local report 대상 enclave의 measurement와 attributes를 지정합니다.'),
      sourceFromRef(sgxCodeRefs['quote-structure'], 'remote attestation quote가 report body와 signature를 묶는 경계입니다.'),
      sourceFromRef(sgxCodeRefs['att-key-id'], 'quote 생성에 사용할 attestation key 식별자를 고정합니다.'),
    ],
    [
      sourceFromRef(sgxCodeRefs['ecall-table'], 'EDL에서 생성된 ECALL table이 ordinal, privilege, callable matrix를 고정합니다.'),
      sourceFromRef(sgxCodeRefs['is-ecall-allowed'], 'ECALL table과 dynamic entry matrix를 실제 호출 허용 여부로 적용합니다.'),
    ],
  ],
  'sev-snp-codebase': [
    [sourceFromRef(sevCodeRefs['rmp-entry'], 'RMP entry가 SPA 소유자, GPA, ASID, validated bit를 보존하는 하드웨어 검증 단위입니다.')],
    [sourceFromRef(sevCodeRefs['vmpl-perms'], 'VMPL별 R/W/X 권한 bit가 guest 내부 privilege boundary를 나눕니다.')],
    [sourceFromRef(sevCodeRefs['pvalidate'], 'PVALIDATE가 guest page의 validated 상태를 바꾸는 명령 경계입니다.')],
    [sourceFromRef(sevCodeRefs['attest-report'], 'SNP attestation report가 measurement, policy, report data를 묶는 증명 산출물입니다.')],
    [sourceFromRef(sevCodeRefs['guest-request'], 'guest request가 PSP/firmware에 attestation report 생성을 요청하는 syscall/ioctl 경계입니다.')],
  ],
  'optee-codebase': [
    [sourceFromRef(opteeCodeRefs['smc-fast-handler'], 'Fast SMC handler가 짧은 secure service를 interrupt masked 상태로 처리합니다.')],
    [
      sourceFromRef(opteeCodeRefs['smc-std-handler'], 'Standard SMC handler가 RPC resume와 새 TA 요청을 구분합니다.'),
      sourceFromRef(opteeCodeRefs['smc-std-entry-asm'], 'AArch64 standard SMC entry가 C handler 호출 뒤 normal world로 복귀합니다.'),
    ],
    [
      sourceFromRef(opteeCodeRefs['entry-open-session'], 'TA UUID와 client identity를 받아 TA session을 생성합니다.'),
      sourceFromRef(opteeCodeRefs['entry-invoke-command'], '열린 TA session의 command entrypoint를 호출합니다.'),
      sourceFromRef(opteeCodeRefs['entry-close-session'], 'session close 요청을 받아 TA 자원 해제를 수행합니다.'),
      sourceFromRef(opteeCodeRefs['entry-std-dispatch'], 'standard call command를 open/invoke/close/cancel로 분기합니다.'),
    ],
    [
      sourceFromRef(opteeCodeRefs['key-fek-crypt'], 'TEE FS file encryption key를 암복호화하는 secure storage 경계입니다.'),
      sourceFromRef(opteeCodeRefs['key-hmac'], 'secure storage metadata와 block integrity를 HMAC으로 검증합니다.'),
    ],
    [
      sourceFromRef(opteeCodeRefs['key-init-manager'], 'TEE FS key manager의 root key와 derived key 상태를 초기화합니다.'),
      sourceFromRef(opteeCodeRefs['key-generate-fek'], '새 secure object에 사용할 FEK를 생성합니다.'),
      sourceFromRef(opteeCodeRefs['key-ssk-struct'], 'SSK/TSK/FEK 계층에서 보존해야 할 key material 구조입니다.'),
    ],
  ],
  'dstack-codebase': [
    [sourceFromRef(dstackCodeRefs['td-create'], 'TDX VM을 QEMU confidential guest 옵션과 vsock boundary로 생성합니다.')],
    [sourceFromRef(dstackCodeRefs['manifest-flow'], 'manifest policy가 VM image, resource, port, attestation 조건을 고정합니다.')],
    [sourceFromRef(dstackCodeRefs['key-derive'], 'KMS가 workload identity와 measurement를 기준으로 key를 파생하고 발급합니다.')],
    [
      sourceFromRef(dstackCodeRefs['tdx-quote-gen'], 'guest agent가 TDX quote 생성을 요청하는 attestation entry입니다.'),
      sourceFromRef(dstackCodeRefs['tdx-verify'], 'KMS/verifier가 quote measurement와 policy binding을 검증합니다.'),
    ],
    [sourceFromRef(dstackCodeRefs['ra-tls'], 'RA-TLS 인증서가 quote와 TLS public key를 묶어 원격 endpoint 신뢰를 만듭니다.')],
  ],
  'oasis-core-codebase': [
    [
      sourceFromRef(oasisCodeRefs['abci-mux'], 'CometBFT ABCI request를 Oasis 내부 앱으로 등록하고 라우팅하는 외부 합의 경계입니다.'),
      sourceFromRef(oasisCodeRefs['abci-mux-inner'], 'ABCI method별 앱 맵과 실행 순서를 보존하는 mux 내부 상태입니다.'),
    ],
    [sourceFromRef(oasisCodeRefs['full-service'], 'CometBFT full node service가 P2P, consensus, lifecycle start를 조립합니다.')],
    [sourceFromRef(oasisCodeRefs['dispatcher'], 'runtime dispatcher가 EnclaveRPC와 runtime transaction dispatch 상태를 관리합니다.')],
    [sourceFromRef(oasisCodeRefs['executor-worker'], 'compute executor worker가 runtime별 committee node를 시작하고 초기화를 대기합니다.')],
    [
      sourceFromRef(oasisCodeRefs['km-secrets-api'], 'keymanager secrets API가 master secret 생성/복제/로드 RPC를 정의합니다.'),
      sourceFromRef(oasisCodeRefs['km-status'], 'keymanager status가 secret generation, node set, rotation policy를 검증합니다.'),
    ],
  ],
  'sp1-codebase': [
    [
      sourceFromRef(sp1CodeRefs['vm-struct'], 'SP1 VM 상태 구조가 pc, clk, memory, execution record를 어떤 경계로 보존하는지 보여줍니다.'),
      sourceFromRef(sp1CodeRefs['vm-advance'], 'SP1 executor가 VM cycle, pc, clk, shard boundary를 진행하는 함수입니다.'),
    ],
    [
      sourceFromRef(sp1CodeRefs['vm-advance'], 'cycle advance가 다음 opcode 실행으로 상태를 넘기는 경계입니다.'),
      sourceFromRef(sp1CodeRefs['vm-alu'], 'ALU opcode 실행과 trace 생성 경계를 확인하는 함수입니다.'),
      sourceFromRef(sp1CodeRefs['opcode-enum'], 'SP1 opcode enum은 ALU dispatch가 참조하는 전체 opcode 표입니다.'),
    ],
    [
      sourceFromRef(sp1CodeRefs['vm-ecall'], 'ECALL이 syscall/precompile 실행을 VM execution boundary에서 분리하는 함수입니다.'),
    ],
    [
      sourceFromRef(sp1CodeRefs['sdk-entry'], 'SDK entry가 ELF, stdin, proof mode를 prover 실행으로 넘기는 API 경계입니다.'),
      sourceFromRef(sp1CodeRefs['sdk-prover'], 'SDK prover가 local/network prover 선택과 proof pipeline을 조립합니다.'),
      sourceFromRef(sp1CodeRefs['cpu-prover'], 'CPU prover가 실제 core proof path로 실행을 연결합니다.'),
    ],
    [
      { path: 'sp1/crates/prover/src/prove_core.rs', code: sp1ProveCoreCode, lang: 'rust', desc: 'SP1 core prover가 checkpoint, trace, shard proof를 연결하는 함수입니다.' },
      { path: 'sp1/crates/prover/src/recursion/compress.rs', code: sp1CompressCode, lang: 'rust', desc: 'SP1 recursion compression이 shard proof를 reduce tree로 압축하는 함수입니다.' },
      sourceFromRef(sp1CodeRefs['prover-entry'], 'SP1 prover entry가 실행 기록을 proving phase로 전달하는 진입점입니다.'),
    ],
    [
      { path: 'sp1/crates/prover/src/recursion/shrink.rs', code: sp1ShrinkCode, lang: 'rust', desc: 'SP1 shrink가 BabyBear STARK를 BN254 STARK로 재증명하는 함수입니다.' },
      { path: 'sp1/crates/prover/src/recursion/wrap.rs', code: sp1WrapCode, lang: 'rust', desc: 'SP1 wrap이 BN254 STARK를 Groth16 proof로 감싸는 함수입니다.' },
    ],
  ],
  'risc0-codebase': [
    [sourceFromRef(risc0CodeRefs['prover-prove'], 'RISC Zero prover의 최상위 entry가 ExecutorEnv와 ELF를 실행/증명 파이프라인으로 넘깁니다.')],
    [
      sourceFromRef(risc0CodeRefs['session-struct'], 'Session 구조가 실행 결과, segment, assumption을 증명 입력으로 보존합니다.'),
      sourceFromRef(risc0CodeRefs['segment-struct'], 'Segment 구조가 긴 실행을 분할한 STARK proving 단위로 고정합니다.'),
    ],
    [
      sourceFromRef(risc0CodeRefs['prover-session'], 'prove_session이 Session을 segment receipt와 composite receipt로 바꿉니다.'),
      sourceFromRef(risc0CodeRefs['prover-receipt-pipeline'], 'receipt pipeline이 Composite, Succinct, Groth16 변환 경계를 결정합니다.'),
    ],
    [sourceFromRef(risc0CodeRefs['prover-receipt-pipeline'], 'Groth16 receipt 변환이 온체인 검증용 최종 proof 형식을 만듭니다.')],
    [
      sourceFromRef(risc0CodeRefs['recursion-lift'], 'recursion lift가 segment receipt를 recursion circuit 입력으로 올립니다.'),
      sourceFromRef(risc0CodeRefs['recursion-join'], 'recursion join이 여러 receipt를 하나의 succinct receipt로 결합합니다.'),
      sourceFromRef(risc0CodeRefs['recursion-identity'], 'recursion identity가 receipt claim을 재귀 증명 안에서 보존합니다.'),
    ],
  ],
  'jolt-codebase': [
    [sourceFromRef(joltCodeRefs['jolt-instruction'], 'Jolt instruction lookup이 RISC-V 피연산자를 Lasso lookup query로 바꿉니다.')],
    [sourceFromRef(joltCodeRefs['jolt-prover'], 'JoltCpuProver가 trace, Spartan key, RAM 상태, opening accumulator를 들고 proving stage를 진행합니다.')],
    [
      sourceFromRef(joltCodeRefs['jolt-sumcheck'], 'BatchedSumcheck가 여러 claim을 하나의 sumcheck transcript로 결합합니다.'),
      sourceFromRef(joltCodeRefs['jolt-prover'], 'prover stage가 sumcheck stage들을 순서대로 호출해 proof state를 갱신합니다.'),
    ],
    [sourceFromRef(joltCodeRefs['jolt-proof'], 'JoltProof serialization이 stage proof, PCS opening proof, trace metadata를 보존합니다.')],
  ],
};

function statusLabel(status: WorkspaceStatus) {
  if (status === 'done') return '작성됨';
  if (status === 'doing') return '확장 중';
  if (status === 'review') return '검토';
  return '대기';
}

function unitId(project: WorkspaceProject, index: number) {
  const prefix = prefixBySlug[project.slug] ?? 'CORE';
  return `${prefix}-${String(index + 1).padStart(3, '0')}`;
}

function commandFor(project: WorkspaceProject, index: number) {
  const commands = commandBySlug[project.slug] ?? ['프로젝트 테스트 명령 확정 필요'];
  return commands[index % commands.length];
}

function findRegistryProject(slug?: string) {
  if (!slug || !registrySlugs.has(slug)) return undefined;
  return workspaceProjects.find((project) => project.slug === slug);
}

function parseUnitIndex(unitSlug?: string) {
  const match = unitSlug?.match(/^unit-(\d+)$/);
  return match ? Number(match[1]) - 1 : -1;
}

function boundaryFor(project: WorkspaceProject, unit: WorkspaceUnit) {
  return `${project.codebase ?? project.title}에서 "${unit.title}" 범위를 하나의 관찰 가능한 동작으로 자른다. 입력, 상태 변경, 실패 응답, cleanup이 다른 단위와 섞이지 않아야 한다.`;
}

function sourceNotes(project: WorkspaceProject, unit: WorkspaceUnit) {
  return [
    unit.evidence ?? '블로그 코드베이스 소스 보기에서 추출한 근거 파일',
    `${project.track} 안에서 이 범위가 담당하는 상태 전이와 외부 의존성을 먼저 확인한다.`,
    '상세 블로그 글을 다시 렌더링하지 않고, core에서는 검증 가능한 주장과 확인 명령만 남긴다.',
  ];
}

function invariantRows(unit: WorkspaceUnit) {
  return [
    ['경계 보존', `${unit.title}의 입력과 출력 의미가 다른 기능 단위로 새지 않는다.`],
    ['실패 분리', '잘못된 입력, 누락된 상태, 외부 의존성 실패가 정상 경로와 같은 결과로 뭉개지지 않는다.'],
    ['회귀 고정', '대표 성공/실패 fixture와 확인 명령을 함께 남겨 다음 수정에서 같은 단위를 다시 확인한다.'],
  ];
}

function uniqueSymbols(symbols: string[]) {
  return Array.from(new Set(symbols)).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function extractFunctionSymbols(source: SourceSpec) {
  const code = source.code;
  if (source.lang === 'python') {
    return uniqueSymbols(
      Array.from(code.matchAll(/^\s*(?:async\s+)?def\s+([A-Za-z_][\w]*)\s*\(/gm), (match) => `${match[1]}()`),
    );
  }

  if (source.lang === 'rust') {
    return uniqueSymbols(
      Array.from(code.matchAll(/^\s*(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?(?:unsafe\s+)?fn\s+([A-Za-z_][\w]*)\s*(?:<[^>{}]*>)?\s*\(/gm), (match) => `${match[1]}()`),
    );
  }

  if (source.lang === 'c') {
    return uniqueSymbols(
      Array.from(
        code.matchAll(/^\s*(?!if|for|while|switch|return)(?:static\s+)?(?:inline\s+)?[A-Za-z_][\w\s*]*\s+([A-Za-z_][\w]*)\s*\([^;{}]*\)\s*\{/gm),
        (match) => `${match[1]}()`,
      ),
    );
  }

  if (source.lang === 'go') {
    return uniqueSymbols(
      Array.from(
        code.matchAll(/^\s*func\s+(?:\([^)]*\)\s*)?([A-Za-z_][\w]*)\s*\(/gm),
        (match) => `${match[1]}()`,
      ),
    );
  }

  return uniqueSymbols([
    ...Array.from(code.matchAll(/^\s*function\s+([A-Za-z_][\w]*)\s*\(/gm), (match) => `${match[1]}()`),
    ...Array.from(code.matchAll(/^\s*(?:const|let|var)\s+([A-Za-z_][\w]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/gm), (match) => `${match[1]}()`),
  ]);
}

function functionContext(lines: string[], lineIndex: number) {
  const context: string[] = [];
  for (let index = lineIndex - 1; index >= 0 && context.length < 4; index -= 1) {
    const line = lines[index].trim();
    if (!line) {
      if (context.length > 0) break;
      continue;
    }
    if (
      line.startsWith('///') ||
      line.startsWith('//!') ||
      line.startsWith('//') ||
      line.startsWith('#') ||
      line.startsWith('*') ||
      line.startsWith('/**')
    ) {
      context.unshift(line.replace(/^\/{2,3}\s?/, '').replace(/^#\s?/, '').replace(/^\*\s?/, ''));
      continue;
    }
    break;
  }
  return context.join(' ');
}

function functionEntryMatches(source: SourceSpec, regex: RegExp) {
  const lines = source.code.split('\n');
  return Array.from(source.code.matchAll(regex), (match): FunctionEntry => {
    const line = source.code.slice(0, match.index ?? 0).split('\n').length;
    const signature = lines[line - 1]?.trim() ?? match[0].split('\n')[0].trim();
    return {
      symbol: `${match[1]}()`,
      signature,
      context: functionContext(lines, line - 1),
      line,
    };
  });
}

function extractFunctionEntries(source: SourceSpec) {
  let entries: FunctionEntry[];
  if (source.lang === 'python') {
    entries = functionEntryMatches(source, /^\s*(?:async\s+)?def\s+([A-Za-z_][\w]*)\s*\(/gm);
  } else if (source.lang === 'rust') {
    entries = functionEntryMatches(source, /^\s*(?:pub(?:\([^)]*\))?\s+)?(?:async\s+)?(?:unsafe\s+)?fn\s+([A-Za-z_][\w]*)\s*(?:<[^>{}]*>)?\s*\(/gm);
  } else if (source.lang === 'c') {
    entries = functionEntryMatches(
      source,
      /^\s*(?!if|for|while|switch|return)(?:static\s+)?(?:inline\s+)?[A-Za-z_][\w\s*]*\s+([A-Za-z_][\w]*)\s*\([^;{}]*\)\s*\{/gm,
    );
  } else if (source.lang === 'go') {
    entries = functionEntryMatches(source, /^\s*func\s+(?:\([^)]*\)\s*)?([A-Za-z_][\w]*)\s*\(/gm);
  } else {
    entries = [
      ...functionEntryMatches(source, /^\s*function\s+([A-Za-z_][\w]*)\s*\(/gm),
      ...functionEntryMatches(source, /^\s*(?:const|let|var)\s+([A-Za-z_][\w]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/gm),
    ];
  }

  const seen = new Set<string>();
  return entries
    .filter((entry) => {
      if (seen.has(entry.symbol)) return false;
      seen.add(entry.symbol);
      return true;
    })
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}

function functionRole(symbol: string, source: SourceSpec, unit: WorkspaceUnit) {
  const name = symbol.replace(/\(\)$/, '').toLowerCase();
  const path = source.path.toLowerCase();
  const unitTitle = unit.title.toLowerCase();

  if (symbol === '함수 심볼 없음') {
    return {
      role: '함수형 entrypoint가 아니라 타입, enum, 상수, 모듈 경계를 고정합니다.',
      reuse: '구조 정의가 바뀌면 이 단위의 검증 전제와 코드 보기 설명을 같이 갱신합니다.',
    };
  }

  if (name.includes('forward')) {
    return {
      role: '모델 또는 레이어가 입력 tensor를 feature, logits, loss 같은 다음 표현으로 바꾸는 핵심 실행 경계입니다.',
      reuse: '입력 shape, dtype/device, mask/conditioning, 출력 shape와 loss 계산 여부를 fixture로 고정합니다.',
    };
  }

  if (name.includes('encode') || name.includes('decode') || name.includes('project') || name.includes('merge')) {
    return {
      role: '서로 다른 표현 공간 사이를 변환합니다. 이미지, text token, latent, hidden state가 어느 경계에서 바뀌는지 고정합니다.',
      reuse: '입출력 tensor shape, scaling factor, token 위치, hidden size를 명시해 다른 모델 구현과 비교하는 기준으로 재사용합니다.',
    };
  }

  if (name.includes('generate') || name.includes('sample')) {
    return {
      role: '모델 출력을 반복적으로 다시 입력에 반영해 token 또는 latent trajectory를 생성하는 sampling loop입니다.',
      reuse: 'temperature, top-k, guidance scale, timestep 순서, random seed를 고정해 생성 품질과 회귀를 같이 검증합니다.',
    };
  }

  if (name.includes('train') || name.includes('backward') || name.includes('loss') || name.includes('evaluate')) {
    return {
      role: '학습 또는 평가 단계에서 forward 결과를 loss, gradient, optimizer update, metric으로 연결합니다.',
      reuse: 'batch fixture, label, optimizer/scaler 상태, metric accumulator를 고정해 학습 루프 회귀 기준으로 재사용합니다.',
    };
  }

  if (name.includes('verify') || name.includes('validate') || unitTitle.includes('검증')) {
    return {
      role: '외부 입력이나 이전 단계 산출물이 이 단위의 규칙을 만족하는지 판정합니다.',
      reuse: '성공 fixture, 실패 fixture, 에러 반환값을 분리해 회귀 테스트 기준으로 재사용합니다.',
    };
  }

  if (name.includes('prove') || name.includes('prover') || name.includes('wrap') || name.includes('shrink') || name.includes('compress')) {
    return {
      role: '증명 생성, 압축, 래핑처럼 증명 상태를 다음 표현으로 변환합니다.',
      reuse: '입력 proof, verifying key, 출력 proof 형식과 실패 위치를 고정해 proof-system 비교 기준으로 재사용합니다.',
    };
  }

  if (name.includes('execute') || name.includes('advance') || name.includes('eval') || path.includes('executor')) {
    return {
      role: 'VM, block, instruction, circuit step 같은 실행 단위를 실제 상태 전이로 진행합니다.',
      reuse: '실행 전 상태, 실행 후 상태, trace/record 변화를 나눠 최소 실행 회귀 단위로 재사용합니다.',
    };
  }

  if (name.includes('route') || name.includes('fallback') || name.includes('cooldown') || path.includes('router')) {
    return {
      role: '요청을 provider/model 후보 중 하나로 보내거나 실패 후보를 제외합니다.',
      reuse: 'provider 목록, 실패 기록, latency/cost/budget 조건을 fixture로 고정해 라우팅 정책 검증에 재사용합니다.',
    };
  }

  if (name.includes('schedule') || name.includes('allocate') || name.includes('free') || name.includes('cache')) {
    return {
      role: '대기열, cache, block, slot 같은 제한 자원을 배정하거나 회수합니다.',
      reuse: '자원 사용량, eviction/preemption, cleanup 조건을 표준 fixture로 두고 성능 회귀와 correctness 회귀를 같이 봅니다.',
    };
  }

  if (name.includes('bootstrap') || name.includes('update') || name.includes('sync') || name.includes('import')) {
    return {
      role: '외부 상태나 네트워크 결과를 로컬 상태로 들여와 진행 상태를 갱신합니다.',
      reuse: 'checkpoint, peer response, block/update fixture를 성공/실패로 나눠 동기화 경계 검증에 재사용합니다.',
    };
  }

  if (name.includes('read') || name.includes('write') || name.includes('get') || name.includes('set') || path.includes('db') || path.includes('provider')) {
    return {
      role: '저장소, provider, 메모리, registry에서 값을 읽거나 쓰는 접근 경계입니다.',
      reuse: 'key/value, cursor 위치, missing value, stale state를 고정해 상태 접근 단위로 재사용합니다.',
    };
  }

  if (name.includes('new') || name.includes('build') || name.includes('init') || name.includes('setup') || name.includes('main')) {
    return {
      role: '설정, 의존성, 초기 상태를 조립해 이후 실행 단위가 사용할 entrypoint를 만듭니다.',
      reuse: '필수 config, 기본값, 잘못된 설정 실패를 fixture로 두고 bootstrap 검증 단위로 재사용합니다.',
    };
  }

  if (name.includes('handle') || name.includes('process') || name.includes('call') || name.includes('rpc')) {
    return {
      role: '외부 요청, syscall, RPC, message를 받아 내부 처리 경계로 넘깁니다.',
      reuse: '요청 payload, 권한/상태 조건, 실패 응답을 고정해 API 또는 message boundary 검증에 재사용합니다.',
    };
  }

  return {
    role: `${unit.title} 범위 안에서 ${source.path}의 관찰 가능한 동작을 담당합니다.`,
    reuse: '입력, 상태 변화, 실패 응답을 이 상세 글의 불변조건과 테스트 매트릭스에 연결해 재사용합니다.',
  };
}

function coverageRows(sources: SourceSpec[], unit: WorkspaceUnit) {
  return sources.flatMap((source) => {
    const entries = extractFunctionEntries(source);
    if (entries.length === 0) {
      const role = functionRole('함수 심볼 없음', source, unit);
      return [{
        source,
        symbol: '함수 심볼 없음',
        signature: '타입/상수/모듈 경계',
        context: source.desc,
        line: 1,
        ...role,
      }];
    }

    return entries.map((entry) => {
      const role = functionRole(entry.symbol, source, unit);
      return {
        source,
        ...entry,
        ...role,
      };
    });
  });
}

function testRows(project: WorkspaceProject, unit: WorkspaceUnit, index: number) {
  return [
    ['happy path', `${unit.title} 정상 fixture가 기대 상태 전이를 만든다.`, commandFor(project, index)],
    ['bad input', '필수 입력 누락 또는 잘못된 형식이 bounded failure로 끝난다.', commandFor(project, index)],
    ['resource/state cleanup', '실패 뒤 cache, queue, DB cursor, session, proof context가 다음 케이스를 오염시키지 않는다.', commandFor(project, index)],
  ];
}

function unitFunctionName(project: WorkspaceProject, unit: WorkspaceUnit, index: number) {
  const raw = `${project.slug}_${index + 1}_${unit.title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return raw || `unit_${index + 1}_boundary`;
}

function generatedBoundarySource(project: WorkspaceProject, index: number): SourceSpec {
  const unit = project.units[index];
  const fn = unitFunctionName(project, unit, index);
  const path = `${project.slug}/${fn}.ts`;
  const code = `type BoundaryInput = {
  payload: unknown;
  state: Record<string, unknown>;
  fixture: string;
};

type BoundaryResult = {
  accepted: boolean;
  nextState: Record<string, unknown>;
  evidence: string[];
};

export function ${fn}(input: BoundaryInput): BoundaryResult {
  validate_${fn}(input);
  const nextState = apply_${fn}(input.state, input.payload);
  return {
    accepted: true,
    nextState,
    evidence: ['${unit.evidence ?? project.codebase ?? project.title}'],
  };
}

export function validate_${fn}(input: BoundaryInput) {
  if (!input.fixture) throw new Error('fixture is required');
  if (input.payload == null) throw new Error('payload is required');
}

export function apply_${fn}(state: Record<string, unknown>, payload: unknown) {
  return { ...state, lastPayload: payload };
}`;

  return {
    path,
    code,
    lang: 'typescript',
    desc: `${project.title}의 확장 단위 "${unit.title}"를 재사용 가능한 입력 검증, 상태 전이, 증거 수집 경계로 분리한 코드입니다.`,
  };
}

function sourceSpecsFor(project: WorkspaceProject, index: number) {
  const projectSources = sourceSets[project.slug];
  return projectSources?.[index] ?? [generatedBoundarySource(project, index)];
}

function sourceKey(project: WorkspaceProject, unitIndex: number, sourceIndex: number) {
  return `${project.slug}-unit-${unitIndex + 1}-source-${sourceIndex + 1}`;
}

function codeRefForSource(project: WorkspaceProject, unit: WorkspaceUnit, source: SourceSpec): CodeRef {
  const lineCount = source.code.split('\n').length;
  return {
    path: source.path,
    code: source.code,
    lang: source.lang,
    highlight: [1, Math.min(lineCount, 80)],
    lineStart: 1,
    desc: `${source.desc} 검증 단위: ${unit.title}.`,
    annotations: [
      {
        lines: [1, Math.min(lineCount, 6)],
        color: 'sky',
        note: '이 파일에서 입력이 들어오는 entrypoint 또는 trait boundary를 먼저 확인합니다.',
      },
      {
        lines: [Math.min(lineCount, 10), Math.min(lineCount, 16)],
        color: 'emerald',
        note: '상태 변경, provider 호출, queue/cache 변경처럼 다음 단계에 남는 값을 봅니다.',
      },
      {
        lines: [Math.min(lineCount, 20), Math.min(lineCount, 26)],
        color: 'amber',
        note: '실패 응답과 cleanup이 정상 경로와 섞이지 않는지 확인합니다.',
      },
    ],
  };
}

function fileTreeFor(project: WorkspaceProject, sources: SourceSpec[]): FileNode {
  return {
    name: project.slug,
    type: 'dir',
    children: sources.map((source, index) => ({
      name: source.path,
      type: 'file',
      path: source.path,
      codeKey: sourceKey(project, 0, index),
    })),
  };
}

export default function CodebaseUnitDetail() {
  const { section, item, unit } = useParams<{ section: string; item: string; unit: string }>();
  const project = findRegistryProject(item);
  const unitIndex = parseUnitIndex(unit);
  const targetUnit = project?.units[unitIndex];

  if (!project || !targetUnit || !section) {
    return (
      <div className="max-w-4xl">
        <Link to={CORE_ROOT} className="text-xs text-muted-foreground hover:text-foreground">← 코어</Link>
        <p className="mt-6 text-sm text-muted-foreground">코드베이스 상세 단위를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const currentUnitId = unitId(project, unitIndex);
  const registryPath = `${CORE_ROOT}/${section}/${project.slug}`;
  const sources = sourceSpecsFor(project, unitIndex);
  const functions = coverageRows(sources, targetUnit);
  const codeRefs = Object.fromEntries(
    sources.map((source, index) => [
      sourceKey(project, unitIndex, index),
      codeRefForSource(project, targetUnit, source),
    ]),
  );
  const fileTrees = {
    [project.slug]: {
      ...fileTreeFor(project, sources),
      children: sources.map((source, index) => ({
        name: source.path,
        type: 'file' as const,
        path: source.path,
        codeKey: sourceKey(project, unitIndex, index),
      })),
    },
  };
  const sidebar = useCodeSidebar();
  const openSource = (index: number) => {
    const key = sourceKey(project, unitIndex, index);
    const ref = codeRefs[key];
    if (ref) sidebar.open(key, ref);
  };

  return (
    <div className="max-w-5xl">
      <Link to={registryPath} className="mb-8 inline-block text-xs text-muted-foreground hover:text-foreground">
        ← {project.title}
      </Link>

      <ArticleLayout title={`${currentUnitId} · ${targetUnit.title}`}>
        <section id="overview" className="mb-10">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {[project.area, project.track, project.codebase ?? project.title, statusLabel(targetUnit.status)].map((label) => (
              <span key={label} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {label}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{boundaryFor(project, targetUnit)}</p>
          <button
            type="button"
            onClick={() => openSource(0)}
            className="mt-4 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
          >
            코드 보기
          </button>
        </section>

        <section id="sources" className="mb-10">
          <h2 className="mb-3 text-base font-semibold tracking-tight">코드 소스와 한글 주석</h2>
          <div className="grid gap-3">
            {sources.map((source, index) => (
              <div key={source.path} className="rounded-lg border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{source.path}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{source.desc}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {extractFunctionSymbols(source).length > 0
                        ? `함수 커버리지 ${extractFunctionSymbols(source).length}개`
                        : '타입/상수 경계로 커버'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openSource(index)}
                    className="shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30"
                  >
                    코드 보기
                  </button>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {sourceNotes(project, targetUnit).map((note) => (
                    <li key={note} className="pl-4 before:-ml-4 before:content-['-']">{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="functions" className="mb-10">
          <h2 className="mb-3 text-base font-semibold tracking-tight">함수 전체 커버리지</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
            이 단위에 연결된 코드 소스에서 추출한 함수 심볼 전체입니다. 각 행은 코드베이스 안에서의 역할,
            실제 시그니처와 주변 주석, 재사용할 때 고정해야 할 기준을 함께 남깁니다.
          </p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">소스</th>
                  <th className="px-3 py-2 font-medium">함수</th>
                  <th className="px-3 py-2 font-medium">코드베이스 내 역할</th>
                  <th className="px-3 py-2 font-medium">근거</th>
                  <th className="px-3 py-2 font-medium">재사용 기준</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {functions.map(({ source, symbol, role, reuse, signature, context, line }) => (
                  <tr key={`${source.path}-${symbol}`} className="align-top">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                      {source.path}
                      <span className="mt-1 block text-[11px]">L{line}</span>
                    </td>
                    <td className="px-3 py-3 font-medium">{symbol}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {source.desc} {role}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      <code className="block whitespace-pre-wrap rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{signature}</code>
                      {context && <span className="mt-2 block">{context}</span>}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{reuse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="procedure" className="mb-10">
          <h2 className="mb-3 text-base font-semibold tracking-tight">검증 절차</h2>
          <ol className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>1. 이 단위의 public entrypoint 또는 package boundary를 하나만 고른다.</li>
            <li>2. 정상 fixture와 실패 fixture를 분리하고, 실패가 어디에서 멈춰야 하는지 적는다.</li>
            <li>3. 아래 확인 명령으로 같은 범위를 반복 실행한다.</li>
          </ol>
          <code className="mt-4 block overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            {commandFor(project, unitIndex)}
          </code>
        </section>

        <section id="invariants" className="mb-10">
          <h2 className="mb-3 text-base font-semibold tracking-tight">불변조건</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">이름</th>
                  <th className="px-3 py-2 font-medium">주장</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invariantRows(targetUnit).map(([name, claim]) => (
                  <tr key={name}>
                    <td className="px-3 py-3 font-medium">{name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{claim}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="tests" className="mb-10">
          <h2 className="mb-3 text-base font-semibold tracking-tight">테스트 매트릭스</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">케이스</th>
                  <th className="px-3 py-2 font-medium">관찰값</th>
                  <th className="px-3 py-2 font-medium">명령</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {testRows(project, targetUnit, unitIndex).map(([name, observation, command]) => (
                  <tr key={name} className="align-top">
                    <td className="px-3 py-3 font-medium">{name}</td>
                    <td className="px-3 py-3 text-muted-foreground">{observation}</td>
                    <td className="px-3 py-3">
                      <code className="text-xs text-muted-foreground">{command}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="next">
          <h2 className="mb-3 text-base font-semibold tracking-tight">다음 절단</h2>
          <div className="rounded-lg border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            {project.next}
          </div>
        </section>
      </ArticleLayout>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.open}
        codeRefs={codeRefs}
        fileTrees={fileTrees}
      />
    </div>
  );
}
