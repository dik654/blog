"""Run original PyTorch Python wrappers with recording substitutes, on CPU only.

The two entire class AST nodes are compiled unchanged. Their native base classes
are replaced with recorders. This observes Python call delegation and defaults;
it does not execute CUDA, measure time, or establish native completion semantics.
The retained C++ sources and official API docs establish those separate claims.
"""
from __future__ import annotations
import ast
import ctypes
import hashlib
import json
import platform
from pathlib import Path
from types import SimpleNamespace

source_path = Path(__file__).resolve().parents[1] / 'codebase/pytorch/torch/cuda/streams.py'
source = source_path.read_text()
tree = ast.parse(source)
classes = [node for node in tree.body if isinstance(node, ast.ClassDef) and node.name in ('Stream', 'Event')]
assert [node.name for node in classes] == ['Stream', 'Event']
trace = []

class StreamBase:
    def __new__(cls, **kwargs):
        obj = object.__new__(cls)
        obj.name = 'unset'
        return obj
    def synchronize(self):
        trace.append(['native_stream_synchronize', self.name])

class EventBase:
    def __new__(cls, **kwargs):
        obj = object.__new__(cls)
        obj.options = kwargs
        return obj
    def record(self, stream):
        trace.append(['native_event_record', stream.name])
    def wait(self, stream):
        trace.append(['native_event_wait', stream.name])
    def synchronize(self):
        trace.append(['native_event_synchronize'])

fake_torch = SimpleNamespace(
    _C=SimpleNamespace(_CudaStreamBase=StreamBase, _CudaEventBase=EventBase),
    backends=SimpleNamespace(cuda=SimpleNamespace(is_built=lambda: True)),
    cuda=SimpleNamespace(current_stream=lambda: stream_a),
)
namespace = dict(torch=fake_torch, ctypes=ctypes)
module = ast.Module(body=[ast.ImportFrom(module='__future__', names=[ast.alias(name='annotations')], level=0), *classes], type_ignores=[])
ast.fix_missing_locations(module)
exec(compile(module, str(source_path), 'exec'), namespace)
Stream, Event = namespace['Stream'], namespace['Event']
stream_a, stream_b = Stream(), Stream()
stream_a.name, stream_b.name = 'A', 'B'
# The original wrapper creates an event, records it in B, then adds a wait to A.
stream_a.wait_stream(stream_b)
# Record in the default/current stream, and contrast the two delegated methods.
event = Event(blocking=True)
event.record()
event.wait(stream_a)
event.synchronize()
stream_a.synchronize()
assert trace == [
    ['native_event_record', 'B'], ['native_event_wait', 'A'],
    ['native_event_record', 'A'], ['native_event_wait', 'A'],
    ['native_event_synchronize'], ['native_stream_synchronize', 'A'],
]
print(json.dumps(dict(
    python=platform.python_version(), nativeCudaExecuted=False,
    sourceSha256=hashlib.sha256(source_path.read_bytes()).hexdigest(),
    unchangedClassNodes=[dict(name=c.name, first=c.lineno, last=c.end_lineno) for c in classes],
    blockingEventOptions=event.options, trace=trace,
    scope='Original Python class bodies with recording native base substitutes; no GPU or timing test.'
), ensure_ascii=False, indent=2))
