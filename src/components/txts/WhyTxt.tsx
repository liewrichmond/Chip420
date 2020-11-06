import React from "react"
import { FaGithub, FaLinkedinIn } from "react-icons/fa"
import styled from "styled-components"

const StyledIcon = styled.a`
    font-size: 25px;
    padding-right: 10px;
`



const WhyTxt: React.FC = () => {
    return (
        <div>
            <h1>
                Motivation
            </h1>
            <p>
                The lack of positive responses from my recent job applications indicate that I need to git gud. This is an attempt in doing so.
            </p>
            <p>
                By no means is this meant to show that I'm a 10x engineer. I am still mostly looking for junior dev positions. This is only meant to show that I can code something.
            </p>
            <p>
                If this has peaked any interest in paying me to write code, feel free to contact me at <a href="mailto:richmond.liew.97@gmail.com">richmond.liew.97@gmail.com </a>
            or check out my social media here:
            </p>
            <StyledIcon>
                <a href="https://github.com/liewrichmond"><FaGithub /></a>
            </StyledIcon>
            <StyledIcon>
                <a href="https://www.linkedin.com/in/richmond-liew/"><FaLinkedinIn /></a>
            </StyledIcon>
        </div >
    )
}

export default WhyTxt