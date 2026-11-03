// Selected excerpt from SP1 v6.10.0 crates/core/executor/src/program.rs.

pub struct Program {
    pub instructions: Vec<Instruction>,
    pub instructions_encoded: Option<Vec<u32>>,
    pub pc_start_abs: u64,
    pub pc_base: u64,
    pub trap_context: Option<u64>,
    pub page_prot_image: HashMap<u64, u8>,
    pub memory_image: Arc<HashMap<u64, u64>>,
    pub preprocessed_shape: Option<Shape<RiscvAirId>>,
    pub enable_untrusted_programs: bool,
    pub function_symbols: Vec<(String, u64, u64)>,
    pub untrusted_memory: Option<(u64, u64)>,
    pub dump_elf_stack: Vec<u64>,
}

impl Program {
    pub fn from(input: &[u8]) -> eyre::Result<Self> {
        let elf = Elf::decode(input)?;

        if elf.pc_base < 32 {
            eyre::bail!("elf with pc_base < 32 is not supported");
        }
        if elf.pc_base % 4 != 0 {
            eyre::bail!("elf with pc_base not a multiple of 4 is not supported");
        }

        let instruction_pair = transpile(&elf.instructions, false);
        let (instructions, instructions_encoded): (Vec<Instruction>, Vec<u32>) =
            instruction_pair.into_iter().unzip();

        if instructions.is_empty() {
            eyre::bail!("empty elf not supported");
        }
        if instructions.len() > (1 << 22) {
            eyre::bail!("elf has too many instructions");
        }

        let enable_untrusted_programs = elf.untrusted_memory.is_some();
        Ok(Program {
            instructions,
            instructions_encoded: Some(instructions_encoded),
            pc_start_abs: elf.pc_start,
            pc_base: elf.pc_base,
            trap_context: elf.trap_context,
            memory_image: elf.memory_image,
            page_prot_image: elf.page_prot_image,
            preprocessed_shape: None,
            enable_untrusted_programs,
            function_symbols: elf.function_symbols,
            untrusted_memory: elf.untrusted_memory,
            dump_elf_stack: elf.dump_elf_stack,
        })
    }
}
