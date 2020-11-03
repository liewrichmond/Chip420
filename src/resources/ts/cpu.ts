import Renderer, { CanvasRenderer } from "./renderer"
class CPU {
    private regs: Uint8Array;
    private indexReg: number;
    private pc: number;
    private memory: Uint8Array;
    private stack: Uint16Array;
    private stackPtr: number;
    private delayTimer: number;
    private soundTimer: number;
    private keys: { [code: number]: boolean }
    private graphics: Uint8Array[];
    private renderer: CanvasRenderer | null

    constructor(memory: Uint8Array) {
        this.regs = new Uint8Array(16);
        this.memory = memory
        this.indexReg = 0;
        this.stack = new Uint16Array(16)
        this.stackPtr = -1
        this.pc = 0x200
        this.delayTimer = 0
        this.soundTimer = 0
        this.keys = {
            0x0: false, 0x1: false, 0x2: false, 0x3: false,
            0x4: false, 0x5: false, 0x6: false, 0x7: false,
            0x8: false, 0x9: false, 0xA: false, 0xB: false,
            0xC: false, 0xD: false, 0xE: false, 0xF: false
        }
        this.graphics = []
        for (let row = 0; row < 32; row++) {
            this.graphics.push(new Uint8Array(64))
        }
        this.renderer = null
    }

    public reset() {
        this.regs = new Uint8Array(16)
        this.pc = 0x200
        this.renderer = new CanvasRenderer()
        this.indexReg = 0;
        this.stack = new Uint16Array(16)
        this.stackPtr = -1
        this.delayTimer = 0
        this.soundTimer = 0
        this._00e0()
    }

    //Sys addr
    private _0nnn() {

    }

    //Clears display
    private _00e0() {
        for (let i = 0; i < this.graphics.length; i++) {
            this.graphics[i] = new Uint8Array(64)
        }
        if (this.renderer) {
            this.renderer.clear();
        }
    }

    //Returns from subroutine
    private _00ee() {
        if (this.stackPtr < -1) {
            throw (new Error(`stackPtr Value: ${this.stackPtr}. Cannot be futher decrement`))
        }
        else {
            this.pc = this.stack[this.stackPtr];
            this.stackPtr--;
        }
    }

    //JP addr
    private _1nnn(opcode: number) {
        const addr: number = (0x0FFF & opcode)
        this.pc = addr
    }

    //CALL addr
    private _2nnn(opcode: number) {
        const addr: number = (0x0FFF & opcode)
        //TODO
        this.stack[this.stackPtr + 1] = this.pc;
        this.stackPtr++;
        this.pc = addr;
    }

    //SE Vx, byte
    private _3xkk(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8;
        const byte: number = (0x00FF & opcode);
        if (this.regs[Vx] === byte) {
            this.pc += 2;
        }
    }

    //SNE Vx, byte
    private _4xkk(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8;
        const byte: number = (0x00FF & opcode);
        if (this.regs[Vx] !== byte) {
            this.pc += 2;
        }
    }

    //SE Vx, Vy
    private _5xy0(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8;
        const Vy: number = (0x00F0 & opcode) >> 4;
        if (this.regs[Vx] === this.regs[Vy]) {
            this.pc += 2;
        }
    }

    //LD Vx, byte
    private _6xkk(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8;
        const byte: number = (0x00FF & opcode);
        this.regs[Vx] = byte;
    }

    //ADD Vx, byte
    private _7xkk(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8;
        const byte: number = (0x00FF & opcode);
        this.regs[Vx] += byte
    }

    //LD Vx, Vy
    private _8xy0(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        this.regs[Vx] = this.regs[Vy]
    }

    //OR Vx, Vy
    private _8xy1(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        const result = this.regs[Vx] | this.regs[Vy]
        this.regs[Vx] = result
    }

    //AND Vx, Vy
    private _8xy2(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        const result = this.regs[Vx] & this.regs[Vy]
        this.regs[Vx] = result
    }

    //XOR Vx, Vy
    private _8xy3(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        const result = this.regs[Vx] ^ this.regs[Vy]
        this.regs[Vx] = result
    }

    //ADD Vx, Vy
    private _8xy4(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        const result = this.regs[Vx] + this.regs[Vy]
        if (result > 255) {
            this.regs[Vx] = result & 0xFF;
            this.regs[0xF] = 1
        }
        else {
            this.regs[Vx] = result
            this.regs[0xF] = 0
        }
    }

    //SUB Vx, Vy
    private _8xy5(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        if (this.regs[Vx] > this.regs[Vy]) {
            this.regs[0xF] = 1
        }
        else {
            this.regs[0xF] = 0
        }
        const result = this.regs[Vx] - this.regs[Vy]
        this.regs[Vx] = result
    }

