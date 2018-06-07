import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SessionService} from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {
  model: any;

  error: string;

  loading: boolean;
  @ViewChild('loginInput') loginInput: ElementRef;

  constructor(private sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute) {
    this.model = {
      login: '',
      password: ''
    };
    if (!!this.sessionService.Token) {
      this.router.navigate(['/']);
    }

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['closeAfterSignIn']) {
        this.sessionService.CloseTabAfterSignIn = queryParams['closeAfterSignIn'];
      }
    });
  }

  private isPasswordVisible: boolean = false;

  ngOnInit() {
  }

  onSubmit() {
    this.error = null;
    this.loading = true;

    this.sessionService.login(this.model.login, this.model.password).subscribe(result => {
      if (result) {
        if (this.sessionService.CloseTabAfterSignIn) {
          window.close();
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.error = 'Authentication failed';
        this.loading = false;
      }
    }, err => {
      this.error = 'Authentication failed';
      this.loading = false;
    });
  }


  getPasswordInputType() {
    return this.isPasswordVisible ? 'text' : 'password';
  }

  ngAfterViewInit(): void {
    if (this.loginInput) {
      this.loginInput.nativeElement.focus();
    }
  }
}
