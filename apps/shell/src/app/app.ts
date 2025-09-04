import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@info-mf-nx/tim-ui';
// import { TimModals } from '@tim-modals';

@Component({
  imports: [RouterModule, ButtonComponent],
  selector: 'info-mf-nx-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'shell';
}
