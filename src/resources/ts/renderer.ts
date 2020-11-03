import * as PIXI from "pixi.js"
class Renderer {
    private app: PIXI.Application
    private graphics: PIXI.Graphics;

    private initializeGraphics() {
        document.body.appendChild(this.app.view);
        this.app.stage.addChild(this.graphics);
    }

    constructor() {
        this.app = new PIXI.Application({
            width: 640,
            height: 320,
            antialias: false
        });
        this.graphics = new PIXI.Graphics();
        this.initializeGraphics();
    }

    public clear() {
        this.graphics.clear();
    }

    public updateGraphicsAt(xPos: number, yPos: number, pixel: number) {
        if (pixel) {
            if (this.graphics.fill.color !== 0x00FF00) {
                this.graphics.beginFill(0x00FF00);
            }
        }
        else {
            if (this.graphics.fill.color !== 0x000000) {
                this.graphics.beginFill(0x000000);
            }
        }
        this.graphics.drawRect((xPos * 10), (yPos * 10), 10, 10);
        this.graphics.endFill()
    }
}

export class CanvasRenderer {
    private screen: HTMLCanvasElement
    private context: CanvasRenderingContext2D

    private getScreen(): HTMLCanvasElement {
        const el = document.querySelector('canvas')
        if (el) {
            return el
        }
        else {
            throw (new Error("Cannot find Canvas element!"))
        }
    }

    private getContext(): CanvasRenderingContext2D {
        const ctx = this.screen.getContext('2d')
        if (ctx) {
            return ctx
        }
        else {
            throw (new Error("cannot get context for 2d canvas!"))
        }
    }

    constructor() {
        this.screen = this.getScreen()
        this.context = this.getContext()
        this.screen.width = 640
        this.screen.height = 320
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.screen.width, this.screen.height)
    }

    public clear() {
        this.context.clearRect(0, 0, this.screen.width, this.screen.height);
        this.context.fillStyle = 'black'
        this.context.fillRect(0, 0, this.screen.width, this.screen.height);
    }

    public updateGraphicsAt(xPos: number, yPos: number, pixel: number) {
        if (pixel && this.context) {
            this.context.fillStyle = "#00FF00"
        }
        else if (!pixel && this.context) {
            this.context.fillStyle = "black"
        }
        if (this.context) {
            this.context.fillRect(
                xPos * 10,
                yPos * 10,
                10,
                10
            )
        }
    }
}

export default Renderer
