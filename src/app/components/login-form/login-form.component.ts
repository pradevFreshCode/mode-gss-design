import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {UserModel} from '../../modules/data-services/models/User.model';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html'
})
export class LoginFormComponent implements OnInit, AfterViewInit {
  model: any;

  error: string;

  loading: boolean;
  @Input() showAdditionalLinks: boolean = true;
  @Input() submitButtonDisabled: boolean = false;
  @ViewChild('loginInput') loginInput: ElementRef;

  @Output() loginApiRespondedSuccess = new EventEmitter<UserModel>();
  @Output() loginApiRespondedError = new EventEmitter<any>();
  @Output() loadingStateChanged = new EventEmitter<boolean>();

  constructor(private sessionService: SessionService) {
    this.model = {
      login: '',
      password: ''
    };
  }

  ngOnInit() {
    this.loadingStateChanged.subscribe(newState => {
      this.loading = newState;
    });
  }

  onSubmit() {
    this.error = null;
    this.loadingStateChanged.emit(true)

    this.sessionService.login(this.model.login, this.model.password).subscribe(result => {
      this.loginApiRespondedSuccess.emit(result);
      this.loadingStateChanged.emit(false);
      if (!result) {
        this.error = 'Authentication failed';
      }
    }, err => {
      this.loginApiRespondedError.emit(err);
      this.loadingStateChanged.emit(false);
      this.error = 'Authentication failed';
    });
  }

  ngAfterViewInit(): void {
    if (this.loginInput) {
      this.loginInput.nativeElement.focus();
    }
  }
}
