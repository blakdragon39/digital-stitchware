import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { CanvasComponent } from './canvas/canvas.component'

@Component({
    selector: 'app-creation',
    standalone: true,
    imports: [ 
        CommonModule,
        FormsModule,
        CanvasComponent,
    ],
    templateUrl: './creation.component.html',
    styleUrl: './creation.component.scss'
})
export class CreationComponent {
    public width = 100
    public height = 100

    public newWidth = 0
    public newHeight = 0

    public changingSize = false

    changeSize() {
        this.newWidth = this.width
        this.newHeight = this.height
        this.changingSize = true
    }

    finishChangingSize() {
        if (this.newWidth < this.width || this.newHeight < this.height) {
            // todo confirm
            console.log("making canvas smaller")
        } else {
            this.width = this.newWidth
            this.height = this.newHeight
        }

        this.changingSize = false
    }
}
