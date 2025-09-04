import { Component, Input } from '@angular/core';

@Component({
  selector: 'tim-button',
  template: `
    <button class="bg-blue-500 text-white p-2 rounded-md">
      {{ label }}
    </button>
  `,
})
export class ButtonComponent {
  @Input() label = '';
}
