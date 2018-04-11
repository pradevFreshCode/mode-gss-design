import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  logopath = environment.assets_dir + 'logo_returnit.png';
  steps = ['sender details', 'recipient details', 'package size', 'payment', 'book pickup'];
  current_step = 0;
}
