import { Point } from './point'

export class Pattern {
	fullCrosses: Map<Point, FullCross> = new Map<Point, FullCross>()
}

export class FullCross {
	xPos: number
	yPos: number
	color: string

	constructor(xPos: number, yPos: number, color: string) {
		this.xPos = xPos
		this.yPos = yPos
		this.color = color
	}
}