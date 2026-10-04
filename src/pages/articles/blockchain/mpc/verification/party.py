"""Article-owned call harness; imports unchanged MPyC modules."""
from pathlib import Path
import json
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'codebase'))
from mpyc.runtime import mpc
import mpyc


async def main():
    secfld = mpc.SecFld(67)
    own_input = int(sys.stdin.readline())
    if not 0 <= own_input < 67:
        raise ValueError('this example requires a canonical field input')
    await mpc.start()
    x, y, z = mpc.input(secfld(own_input))
    result = (x + y) * z
    opened = await mpc.output(result)
    print(json.dumps({'party': mpc.pid, 'parties': len(mpc.parties),
                      'threshold': mpc.threshold, 'field': secfld.field.order,
                      'result': int(opened), 'mpyc': mpyc.__version__,
                      'ssl': mpc.options.ssl, 'prss': not mpc.options.no_prss}))
    await mpc.shutdown()


mpc.run(main())
