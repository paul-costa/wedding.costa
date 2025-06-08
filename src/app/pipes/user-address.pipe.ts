import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../constants/firebase/fire-store.types';
import { CountryCodeNameMap } from '../constants/general.constants';

export type AdditionalInfoType = Address;

@Pipe({
  name: 'UserAddress',
})
export class UserAddressPipe implements PipeTransform {
  transform(value: AdditionalInfoType): string {
    if (instanceOfAddress(value)) {
      return `${value.title}\n${value.streetName} ${value.streetNumber}\n${value.zip} ${value.city}\n${CountryCodeNameMap[value.countryCode]}`;
    }
  }
}

function instanceOfAddress(object: AdditionalInfoType): object is Address {
  return (
    'title' in object &&
    'streetName' in object &&
    'streetNumber' in object &&
    'zip' in object &&
    'city' in object &&
    'countryCode' in object
  );
}
