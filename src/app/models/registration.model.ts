export class RegistrationModel {
  public static FromJson(json: any) {
    return new RegistrationModel(
      json['login'],
      json['name'],
      json['password'],
      json['password_confirmation'],
      json['email']
    );
  }

  public constructor(public firstName: string = '',
                     public lastName: string = '',
                     public login: string = '',
                     public email: string = '',
                     public phone: string = '',
                     public password: string = '',
                     public passwordConfirmation: string = '') {
  }


  public toJson(): any {
    const obj: any = {
      login: this.login,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      password: this.password
    };

    return obj;
  }
}
