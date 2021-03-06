import React, { useState, useRef, useEffect } from 'react';
import DesktopIcons from "./DesktopIcons"
import Chip8Window from "./Chip8Window"
import SelectionWindow from "./SelectionWindow"
import TxtWindow from "./txts/TxtWindow"
import { getGameMetadata, gameMetadata } from "../resources/ts/utils"
import Chip8 from '../resources/ts/chip8';


const Desktop: React.FC = () => {
    const chip8 = useRef<Chip8 | null>()
    useEffect(() => {
        chip8.current = new Chip8()
    }, [])

    const games: { [game: string]: gameMetadata } = getGameMetadata();

    const [showGameSelection, setShowGameSelection] = useState(true)
    const [showChip8Window, setShowChip8Window] = useState(true)
    const [TxtWindowOpened, toggleTxtWindow] = useState(true)
    const [TxtWindowWhich, setTxtWindowWhich] = useState("why")

    const openGameSelectionWindow = () => {
        setShowGameSelection(true)
    }

    const onSelectGameClick = (game: string): void => {
        setShowGameSelection(false)
        setShowChip8Window(true)
        if (chip8.current) {
            chip8.current.stop();
            chip8.current.loadRomIntoMemory(games[game].romLocation).then(() => {
                if (chip8.current) {
                    chip8.current.start(3, games[game].keyBindings)
                }
            })
        }
    }

    const openTxt = (which: string): void => {
        toggleTxtWindow(true)
        setTxtWindowWhich(which)
    }

    const closeTxt = (): void => {
        toggleTxtWindow(false)
    }

    const openChip420Window = () => {
        setShowChip8Window(true)
        setShowGameSelection(true)
    }

    const closeChip8Window = () => {
        if (chip8.current) {
            chip8.current.stop();
            setShowChip8Window(false)
        }
    }

    const closeGameSelectionWindow = () => {
        setShowGameSelection(false)
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
            <DesktopIcons openChip420Window={openChip420Window} openTxt={openTxt} />
            {
                showGameSelection && (
                    <SelectionWindow games={Object.keys(games)} handleSelectGameClick={onSelectGameClick} closeWindow={closeGameSelectionWindow} />
                )
            }
            {
                TxtWindowOpened && < TxtWindow which={TxtWindowWhich} closeTxtWindow={closeTxt} />
            }
            {
                showChip8Window && (
                    <Chip8Window handleLoadGameClick={openGameSelectionWindow} registerKeyPress={registerKeyPress}
                        registerKeyRelease={registerKeyRelease} closeWindow={closeChip8Window} />
                )
            }
        </div>
    )
}

export default Desktop


