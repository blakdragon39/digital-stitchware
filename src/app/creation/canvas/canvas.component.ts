import { Component, Input, SimpleChanges } from '@angular/core'
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
    @Input() public color = "#000000"
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

    private rightClickDown = false
    private xOffset = 20
    private yOffset = 20

    ngOnInit() {
        var gridCanvas = document.getElementById('gridCanvas') as HTMLCanvasElement
        var fullCrossCanvas = document.getElementById('fullCrossCanvas') as HTMLCanvasElement
        var highlightCanvas = document.getElementById('highlightCanvas') as HTMLCanvasElement

        this.gridCtx = gridCanvas.getContext('2d')!
        this.fullCrossCtx = fullCrossCanvas.getContext('2d')!
        this.highlightCtx = highlightCanvas.getContext('2d')!
        this.boundingRect = gridCanvas.getBoundingClientRect()!

        this.initialized = true
        this.drawGridLines()
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!this.initialized) return
        if ('width' in changes || 'height' in changes) {
            this.drawGridLines()
        }
    }

    onMouseMoveEvent(event: MouseEvent) {
        if (this.isInsideCanvas(event)) {
            if (this.rightClickDown) {
                this.xOffset += event.movementX
                this.yOffset += event.movementY
                this.redrawAll()
            } else {
                var mousePos = this.getMousePosRelativeToPattern(event)
                this.highlightedSquare = this.getHoveredSquare(mousePos)
                this.drawHighlight()
            }
        } else {
            this.rightClickDown = false
        }
    }

    onMouseClickEvent(event: MouseEvent) {
        // todo transfer this to onMouseDownEvent for button == 0
        if (event.button == 0) {
            this.onLeftMouseClick(event)
        }
    }

    onMouseDownEvent(event: MouseEvent) {
        event.preventDefault()
        if (event.button == 2) {
            this.rightClickDown = true
        }
    }

    onMouseUpEvent(event: MouseEvent) {
        if (event.button == 2) {
            this.rightClickDown = false
        }
    }

    onScrollEvent(event: WheelEvent) {
        var newStitchSize = this.stitchSize + (event.deltaY * -0.1)

        if (newStitchSize > 0) {
            this.stitchSize = newStitchSize
            this.redrawAll()
        }
    }

    onLeftMouseClick(event: MouseEvent) {
        if (this.highlightedSquare) {
            this.setBlock(this.highlightedSquare, this.color)
        }
    }

    getMousePosRelativeToPattern(event: MouseEvent): Point {
        return new Point((event.clientX - this.boundingRect.x) - this.xOffset, (event.clientY - this.boundingRect.y) - this.yOffset)
    }

    isInsideCanvas(event: MouseEvent) {
        return event.clientX > this.boundingRect.x && event.clientX - this.boundingRect.x < this.boundingRect.width &&
            event.clientY > this.boundingRect.y && event.clientY - this.boundingRect.y < this.boundingRect.height
    }

    getHoveredSquare(mousePos: Point): Point | null {
        var x = Math.floor(mousePos.x / this.stitchSize)
        var y = Math.floor(mousePos.y / this.stitchSize)

        if (x >= 0 && x < this.width && y >=0 &&  y < this.height) {
            return new Point(x, y)
        } else {
            return null
        }
    }

    setBlock(block: Point, color: string) {
        this.pattern.fullCrosses.set(block, new FullCross(block.x, block.y, color))
        this.drawPattern() // todo only redraw the one block?
    }


    ///////////////////////////////
    // Draw canvas  ///////////////
    ///////////////////////////////

    redrawAll() {
        this.drawGridLines()
        this.drawPattern()
        this.drawHighlight()
    }

    drawGridLines() {
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

    drawHighlight() {
        this.highlightCtx.reset()
        if (this.highlightedSquare) {
            this.drawSquare(this.highlightCtx, this.highlightedSquare, '#32a852')
        }
    }

    drawLine(c: CanvasRenderingContext2D, from: Point, to: Point, width: number) {
        c.beginPath()
        c.lineWidth = width
        c.moveTo(from.x + this.xOffset, from.y + this.yOffset)
        c.lineTo(to.x + this.xOffset, to.y + this.yOffset)
        c.stroke()
    }

    drawSquare(c: CanvasRenderingContext2D, pos: Point, color: string) {
        c.beginPath()
        c.rect((pos.x * this.stitchSize) + this.xOffset, (pos.y * this.stitchSize) + this.yOffset, this.stitchSize, this.stitchSize)
        c.fillStyle = color
        c.fill()
    }
}
