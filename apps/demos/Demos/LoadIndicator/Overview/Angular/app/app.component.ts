import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection, signal } from '@angular/core';
import { DxButtonModule, DxLoadIndicatorModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxButtonModule,
    DxLoadIndicatorModule,
  ],
})
export class AppComponent {
  loadIndicatorVisible = signal(false);

  buttonText = 'Send';

  onClick() {
    this.buttonText = 'Sending';
    this.loadIndicatorVisible.set(true);

    setTimeout(() => {
      this.buttonText = 'Send';
      this.loadIndicatorVisible.set(false);
    }, 2000);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
