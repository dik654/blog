// SPDX-License-Identifier: BSD-2-Clause
/*
 * Copyright (c) 2019-2021, Linaro Limited
 */

#include <assert.h>
#include <compiler.h>
#include <config.h>
#include <io.h>
#include <kernel/misc.h>
#include <kernel/msg_param.h>
#include <kernel/notif.h>
#include <kernel/thread.h>
#include <kernel/thread_private.h>
#include <kernel/virtualization.h>
#include <mm/core_mmu.h>
#include <optee_msg.h>
#include <optee_rpc_cmd.h>
#include <sm/optee_smc.h>
#include <sm/sm.h>
#include <string.h>
#include <tee/entry_fast.h>
#include <tee/entry_std.h>
#include <tee/tee_cryp_utl.h>

static bool thread_prealloc_rpc_cache;
static unsigned int thread_rpc_pnum;

static_assert(NOTIF_VALUE_DO_BOTTOM_HALF ==
	      OPTEE_SMC_ASYNC_NOTIF_VALUE_DO_BOTTOM_HALF);

void thread_handle_fast_smc(struct thread_smc_args *args)
{
	thread_check_canaries();

	if (IS_ENABLED(CFG_NS_VIRTUALIZATION) &&
	    virt_set_guest(args->a7) && args->a7 != HYP_CLNT_ID) {
		args->a0 = OPTEE_SMC_RETURN_ENOTAVAIL;
		goto out;
	}

	tee_entry_fast(args);

	if (IS_ENABLED(CFG_NS_VIRTUALIZATION))
		virt_unset_guest();

out:
	/* Fast handlers must not unmask any exceptions */
	assert(thread_get_exceptions() == THREAD_EXCP_ALL);
}

uint32_t thread_handle_std_smc(uint32_t a0, uint32_t a1, uint32_t a2,
			       uint32_t a3, uint32_t a4, uint32_t a5,
			       uint32_t a6 __unused, uint32_t a7 __maybe_unused)
{
	uint32_t rv = OPTEE_SMC_RETURN_OK;

	thread_check_canaries();

	if (IS_ENABLED(CFG_NS_VIRTUALIZATION) && virt_set_guest(a7))
		return OPTEE_SMC_RETURN_ENOTAVAIL;

	/*
	 * thread_resume_from_rpc() and thread_alloc_and_run() only return
	 * on error. Successful return is done via thread_exit() or
	 * thread_rpc().
	 */
	if (a0 == OPTEE_SMC_CALL_RETURN_FROM_RPC) {
		thread_resume_from_rpc(a3, a1, a2, a4, a5);
		rv = OPTEE_SMC_RETURN_ERESUME;
	} else {
		thread_alloc_and_run(a0, a1, a2, a3, 0, 0);
		rv = OPTEE_SMC_RETURN_ETHREAD_LIMIT;
	}

	if (IS_ENABLED(CFG_NS_VIRTUALIZATION))
		virt_unset_guest();

	return rv;
}

static uint32_t std_smc_entry(uint32_t a0, uint32_t a1, uint32_t a2,
			      uint32_t a3 __unused)
{
	const bool with_rpc_arg = true;

	switch (a0) {
	case OPTEE_SMC_CALL_WITH_ARG:
		return std_entry_with_parg(reg_pair_to_64(a1, a2),
					   !with_rpc_arg);
	case OPTEE_SMC_CALL_WITH_RPC_ARG:
		return std_entry_with_parg(reg_pair_to_64(a1, a2),
					   with_rpc_arg);
	case OPTEE_SMC_CALL_WITH_REGD_ARG:
		return std_entry_with_regd_arg(reg_pair_to_64(a1, a2), a3);
	default:
		EMSG("Unknown SMC 0x%"PRIx32, a0);
		return OPTEE_SMC_RETURN_EBADCMD;
	}
}

uint32_t __weak __thread_std_smc_entry(uint32_t a0, uint32_t a1, uint32_t a2,
				       uint32_t a3, uint32_t a4 __unused,
				       uint32_t a5 __unused)
{
	if (IS_ENABLED(CFG_NS_VIRTUALIZATION))
		virt_on_stdcall();

	return std_smc_entry(a0, a1, a2, a3);
}
