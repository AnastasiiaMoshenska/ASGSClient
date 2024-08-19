import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'accsoft-layout-schematic';
}
