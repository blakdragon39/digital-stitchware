import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

import { Point } from '../../models/point'

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

    ngOnInit() {
        // todo async this
        var canvas = document.getElementById('stitchCanvas')
        if (!canvas) return

        var c = (canvas as HTMLCanvasElement).getContext('2d')
        if (!c) return

        // draw full outer outline
        // todo plus half of outline width to finish the box
        this.drawLine(c, new Point(0, 0), new Point(this.width * this.stitchSize, 0), this.fullOutline)
        this.drawLine(c, new Point(0, 0), new Point(0, this.height * this.stitchSize), this.fullOutline)
        this.drawLine(c, new Point(this.width * this.stitchSize, 0), new Point(this.width * this.stitchSize, this.height * this.stitchSize), this.fullOutline)
        this.drawLine(c, new Point(0, this.height * this.stitchSize), new Point(this.width * this.stitchSize, this.height * this.stitchSize), this.fullOutline)

        //draw box outlines
        for (let x = 0; x < this.width; x += 1) {
            var lineSize = this.stitchLine
            if (x % 10 == 0) lineSize = this.boxLine
            this.drawLine(c, new Point(x * this.stitchSize, 0), new Point(x * this.stitchSize, this.height * this.stitchSize), lineSize)
        }

        for (let y = 0; y < this.height; y +=1 ) {
            var lineSize = this.stitchLine
            if (y % 10 == 0) lineSize = this.boxLine
            this.drawLine(c, new Point(0, y * this.stitchSize), new Point(this.width * this.stitchSize, y * this.stitchSize), lineSize)
        }
    }

    drawLine(c: CanvasRenderingContext2D, from: Point, to: Point, width: number) {
        c.beginPath()
        c.lineWidth = width
        c.moveTo(from.x, from.y)
        c.lineTo(to.x, to.y)
        c.stroke()
    }
}
