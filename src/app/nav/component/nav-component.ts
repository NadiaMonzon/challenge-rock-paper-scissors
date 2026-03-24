import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav-component.html',
  imports: [RouterLink, RouterOutlet],
})
export class NavComponent {}
