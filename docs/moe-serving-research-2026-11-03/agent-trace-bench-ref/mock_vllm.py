#!/usr/bin/env python3
"""agent_bench.py 자체 시험용 OpenAI 호환 가짜 서버(stdlib). 성능 수치는 의미 없다.

모델: 토큰 = 공백 단어 하나. 요청별 디코드 속도 = single / (1 + (active-1)/knee).
prefix cache는 메시지 경계 단위 LRU(용량 = kv_tokens). TTFT = 미적중 토큰 / prefill_rate.
/metrics에 vllm 이름을 흉내 낸 prefix_cache_queries/hits, kv_cache_usage_perc를 노출한다.
"""
import argparse
import hashlib
import json
import threading
import time
from collections import OrderedDict
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

LOCK = threading.Lock()
STATE = dict(active=0, queries=0, hits=0)
CACHE = OrderedDict()  # prefix hash -> tokens
ARGS = None


def ntok(s):
    return len(s.split())


def lookup(messages):
    """returns (total_tokens, cached_tokens) and inserts prefixes."""
    h = hashlib.sha1()
    total, cached, hit_run = 0, 0, True
    keys = []
    for m in messages:
        h.update(json.dumps(m, sort_keys=True).encode())
        total += ntok(m.get("content") or "")
        k = h.hexdigest()
        keys.append((k, total))
        if hit_run and k in CACHE:
            cached = total
            CACHE.move_to_end(k)
        else:
            hit_run = False
    for k, t in keys:
        CACHE[k] = t
        CACHE.move_to_end(k)
    while sum(CACHE.values()) > ARGS.kv_tokens * 4 and CACHE:  # 체인 중복 저장을 감안한 대략치
        CACHE.popitem(last=False)
    return total, cached


class H(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def _send(self, code, body, ctype="application/json"):
        b = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path == "/metrics":
            with LOCK:
                used = min(1.0, sum(CACHE.values()) / (ARGS.kv_tokens * 4))
                txt = (f"vllm:prefix_cache_queries_total{{model_name=\"mock\"}} {STATE['queries']}\n"
                       f"vllm:prefix_cache_hits_total{{model_name=\"mock\"}} {STATE['hits']}\n"
                       f"vllm:kv_cache_usage_perc{{model_name=\"mock\"}} {used}\n"
                       f"vllm:num_requests_running{{model_name=\"mock\"}} {STATE['active']}\n")
            self._send(200, txt, "text/plain")
        elif self.path == "/v1/models":
            self._send(200, json.dumps({"data": [{"id": "mock"}]}))
        else:
            self._send(404, "{}")

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
        if self.path == "/tokenize":
            self._send(200, json.dumps({"count": ntok(body.get("prompt", ""))}))
            return
        if self.path != "/v1/chat/completions":
            self._send(404, "{}")
            return
        msgs = body.get("messages", [])
        with LOCK:
            total, cached = lookup(msgs)
            STATE["queries"] += total
            STATE["hits"] += cached
            STATE["active"] += 1
        try:
            time.sleep(0.02 + (total - cached) / ARGS.prefill_rate)
            n = int(body.get("max_tokens", 16))
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Transfer-Encoding", "chunked")
            self.end_headers()

            def chunk(obj):
                b = ("data: " + (obj if isinstance(obj, str) else json.dumps(obj)) + "\n\n").encode()
                self.wfile.write(f"{len(b):x}\r\n".encode() + b + b"\r\n")
                self.wfile.flush()

            for i in range(n):
                with LOCK:
                    act = STATE["active"]
                speed = ARGS.single / (1 + (act - 1) / ARGS.knee)
                time.sleep(1.0 / speed)
                chunk({"choices": [{"index": 0, "delta": {"content": "tok "}}]})
            chunk({"choices": [], "usage": {"prompt_tokens": total, "completion_tokens": n,
                                            "prompt_tokens_details": {"cached_tokens": cached}}})
            chunk("[DONE]")
            self.wfile.write(b"0\r\n\r\n")
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            with LOCK:
                STATE["active"] -= 1


def main():
    global ARGS
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=18080)
    ap.add_argument("--single", type=float, default=80.0, help="단일 요청 tok/s")
    ap.add_argument("--knee", type=float, default=6.0, help="속도가 절반이 되는 추가 동시 요청 수")
    ap.add_argument("--prefill-rate", type=float, default=20000.0)
    ap.add_argument("--kv-tokens", type=int, default=400000)
    ARGS = ap.parse_args()
    class Srv(ThreadingHTTPServer):
        daemon_threads = True

        def handle_error(self, request, client_address):  # 클라이언트 중단(측정 종료)은 정상
            pass
    Srv(("127.0.0.1", ARGS.port), H).serve_forever()


if __name__ == "__main__":
    main()
