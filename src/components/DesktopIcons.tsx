import React from 'react'
import styled from 'styled-components'
import { Icon } from '@react95/core'

const StyledShorcut = styled.div`
    margin-left: 20px;
    margin-top: 20px;
	align-items: center;
`;

interface DesktopIconsProps {
    openChip420Window: () => void
    openTxt: (txt: string) => void
}

const DesktopIcons: React.FC<DesktopIconsProps> = (props: DesktopIconsProps) => {
    return (
        <div>
            <div>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="bat_exec"
                        onClick={() => {props.openChip420Window()}}
                    />
                    <div>Chip420.exe</div>
                </StyledShorcut>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="file_text"
                        onClick={() => {props.openTxt("why")}}
                    />
                    <div>why.txt</div>
                </StyledShorcut>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="file_text"
                        onClick={() => {props.openTxt("inspo")}}
                    />
                    <div>inspo.txt</div>
                </StyledShorcut>

            </div>

        </div>
    )
}

export default DesktopIcons