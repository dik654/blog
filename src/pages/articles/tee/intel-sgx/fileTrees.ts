import type { FileNode } from '@/components/code/types';

const f = (name: string, path: string, codeKey?: string): FileNode =>
  ({ name, type: 'file', path, codeKey });
const d = (name: string, children: FileNode[]): FileNode =>
  ({ name, type: 'dir', children });

export const sgxFileTree: FileNode = d('linux-sgx', [
  d('sdk/trts', [
    f('trts_ecall.cpp — is_ecall_allowed()', 'linux-sgx/sdk/trts/trts_ecall.cpp — is_ecall_allowed()', 'is-ecall-allowed'),
    f('trts_ecall.cpp — trts_ecall()', 'linux-sgx/sdk/trts/trts_ecall.cpp — trts_ecall()', 'trts-ecall'),
    f('trts_ecall.cpp — do_ecall()', 'linux-sgx/sdk/trts/trts_ecall.cpp — do_ecall()', 'do-ecall'),
    f('trts_ocall.cpp — sgx_ocall()', 'linux-sgx/sdk/trts/trts_ocall.cpp — sgx_ocall()', 'sgx-ocall'),
    f('trts_ocall.cpp — do_oret()', 'linux-sgx/sdk/trts/trts_ocall.cpp — do_oret()', 'do-oret'),
    f('trts_internal_types.h', 'linux-sgx/sdk/trts/trts_internal_types.h — ecall_table_t', 'ecall-table'),
  ]),
  d('common/inc', [
    f('sgx_key.h', 'linux-sgx/common/inc/sgx_key.h — sgx_key_request_t', 'key-request'),
    f('sgx_tseal.h', 'linux-sgx/common/inc/sgx_tseal.h — sgx_sealed_data_t', 'sealed-data'),
    f('sgx_report.h — target_info_t', 'linux-sgx/common/inc/sgx_report.h — sgx_target_info_t', 'target-info'),
    f('sgx_report.h — report_body_t', 'linux-sgx/common/inc/sgx_report.h — sgx_report_body_t', 'report-body'),
    f('sgx_quote.h — quote_t', 'linux-sgx/common/inc/sgx_quote.h — sgx_quote_t', 'quote-structure'),
    f('sgx_quote.h — att_key_id_t', 'linux-sgx/common/inc/sgx_quote.h — sgx_ql_att_key_id_t', 'att-key-id'),
    d('internal', [
      f('rts.h — ocall_context_t', 'linux-sgx/common/inc/internal/rts.h — ocall_context_t', 'ocall-context'),
    ]),
  ]),
]);
