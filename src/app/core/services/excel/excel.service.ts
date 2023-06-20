import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

@Injectable() export class ExcelService {

  constructor() { }

  public exportPreliminarSinestrosSOAT (correctos: any[], errores: any[], excelFileName: string): void {
    var workbook = XLSX.utils.book_new();
    var wsCorrectos = XLSX.utils.json_to_sheet(correctos);
    XLSX.utils.book_append_sheet(workbook, wsCorrectos, "CORRECTOS");
    var wsErrores = XLSX.utils.json_to_sheet(errores);
    XLSX.utils.book_append_sheet(workbook, wsErrores, "ERRORES");
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, excelFileName + EXCEL_EXTENSION);
  }
  
}