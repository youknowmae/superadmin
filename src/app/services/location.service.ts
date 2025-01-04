import { Injectable } from '@angular/core';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private ds: DataService,
  ) { }

  async getRegions() {
    const response = await this.ds.fetchAssets('location/refregion.json').toPromise();
    return response.RECORDS; 
  }
  
  async getProvinces(regCode: string) {
    const province = await this.ds.fetchAssets('location/refprovince.json').toPromise();
    return province.RECORDS.filter((data: any) => data.regCode === regCode)
  }

  async getMunicipalities(provCode: string) {
    const province = await this.ds.fetchAssets('location/refcitymun.json').toPromise();
    return province.RECORDS.filter((data: any) => data.provCode === provCode)
  }
  
  async getBarangays(citymunCode: string) {
    const barangays = await this.ds.fetchAssets('location/refbrgy.json').toPromise();
    return barangays.RECORDS.filter((data: any) => data.citymunCode === citymunCode)
  }
}
