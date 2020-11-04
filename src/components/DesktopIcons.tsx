import React from 'react'
import styled from 'styled-components'
import { Icon } from '@react95/core'

const StyledShorcut = styled.div`
    margin-left: 20px;
    margin-top: 20px;
	align-items: center;
`;

interface DesktopIconsProps {
    handleChip420IconClick: () => void
}

const DesktopIcons: React.FC<DesktopIconsProps> = (props: DesktopIconsProps) => {
    return (
        <div>
            <div>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="bat_exec"
                        onClick={() => {props.handleChip420IconClick()}}
                    />
                    <div>Chip420.exe</div>
                </StyledShorcut>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="file_text"
                        onClick={() => {}}
                    />
                    <div>why.txt</div>
                </StyledShorcut>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="file_text"
                        onClick={() => {}}
                    />
                    <div>inspo.txt</div>
                </StyledShorcut>

            </div>

        </div>
    )
}

export default DesktopIcons