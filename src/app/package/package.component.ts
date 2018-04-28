import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlContainer, NgForm, FormControl } from '@angular/forms';
import { GssRequestService } from '../gss-request.service';
import { RatesRequest } from '../rates-request';
import { Package } from '../package';
import { Available } from '../available';
import { PACKAGE_OPTIONS } from '../package-options';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;
  @Output() goClicked = new EventEmitter<any>();

  loaderpath = environment.assets_dir + 'ajax-loader.gif';
  packageOptions = PACKAGE_OPTIONS;
  // selectedOption = Package;
  customRate = 0.0;
  customWidth: number;
  customLength: number;
  customHeight: number;
  customWeight: number;

  isCustomLoading: boolean;
  customAvailable: any;
  customErrorResponse: any;
  isNoCustomAvails: boolean;

  /*
  a2Rate: number;
  a3Rate: number;
  a4Rate: number;
  a5Rate: number;
  isA2Loading: boolean;
  isA3Loading: boolean;
  isA4Loading: boolean;
  isA5Loading: boolean;
  a2Available: any;
  a3Available: any;
  a4Available: any;
  a5Available: any;
  isNoA2Avail: boolean;
  isNoA3Avail: boolean;
  isNoA4Avail: boolean;
  isNoA5Avail: boolean;
  */
  available: any;
  isAvailLoading: boolean[];

  constructor(
    private gssRequestService: GssRequestService,
  ) { }

  ngOnInit() {
    this.isCustomLoading = false;
    this.isNoCustomAvails = false;
    this.available = {};
    this.available.Available = [];
    /*
    this.getA2Avail();
    this.getA3Avail();
    this.getA4Avail();
    this.getA5Avail();
    */
    this.isAvailLoading = [];
    this.packageOptions.forEach((value, index) => {
      this.isAvailLoading[index] = false;
    });
  }

  /*
  getA2Avail() {
    this.a2Rate = 0.0;
    this.isA2Loading = true;
    this.a2Available = {};
    this.a2Available.Available = [];

    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    // create Packages
    toGo.Packages = [];

    const a2Pkg = new Package();
    a2Pkg.Id = 0;
    a2Pkg.Length = 45;
    a2Pkg.Width = 45;
    a2Pkg.Height = 5;
    a2Pkg.Name = 'GSS-A2 SATCHEL';
    a2Pkg.Kg = 2;
    a2Pkg.PackageCode = 'A2';
    a2Pkg.Type = 'Box';
    toGo.Packages.push(a2Pkg);

    this.gssRequestService.getAvails(toGo)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.a2Available = avails;
          if (this.a2Available.Available.length === 0) {
            this.isNoA2Avail = true;
            setTimeout(() => {
              this.isNoA2Avail = false;
            }, 3000);
          } else {
            // TODO
            this.a2Rate = this.a2Available.Available[0].Cost + environment.return_charge;
          }
        },
        err => {
          this.isNoA2Avail = true;
          setTimeout(() => {
            this.isNoA2Avail = false;
          }, 3000);
        },
        () => {
          this.isA2Loading = false;
        }
      );
  }

  getA3Avail() {
    this.a3Rate = 0.0;
    this.isA3Loading = true;
    this.a3Available = {};
    this.a3Available.Available = [];

    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    // create Packages
    toGo.Packages = [];

    const a3Pkg = new Package();
    a3Pkg.Id = 0;
    a3Pkg.Length = 36;
    a3Pkg.Width = 41;
    a3Pkg.Height = 4;
    a3Pkg.Name = 'GSS-A3 SATCHEL';
    a3Pkg.Kg = 2;
    a3Pkg.PackageCode = 'A3';
    a3Pkg.Type = 'Box';
    toGo.Packages.push(a3Pkg);

    this.gssRequestService.getAvails(toGo)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.a3Available = avails;
          if (this.a3Available.Available.length === 0) {
            this.isNoA3Avail = true;
            setTimeout(() => {
              this.isNoA3Avail = false;
            }, 3000);
          } else {
            // TODO
            this.a3Rate = this.a3Available.Available[0].Cost + environment.return_charge;
          }
        },
        err => {
          this.isNoA3Avail = true;
          setTimeout(() => {
            this.isNoA3Avail = false;
          }, 3000);
        },
        () => {
          this.isA3Loading = false;
        }
      );
  }

  getA4Avail() {
    this.a4Rate = 0.0;
    this.isA4Loading = true;
    this.a4Available = {};
    this.a4Available.Available = [];

    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    // create Packages
    toGo.Packages = [];

    const a4Pkg = new Package();
    a4Pkg.Id = 0;
    a4Pkg.Length = 28;
    a4Pkg.Width = 39;
    a4Pkg.Height = 2;
    a4Pkg.Name = 'GSS-A4 SATCHEL';
    a4Pkg.Kg = 2;
    a4Pkg.PackageCode = 'A4';
    a4Pkg.Type = 'Box';
    toGo.Packages.push(a4Pkg);

    this.gssRequestService.getAvails(toGo)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.a4Available = avails;
          if (this.a4Available.Available.length === 0) {
            this.isNoA4Avail = true;
            setTimeout(() => {
              this.isNoA4Avail = false;
            }, 3000);
          } else {
            // TODO
            this.a4Rate = this.a4Available.Available[0].Cost + environment.return_charge;
          }
        },
        err => {
          this.isNoA4Avail = true;
          setTimeout(() => {
            this.isNoA4Avail = false;
          }, 3000);
        },
        () => {
          this.isA4Loading = false;
        }
      );
  }

  getA5Avail() {
    this.a5Rate = 0.0;
    this.isA5Loading = true;
    this.a5Available = {};
    this.a5Available.Available = [];

    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    // create Packages
    toGo.Packages = [];

    const a5Pkg = new Package();
    a5Pkg.Id = 0;
    a5Pkg.Length = 21;
    a5Pkg.Width = 26;
    a5Pkg.Height = 2;
    a5Pkg.Name = 'GSS-A5 SATCHEL';
    a5Pkg.Kg = 2;
    a5Pkg.PackageCode = 'A5';
    a5Pkg.Type = 'Box';
    toGo.Packages.push(a5Pkg);

    this.gssRequestService.getAvails(toGo)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.a5Available = avails;
          if (this.a5Available.Available.length === 0) {
            this.isNoA5Avail = true;
            setTimeout(() => {
              this.isNoA5Avail = false;
            }, 3000);
          } else {
            // TODO
            this.a5Rate = this.a5Available.Available[0].Cost + environment.return_charge;
          }
        },
        err => {
          this.isNoA5Avail = true;
          setTimeout(() => {
            this.isNoA5Avail = false;
          }, 3000);
        },
        () => {
          this.isA5Loading = false;
        }
      );
  }
  */

  getCustomAvail() {
    this.customRate = 0.0;
    this.isCustomLoading = true;
    this.customErrorResponse = null;
    this.customAvailable = {};
    this.customAvailable.Available = [];

    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    // create Packages
    toGo.Packages = [];

    const customPkg = new Package();
    customPkg.Id = 0;
    customPkg.Length = this.customLength;
    customPkg.Width = this.customWidth;
    customPkg.Height = this.customHeight;
    customPkg.Name = 'custom';
    customPkg.Kg = this.customWeight;
    customPkg.PackageCode = '';
    customPkg.Type = 'Box';
    toGo.Packages.push(customPkg);

    this.gssRequestService.getAvails(toGo)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.customAvailable = avails;
          if (this.customAvailable.Available.length === 0) {
            this.isNoCustomAvails = true;
            setTimeout(() => {
              this.isNoCustomAvails = false;
            }, 3000);
          } else {
            // TODO
            this.customRate = this.customAvailable.Available[0].Cost + environment.return_charge;
          }
        },
        err => {
          this.customErrorResponse = err;
          this.isNoCustomAvails = true;
          setTimeout(() => {
            this.isNoCustomAvails = false;
          }, 3000);
        },
        () => {
          this.isCustomLoading = false;
        }
      );
  }

  /*
  public goWithA2(isEmail: boolean = true) {
    // create Packages
    this.ratesRequest.Packages = [];

    const a2Pkg = new Package();
    a2Pkg.Id = 0;
    a2Pkg.Length = 45;
    a2Pkg.Width = 45;
    a2Pkg.Height = 5;
    a2Pkg.Name = 'GSS-A2 SATCHEL';
    a2Pkg.Kg = 2;
    a2Pkg.PackageCode = 'A2';
    a2Pkg.Type = 'Box';

    this.ratesRequest.Packages.push(a2Pkg);

    this.a2Available.Available[0].IsEmail = isEmail;
    this.a2Available.Available[0].Cost = this.a2Rate;
    this.goClicked.emit(this.a2Available.Available[0]);
  }

  public goWithA3(isEmail: boolean = true) {
    // create Packages
    this.ratesRequest.Packages = [];

    const a3Pkg = new Package();
    a3Pkg.Id = 0;
    a3Pkg.Length = 36;
    a3Pkg.Width = 41;
    a3Pkg.Height = 4;
    a3Pkg.Name = 'GSS-A3 SATCHEL';
    a3Pkg.Kg = 2;
    a3Pkg.PackageCode = 'A3';
    a3Pkg.Type = 'Box';

    this.ratesRequest.Packages.push(a3Pkg);

    this.a3Available.Available[0].IsEmail = isEmail;
    this.a3Available.Available[0].Cost = this.a3Rate;
    this.goClicked.emit(this.a3Available.Available[0]);
  }

  public goWithA4(isEmail: boolean = true) {
    // create Packages
    this.ratesRequest.Packages = [];

    const a4Pkg = new Package();
    a4Pkg.Id = 0;
    a4Pkg.Length = 28;
    a4Pkg.Width = 39;
    a4Pkg.Height = 2;
    a4Pkg.Name = 'GSS-A4 SATCHEL';
    a4Pkg.Kg = 2;
    a4Pkg.PackageCode = 'A4';
    a4Pkg.Type = 'Box';

    this.ratesRequest.Packages.push(a4Pkg);

    this.a4Available.Available[0].IsEmail = isEmail;
    this.a4Available.Available[0].Cost = this.a4Rate;
    this.goClicked.emit(this.a4Available.Available[0]);
  }

  public goWithA5(isEmail: boolean = true) {
    // create Packages
    this.ratesRequest.Packages = [];

    const a5Pkg = new Package();
    a5Pkg.Id = 0;
    a5Pkg.Length = 21;
    a5Pkg.Width = 26;
    a5Pkg.Height = 2;
    a5Pkg.Name = 'GSS-A5 SATCHEL';
    a5Pkg.Kg = 2;
    a5Pkg.PackageCode = 'A5';
    a5Pkg.Type = 'Box';

    this.ratesRequest.Packages.push(a5Pkg);

    this.a5Available.Available[0].IsEmail = isEmail;
    this.a5Available.Available[0].Cost = this.a5Rate;
    this.goClicked.emit(this.a5Available.Available[0]);
  }
  */

  public goWithCustom(isEmail: boolean = true) {
    // create Packages
    this.ratesRequest.Packages = [];

    const customPkg = new Package();
    customPkg.Id = 0;
    customPkg.Length = this.customLength;
    customPkg.Width = this.customWidth;
    customPkg.Height = this.customHeight;
    customPkg.Name = 'custom';
    customPkg.Kg = this.customWeight;
    customPkg.PackageCode = '';
    customPkg.Type = 'Box';

    this.ratesRequest.Packages.push(customPkg);

    this.customAvailable.Available[0].IsEmail = isEmail;
    this.customAvailable.Available[0].Cost = this.customRate;
    this.goClicked.emit(this.customAvailable.Available[0]);
  }

  public goWithIt(idx: number) {
    this.setAvailLoading(idx);
    // create Packages
    this.ratesRequest.Packages = [];

    const pkg = new Package();

    pkg.Id = 0;
    pkg.Length = PACKAGE_OPTIONS[idx].Length;
    pkg.Width = PACKAGE_OPTIONS[idx].Width;
    pkg.Height = PACKAGE_OPTIONS[idx].Height;
    pkg.Name = PACKAGE_OPTIONS[idx].Name;
    pkg.Kg = PACKAGE_OPTIONS[idx].Kg;
    pkg.PackageCode = PACKAGE_OPTIONS[idx].PackageCode;
    pkg.Type = 'Box';

    this.ratesRequest.Packages.push(pkg);

    ///
    // copy existing ratesRequest
    const toGo = Object.assign({}, this.ratesRequest);

    this.gssRequestService.getAvails(this.ratesRequest)
      .map(data => {
        data.Available.sort((a, b) => {
          return a.Cost - b.Cost; // lowest cost first
        });
        return data;
      })
      .subscribe(
        avails => {
          this.available = avails;
          this.available.Available[0].IsEmail = false;
          this.available.Available[0].Cost = PACKAGE_OPTIONS[idx].Price;

          // console.log(this.available.Available[0]);
          this.goClicked.emit(this.available.Available[0]);
        },
        err => {
          // TODO error
          alert('error occurred.');
        },
        () => {
        }
      );

  }

  public setAvailLoading(idx: number) {
    this.isAvailLoading[idx] = true;
  }
}