    // SHR Vx
    private _8xy6(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        this.regs[0xF] = this.regs[Vx] & 0x1
        const result = this.regs[Vx] >> 1
        this.regs[Vx] = result
    }

    // SUBN Vx, Vy
    private _8xy7(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4
        if (this.regs[Vy] > this.regs[Vx]) {
            this.regs[0xF] = 1
        }
        else {
            this.regs[0xF] = 0
        }
        const result: number = this.regs[Vy] - this.regs[Vx];
        this.regs[Vx] = result
    }

    // SHL Vx {, Vy}
    private _8xye(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        this.regs[0xF] = (this.regs[Vx] & 0x80) >> 7
        const result = this.regs[Vx] << 1
        this.regs[Vx] = result
    }

    // SNE Vx, Vy
    private _9xy0(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8;
        const Vy: number = (0x00F0 & opcode) >> 4;
        if (this.regs[Vx] !== this.regs[Vy]) {
            this.pc += 2
        }
    }

    // LD I, addr
    private _Annn(opcode: number) {
        const addr: number = (0x0FFF & opcode)
        this.indexReg = addr
    }

    //JP V0, addr
    private _Bnnn(opcode: number) {
        const addr: number = (0x0FFF & opcode)
        this.pc = addr + this.regs[0]
    }

