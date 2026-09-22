import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  enableProdMode,
  provideZoneChangeDetection,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import { DxDataGridModule } from 'devextreme-angular';
import { CustomStore, DataSource } from 'devextreme-angular/common/data';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    DxDataGridModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppComponent {
  dataSource: DataSource | undefined;

  connectionStarted: boolean;

  constructor() {
    this.connectionStarted = false;

    const hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    const store = new CustomStore({
      load: () => hubConnection.invoke('getAllStocks'),
      key: 'symbol',
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data: Record<string, unknown>) => {
          store.push([{ type: 'update', key: data.symbol, data }]);
        });
        this.dataSource = new DataSource({ store });
        this.connectionStarted = true;
      });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
