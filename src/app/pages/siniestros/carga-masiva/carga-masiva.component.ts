/*************************************************************************************************/
/*  NOMBRE              :   SINIESTROS.COMPONENT.TS                                              */
/*  DESCRIPCIÓN         :   BROKER COMPONENTS                                                    */
/*  AUTOR               :   MATERIA GRIS - DIEGO ARMANDO GONZALES CHOCANO                        */
/*  FECHA               :   04-05-2023                                                           */
/*  VERSIÓN             :   1.0 - CARGAS MASIVAS SINIESTROS                                      */
/*************************************************************************************************/

import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CargaMasivaService } from 'src/app/core/services/carga-masiva/carga-masiva.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export interface ListApertura {
  LIST?: any;
  P_CTIPMOV_SOAT?: any;
  P_TYPE_LOAD?: any;
}

export interface ListCabecera {
  P_NREPORTE?: any;
}

export interface ListErrores {
  P_CAUX_SOAT_OPE?: string;
  P_NID_SOAT_OPE?: number;
}

export interface ReportePreliminar {
  P_CAUX_SOAT_OPE?: string;
}

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})

export class CargaMasivaComponent implements OnInit {

  ListApertura: ListApertura;
  ListCabecera: ListCabecera;
  ListErrores: ListErrores;
  ReportePreliminar: ReportePreliminar;

  isLoading: boolean = false;
  apertura: boolean = true;
  reserva: boolean = false;
  liquidacion: boolean = false;
  reporte_prel: boolean = true;
  definitivo: boolean = true;
  preliminar: boolean = true;

  carga: number = 1;
  codigo: number = 1;
  trama: string = 'O';
  archivoNombre: string = null;
  numero_siniestro: string = null;
  caux_soat_ope: string = null;

  data: any = [];
  dataSet: any = [];
  cabeceraData: any = [];
  cabeceraDataName: any = [];
  primeraColumna: any = [];
  correctos: any = [];
  errores: any = [];

  itemChecks: any = {};
  itemChecksSend: any[] = [];
  booleanSelect: boolean = false;
  booleanDisabled: boolean = true;
  
  listResults: any = [];
  listToShow: any = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  maxSize = 10;
  
  listResultsError: any = [];
  listToShowError: any = [];
  currentPageError = 1;
  itemsPerPageError = 5;
  totalItemsError = 0;
  maxSizeError = 10;

  constructor(
    private modalService: NgbModal,
    private CargaMasivaService: CargaMasivaService
  ) { }

  ngOnInit(): void { }

  pageChanged = (currentPage) => {
    this.currentPage = currentPage;
    this.listToShow = this.listResults.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onFileChange = (evt: any) => {
    this.archivoNombre = null;
    this.preliminar = true;
    if (this.apertura == true || this.reserva == true || this.liquidacion == true) {
      const target: DataTransfer = <DataTransfer>(evt.target);
      var name = target.files[0].name;
      if (
        (name.toLowerCase().includes("apertura") && this.apertura !== true) ||
        (name.toLowerCase().includes("reserva") && this.reserva !== true) ||
        (name.toLowerCase().includes("liquidacion") && this.liquidacion !== true)
      ) {
        Swal.fire(
          {
            title: '¿Está seguro de cargar el archivo?',
            text: 'El nombre del archivo no corresponde con el tipo de trama seleccionado. ¿Desea proceder?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            allowOutsideClick: false,
            cancelButtonText: 'No',
          }
        ).then(
          (res) => {
            if (res.value) {
              this.archivoNombre = target.files[0].name;
              this.preliminar = false;
              const reader: FileReader = new FileReader();
              reader.onload = (e: any) => {
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
                this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
                this.dataSet = this.data;
              };
              reader.readAsBinaryString(target.files[0]);
            }
            else if (res.dismiss === Swal.DismissReason.cancel) {
              this.archivoNombre = null;
              this.preliminar = true;
              return;
            }
          }
        )
      } else {
        this.archivoNombre = target.files[0].name;
        this.preliminar = false;
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
          this.dataSet = this.data;
        };
        reader.readAsBinaryString(target.files[0]);
      }
    } else {
      this.archivoNombre = null;
      this.preliminar = true;
      Swal.fire('Información', 'Seleccione el tipo de trama.', 'error');
    }
  }

  mostrarModalErrores = (content: any, item) => {
    if (item.SDET_ERROR) {
      this.ListErrores = {};
      this.ListErrores.P_CAUX_SOAT_OPE = item.CAUX_SOAT_OPE;
      this.ListErrores.P_NID_SOAT_OPE = item.NID_SOAT_OPE;
      this.numero_siniestro = item.SNRO_SINIESTRO;
      this.listarErrores(this.ListErrores);
      this.modalService.open(content, { backdrop: 'static', size: 'lg', keyboard: false, centered: true });
    } else { return }
  }

