import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../services/theme.service';
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [ThemeService]
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit() {}

  toggleDarkMode() {
    this.themeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }
  
  search() {
    const textInput: HTMLInputElement = document.getElementById("searchText") as HTMLInputElement;
    const searchText: string = textInput.value.replace('\\', ' ').replace('/', ' ');
    textInput.value = '';

    this.router.navigate(['story-search/6/0/' + encodeURIComponent(searchText)]);
    this.triggerNavbarTogglerClick();
  }

  triggerNavbarTogglerClick() {
    if (window.getComputedStyle(document.getElementsByClassName("navbar-toggler")[0] as HTMLElement).display == 'block')
      (document.getElementsByClassName("navbar-toggler")[0] as HTMLElement).click();
  }

  enterDown(event: KeyboardEvent) {
    if(event.key === "Enter") {
      this.search();
    }
  }
}
