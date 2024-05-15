import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-route-not-found',
    templateUrl: './route-not-found.component.html',
    styleUrls: ['./route-not-found.component.css']
})
export class RouteNotFoundComponent implements OnInit {

    constructor(private titleService: Title) {
        this.titleService.setTitle('Pagina nu a fost găsită');
    }

    ngOnInit() { }

}
