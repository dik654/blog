"""Run three local parties with separate stdin inputs. Not a security audit."""
from pathlib import Path
import json
import platform
import subprocess
import sys

path = Path(__file__).with_name('party.py')
processes = []
try:
    for party, value in enumerate([4, 3, 5]):
        command = [sys.executable, str(path), '-M3', f'-I{party}', '-T1', '-B24670',
                   '--no-log', '--no-gmpy2', '--no-numpy', '--no-uvloop', '--no-prss']
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                   stderr=subprocess.PIPE, text=True)
        process.stdin.write(str(value) + '\n')
        process.stdin.flush()
        processes.append(process)
    records = []
    for process in processes:
        stdout, stderr = process.communicate(timeout=30)
        assert process.returncode == 0, (process.returncode, stdout, stderr)
        rows = [json.loads(line) for line in stdout.splitlines() if line.startswith('{')]
        assert len(rows) == 1 and rows[0]['result'] == 35, stdout
        records.append({'observed': rows[0], 'stderr': stderr, 'exitCode': process.returncode})
    print(json.dumps({'python': platform.python_version(), 'inputFixture': [4, 3, 5],
                      'records': records, 'transport': 'localhost TCP; SSL disabled',
                      'scope': 'Three honest processes using unchanged retained MPyC source.',
                      'notExecuted': ['malicious parties', 'crash/restart/dropout', 'remote authenticated transport',
                                      'DKG or signing', 'complete test suite', 'benchmark', 'security proof']}, indent=2))
finally:
    for process in processes:
        if process.poll() is None:
            process.kill()
            process.wait()
