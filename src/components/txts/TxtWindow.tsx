import React from "react"
import { Modal, Frame } from "@react95/core"
import WhyTxt from "./WhyTxt"
import InspoTxt from "./InspoTxt"
import styled from "styled-components"

const StyledText = styled.div`
    font-size: 15px
`
interface TxtWindowProps {
    which: string
    closeTxtWindow: () => void
}

const TxtWindow: React.FC<TxtWindowProps> = (props: TxtWindowProps) => {
    return (
        <div>
            <Modal title={`${props.which}.txt`} closeModal={() => {props.closeTxtWindow()}}
                width="400"
                height="500"
                defaultPosition={{
                    x: 70,
                    y: 10
                }}
                icon="file_text"
            >

                <Frame
                    bg="white"
                    boxShadow="in"
                    height="100%"
                    padding={20}
                    style={{
                        overflowY: "auto",
                        maxHeight: "460px",
                    }}
                >
                    <StyledText>
                        {props.which === "why" && <WhyTxt />}
                        {props.which === "inspo" && <InspoTxt />}
                    </StyledText>

                </Frame>
            </Modal>
        </div>
    )
}

export default TxtWindow