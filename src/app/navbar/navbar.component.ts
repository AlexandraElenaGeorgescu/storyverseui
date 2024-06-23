import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ThemeService } from '../services/theme.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [ThemeService, FormBuilder]
})
export class NavbarComponent implements OnInit {
  isDarkMode = false;
  formSearch;

  constructor(private router: Router, private themeService: ThemeService, private formBuilder: FormBuilder) {
    this.formSearch = this.formBuilder.group({
      searchText: new FormControl('')
    });
  }

  ngOnInit() {}

  toggleDarkMode() {
    this.themeService.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }
  
  search() {
    let valueSearch = this.formSearch.controls["searchText"].value;
    const textInput = valueSearch==null ? "" : valueSearch;
    console.log(textInput);
    textInput.replace('\\', ' ').replace('/', ' ');
    console.log(textInput);

    this.router.navigate(['story-search/6/0/' + encodeURIComponent(textInput)]);
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
