import { Component, inject } from '@angular/core'
import { NgIf, NgFor } from '@angular/common'
import { MessageService } from '../services/message.service'

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ NgIf, NgFor ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  public messageService = inject(MessageService)


}