  listarErrores = (item) => {
    this.CargaMasivaService.ListarErroresApertura(item).subscribe(
      res => {
        this.currentPageError = 1;
        this.listResultsError = res.Result.P_TABLE;
        this.totalItemsError = this.listResultsError.length;
        this.listToShowError = this.listResultsError.slice(
          (this.currentPageError - 1) * this.itemsPerPageError,
          this.currentPageError * this.itemsPerPageError
        );
      },
      err => { Swal.fire('Información', 'Ha ocurrido un error al obtener los errores.', 'error'); }
    )
  }

  pageChangedError = (currentPageError) => {
    this.currentPageError = currentPageError;
    this.listToShowError = this.listResultsError.slice(
      (this.currentPageError - 1) * this.itemsPerPageError,
      this.currentPageError * this.itemsPerPageError
    );
  }

  checkAll = () => {
    for (var i = 0; i < this.listResults.length; i++) {
      //if (!this.listResults[i].SDET_ERROR) {
        this.listResults[i].IS_SELECTED = this.booleanSelect;
      //}
    }
    this.getCheckedList();
  }

  checkItem = () => {
    this.booleanSelect = this.listResults.every(
      function (item: any) {
        return item.IS_SELECTED == true;
      }
    )
    this.getCheckedList();
  }

  getCheckedList = () => {
    this.itemChecks = [];
    this.itemChecksSend = [];
    for (var i = 0; i < this.listResults.length; i++) {
      if (this.listResults[i].IS_SELECTED) {
        this.itemChecks.push(this.listResults[i]);
      }
    }
    this.itemChecksSend.push(this.itemChecks);
    if (this.itemChecks.length > 0) {
      this.definitivo = false;
    } else {
      this.definitivo = true;
    }
  }

  onLimpiar = () => {
    this.archivoNombre = null;
    this.data = null;
    this.dataSet = null;
    this.listToShow = null;
    this.carga = 1;
    this.reporte_prel = true;
    this.definitivo = true;
    this.preliminar = true;
  }

  onDefinitivo = () => {
    Swal.fire('Información', 'Ola q ase.', 'info');
  }

  descargarReportePreliminar = () => {
    this.ReportePreliminar = {};
    this.ReportePreliminar.P_CAUX_SOAT_OPE = this.caux_soat_ope;
    this.CargaMasivaService.ProcessReportePreliminarSiniestrosSOAT(this.ReportePreliminar).subscribe(
      res => {
        let _data = res;
        if (_data.response == 0) {
          if (_data.Data != null) {
            const file = new File([this.obtenerBlobFromBase64(_data.Data, '')], 'Reporte_Preliminar_Siniestros_SOAT_' + this.ReportePreliminar.P_CAUX_SOAT_OPE + '.xlsx', { type: 'text/xls' });
            FileSaver.saveAs(file);
          }
        }
        else {
          Swal.fire({
            title: 'Información',
            text: _data.Data,
            icon: 'info',
            confirmButtonText: 'Continuar',
            allowOutsideClick: false
          })
        }
      }
    )
  }

