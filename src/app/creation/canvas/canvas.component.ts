import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

import { Point } from '../../models/point'
import { Pattern, FullCross } from '../../models/pattern'

@Component({
    selector: 'app-canvas',
    standalone: true,
    imports: [ 
        CommonModule,
    ],
    templateUrl: './canvas.component.html',
    styleUrl: './canvas.component.scss'
})
export class CanvasComponent {
    @Input() public width = 0
    @Input() public height = 0

    private stitchSize = 30
    private fullOutline = 6
    private stitchLine = 1
    private boxLine = 4

    private initialized = false
    private gridCtx!: CanvasRenderingContext2D
    private fullCrossCtx!: CanvasRenderingContext2D
    private highlightCtx!: CanvasRenderingContext2D
    private boundingRect!: DOMRect

    private highlightedSquare: Point | null = null
    private pattern: Pattern = new Pattern()

    ngOnInit() {
        var gridCanvas = document.getElementById('gridCanvas')!
        var fullCrossCanvas = document.getElementById('fullCrossCanvas')!
        var highlightCanvas = document.getElementById('highlightCanvas')!

        this.gridCtx = (gridCanvas as HTMLCanvasElement).getContext('2d')!
        this.fullCrossCtx = (fullCrossCanvas as HTMLCanvasElement).getContext('2d')!
        this.highlightCtx = (highlightCanvas as HTMLCanvasElement).getContext('2d')!
        this.boundingRect = gridCanvas.getBoundingClientRect()!

        this.initialized = true        
        this.ngOnChanges()
    }

    ngOnChanges() {
        if (!this.initialized) return

        this.gridCtx.reset()

        // draw full outer outline
        // todo plus half of outline width to finish the box
        this.drawLine(this.gridCtx, new Point(0, 0), new Point(this.width * this.stitchSize, 0), this.fullOutline)
        this.drawLine(this.gridCtx, new Point(0, 0), new Point(0, this.height * this.stitchSize), this.fullOutline)
        this.drawLine(this.gridCtx, new Point(this.width * this.stitchSize, 0), new Point(this.width * this.stitchSize, this.height * this.stitchSize), this.fullOutline)
        this.drawLine(this.gridCtx, new Point(0, this.height * this.stitchSize), new Point(this.width * this.stitchSize, this.height * this.stitchSize), this.fullOutline)

        //draw box outlines
        for (let x = 0; x < this.width; x += 1) {
            var lineSize = this.stitchLine
            if (x % 10 == 0) lineSize = this.boxLine
            this.drawLine(this.gridCtx, new Point(x * this.stitchSize, 0), new Point(x * this.stitchSize, this.height * this.stitchSize), lineSize)
        }

        for (let y = 0; y < this.height; y +=1 ) {
            var lineSize = this.stitchLine
            if (y % 10 == 0) lineSize = this.boxLine
            this.drawLine(this.gridCtx, new Point(0, y * this.stitchSize), new Point(this.width * this.stitchSize, y * this.stitchSize), lineSize)
        }
    }

    drawPattern() {
        this.fullCrossCtx.reset()
        for (let fullCross of this.pattern.fullCrosses.values()) {
            this.drawSquare(this.fullCrossCtx, new Point(fullCross.xPos, fullCross.yPos), fullCross.color)
        }
    }

    drawLine(c: CanvasRenderingContext2D, from: Point, to: Point, width: number) {
        c.beginPath()
        c.lineWidth = width
        c.moveTo(from.x, from.y)
        c.lineTo(to.x, to.y)
        c.stroke()
    }

    drawSquare(c: CanvasRenderingContext2D, pos: Point, color: string) {
        c.rect(pos.x * this.stitchSize, pos.y * this.stitchSize, this.stitchSize, this.stitchSize)
        c.fillStyle = color
        c.fill()
    }

    onMouseMoveEvent(event: MouseEvent) {
        var mousePos = this.getRelativeMousePosition(event)
        if (this.isInsideCanvas(mousePos)) {
            var squarePos = this.getHoveredSquare(mousePos)
            if (squarePos && this.highlightedSquare != squarePos) {
                this.highlightCtx.reset()
                this.drawSquare(this.highlightCtx, squarePos, '#32a852')
                this.highlightedSquare = squarePos
            }
        }
    }

    onMouseClickEvent(event: MouseEvent) {
        var mousePos = this.getRelativeMousePosition(event)
        if (this.isInsideCanvas(mousePos) && this.highlightedSquare) {
            this.setBlock(this.highlightedSquare, '#000')
        }
    }

    getRelativeMousePosition(event: MouseEvent): Point {
        return new Point(event.clientX - this.boundingRect.x, event.clientY - this.boundingRect.y)
    }

    isInsideCanvas(mousePos: Point) {
        return mousePos.x > 0 && mousePos.x < this.boundingRect.width && mousePos.y > 0 && mousePos.y < this.boundingRect.height
    }

    getHoveredSquare(mousePos: Point): Point | null {
        var x = Math.floor(mousePos.x / this.stitchSize)
        var y = Math.floor(mousePos.y / this.stitchSize)

        if (x < this.width && y < this.height) {
            return new Point(x, y)
        } else {
            return null
        }
    }

    setBlock(block: Point, color: string) {
        this.pattern.fullCrosses.set(block, new FullCross(block.x, block.y, color))
        this.drawPattern() // todo only redraw the one block?
    }
}
