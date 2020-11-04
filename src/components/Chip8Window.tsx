import React from 'react';
import {
    Modal,
    List,
    Frame
} from '@react95/core';
import styled from 'styled-components'

interface Chip8WindowProps {
    handleLoadGameClick: () => void
    closeWindow: () => void
    registerKeyPress: (event: React.KeyboardEvent) => void
    registerKeyRelease: (event: React.KeyboardEvent) => void
}

const FrameWrapper = styled.div`
    margin: 25px;
`

const Chip8Window: React.FC<Chip8WindowProps> = (props: Chip8WindowProps) => {

    const registerKeyPress = (event: React.KeyboardEvent) => {
        props.registerKeyPress(event)
    }

    const registerKeyRelease = (event: React.KeyboardEvent) => {
        props.registerKeyRelease(event)
    }

    return (
        <Modal
            title="Chip420"
            buttonsAlignment="flex-end"
            closeModal={() => { props.closeWindow() }}
            defaultPosition={{
                x: 700,
                y: 200
            }}
            height="420"
            icon="drvspace_7"
            menu={[
                {
                    list: <List width={200}><List.Item onClick={() => { props.handleLoadGameClick() }}>Load Game</List.Item></List>,
                    name: 'File'
                }
            ]}
            width="740"
        >
            <div onKeyDown={registerKeyPress} onKeyUp={registerKeyRelease} tabIndex={-1}>
                <FrameWrapper>
                    <Frame padding={4} width={648} height={328}>
                        <Frame height="100%" boxShadow="in">
                            <canvas>
                            </canvas>
                        </Frame>
                    </Frame>
                </FrameWrapper>
            </div>
        </Modal>
    )
}

export default Chip8Window
