import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: []
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

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
