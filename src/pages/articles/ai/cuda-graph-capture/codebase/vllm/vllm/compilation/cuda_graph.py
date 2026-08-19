# vllm-project/vllm 저장소 · vllm/compilation/cuda_graph.py (main branch,
# commit 842dd8f, 2026년 8월 기준). 전체 361줄 중 이 글이 다루는
# CUDAGraphEntry·CUDAGraphOptions·CUDAGraphWrapper만 발췌했습니다. 로그
# 테이블을 만드는 CUDAGraphLogging 클래스, __getattr__/unwrap/clear_graphs
# 같은 부가 accessor는 생략했습니다.
#
# 본문 대응: 이 글의 "capture는 첫 호출에서 한 번, replay는 이후 호출마다"
# 라는 주장이 정확히 CUDAGraphWrapper.__call__ 하나에 구현돼 있습니다 —
# batch_descriptor(패딩된 배치 shape)를 key로 삼아 처음 보는 shape면
# capture하고, 이미 본 shape면 저장해둔 torch.cuda.CUDAGraph를 replay합니다.

import dataclasses
import weakref
from collections.abc import Callable
from contextlib import ExitStack
from typing import Any, ClassVar
from unittest.mock import patch

import torch

from vllm.compilation.counter import compilation_counter
from vllm.compilation.monitor import validate_cudagraph_capturing_enabled
from vllm.config import CUDAGraphMode, VllmConfig
from vllm.distributed.device_communicators.pynccl_allocator import set_graph_pool_id
from vllm.forward_context import (
    BatchDescriptor,
    get_forward_context,
    is_forward_context_available,
)
from vllm.model_executor.offloader.base import get_offloader
from vllm.platforms import current_platform
from vllm.utils.torch_utils import current_stream, weak_ref_tensors


@dataclasses.dataclass
class CUDAGraphEntry:
    # article의 "shape별로 그래프 하나" — batch_descriptor(패딩된 배치
    # 크기 등)마다 이 entry 하나가 대응하고, 그 안의 cudagraph가 실제
    # capture된 커널 시퀀스를 들고 있습니다. 처음엔 None이라 아직 capture
    # 전임을 뜻합니다.
    batch_descriptor: BatchDescriptor
    cudagraph: torch.cuda.CUDAGraph | None = None
    output: Any | None = None

    # for cudagraph debugging, track the input addresses
    # during capture, and check if they are the same during replay
    input_addresses: list[int] | None = None


@dataclasses.dataclass
class CUDAGraphOptions:
    debug_log_enable: bool = True
    gc_disable: bool = False
    weak_ref_output: bool = True


