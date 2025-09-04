import { Component, Input } from '@angular/core';

@Component({
  selector: 'tim-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() bgColor = 'bg-blue-500';

  @Input() label = 'Button';
}
