import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
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
              private router: Router) {
    this.model = {
      login: '',
      password: ''
    };
    if (!!this.sessionService.Token) {
      this.router.navigate(['/']);
    }
  }

  private isPasswordVisible: boolean = false;

  ngOnInit() {
  }

  onSubmit() {
    this.error = null;
    this.loading = true;

    this.sessionService.login(this.model.login, this.model.password).subscribe(result => {
      if (result) {
        this.router.navigate(['/']);
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