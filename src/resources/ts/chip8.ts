import CPU from "./cpu"
import Tetris from "../assets/roms/Tetris.ch8"
import spaceInvaders from "../assets/roms/spaceInvaders.ch8"
import testRom from "../assets/roms/test_opcode.ch8"
import testRom2 from "../assets/roms/BC_test.ch8"

class Chip8 {
    private cpu: CPU
    private memory: Uint8Array;
    private keyboard: { [keyCode: string]: number }
    private cycleInterval = 0;
    private delayInterval = 0;

    private loadFontsIntoMemory() {
        //Load default Hex fonts into memory
        //TODO
        const fonts: number[] = [
            0xF0, 0x90, 0x90, 0x90, 0xF0,
            0x20, 0x60, 0x20, 0x20, 0x70,
            0xF0, 0x10, 0xF0, 0x80, 0xF0,
            0xF0, 0x10, 0xF0, 0x10, 0xF0,
            0x90, 0x90, 0xF0, 0x10, 0x10,
            0xF0, 0x80, 0xF0, 0x10, 0xF0,
            0xF0, 0x80, 0xF0, 0x90, 0xF0,
            0xF0, 0x10, 0x20, 0x40, 0x40,
            0xF0, 0x90, 0xF0, 0x90, 0xF0,
            0xF0, 0x90, 0xF0, 0x10, 0xF0,
            0xF0, 0x90, 0xF0, 0x90, 0x90,
            0xE0, 0x90, 0xE0, 0x90, 0xE0,
            0xF0, 0x80, 0x80, 0x80, 0xF0,
            0xE0, 0x90, 0x90, 0x90, 0xE0,
            0xF0, 0x80, 0xF0, 0x80, 0xF0,
            0xF0, 0x80, 0xF0, 0x80, 0x80,
        ]
        for(let i = 0; i < fonts.length; i++) {
            this.memory[i] = fonts[i]
        }
    }

    constructor() {
        this.memory = new Uint8Array(4096)
        this.loadFontsIntoMemory();
        this.cpu = new CPU(this.memory);
        this.keyboard = {
            "1": 0x1, "2": 0x2, "3": 0x3, "4": 0xC,
            "q": 0x4, "w": 0x5, "e": 0x6, "r": 0xD,
            "a": 0x7, "s": 0x8, "d": 0x9, "f": 0xE,
            "z": 0xA, "x": 0x0, "c": 0xB, "v": 0xF
        }
    }

    private async getRom(romStr: string): Promise<Uint8Array> {
        const response: Response = await fetch(romStr);
        if (response.body) {
            const reader: ReadableStreamReader<Uint8Array> = response.body.getReader();
            const data: ReadableStreamReadResult<Uint8Array> = await reader.read();
            if (data.value) {
                const rawRom: Uint8Array = data.value;
                return rawRom;
            }
            else {
                throw (new Error("Corrupted ROM data"))
            }
        }
        else {
            throw (new Error("Could Not Fetch ROM"))
        }
    }

    public async loadRomIntoMemory(romStr: string): Promise<void> {
        // let RomStr = spaceInvaders
        const rom: Uint8Array = await this.getRom(romStr);
        const programStartAddr: number = 0x200;
        for (let i = 0; i < rom.length; i++) {
            this.memory[programStartAddr + i] = rom[i];
        }
    }

    public registerKeyPress(code: string): void {
        if (Object.keys(this.keyboard).includes(code)) {
            this.cpu.registerKeyPress(this.keyboard[code])
        }
    }

    public registerKeyRelease(code: string): void {
        if (Object.keys(this.keyboard).includes(code)) {
            this.cpu.registerKeyRelease(this.keyboard[code])
        }
    }

    public start(clockSpeed: number): void {
        this.cpu.reset()
        this.cycleInterval = window.setInterval(() => { this.cpu.cycle() }, clockSpeed)
        this.delayInterval = window.setInterval(() => { this.cpu.decrementTimer() }, 16)
    }

    public stop(): void {
        clearInterval(this.cycleInterval);
        clearInterval(this.delayInterval);
        this.cpu.reset();
    }
}

export default Chip8