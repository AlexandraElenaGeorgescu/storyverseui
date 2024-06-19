import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ThemeService]
})
export class AppComponent implements OnInit {
  title = 'storyverse';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.applyTheme();
  }
}

