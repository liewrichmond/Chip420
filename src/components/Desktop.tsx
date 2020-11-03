import React, { useState, useRef, useEffect } from 'react';
import DesktopIcons from "./DesktopIcons"
import Chip8Window from "./Chip8Window"
import SelectionWindow from "./SelectionWindow"
import { getGames } from "../resources/ts/utils"
import Chip8 from '../resources/ts/chip8';


const Desktop: React.FC = () => {
    const chip8 = useRef<Chip8 | null>()
    useEffect(() => {
        chip8.current = new Chip8()
    }, [])

    const [showGameSelection, setShowGameSelection] = useState(true)
    const games: any = getGames()
    const items = Object.keys(games)
    const onLoadGameClick = () => {
        setShowGameSelection(true)
    }
    const onSelectGameClick = (game: string): void => {
        setShowGameSelection(false)
        if (chip8.current) {
            chip8.current.stop();
            chip8.current.loadRomIntoMemory(games[game]).then(() => {
                if (chip8.current) {
                    chip8.current.start(3)
                }
            })
        }
    }
    const registerKeyPress = (event: React.KeyboardEvent) => {
        if (chip8.current) {
            chip8.current.registerKeyPress(event.key)
        }
    }

    const registerKeyRelease = (event: React.KeyboardEvent) => {
        if (chip8.current) {
            chip8.current.registerKeyRelease(event.key)
        }
    }


    return (
        <div>
            <DesktopIcons />
            {showGameSelection && <SelectionWindow games={items} handleSelectGameClick={onSelectGameClick} />}
            <Chip8Window handleLoadGameClick={onLoadGameClick} registerKeyPress={registerKeyPress} registerKeyRelease={registerKeyRelease} />
        </div>
    )
}

export default Desktop


