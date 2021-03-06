import React, { useState } from "react"
import { Modal, Frame, Icon } from "@react95/core"
import styled from "styled-components"


const FilesWrapper = styled.div`
	display: flex;
	grid-template-columns: repeat(4, 1fr);
	flex-wrap: wrap;
`;

const StyledItem = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-direction: column;
	text-align: center;
	width: 25%;
    padding: 10px 0;
`;

const StyledSpan = styled.span`
	margin-top: 5px;
`
interface SelectionWindowProps {
    games: string[]
    handleSelectGameClick: (game: string) => void
    closeWindow: () => void
}


const SelectionWindow: React.FC<SelectionWindowProps> = (props: SelectionWindowProps) => {
    const [selectedGame, setSelectedGame] = useState("")

    const selectItem = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const game: string = event.currentTarget.id
        setSelectedGame(game)
    }

    return (
        <Modal
            title="Select Game"
            buttonsAlignment="flex-end"
            icon="access_221"
            closeModal={() => { props.closeWindow() }}
            width="400"
            height="350"
            defaultPosition={{
                x: 275,
                y: 520
            }}
            buttons={[{ value: "Select", onClick: () => { props.handleSelectGameClick(selectedGame) } }]}
        >
            <Frame boxShadow="in" height="100%" bg="white">
                <FilesWrapper>
                    {
                        props.games.map((game) =>
                            <StyledItem onClick={selectItem} id={game}>
                                <Icon
                                    name="folder_exe"
                                    className="pointer"
                                />
                                <StyledSpan style={game === selectedGame ? { background: "#4293f5", color: "white" } : { background: "white" }}>{game}</StyledSpan>
                            </StyledItem>
                        )
                    }
                </FilesWrapper>
            </Frame>
        </Modal>
    )
}

export default SelectionWindow