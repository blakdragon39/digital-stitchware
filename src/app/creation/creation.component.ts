import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { CanvasComponent } from './canvas/canvas.component'
import { ColorPickerComponent } from './colorpicker/colorpicker.component'

@Component({
    selector: 'app-creation',
    standalone: true,
    imports: [ 
        CommonModule,
        FormsModule,
        CanvasComponent,
        ColorPickerComponent,
    ],
    templateUrl: './creation.component.html',
    styleUrl: './creation.component.scss'
})
export class CreationComponent {
    public width = 10
    public height = 10
    public color = "#00ff00"

    public newWidth = 0
    public newHeight = 0

    public changingSize = false

    onColorChange = (event: Event) => {
        this.color = (event.target as HTMLInputElement).value
    } 

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
