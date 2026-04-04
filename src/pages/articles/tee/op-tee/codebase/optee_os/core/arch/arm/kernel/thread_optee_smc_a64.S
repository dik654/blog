/* SPDX-License-Identifier: BSD-2-Clause */
/*
 * Copyright (c) 2019, Linaro Limited
 */

#include <arm64_macros.S>
#include <arm.h>
#include <asm.S>
#include <generated/asm-defines.h>
#include <keep.h>
#include <kernel/thread.h>
#include <sm/optee_smc.h>
#include <sm/teesmc_opteed.h>
#include <sm/teesmc_opteed_macros.h>

LOCAL_FUNC vector_std_smc_entry , : , .identity_map
	readjust_pc
	bl	thread_handle_std_smc
	/*
	 * Normally thread_handle_std_smc() should return via
	 * thread_exit(), thread_rpc(), but if thread_handle_std_smc()
	 * hasn't switched stack (error detected) it will do a normal "C"
	 * return.
	 */
	mov	w1, w0
	ldr	x0, =TEESMC_OPTEED_RETURN_CALL_DONE
	smc	#0
	/* SMC should not return */
	panic_at_smc_return
END_FUNC vector_std_smc_entry

LOCAL_FUNC vector_fast_smc_entry , : , .identity_map
	readjust_pc
	sub	sp, sp, #THREAD_SMC_ARGS_SIZE
	store_xregs sp, THREAD_SMC_ARGS_X0, 0, 7
	mov	x0, sp
	bl	thread_handle_fast_smc
	load_xregs sp, THREAD_SMC_ARGS_X0, 1, 8
	add	sp, sp, #THREAD_SMC_ARGS_SIZE
	ldr	x0, =TEESMC_OPTEED_RETURN_CALL_DONE
	smc	#0
	/* SMC should not return */
	panic_at_smc_return
END_FUNC vector_fast_smc_entry

LOCAL_FUNC vector_fiq_entry , : , .identity_map
	readjust_pc
	bl	thread_check_canaries
	bl	interrupt_main_handler
	ldr	x0, =TEESMC_OPTEED_RETURN_FIQ_DONE
	smc	#0
	/* SMC should not return */
	panic_at_smc_return
END_FUNC vector_fiq_entry

/*
 * Vector table supplied to ARM Trusted Firmware (ARM-TF) at
 * initialization.
 *
 * Note that ARM-TF depends on the layout of this vector table, any change
 * in layout has to be synced with ARM-TF.
 */
FUNC thread_vector_table , : , .identity_map, , nobti
	b	vector_std_smc_entry
	b	vector_fast_smc_entry
	b	vector_cpu_on_entry
	b	vector_cpu_off_entry
	b	vector_cpu_resume_entry
	b	vector_cpu_suspend_entry
	b	vector_fiq_entry
	b	vector_system_off_entry
	b	vector_system_reset_entry
END_FUNC thread_vector_table

FUNC thread_std_smc_entry , :
	bl	__thread_std_smc_entry
	mov	w20, w0	/* Save return value for later */

	/* Mask all maskable exceptions before switching to temporary stack */
	msr	daifset, #DAIFBIT_ALL
	bl	thread_get_tmp_sp
	mov	sp, x0

	bl	thread_state_free

	ldr	x0, =TEESMC_OPTEED_RETURN_CALL_DONE
	mov	w1, w20
	mov	x2, #0
	mov	x3, #0
	mov	x4, #0
	smc	#0
	/* SMC should not return */
	panic_at_smc_return
END_FUNC thread_std_smc_entry
