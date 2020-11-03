import Tetris from "../assets/roms/Tetris.ch8"
import spaceInvaders from "../assets/roms/spaceInvaders.ch8"
import testRom from "../assets/roms/test_opcode.ch8"
import testRom2 from "../assets/roms/BC_test.ch8"



export const getGames = () => {
    return {
        "Tetris": Tetris,
        "Space Invaders": spaceInvaders,
        "Test ROM 1": testRom,
        "Test ROM 2": testRom2
    }
}