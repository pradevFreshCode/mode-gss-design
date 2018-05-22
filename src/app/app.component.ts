import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {UsersService} from './modules/data-services/services/usersService';
import {SessionService} from './services/session.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private router: Router, private titleService: Title, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        let deepestAvailableTitle = null;

        while (route.firstChild
        && route.firstChild.routeConfig
        && route.firstChild.routeConfig.data
        && route.firstChild.routeConfig.data.title) {
          deepestAvailableTitle = route.firstChild.routeConfig.data.title;
          route = route.firstChild;
        }
        return deepestAvailableTitle;
      }))
      .subscribe((deepestAvailableTitle) => {
        if (deepestAvailableTitle) {
          this.titleService.setTitle(deepestAvailableTitle);
        } else {
          this.titleService.setTitle(null);
        }
      });
  }

}
