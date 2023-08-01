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
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export interface ListPreliminar {
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

export interface ListDefinitivo {
  LIST?: any;
}

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})

export class CargaMasivaComponent implements OnInit {

  ListPreliminar: ListPreliminar;
  ListCabecera: ListCabecera;
  ListErrores: ListErrores;
  ReportePreliminar: ReportePreliminar;
  ListDefinitivo: ListDefinitivo;

  isLoading: boolean = false;
  apertura: boolean = true;
  reserva: boolean = false;
  liquidacion: boolean = false;
  reporte_prel: boolean = true;
  definitivo: boolean = true;
  preliminar: boolean = true;

  booleanSelect: boolean = false;
  booleanDisabled: boolean = true;
  carga: number = 2;
  codigo: number = 1;
  trama: string = 'O';
  archivoNombre: string = null;
  numero_siniestro: string = null;
  caux_soat_ope: string = null;
  openModal = false;

  data: any = [];
  dataSet: any = [];
  cabeceraData: any = [];
  cabeceraDataName: any = [];
  primeraColumna: any = [];
  correctos: any = [];
  errores: any = [];
  
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
    private CargaMasivaService: CargaMasivaService,
    public authProtectaService: AuthProtectaService
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
    this.booleanSelect = false;
    this.data = null;
    this.dataSet = null;
    this.listToShow = null;
    this.reporte_prel = true;
    this.definitivo = true;
    this.preliminar = true;
    if (this.apertura == true || this.reserva == true || this.liquidacion == true) {
      const target: DataTransfer = <DataTransfer>(evt.target);
      var name = target.files[0].name;
      if (
        (name.toLowerCase().includes("aper") && this.apertura == true) ||
        (name.toLowerCase().includes("res") && this.reserva == true) ||
        (name.toLowerCase().includes("liq") && this.liquidacion == true)
      ) {
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
        evt.target.value = null;
      } else {
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
              evt.target.value = null;
            }
            else if (res.dismiss === Swal.DismissReason.cancel) {
              this.archivoNombre = null;
              this.preliminar = true;
              evt.target.value = null;
              return;
            }
          }
        )
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
    if (this.codigo == 1) {
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
    } else if (this.codigo == 2) {
      this.CargaMasivaService.ListarErroresReservas(item).subscribe(
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
    } else if (this.codigo == 3) {
      this.CargaMasivaService.ListarErroresLiquidacion(item).subscribe(
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
    } else {
      Swal.fire('Información', 'Seleccione el tipo de trama.', 'warning');
    }
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
      if (this.listResults[i].NSTA1_SOAT_OPE !== 3) {
        this.listResults[i].IS_SELECTED = this.booleanSelect;
      }
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
    this.ListDefinitivo = {};
    this.ListDefinitivo.LIST = [];
    for (var i = 0; i < this.listResults.length; i++) {
      if (this.listResults[i].IS_SELECTED) {
        let cookie = this.authProtectaService.getCookie('AppSiniestro');
        let codUsuario = this.authProtectaService.getValueCookie('CodUsu', cookie);
        this.listResults[i].USERCODE = Number(atob(codUsuario));
        this.ListDefinitivo.LIST.push(this.listResults[i]);
      }
    }
    if (this.ListDefinitivo.LIST.length > 0) {
      this.definitivo = false;
    } else {
      this.definitivo = true;
    }
  }

  onLimpiar = () => {
    this.archivoNombre = null;
    this.booleanSelect = false;
    this.data = null;
    this.dataSet = null;
    this.listToShow = null;
    this.carga = 2;
    this.reporte_prel = true;
    this.definitivo = true;
    this.preliminar = true;
  }

  onPreliminar = () => {
    this.isLoading = true;
    this.booleanSelect = false;
    this.ListCabecera = {};
    this.ListCabecera.P_NREPORTE = this.codigo;
    if (this.codigo == 1) {
      this.CargaMasivaService.ListarCabeceraData(this.ListCabecera).subscribe(
        res => {
          this.cabeceraData = res.Result.P_TABLE;
          this.ListPreliminar = {};
          this.ListPreliminar.LIST = [];
          this.ListPreliminar.P_CTIPMOV_SOAT = this.trama;
          this.ListPreliminar.P_TYPE_LOAD = this.carga;
          this.cabeceraDataName = [];
          for (var i = 0; i < this.cabeceraData.length; i++) {
            this.cabeceraDataName.push(this.cabeceraData[i].SFIELDNAME);
          }
          this.primeraColumna = this.dataSet[0];
          if (this.cabeceraDataName.length != this.primeraColumna.length) {
            this.isLoading = false;
            Swal.fire('Información', 'El número de columnas no coincide.', 'warning');
            return;
          } else {
            for (var i = 0; i < this.cabeceraDataName.length; i++) {
              if (this.cabeceraDataName[i].trim() != this.primeraColumna[i].trim()) {
                this.isLoading = false;
                Swal.fire('Información', 'Los nombres de la cabecera no coinciden.', 'warning');
                return;
              }
            }
            if (this.dataSet.length > 1) {
              for (var i = 1; i < this.dataSet.length; i++) {
                var item: any = {};
                item.P_NID_SOAT_OPE = i + 1;
                item.P_SFECHA_SINIESTRO = this.dataSet[i][0]?.trim();
                item.P_SHORA_SINIESTRO = this.dataSet[i][1]?.trim();
                item.P_SRAMO = this.dataSet[i][2]?.trim();
                item.P_SNRO_SINIESTRO = this.dataSet[i][3]?.trim();
                item.P_SNRO_POLIZA = this.dataSet[i][4]?.trim();
                item.P_SPLACA = this.dataSet[i][5]?.trim();
                item.P_SNRO_CASO = this.dataSet[i][6]?.trim();
                item.P_SNRO_AUDITORIA = this.dataSet[i][7]?.trim();
                item.P_SNOMBRES = this.dataSet[i][8]?.trim();
                item.P_SAPELLIDO_PATERNO = this.dataSet[i][9]?.trim();
                item.P_SAPELLIDO_MATERNO = this.dataSet[i][10]?.trim();
                item.P_STIPO_DOCUMENTO = this.dataSet[i][11]?.trim();
                item.P_SNRO_DOCUMENTO = this.dataSet[i][12]?.trim();
                item.P_SIPRESS_AQ_EMITECG = this.dataSet[i][13]?.trim();
                item.P_SIPRESS_RUC = this.dataSet[i][14]?.trim();
                item.P_SCCAUSA_SINIESTRO = this.dataSet[i][15]?.trim();
                item.P_SFECHA_DENUNCIO = this.dataSet[i][16]?.trim();
                item.P_SHORA_RECEPCION = this.dataSet[i][17]?.trim();
                item.P_SOCUPANTE = this.dataSet[i][18]?.trim();
                item.P_SFALLECIDO = this.dataSet[i][19]?.trim();
                item.P_SFECHA_FALLECIDO = this.dataSet[i][20]?.trim();
                item.P_SUBIGEO = this.dataSet[i][21]?.trim();
                item.P_SESTADO_SINIESTRO = this.dataSet[i][22]?.trim();
                item.P_SCODIGO_COMISARIA = this.dataSet[i][23]?.trim();
                item.P_SPATERNO_CONDUCTOR = this.dataSet[i][24]?.trim();
                item.P_SMATERNO_CONDUCTOR = this.dataSet[i][25]?.trim();
                item.P_SNOMBRES_CONDUCTOR = this.dataSet[i][26]?.trim();
                item.P_SMOTIVO_DE_RECHAZO = this.dataSet[i][27]?.trim();
                item.P_STIPO_ATENCION = this.dataSet[i][28]?.trim();
                item.P_SFECHA_APERTURA = this.dataSet[i][29]?.trim();
                item.P_SLUGAR_OCURRENCIA = this.dataSet[i][30]?.trim();
                item.P_SFECNAC_CONDUCTOR = this.dataSet[i][31]?.trim();
                this.ListPreliminar.LIST.push(item);
              }
              this.CargaMasivaService.RecorrerListaApertura(this.ListPreliminar).subscribe(
                res => {
                  this.currentPage = 1;
                  this.listResults = res.Result.P_TABLE;
                  this.totalItems = this.listResults.length;
                  this.listToShow = this.listResults.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                  );
                  this.caux_soat_ope = this.listResults[0].CAUX_SOAT_OPE;
                  this.reporte_prel = false;
                  this.isLoading = false;
                  Swal.fire('Información', 'Carga Preliminar exitosa.', 'success');
                  for (var i = 0; i < this.listResults.length; i++) {
                    if (this.listResults[i].NSTA1_SOAT_OPE == 3) {
                      this.booleanDisabled = true;
                    } else {
                      this.booleanDisabled = false;
                      return;
                    }
                  }
                },
                err => {
                  this.isLoading = false;
                  Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
                }
              )
            } else {
              this.isLoading = false;
              Swal.fire('Información', 'No existen datos.', 'warning');
            }
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al obtener la cabecera de los datos.', 'error');
        }
      )
    } else if (this.codigo == 2) {
      this.CargaMasivaService.ListarCabeceraData(this.ListCabecera).subscribe(
        res => {
          this.cabeceraData = res.Result.P_TABLE;
          this.ListPreliminar = {};
          this.ListPreliminar.LIST = [];
          this.ListPreliminar.P_CTIPMOV_SOAT = this.trama;
          this.ListPreliminar.P_TYPE_LOAD = this.carga;
          this.cabeceraDataName = [];
          for (var i = 0; i < this.cabeceraData.length; i++) {
            this.cabeceraDataName.push(this.cabeceraData[i].SFIELDNAME);
          }
          this.primeraColumna = this.dataSet[0];
          if (this.cabeceraDataName.length != this.primeraColumna.length) {
            this.isLoading = false;
            Swal.fire('Información', 'El número de columnas no coincide.', 'warning');
            return;
          } else {
            for (var i = 0; i < this.cabeceraDataName.length; i++) {
              if (this.cabeceraDataName[i].trim() != this.primeraColumna[i].trim()) {
                this.isLoading = false;
                Swal.fire('Información', 'Los nombres de la cabecera no coinciden.', 'warning');
                return;
              }
            }
            if (this.dataSet.length > 1) {
              for (var i = 1; i < this.dataSet.length; i++) {
                var item: any = {};
                item.P_NID_SOAT_OPE = i + 1;
                item.P_STIPO_MOVIMIENTO = this.dataSet[i][0]?.trim();
                item.P_SFECHA_MOVIMIENTO = this.dataSet[i][1]?.trim();
                item.P_SNRO_SINIESTRO = this.dataSet[i][2]?.trim();
                item.P_SNRO_POLIZA = this.dataSet[i][3]?.trim();
                item.P_SNRO_CASO = this.dataSet[i][4]?.trim();
                item.P_SCOBERTURA = this.dataSet[i][5]?.trim();
                item.P_SNRO_CARTA = this.dataSet[i][6]?.trim();
                item.P_SNOMBRES = this.dataSet[i][7]?.trim();
                item.P_SAPELLIDO_PATERNO = this.dataSet[i][8]?.trim();
                item.P_SAPELLIDO_MATERNO = this.dataSet[i][9]?.trim();
                item.P_SRAZON_SOCIAL = this.dataSet[i][10]?.trim();
                item.P_STIPO_DOCUMENTO = this.dataSet[i][11]?.trim();
                item.P_SNRO_DOCUMENTO = this.dataSet[i][12]?.trim();
                item.P_SESPECIALIDAD = this.dataSet[i][13]?.trim();
                item.P_SCOD_DIAGNOSTICO = this.dataSet[i][14]?.trim();
                item.P_SNOM_MED_TRATANTE = this.dataSet[i][15]?.trim();
                item.P_SMONEDA = this.dataSet[i][16]?.trim();
                item.P_SMONTO_CARTA = this.dataSet[i][17]?.trim();
                item.P_SMONTO_TOT_FACT = this.dataSet[i][18]?.trim();
                item.P_STIPO_TRAMA = this.dataSet[i][19]?.trim();
                item.P_SFECHA_DENUNCIO = this.dataSet[i][20]?.trim();
                item.P_SFECHA_APERTURA = this.dataSet[i][21]?.trim();
                item.P_SLUGAR_OCURRENCIA = this.dataSet[i][22]?.trim();
                item.P_SFECNAC_CONDUCTOR = this.dataSet[i][23]?.trim();
                item.P_SIPRESS_AQ_EMITECG = this.dataSet[i][24]?.trim();
                item.P_SIPRESS_RUC = this.dataSet[i][25]?.trim();
                item.P_STIPO_ATENCION = this.dataSet[i][26]?.trim();
                item.P_SCOMPLEJ_DIAGNO = this.dataSet[i][27]?.trim();
                this.ListPreliminar.LIST.push(item);
              }
              this.CargaMasivaService.RecorrerListaReservas(this.ListPreliminar).subscribe(
                res => {
                  this.currentPage = 1;
                  this.listResults = res.Result.P_TABLE;
                  this.totalItems = this.listResults.length;
                  this.listToShow = this.listResults.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                  );
                  this.caux_soat_ope = this.listResults[0].CAUX_SOAT_OPE;
                  this.reporte_prel = false;
                  this.isLoading = false;
                  Swal.fire('Información', 'Carga Preliminar exitosa.', 'success');
                  for (var i = 0; i < this.listResults.length; i++) {
                    if (this.listResults[i].NSTA1_SOAT_OPE == 3) {
                      this.booleanDisabled = true;
                    } else {
                      this.booleanDisabled = false;
                      return;
                    }
                  }
                },
                err => {
                  this.isLoading = false;
                  Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
                }
              )
            } else {
              this.isLoading = false;
              Swal.fire('Información', 'No existen datos.', 'warning');
            }
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al obtener la cabecera de los datos.', 'error');
        }
      )
    } else if (this.codigo == 3) {
      this.CargaMasivaService.ListarCabeceraData(this.ListCabecera).subscribe(
        res => {
          this.cabeceraData = res.Result.P_TABLE;
          this.ListPreliminar = {};
          this.ListPreliminar.LIST = [];
          this.ListPreliminar.P_CTIPMOV_SOAT = this.trama;
          this.ListPreliminar.P_TYPE_LOAD = this.carga;
          this.cabeceraDataName = [];
          for (var i = 0; i < this.cabeceraData.length; i++) {
            this.cabeceraDataName.push(this.cabeceraData[i].SFIELDNAME);
          }
          this.primeraColumna = this.dataSet[0];
          if (this.cabeceraDataName.length != this.primeraColumna.length) {
            this.isLoading = false;
            Swal.fire('Información', 'El número de columnas no coincide.', 'warning');
            return;
          } else {
            for (var i = 0; i < this.cabeceraDataName.length; i++) {
              if (this.cabeceraDataName[i].trim() != this.primeraColumna[i].trim()) {
                this.isLoading = false;
                Swal.fire('Información', 'Los nombres de la cabecera no coinciden.', 'warning');
                return;
              }
            }
            if (this.dataSet.length > 1) {
              for (var i = 1; i < this.dataSet.length; i++) {
                var item: any = {};
                item.P_NID_SOAT_OPE = i + 1;
                item.P_STIPO_MOVIMIENTO = this.dataSet[i][0]?.trim();
                item.P_SFECHA_MOVIMIENTO = this.dataSet[i][1]?.trim();
                item.P_SNRO_SINIESTRO = this.dataSet[i][2]?.trim();
                item.P_SNRO_POLIZA = this.dataSet[i][3]?.trim();
                item.P_SNRO_CASO = this.dataSet[i][4]?.trim();
                item.P_SCOBERTURA = this.dataSet[i][5]?.trim();
                item.P_SNRO_CARTA = this.dataSet[i][6]?.trim();
                item.P_SNOMBRES_BENEFICIA = this.dataSet[i][7]?.trim();
                item.P_SPATERNO_BENEFICIA = this.dataSet[i][8]?.trim();
                item.P_SMATERNO_BENEFICIA = this.dataSet[i][9]?.trim();
                item.P_SRAZON_SOCIA_BENEF = this.dataSet[i][10]?.trim();
                item.P_STIPO_DOC_BENEF = this.dataSet[i][11]?.trim();
                item.P_SNRO_DOC_BENEF = this.dataSet[i][12]?.trim();
                item.P_SESPECIALIDAD = this.dataSet[i][13]?.trim();
                item.P_SCOD_DIAGNOSTICO = this.dataSet[i][14]?.trim();
                item.P_SNOM_DIAGNOSTICO = this.dataSet[i][15]?.trim();
                item.P_SNOM_MED_TRATANTE = this.dataSet[i][16]?.trim();
                item.P_SMONEDA = this.dataSet[i][17]?.trim();
                item.P_SMONTO_CARTA = this.dataSet[i][18]?.trim();
                item.P_SMONTO_TOT_FACT = this.dataSet[i][19]?.trim();
                item.P_SNRO_FACTURA = this.dataSet[i][20]?.trim();
                item.P_SFEC_EMI_FACTURA = this.dataSet[i][21]?.trim();
                item.P_SIND_PAGO_TOTAL = this.dataSet[i][22]?.trim();
                item.P_STIPO_TRAMA = this.dataSet[i][23]?.trim();
                item.P_SFEC_RECEP_FACT = this.dataSet[i][24]?.trim();
                item.P_SPRODUCT = this.dataSet[i][25]?.trim();
                item.P_SDESC_COBERTURA = this.dataSet[i][26]?.trim();
                item.P_SREG_COMPROB = this.dataSet[i][27]?.trim();
                item.P_STIPO_COMPROB = this.dataSet[i][28]?.trim();
                item.P_SAFECTO_A_IGV = this.dataSet[i][29]?.trim();
                item.P_SMONTO_IGV = this.dataSet[i][30]?.trim();
                item.P_SIMPORTE_TOTAL = this.dataSet[i][31]?.trim();
                item.P_SDESC_MONEDA = this.dataSet[i][32]?.trim();
                item.P_SPLACA = this.dataSet[i][33]?.trim();
                item.P_SDESC_COBERTURA_ = this.dataSet[i][34]?.trim();
                item.P_SFECHA_LIQUIDA = this.dataSet[i][35]?.trim();
                item.P_SCONDICION_PAGO = this.dataSet[i][36]?.trim();
                item.P_SGLOSA = this.dataSet[i][37]?.trim();
                item.P_SFECHA_DENUNCIO = this.dataSet[i][38]?.trim();
                item.P_SFEC_T_ANALISIS = this.dataSet[i][39]?.trim();
                item.P_SFECHA_APERTURA = this.dataSet[i][40]?.trim();
                item.P_STIPO_ATENCION = this.dataSet[i][41]?.trim();
                item.P_SCOMPLEJ_DIAGNO = this.dataSet[i][42]?.trim();
                item.P_SPROCEDIMIENTO = this.dataSet[i][43]?.trim();
                item.P_SHOSPITAL_DIAS = this.dataSet[i][44]?.trim();
                item.P_STIPO_DE_PAGO = this.dataSet[i][45]?.trim();
                item.P_SBANCO = this.dataSet[i][46]?.trim();
                item.P_SNRO_CUENTA = this.dataSet[i][47]?.trim();
                item.P_SRED_IPRESS = this.dataSet[i][48]?.trim();
                item.P_SESTADO_COBERTURA = this.dataSet[i][49]?.trim();
                item.P_SIPRESS_AQ_EMITECG = this.dataSet[i][50]?.trim();
                item.P_SIPRESS_RUC = this.dataSet[i][51]?.trim();
                this.ListPreliminar.LIST.push(item);
              }
              this.CargaMasivaService.RecorrerListaLiquidacion(this.ListPreliminar).subscribe(
                res => {
                  this.currentPage = 1;
                  this.listResults = res.Result.P_TABLE;
                  this.totalItems = this.listResults.length;
                  this.listToShow = this.listResults.slice(
                    (this.currentPage - 1) * this.itemsPerPage,
                    this.currentPage * this.itemsPerPage
                  );
                  this.caux_soat_ope = this.listResults[0].CAUX_SOAT_OPE;
                  this.reporte_prel = false;
                  this.isLoading = false;
                  Swal.fire('Información', 'Carga Preliminar exitosa.', 'success');
                  for (var i = 0; i < this.listResults.length; i++) {
                    if (this.listResults[i].NSTA1_SOAT_OPE == 3) {
                      this.booleanDisabled = true;
                    } else {
                      this.booleanDisabled = false;
                      return;
                    }
                  }
                },
                err => {
                  this.isLoading = false;
                  Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
                }
              )
            } else {
              this.isLoading = false;
              Swal.fire('Información', 'No existen datos.', 'warning');
            }
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al obtener la cabecera de los datos.', 'error');
        }
      )
    } else {
      this.isLoading = false;
      Swal.fire('Información', 'Seleccione el tipo de trama.', 'warning');
    }
  }

  onDefinitivo = () => {
    this.isLoading = true;
    if (this.codigo == 1) {
      this.CargaMasivaService.CargarDefinitivoApertura(this.ListDefinitivo).subscribe(
        res => {
          if (res.Result.P_NCODE == 0) {
            this.isLoading = false;
            this.archivoNombre = null;
            this.booleanSelect = false;
            this.data = null;
            this.dataSet = null;
            this.listToShow = null;
            this.reporte_prel = true;
            this.definitivo = true;
            this.preliminar = true;
            Swal.fire('Información', 'Carga Definitiva exitosa.', 'success');
          } else {
            this.isLoading = false;
            Swal.fire('Información', res.Result.P_SMESSAGE, 'error');
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
        }
      )
    } else if (this.codigo == 2) {
      this.CargaMasivaService.CargarDefinitivoReservas(this.ListDefinitivo).subscribe(
        res => {
          if (res.Result.P_NCODE == 0) {
            this.isLoading = false;
            this.archivoNombre = null;
            this.booleanSelect = false;
            this.data = null;
            this.dataSet = null;
            this.listToShow = null;
            this.reporte_prel = true;
            this.definitivo = true;
            this.preliminar = true;
            Swal.fire('Información', 'Carga Definitiva exitosa.', 'success');
          } else {
            this.isLoading = false;
            Swal.fire('Información', res.Result.P_SMESSAGE, 'error');
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
        }
      )
    } else if (this.codigo == 3) {
      this.CargaMasivaService.CargarDefinitivoLiquidacion(this.ListDefinitivo).subscribe(
        res => {
          if (res.Result.P_NCODE == 0) {
            this.isLoading = false;
            this.archivoNombre = null;
            this.booleanSelect = false;
            this.data = null;
            this.dataSet = null;
            this.listToShow = null;
            this.reporte_prel = true;
            this.definitivo = true;
            this.preliminar = true;
            Swal.fire('Información', 'Carga Definitiva exitosa.', 'success');
          } else {
            this.isLoading = false;
            Swal.fire('Información', res.Result.P_SMESSAGE, 'error');
          }
        },
        err => {
          this.isLoading = false;
          Swal.fire('Información', 'Ha ocurrido un error al procesar los datos.', 'error');
        }
      )
    } else {
      this.isLoading = false;
      Swal.fire('Información', 'Seleccione el tipo de trama.', 'warning');
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

  onReportePreliminar = () => {
    this.ReportePreliminar = {};
    this.ReportePreliminar.P_CAUX_SOAT_OPE = this.caux_soat_ope;
    if (this.codigo == 1) {
      this.CargaMasivaService.ProcessReportePreliminarApertura(this.ReportePreliminar).subscribe(
        res => {
          let _data = res;
          if (_data.response == 0) {
            if (_data.Data != null) {
              const file = new File([this.obtenerBlobFromBase64(_data.Data, '')], 'Reporte_Preliminar_Siniestros_SOAT_Apertura' + this.ReportePreliminar.P_CAUX_SOAT_OPE + '.xlsx', { type: 'text/xls' });
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
    } else if (this.codigo == 2) {
      this.CargaMasivaService.ProcessReportePreliminarReservas(this.ReportePreliminar).subscribe(
        res => {
          let _data = res;
          if (_data.response == 0) {
            if (_data.Data != null) {
              const file = new File([this.obtenerBlobFromBase64(_data.Data, '')], 'Reporte_Preliminar_Siniestros_SOAT_Reservas' + this.ReportePreliminar.P_CAUX_SOAT_OPE + '.xlsx', { type: 'text/xls' });
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
    } else if (this.codigo == 3) {
      this.CargaMasivaService.ProcessReportePreliminarLiquidacion(this.ReportePreliminar).subscribe(
        res => {
          let _data = res;
          if (_data.response == 0) {
            if (_data.Data != null) {
              const file = new File([this.obtenerBlobFromBase64(_data.Data, '')], 'Reporte_Preliminar_Siniestros_SOAT_Liquidacion' + this.ReportePreliminar.P_CAUX_SOAT_OPE + '.xlsx', { type: 'text/xls' });
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
    } else {
      this.isLoading = false;
      Swal.fire('Información', 'Seleccione el tipo de trama.', 'warning');
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

  showModal(openSidebar:boolean){
    this.openModal = openSidebar
  }
}