    private RNG(): number {
        const min = Math.ceil(0);
        const max = Math.floor(256);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    // RND Vx, byte
    private _Cxkk(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const byte: number = (0x00FF & opcode)
        const randNumber = this.RNG();
        const result = randNumber & byte;
        this.regs[Vx] = result;
    }

    private updateGraphicsAt(xPos: number, yPos: number, spritePixel: number) {
        const currentPixel = this.graphics[yPos][xPos];
        const newPixel = currentPixel ^ spritePixel;
        if (currentPixel === 1 && newPixel === 0) {
            this.regs[0xF] = 1
        }
        this.graphics[yPos][xPos] = newPixel
        if (this.renderer) {
            this.renderer.updateGraphicsAt(xPos, yPos, newPixel)
        }
    }

    // DRW Vx, Vy, nibble
    private _Dxyn(opcode: number) {
        const spriteHeight: number = (0x000F & opcode)
        const Vx: number = (0x0F00 & opcode) >> 8
        const Vy: number = (0x00F0 & opcode) >> 4

        this.regs[0xF] = 0

        for (let row = 0; row < spriteHeight; row++) {
            const memoryAddr = this.indexReg + row;
            const spriteToDraw: number = this.memory[memoryAddr];

            for (let col = 0; col < 8; col++) {
                const yPos = (this.regs[Vy] + row) % 32
                const xPos = (this.regs[Vx] + col) % 64
                const shiftAmount: number = 7 - col
                const spritePixel = (spriteToDraw >> shiftAmount) & 0b1
                this.updateGraphicsAt(xPos, yPos, spritePixel)
            }
        }
    }

    // SKP Vx
    private _Ex9E(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        if (this.keys[this.regs[Vx]]) {
            this.pc += 2
        }
    }

    // SKNP Vx
    private _ExA1(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        if (!this.keys[this.regs[Vx]]) {
            this.pc += 2
        }
    }

    // LD Vx, DT
    private _Fx07(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        this.regs[Vx] = this.delayTimer
    }

    private hasKeyPress(): null | number {
        for (const key in this.keys) {
            if (this.keys[key]) {
                return Number(key);
            }
        }
        return null;
    }

    // LD Vx, K
    private _Fx0A(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        const keyPressed = this.hasKeyPress();
        if (keyPressed) {
            this.regs[Vx] = keyPressed
        }
        else {
            this.pc -= 2
        }
    }

    // LD DT, Vx
    private _Fx15(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        this.delayTimer = this.regs[Vx]
    }

    // LD ST, Vx
    private _Fx18(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        this.soundTimer = this.regs[Vx]
    }

    // ADD I, Vx
    private _Fx1E(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        this.indexReg = this.indexReg + this.regs[Vx]
    }

    // LD F, Vx
    private _Fx29(opcode: number) {
        //TODO
        const Vx: number = (0x0F00 & opcode) >> 8
        const memoryAddr: number = this.regs[Vx] * 5
        this.indexReg = memoryAddr
    }

    // LD B, Vx
    private _Fx33(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        let n: number = this.regs[Vx]
        this.memory[this.indexReg + 2] = n % 10
        n = Math.floor(n / 10)
        this.memory[this.indexReg + 1] = n % 10
        n = Math.floor(n / 10)
        this.memory[this.indexReg] = n % 10
    }

    // LD [I], Vx
    private _Fx55(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        for (let i = 0; i <= Vx; i++) {
            this.memory[this.indexReg + i] = this.regs[i]
        }
    }

    private _Fx65(opcode: number) {
        const Vx: number = (0x0F00 & opcode) >> 8
        for (let i = 0; i <= Vx; i++) {
            this.regs[i] = this.memory[this.indexReg + i]
        }
    }

    private fetchInstruction(): number {
        const bigNibble: number = (this.memory[this.pc]) << 8;
        const smallNibble: number = this.memory[this.pc + 1];
        const instruction: number = bigNibble | smallNibble;
        this.pc += 2
        return instruction
    }

    private decode0x8MSB(opcode: number): any {
        const LSB: number = (0x000F & opcode);
        switch (LSB) {
            case 0x0:
                this._8xy0(opcode);
                break;
            case 0x1:
                this._8xy1(opcode);
                break;
            case 0x2:
                this._8xy2(opcode);
                break;
            case 0x3:
                this._8xy3(opcode);
                break;
            case 0x4:
                this._8xy4(opcode);
                break;
            case 0x5:
                this._8xy5(opcode);
                break;
            case 0x6:
                this._8xy6(opcode);
                break;
            case 0x7:
                this._8xy7(opcode);
                break;
            case 0xE:
                this._8xye(opcode);
                break;
            default:
                throw (new Error("Invalid opcode starting with 0x8"))
        }
    }

    private decode0xFMSB(opcode: number): any {
        const lastTwoHexDigits: number = (0x00FF & opcode);
        switch (lastTwoHexDigits) {
            case 0x07:
                this._Fx07(opcode);
                break;
            case 0x0A:
                this._Fx0A(opcode);
                break;
            case 0x15:
                this._Fx15(opcode);
                break;
            case 0x18:
                this._Fx18(opcode);
                break;
            case 0x1E:
                this._Fx1E(opcode);
                break;
            case 0x29:
                this._Fx29(opcode);
                break;
            case 0x33:
                this._Fx33(opcode);
                break;
            case 0x55:
                this._Fx55(opcode);
                break;
            case 0x65:
                this._Fx65(opcode);
                break;
            default:
                throw (new Error("Invalid opcode starting with 0xF"))
        }
    }

    private decodeAndExecuteInstruction(opcode: number): void {
        // Determine the opcode by looking at MSB first
        const MSB: number = (0xF000 & opcode) >> 12
        switch (MSB) {
            case 0x0:
                if (opcode === 0x00E0) {
                    this._00e0();
                }
                else if (opcode === 0x00EE) {
                    this._00ee();
                }
                else {
                    this._0nnn();
                }
                break;
            case 0x1:
                this._1nnn(opcode);
                break;
            case 0x2:
                this._2nnn(opcode);
                break;
            case 0x3:
                this._3xkk(opcode);
                break;
            case 0x4:
                this._4xkk(opcode);
                break;
            case 0x5:
                this._5xy0(opcode);
                break;
            case 0x6:
                this._6xkk(opcode);
                break;
            case 0x7:
                this._7xkk(opcode);
                break;
            case 0x8:
                this.decode0x8MSB(opcode)
                break;
            case 0x9:
                this._9xy0(opcode);
                break;
            case 0xA:
                this._Annn(opcode);
                break;
            case 0xB:
                this._Bnnn(opcode)
                break;
            case 0xC:
                this._Cxkk(opcode);
                break;
            case 0xD:
                this._Dxyn(opcode);
                break;
            case 0xE:
                const lastTwoHexDigits: number = (0x00FF & opcode)
                if (lastTwoHexDigits === 0x9E) {
                    this._Ex9E(opcode);
                }
                else if (lastTwoHexDigits === 0xA1) {
                    this._ExA1(opcode);
                }
                else {
                    throw (new Error("Invalid opcode starting with 0xE"))
                }
                break;
            case 0xF:
                this.decode0xFMSB(opcode)
                break;
            default:
                throw (new Error("Invalid Opcode"))

        }
    }

    public cycle(): void {
        const opcode = this.fetchInstruction()
        this.decodeAndExecuteInstruction(opcode)
    }

    public decrementTimer(): void {
        if (this.soundTimer > 0) {
            this.soundTimer--
        }
        if (this.delayTimer > 0) {
            this.delayTimer--
        }
    }

    public registerKeyPress(code: number) {
        this.keys[code] = true
    }

    public registerKeyRelease(code: number) {
        this.keys[code] = false
    }

}

export default CPU 