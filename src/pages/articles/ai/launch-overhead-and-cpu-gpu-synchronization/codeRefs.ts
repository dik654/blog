import type {CodeRef,FileNode,ProjectMeta} from "@/components/code/types";
import source0 from "./codebase/pytorch/aten/src/ATen/native/Scalar.cpp?raw";
import source1 from "./codebase/pytorch/aten/src/ATen/native/cuda/CUDAScalar.cu?raw";
import source2 from "./codebase/pytorch/c10/cuda/CUDAFunctions.h?raw";
import source3 from "./codebase/pytorch/torch/cuda/streams.py?raw";
import source4 from "./codebase/pytorch/torch/cuda/streams.py?raw";
import source5 from "./codebase/pytorch/torch/csrc/cuda/Event.cpp?raw";
import source6 from "./codebase/pytorch/c10/cuda/CUDAEvent.h?raw";
import source7 from "./codebase/pytorch/c10/cuda/CUDAEvent.h?raw";
import source8 from "./codebase/pytorch/torch/cuda/__init__.py?raw";
import source9 from "./codebase/pytorch/c10/cuda/CUDAFunctions.cpp?raw";
import source10 from "./codebase/pytorch/torch/csrc/utils/tensor_numpy.cpp?raw";
import source11 from "./verification/observe.py?raw";
export const codeRefs:Record<string,CodeRef>={
"item":{code:source0,"path": "pytorch/aten/src/ATen/native/Scalar.cpp", "lang": "c", "highlight": [15, 31], "desc": "원소 한 개인 일반 tensor는 _local_scalar_dense로 내려갑니다. 희소·양자화 분기는 별도입니다."},
"scalar":{code:source1,"path": "pytorch/aten/src/ATen/native/cuda/CUDAScalar.cu", "lang": "c", "highlight": [57, 69], "desc": "일반 CUDA 경로는 pinned CPU 한 칸을 만들고 현재 stream에서 한 값을 복사해 읽습니다. 앞쪽 ROCm 조건 분기는 구별합니다."},
"copy-sync":{code:source2,"path": "pytorch/c10/cuda/CUDAFunctions.h", "lang": "c", "highlight": [78, 114], "desc": "CUDA 분기는 비동기 복사를 제출한 바로 다음 줄에서 그 stream의 완료를 기다립니다."},
"stream-wait":{code:source3,"path": "pytorch/torch/cuda/streams.py", "lang": "python", "highlight": [47, 95], "desc": "wait_stream(B)는 B에 event를 기록하고 A의 미래 작업에 기다릴 조건을 붙입니다."},
"event-python":{code:source4,"path": "pytorch/torch/cuda/streams.py", "lang": "python", "highlight": [193, 257], "desc": "record의 기본값은 현재 stream입니다. wait와 synchronize는 서로 다른 native 메서드로 내려갑니다."},
"event-native":{code:source5,"path": "pytorch/torch/csrc/cuda/Event.cpp", "lang": "c", "highlight": [146, 191], "desc": "Python wait는 CUDAEvent.block(stream)에 연결되고 synchronize는 CUDAEvent.synchronize()에 연결됩니다."},
"event-wait":{code:source6,"path": "pytorch/c10/cuda/CUDAEvent.h", "lang": "c", "highlight": [166, 191], "desc": "block이라는 C++ 메서드는 CUDA stream에 event 의존성을 넣습니다. 이름만 보고 CPU 대기로 해석하지 않습니다."},
"event-sync":{code:source7,"path": "pytorch/c10/cuda/CUDAEvent.h", "lang": "c", "highlight": [216, 227], "desc": "이미 만든 event의 완료를 CPU가 기다리는 실제 API는 cudaEventSynchronize입니다."},
"device-python":{code:source8,"path": "pytorch/torch/cuda/__init__.py", "lang": "python", "highlight": [1271, 1281], "desc": "장치를 선택해 _cuda_synchronize를 호출합니다. 문서도 그 장치의 모든 stream 범위를 명시합니다."},
"device-native":{code:source9,"path": "pytorch/c10/cuda/CUDAFunctions.cpp", "lang": "c", "highlight": [147, 154], "desc": "Python의 native 연결 함수가 호출하는 device_synchronize는 cudaDeviceSynchronize를 사용합니다."},
"numpy":{code:source10,"path": "pytorch/torch/csrc/utils/tensor_numpy.cpp", "lang": "c", "highlight": [126, 171], "desc": "force=False의 CUDA tensor는 CPU 검사에서 거부됩니다. 검사를 통과하거나 force=True이면 detach().cpu()를 수행합니다."},
"observation":{code:source11,"path": "verification/observe.py", "lang": "python", "highlight": [1, 83], "desc": "원본 두 Python class의 AST를 바꾸지 않고 실행하되 native base를 기록용 객체로 대체했습니다. GPU 실행과 시간 측정은 없습니다."},
};
export const fileTrees:Record<string,FileNode>={"pytorch": {"name": "PyTorch · v2.14.0", "type": "dir", "children": [{"name": "Scalar.cpp · item", "type": "file", "path": "pytorch/aten/src/ATen/native/Scalar.cpp", "codeKey": "item"}, {"name": "CUDAScalar.cu · scalar", "type": "file", "path": "pytorch/aten/src/ATen/native/cuda/CUDAScalar.cu", "codeKey": "scalar"}, {"name": "CUDAFunctions.h · copy-sync", "type": "file", "path": "pytorch/c10/cuda/CUDAFunctions.h", "codeKey": "copy-sync"}, {"name": "streams.py · stream-wait", "type": "file", "path": "pytorch/torch/cuda/streams.py", "codeKey": "stream-wait"}, {"name": "streams.py · event-python", "type": "file", "path": "pytorch/torch/cuda/streams.py", "codeKey": "event-python"}, {"name": "Event.cpp · event-native", "type": "file", "path": "pytorch/torch/csrc/cuda/Event.cpp", "codeKey": "event-native"}, {"name": "CUDAEvent.h · event-wait", "type": "file", "path": "pytorch/c10/cuda/CUDAEvent.h", "codeKey": "event-wait"}, {"name": "CUDAEvent.h · event-sync", "type": "file", "path": "pytorch/c10/cuda/CUDAEvent.h", "codeKey": "event-sync"}, {"name": "__init__.py · device-python", "type": "file", "path": "pytorch/torch/cuda/__init__.py", "codeKey": "device-python"}, {"name": "CUDAFunctions.cpp · device-native", "type": "file", "path": "pytorch/c10/cuda/CUDAFunctions.cpp", "codeKey": "device-native"}, {"name": "tensor_numpy.cpp · numpy", "type": "file", "path": "pytorch/torch/csrc/utils/tensor_numpy.cpp", "codeKey": "numpy"}]}, "verification": {"name": "호출 관찰", "type": "dir", "children": [{"name": "observe.py · observation", "type": "file", "path": "verification/observe.py", "codeKey": "observation"}]}};
export const projectMetas:Record<string,ProjectMeta>={"pytorch": {"id": "pytorch", "label": "PyTorch · v2.14.0", "badgeClass": "bg-primary/10 text-primary"}, "verification": {"id": "verification", "label": "Python 원문 호출 관찰", "badgeClass": "bg-primary/10 text-primary"}};
