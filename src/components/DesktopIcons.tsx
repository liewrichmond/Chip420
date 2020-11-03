import React from 'react'
import styled from 'styled-components'
import { Icon } from '@react95/core'

const StyledShorcut = styled.div`
    margin-left: 20px;
    margin-top: 20px;
	align-items: center;
`;

const DesktopIcons: React.FC = () => {
    return (
        <div>
            <div>
                <StyledShorcut>
                    <Icon
                        className="pointer"
                        name="bat_exec"
                        onClick={() => {}}
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