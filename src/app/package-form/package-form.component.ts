import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import * as $ from 'jquery';
import { RatesRequest } from '../rates-request';
import { Package } from '../package';

@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})

export class PackageFormComponent implements OnInit {
  @Input() ratesRequest: RatesRequest;

  selStockNew: string;
  unitNew: number;
  lengthNew?: number;
  widthNew?: number;
  heightNew?: number;
  kgNew?: number;
  totalKg = 0;
  totalCubic = 0;
  totalUnit = 0;
  unitsPerStock: number[] = [];

  constructor() { }

  ngOnInit() {
    this.selStockNew = 'custom';
    this.unitNew = 1;
  }

  public deleteStockRow(index: number) {
    // alert(index);
    this.ratesRequest.Packages.splice(index, 1);
    this.updateTotals();
  }

  public onPkgTypeChange(index?: number) {
    if (index === undefined) {
      // new
      if (this.selStockNew === 'GSS-A2 SATCHEL') {
        const newPackage = new Package();
        newPackage.Id = 0;
        newPackage.Unit = 1;
        newPackage.Length = 45;
        newPackage.Width = 45;
        newPackage.Height = 5;
        newPackage.Kg = 5;
        newPackage.Name = 'GSS-A2 SATCHEL';
        newPackage.PackageCode = 'A2';
        newPackage.Type = 'Box';
        this.ratesRequest.Packages.push(newPackage);

      } else if (this.selStockNew === 'GSS-A3 SATCHEL') {
        const newPackage = new Package();
        newPackage.Id = 0;
        newPackage.Unit = 1;
        newPackage.Length = 36;
        newPackage.Width = 41;
        newPackage.Height = 4;
        newPackage.Kg = 4;
        newPackage.Name = 'GSS-A3 SATCHEL';
        newPackage.PackageCode = 'A3';
        newPackage.Type = 'Box';
        this.ratesRequest.Packages.push(newPackage);

      } else if (this.selStockNew === 'GSS-A4 SATCHEL') {
        const newPackage = new Package();
        newPackage.Id = 0;
        newPackage.Unit = 1;
        newPackage.Length = 28;
        newPackage.Width = 39;
        newPackage.Height = 2;
        newPackage.Kg = 2;
        newPackage.Name = 'GSS-A4 SATCHEL';
        newPackage.PackageCode = 'A4';
        newPackage.Type = 'Box';
        this.ratesRequest.Packages.push(newPackage);

      } else if (this.selStockNew === 'GSS-DLE SATCHEL') {
        const newPackage = new Package();
        newPackage.Id = 0;
        newPackage.Unit = 1;
        newPackage.Length = 15;
        newPackage.Width = 26;
        newPackage.Height = 2;
        newPackage.Kg = 1;
        newPackage.Name = 'GSS-DLE SATCHEL';
        newPackage.PackageCode = 'DLE';
        newPackage.Type = 'Box';
        this.ratesRequest.Packages.push(newPackage);

      } else if (this.selStockNew === 'GSS-A5 SATCHEL') {
        const newPackage = new Package();
        newPackage.Id = 0;
        newPackage.Unit = 1;
        newPackage.Length = 21;
        newPackage.Width = 26;
        newPackage.Height = 2;
        newPackage.Kg = 2;
        newPackage.Name = 'GSS-A5 SATCHEL';
        newPackage.PackageCode = 'A5';
        newPackage.Type = 'Box';
        this.ratesRequest.Packages.push(newPackage);
      } else { // custom

      }

      // update elements
      this.selStockNew = 'custom';
      $('#sel_stock_new option:eq(0)').prop('selected', true);
      this.unitNew = 1;

    } else {
      // existing
      // get the Package
      const thePackage = this.ratesRequest.Packages[index];
      if (thePackage.Name === 'custom') {
        thePackage.PackageCode = '';

      } else if (thePackage.Name === 'GSS-A2 SATCHEL') {
        thePackage.Length = 45;
        thePackage.Width = 45;
        thePackage.Height = 5;
        thePackage.Kg = 5;
        thePackage.Name = 'GSS-A2 SATCHEL';
        thePackage.PackageCode = 'A2';
        thePackage.Type = 'Box';

      } else if (thePackage.Name === 'GSS-A3 SATCHEL') {
        thePackage.Length = 36;
        thePackage.Width = 41;
        thePackage.Height = 4;
        thePackage.Kg = 4;
        thePackage.Name = 'GSS-A3 SATCHEL';
        thePackage.PackageCode = 'A3';
        thePackage.Type = 'Box';

      } else if (thePackage.Name === 'GSS-A4 SATCHEL') {
        thePackage.Length = 28;
        thePackage.Width = 39;
        thePackage.Height = 2;
        thePackage.Kg = 2;
        thePackage.Name = 'GSS-A4 SATCHEL';
        thePackage.PackageCode = 'A4';
        thePackage.Type = 'Box';

      } else if (thePackage.Name === 'GSS-DLE SATCHEL') {
        thePackage.Length = 15;
        thePackage.Width = 26;
        thePackage.Height = 2;
        thePackage.Kg = 1;
        thePackage.Name = 'GSS-DLE SATCHEL';
        thePackage.PackageCode = 'DLE';
        thePackage.Type = 'Box';

      } else if (thePackage.Name === 'GSS-A5 SATCHEL') {
        thePackage.Length = 21;
        thePackage.Width = 26;
        thePackage.Height = 2;
        thePackage.Kg = 2;
        thePackage.Name = 'GSS-A5 SATCHEL';
        thePackage.PackageCode = 'A5';
        thePackage.Type = 'Box';
      }
    }

    this.updateTotals();
  }

  public updateTotals() {
    // update totals
    this.totalKg = 0;
    this.totalCubic = 0;
    this.totalUnit = 0;

    this.ratesRequest.Packages.forEach(item => {
      this.totalKg += item.Kg;
    });
    this.ratesRequest.Packages.forEach(item => {
      this.totalCubic += (item.Length * item.Width * item.Height / 1000000);
    });
    this.ratesRequest.Packages.forEach(item => {
      this.totalUnit += item.Unit;
    });
  }

  public checkNew() {
    if (this.unitNew !== undefined && this.lengthNew !== undefined && this.widthNew !== undefined && this.heightNew !== undefined) {
      if (this.unitNew > 0 && this.lengthNew > 0 && this.widthNew > 0 && this.heightNew > 0) {
        // add new custom
        const newPackage = new Package();
        newPackage.Id = 0;
        newPackage.Unit = this.unitNew;
        newPackage.Length = this.lengthNew;
        newPackage.Width = this.widthNew;
        newPackage.Height = this.heightNew;
        newPackage.Kg = this.kgNew || null;
        newPackage.Name = 'custom';
        newPackage.PackageCode = '';
        newPackage.Type = 'Box';
        this.ratesRequest.Packages.push(newPackage);

        // reset values
        this.unitNew = 1;
        this.lengthNew = undefined;
        this.widthNew = undefined;
        this.heightNew = undefined;

        this.updateTotals();
        $('input[id^="kg_"]').each((i, v) => {
          // console.log(v);
        });
      }
    }
  }
}
