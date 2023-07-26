import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalPipe implements PipeTransform {

  transform(value: number): string {

    if(value == undefined) return "";

    const hasDecimal = value % 1 !== 0;
    if(!hasDecimal){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }else{
      return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

}
