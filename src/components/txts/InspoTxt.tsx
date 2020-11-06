import React from "react"

const InspoTxt: React.FC = () => {
    return (
        <div>
            <h1>References and Inspiration</h1>
            <p>
                Links that helped me a lot to make this project.
            </p>
            <ul>
                <li>
                    <a href="https://austinmorlan.com/posts/chip8_emulator/">Auston Morlan's Chip8 writeup</a>
                </li>
                <li>
                    <a href="http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#0.0">Cowgod's Legendary Chip8 Reference</a>
                </li>
                <li>
                    <a href="https://www.taniarascia.com/writing-an-emulator-in-javascript-chip8/">Tania Rascia's Chip8 implementation in Javascript</a>
                </li>
                <li>
                    <a href="https://insafkhamzin.com/">UI HEAVILY inspired by Insaf Khamzin's personal website</a>
                </li>
            </ul>
        </div>
    )
}

export default InspoTxt