class CUDAGraphWrapper:
    """Wraps a runnable to add CUDA graph capturing and replaying ability. And
    provide attribute access to the underlying `runnable` via `__getattr__`.

    The workflow of this wrapper in the cudagraph dispatching is as follows:
    1. At initialization, a runtime mode is assigned to the wrapper (FULL or
    PIECEWISE).
    2. At runtime, the wrapper receives a runtime_mode and a
    batch_descriptor(key) from the forward context and blindly trust them
    for cudagraph dispatching.
    3. If runtime_mode is NONE or runtime_mode does not match the mode of the
    wrapper, just call the runnable directly.
    4. Otherwise, i.e., the runtime_mode matches the mode of the wrapper,
    the wrapper will perform cudagraph capture(if key does not exist, create
    a new entry and cache it) or replay (if key exists in the cache).
    """

    _all_instances: ClassVar[weakref.WeakSet["CUDAGraphWrapper"]] = weakref.WeakSet()

    def __init__(
        self,
        runnable: Callable[..., Any],
        vllm_config: VllmConfig,
        runtime_mode: CUDAGraphMode,
        cudagraph_options: CUDAGraphOptions | None = None,
    ) -> None:
        self.runnable = runnable
        self.vllm_config = vllm_config
        self.runtime_mode = runtime_mode
        self.compilation_config = vllm_config.compilation_config

        assert self.runtime_mode != CUDAGraphMode.NONE
        # article에는 없는 실제 세부 — capture한 그래프들이 GPU memory
        # pool을 공유하도록, graph마다 새 pool을 잡지 않고 platform의
        # global pool을 재사용합니다.
        self.graph_pool = current_platform.get_global_graph_pool()

        if cudagraph_options is None:
            cudagraph_options = CUDAGraphOptions()
        self.cudagraph_options = cudagraph_options
        # article의 "shape마다 그래프 하나" 구현 — batch_descriptor를
        # key로 하는 dict. 아직 아무 shape도 capture 안 하면 비어 있음.
        self.concrete_cudagraph_entries: dict[BatchDescriptor, CUDAGraphEntry] = {}

        CUDAGraphWrapper._all_instances.add(self)

    def __call__(self, *args: Any, **kwargs: Any) -> Any | None:
        if not is_forward_context_available():
            # No forward context means we are outside the normal
            # inference path (e.g. a vision encoder forward pass).
            # Just run the underlying function without cudagraphs.
            return self.runnable(*args, **kwargs)

        forward_context = get_forward_context()
        batch_descriptor = forward_context.batch_descriptor
        cudagraph_runtime_mode = forward_context.cudagraph_runtime_mode

        if (
            cudagraph_runtime_mode == CUDAGraphMode.NONE
            or cudagraph_runtime_mode != self.runtime_mode
        ):
            # CUDAGraphMode.NONE could mean the profile run, a warmup run, or
            # running without cudagraphs.
            return self.runnable(*args, **kwargs)

        assert batch_descriptor is not None
        if batch_descriptor not in self.concrete_cudagraph_entries:
            # article의 "처음 보는 shape → 새 entry" — 이 batch_descriptor를
            # 아직 capture한 적이 없으면 빈 entry부터 만듭니다.
            self.concrete_cudagraph_entries[batch_descriptor] = CUDAGraphEntry(
                batch_descriptor=batch_descriptor
            )

        entry = self.concrete_cudagraph_entries[batch_descriptor]

        if entry.cudagraph is None:
            # article의 capture 경로 — 이 shape는 처음이라 아직
            # cudagraph가 없습니다. 여기서부터 실제 capture를 수행합니다.
            validate_cudagraph_capturing_enabled()

            # article의 static address 제약을 실제로 확인하는 지점 —
            # capture 시점의 input tensor GPU 주소를 기록해 둡니다.
            # replay 때 이 주소가 바뀌면(다른 tensor를 넘기면) 문제가
            # 생긴다는 뜻이라, debug 모드에서는 아래에서 이 값과 비교합니다.
            input_addresses = [
                x.data_ptr() for x in args if isinstance(x, torch.Tensor)
            ]
            entry.input_addresses = input_addresses
            cudagraph = torch.cuda.CUDAGraph()

            with ExitStack() as stack:
                if self.cudagraph_options.gc_disable:
                    stack.enter_context(
                        patch("gc.collect", lambda *args, **kwargs: None)
                    )
                    stack.enter_context(
                        patch(
                            "torch.accelerator.empty_cache",
                            lambda *args, **kwargs: None,
                        )
                    )

                if self.graph_pool is not None:
                    set_graph_pool_id(self.graph_pool)
                else:
                    set_graph_pool_id(current_platform.graph_pool_handle())

                get_offloader().sync_prev_onload()

                # article의 핵심 — torch.cuda.graph(...) 안에서 실행한
                # runnable(*args, **kwargs)는 실제로 GPU에서 실행되는
                # 대신, 커널 launch 시퀀스만 이 cudagraph 객체에
                # "녹화"됩니다. 이 with 블록을 나올 때 capture가 끝납니다.
                with torch.cuda.graph(
                    cudagraph,
                    pool=self.graph_pool,
                    stream=current_stream(),
                ):
                    output = self.runnable(*args, **kwargs)
                    get_offloader().join_after_forward()
                    if self.cudagraph_options.weak_ref_output:
                        # by converting it to weak ref,
                        # the original `output` will immediately be released
                        # to save memory.
                        output = weak_ref_tensors(output)

            entry.output = weak_ref_tensors(output)
            entry.cudagraph = cudagraph

            compilation_counter.num_cudagraph_captured += 1

            # important: we need to return the output, rather than
            # the weak ref of the output, so that pytorch can correctly
            # manage the memory during cuda graph capture
            return output

        if self.cudagraph_options.debug_log_enable:
            # article의 static address 검증 — capture 때 기록해 둔
            # input_addresses와 이번 호출의 실제 tensor 주소가 다르면,
            # replay가 capture 시점과 다른 메모리를 읽는다는 뜻이라
            # 즉시 assert로 잡습니다.
            new_input_addresses = [
                x.data_ptr() for x in args if isinstance(x, torch.Tensor)
            ]
            assert new_input_addresses == entry.input_addresses, (
                f"Input addresses for cudagraphs are different "
                f"during replay. Expected {entry.input_addresses}, "
                f"got {new_input_addresses}"
            )

        get_offloader().sync_prev_onload()
        # article의 replay 경로 — 이미 capture된 같은 shape이므로,
        # runnable을 다시 Python에서 실행하지 않고 녹화된 커널
        # 시퀀스를 GPU에 그대로 재생만 합니다. Kernel launch overhead가
        # 없는 이유가 이 한 줄입니다.
        entry.cudagraph.replay()
        return entry.output