  onPreliminar = () => {
    this.isLoading = true;
    this.ListCabecera = {};
    this.ListCabecera.P_NREPORTE = this.codigo;
    if (this.codigo == 1) {
      this.CargaMasivaService.ListarCabeceraData(this.ListCabecera).subscribe(
        res => {
          this.cabeceraData = res.Result.P_TABLE;
          this.ListApertura = {};
          this.ListApertura.LIST = [];
          this.ListApertura.P_CTIPMOV_SOAT = this.trama;
          this.ListApertura.P_TYPE_LOAD = this.carga;
          this.cabeceraDataName = [];
          for (var i = 0; i < this.cabeceraData.length; i++) {
            this.cabeceraDataName.push(this.cabeceraData[i].SFIELDNAME);
          }
          this.primeraColumna = this.dataSet[0];
          if (this.cabeceraDataName.length != this.primeraColumna.length) {
            Swal.fire('Información', 'El número de columnas no coincide.', 'warning');
            this.isLoading = false;
            return;
          } else {
            for (var i = 0; i < this.cabeceraDataName.length; i++) {
              if (this.cabeceraDataName[i].trim() != this.primeraColumna[i].trim()) {
                Swal.fire('Información', 'Los nombres de la cabecera no coinciden.', 'warning');
                this.isLoading = false;
                return;
              }
            }
            if (this.dataSet.length > 1) {
              for (var i = 1; i < this.dataSet.length; i++) {
                var item: any = {};
                item.NUMERO_FILA = i + 1;
                item.FECHA_SINIESTRO = this.dataSet[i][0]?.trim();
                item.HORA_SINIESTRO = this.dataSet[i][1]?.trim();
                item.RAMO = this.dataSet[i][2]?.trim();
                item.NRO_SINIESTRO = this.dataSet[i][3]?.trim();
                item.NRO_POLIZA = this.dataSet[i][4]?.trim();
                item.PLACA = this.dataSet[i][5]?.trim();
                item.NRO_CASO = this.dataSet[i][6]?.trim();
                item.NRO_AUDITORIA = this.dataSet[i][7]?.trim();
                item.NOMBRES = this.dataSet[i][8]?.trim();
                item.APELLIDO_PATERNO = this.dataSet[i][9]?.trim();
                item.APELLIDO_MATERNO = this.dataSet[i][10]?.trim();

                item.TIPO_DOCUMENTO = this.dataSet[i][11]?.trim();
                item.NRO_DOCUMENTO = this.dataSet[i][12]?.trim();
                // NUEVOS CAMPOS
                item.IPRESS_AQ_EMITECG = this.dataSet[i][13]?.trim();
                item.IPRESS_RUC = this.dataSet[i][14]?.trim();
                item.CAUSA_SINIESTRO = this.dataSet[i][15]?.trim();
                // item.CENTRO_MEDICO = this.dataSet[i][13]?.trim();
                // item.TIPO_SINIESTRO = this.dataSet[i][14]?.trim();
                item.FECHA_DENUNCIO = this.dataSet[i][16]?.trim();
                item.HORA_RECEPCION = this.dataSet[i][17]?.trim();
                item.OCUPANTE = this.dataSet[i][18]?.trim();
                item.FALLECIDO = this.dataSet[i][19]?.trim();
                item.FECHA_FALLECIDO = this.dataSet[i][20]?.trim();

                item.UBIGEO = this.dataSet[i][21]?.trim();
                item.ESTADO_SINIESTRO = this.dataSet[i][22]?.trim();
                item.CODIGO_COMISARIA = this.dataSet[i][23]?.trim();
                item.PATERNO_CONDUCTOR = this.dataSet[i][24]?.trim();
                item.MATERNO_CONDUCTOR = this.dataSet[i][25]?.trim();
                item.NOMBRES_CONDUCTOR = this.dataSet[i][26]?.trim();
                item.MOTIVO_RECHAZO = this.dataSet[i][27]?.trim();
                item.TIPO_ATENCION = this.dataSet[i][28]?.trim();
                item.FECHA_APERTURA = this.dataSet[i][29]?.trim();
                item.LUGAR_OCURRENCIA = this.dataSet[i][30]?.trim();
                item.FECHA_NACIMIENTO = this.dataSet[i][31]?.trim();
                this.ListApertura.LIST.push(item);
              }
              this.CargaMasivaService.RecorrerListaApertura(this.ListApertura).subscribe(
                res => {
                  Swal.fire('Información', 'Se procesaron los datos correctamente.', 'success');
                  this.currentPage = 1;
                  this.listResults = res.Result.P_TABLE;
                  this.totalItems = this.listResults.length;
                  this.listToShow = this.listResults.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                  );
                  this.caux_soat_ope = this.listResults[0].CAUX_SOAT_OPE;
                  this.isLoading = false;
                  this.reporte_prel = false;
                  for (var i = 0; i < this.listResults.length; i++) {
                    if (!this.listResults[i].SDET_ERROR) {
                      this.booleanDisabled = false;
                    } else {
                      this.booleanDisabled = true;
                    }
                  }
                },
                err => {
                  Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
                  this.isLoading = false;
                }
              )
            } else {
              Swal.fire('Información', 'No existen datos.', 'warning');
              this.isLoading = false;
            }
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al obtener la cabecera de los datos.', 'error');
        }
      )
    } else if (this.codigo == 2) {
      Swal.fire('Información', 'Martha está desarrollando.', 'warning');
      this.isLoading = false;
    } else if (this.codigo == 3) {
      Swal.fire('Información', 'Martha está desarrollando.', 'warning');
      this.isLoading = false;
    } else {
      Swal.fire('Información', 'Seleccione el tipo de trama.', 'warning');
      this.isLoading = false;
    }
  }

  onApertura = (e) => {
    if (e == true) {
      this.reserva = false;
      this.liquidacion = false;
      this.trama = 'O';
      this.codigo = 1;
    } else {
      this.trama = null;
      this.codigo = null;
    }
  }

  onReserva = (e) => {
    if (e == true) {
      this.apertura = false;
      this.liquidacion = false;
      this.trama = 'R';
      this.codigo = 2;
    } else {
      this.trama = null;
      this.codigo = null;
    }
  }

  onLiquidacion = (e) => {
    if (e == true) {
      this.reserva = false;
      this.apertura = false;
      this.trama = 'L';
      this.codigo = 3;
    } else {
      this.trama = null;
      this.codigo = null;
    }
  }

  obtenerBlobFromBase64 = (b64Data: string, contentType: string) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}