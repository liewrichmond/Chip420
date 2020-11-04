import Tetris from "../assets/roms/Tetris.ch8"
import spaceInvaders from "../assets/roms/spaceInvaders.ch8"
import testRom from "../assets/roms/test_opcode.ch8"
import testRom2 from "../assets/roms/BC_test.ch8"

export interface gameMetadata {
    romLocation: string,
    keyBindings: { [customKey: string]: string }
}

export const getGameMetadata = (): { [key: string]: gameMetadata } => {
    return ({
        "Tetris": {
            romLocation: Tetris,
            keyBindings: {
                "ArrowLeft": "w",
                "ArrowRight": "e",
                "ArrowUp": "q",
                "ArrowDown": "a"
            }
        },
        "Space Invaders": {
            romLocation: spaceInvaders,
            keyBindings: {
                "ArrowLeft": "q",
                "ArrowRight": "e",
                "ArrowUp": "w",
            }
        },
        "Test ROM 1": {
            romLocation: testRom,
            keyBindings: {}
        },
        "Test ROM 2": {
            romLocation: testRom2,
            keyBindings: {}
        },
    })
}