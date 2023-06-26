import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { LiquidacionService } from "src/app/services/LiquidacionService";
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export class DatosReporteHistorico{
    P_DFECINI : string;
    P_DFECFIN: string;
    TIPO_REPORTE: string;
  }

export class SalidaReporteSiniestro{
    NRO_SINIESTRO: string;
    NRO_SIN_PROVEEDOR: string;
    CASO: string;
    NRO_POLIZA: string;
    ESTADO_POLIZA: string;
    COD_CAUSA_SIN: string;
    DESC_CAU_SIN: string;
    NRO_DOCUMENTO: string;
    NOMBRE_COMPLETO: string;
    TIPO_ATENCION: string;
    FECHA_OCURRENCIA: string;
    FECHA_AVISO: string;
    FECHA_REGISTRO: string;
    PLACA: string;
    CLASE: string;
    USO: string;
    MARCA: string;
    MODELO: string;
    CANAL_VENTA: string;
    INICIO_VIGENCIA: string;
    FIN_VIGENCIA: string;
    DEPARTAMENTO: string;
    PROVINCIA: string;
    DISTRITO: string;
    USUARIO: string;
    FECNACCONDUCTOR: string;
}

export class SalidaReporteReserva{
    NRO_SINIESTRO : string;
    COBERTURA : string;
    CODIGO_COBERTURA : string;
    NUM_SIN_PROVEEDOR : string;
    CASO : string;
    NRO_POLIZA : string;
    ESTADO_POLIZA : string;
    NRO_DOCUMENTO : string;
    NOMBRE_COMPLETO : string;
    RESERVA : string;
    TIPO_RESERVA : string;
    NUM_CARTA : string;
    FECHA_DENUNCIO : string;
    FECHA_RESERVA : string;
    FECHA_REGISTRO : string;
    INTERFAZ : string;
    NRO_DOC_SINI : string;
    NOM_SINIESTRADO : string;
    FECHA_OCURRENCIA : string;
    PLACA : string;
    CLASE : string;
    USO : string;
    MARCA : string;
    MODELO : string;
    CANAL_VENTA : string;
    INI_VIGENCIA : string;
    FIN_VIGENCIA : string;
    DEPARTAMENTO : string;
    PROVINCIA : string;
    DISTRITO : string;
    USUARIO : string;
    NOMBRE_IPRESS : string;
    RUC_IPRESS : string;
    TIPO_ATENCION : string;
    COMPLE_DIAGNOS : string;
    DIAS_DESCANSO : string;
    INICIO_DESCANSO : string;
    FIN_DESCANSO : string;
}

@Component({
    selector: 'app-reporte-historico',
    templateUrl: './reporte-historico.component.html',
    styleUrls: ['./reporte-historico.component.scss']
  })
export class ReporteHistoricoComponent implements OnInit {

    fechaInicio : "";
    fechaFin : "";
    tipoReporte = "0";

    cabeceraReporteSiniestros = [
        ['Columna1','Columna2','Columna3','Columna4','Columna5'],
    ];
    salidaSiniestros: any[];
    salidaReservas: any[];
    salidaLiquidaciones: any[];
    fechIniR : string
    fechFinR : string;
    

    constructor(private service: LiquidacionService,
                private http: HttpClient) { }

    ngOnInit(): void {
        this.fechaInicio = null;
        this.fechaFin = null;
        this.tipoReporte = "0";
    }

    limpiarDatos(){
        this.fechaInicio = null;
        this.fechaFin = null;
        this.tipoReporte = "0";
    }

    async generarReporte(){
        
        console.log(this.fechaInicio);
        console.log(this.fechaFin);
        
        if(this.fechaInicio == null || this.fechaFin == null){
            Swal.fire('Información', 'Las fechas del reporte son obligatorias', 'warning');
            return;
          }else{
            
            console.log(this.fechaInicio);
            console.log(this.fechaFin);
            
            //transformamos las fechas
            this.fechIniR = this.fechaInicio.replace('-','');
            this.fechFinR = this.fechaFin.replace('-','');
            this.fechIniR = this.fechIniR.replace('-','');
            this.fechFinR = this.fechFinR.replace('-','');
            console.log(this.fechIniR);
            console.log(this.fechFinR);
            
            if(this.fechaInicio > this.fechaFin){ 
                 Swal.fire('Información', 'La fecha de fin no puede ser mayor a la fecha de inicio', 'warning');
                 return;
             }else{
                const skipHeader = true;
                const workbook = XLSX.utils.book_new();
                const datosReporteHistorico = new DatosReporteHistorico();
                datosReporteHistorico.P_DFECINI = this.fechaInicio;
                datosReporteHistorico.P_DFECFIN = this.fechaFin;
                datosReporteHistorico.TIPO_REPORTE = this.tipoReporte;                
                //this.salidaSiniestros = new SalidaReporteSiniestro[] = [];
                switch (this.tipoReporte) {
                    case "0":
                      const nomTodos = 'ReporteHistoricoSOAT_' + this.fechIniR + '_' + this.fechFinR;
                      this.service.GenerarExcelHistoricoTodo(datosReporteHistorico, nomTodos);
                        // this.service.ReporteHistoricoSoatSiniestro(datosReporteHistorico).subscribe(
                        //     s => {        
                        //         this.salidaSiniestros = <any[]>s; 
                        //         //salida = this.salidaSiniestros;
                        //         console.log('1');
                        //         console.log(this.salidaSiniestros);
                        //          this.service.ReporteHistoricoSoatReserva(datosReporteHistorico).subscribe(
                        //              s => {        
                        //                  this.salidaReservas = <any[]>s; 
                        //                  console.log('2');
                        //                  console.log(this.salidaReservas);
                        //                  this.service.ReporteHistoricoSoatLiquidaciones(datosReporteHistorico).subscribe(
                        //                   s => {        
                        //                       this.salidaLiquidaciones = <any[]>s; 
                        //                       console.log('3');
                        //                       console.log(this.salidaLiquidaciones);
                        //                       this.exportReportSiniestros(this.salidaSiniestros, this.salidaReservas, this.salidaLiquidaciones, 'ReporteHistoricoSOAT_' + this.fechIniR + '_' + this.fechFinR);   
                        //                       //generateExcel();
                        //                   },
                        //                   e => {
                        //                     console.log(e);
                        //               });
                        //              },
                        //              e => {
                        //                console.log(e);
                        //          });
                        //     },
                        //     e => {
                        //         console.log(e);
                        // });
                        break;
                    case "1":
                      const nomSiniestros = 'ReporteHistoricoSOAT_Siniestros_' + this.fechIniR + '_' + this.fechFinR;
                      this.service.GenerarExcelSiniestros(datosReporteHistorico, nomSiniestros);
                      // this.service.ReporteHistoricoSoatSiniestro(datosReporteHistorico).subscribe(
                      //     s => {        
                      //         this.salidaSiniestros = <any[]>s; 
                      //         this.exportReportApertura(this.salidaSiniestros, 'ReporteHistoricoSOAT_Siniestros_' + this.fechIniR + '_' + this.fechFinR);                              
                      //     },
                      //     e => {
                      //       console.log(e);
                      // });
                      break;
                    case "2":
                      const nomReserva = 'ReporteHistoricoSOAT_Reservas_' + this.fechIniR + '_' + this.fechFinR;
                      this.service.GenerarExcelReservas(datosReporteHistorico,nomReserva);
                      // this.service.ReporteHistoricoSoatReserva(datosReporteHistorico).subscribe(
                      //     s => {        
                      //         this.salidaReservas = <any[]>s; 
                      //         this.exportReportReservas(this.salidaReservas, 'ReporteHistoricoSOAT_Reservas_' + this.fechIniR + '_' + this.fechFinR);
                      //     },
                      //     e => {
                      //       console.log(e);
                      // });
                      break;
                    case "3":
                      const nomLiquidacion = 'ReporteHistoricoSOAT_Liquidaciones_' + this.fechIniR + '_' + this.fechFinR;
                      this.service.GenerarExcelLiquidaciones(datosReporteHistorico, nomLiquidacion);
                      // this.service.ReporteHistoricoSoatLiquidaciones(datosReporteHistorico).subscribe(
                      //     s => {        
                      //         this.salidaLiquidaciones = <any[]>s; 
                      //         this.exportReportLiquidacones(this.salidaLiquidaciones, 'ReporteHistoricoSOAT_Liquidaciones_' + this.fechIniR + '_' + this.fechFinR);
                      //     },
                      //     e => {
                      //       console.log(e);
                      // });
                      break;
                }
                
             }
          }
    }

    public exportReportSiniestros(jsonSini: any[], jsonReser: any[], jsonLiqui: any[], excelFileName: string): void {
      
        const ws = XLSX.utils.json_to_sheet(
           [
             {
                A: 'Nro Siniestro',
                B: 'Nro de Siniestro del Proveedor',
                C: 'Caso',
                D: 'Nro Póliza',
                E: 'Estado Póliza',
                F: 'Cod Causa Siniestro',
                G: 'Causa Siniestro',
                H: 'Nro Documento Del lesionado',
                I: 'Nombre Completo del lesionado',
                J: 'Tipo Atención',
                K: 'Fecha Ocurrencia',
                L: 'Fecha Aviso',
                M: 'Fecha Registro',
                N: 'Placa',
                O: 'Clase',
                P: 'Uso',
                Q: 'Marca',
                R: 'Modelo',
                S: 'Canal Venta',
                T: 'Inicio Vigencia',
                U: 'Fin Vigencia',
                V: 'Departamento',
                W: 'Provincia',
                X: 'Distrito',
                Y: 'Usuario',
                Z: 'Fecha Nacimiento Conductor',
             },
           ],
           {
              header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' , 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
              skipHeader: true,
           }
           
         );
         const listadoSini = [];
         for (let i = 0; i < jsonSini.length; i++) {
           const object = {
             A: jsonSini[i].NRO_SINIESTRO,
             B: jsonSini[i].NRO_SIN_PROVEEDOR,
             C: jsonSini[i].CASO,
             D: jsonSini[i].NRO_POLIZA,
             E: jsonSini[i].ESTADO_POLIZA,
             F: jsonSini[i].COD_CAUSA_SIN,
             G: jsonSini[i].DESC_CAU_SIN,
             H: jsonSini[i].NRO_DOCUMENTO,
             I: jsonSini[i].NOMBRE_COMPLETO,
             J: jsonSini[i].TIPO_ATENCION,
             K: jsonSini[i].FECHA_OCURRENCIA,
             L: jsonSini[i].FECHA_AVISO,
             M: jsonSini[i].FECHA_REGISTRO,
             N: jsonSini[i].PLACA,
             O: jsonSini[i].CLASE,
             P: jsonSini[i].USO,
             Q: jsonSini[i].MARCA,
             R: jsonSini[i].MODELO,
             S: jsonSini[i].CANAL_VENTA,
             T: jsonSini[i].INICIO_VIGENCIA,
             U: jsonSini[i].FIN_VIGENCIA,
             V: jsonSini[i].DEPARTAMENTO,
             W: jsonSini[i].PROVINCIA,
             X: jsonSini[i].DISTRITO,
             Y: jsonSini[i].USUARIO,
             Z: jsonSini[i].FECNACCONDUCTOR,
           };    
           listadoSini.push(object);
         }
         const wr = XLSX.utils.json_to_sheet(
            [
              {
                A: 'Nro Siniestro',
                B: 'Cobertura',
                C: 'Codigo de cobertura',
                D: 'Nro de Siniestro del Proveedor ',
                E: 'Caso',
                F: 'Nro Póliza',
                G: 'Estado Póliza',
                H: 'Nro Documento Contratante',
                I: 'Nombre Completo Contratante',
                J: 'Reserva',
                K: 'Tipo de Reserva',
                L: 'Número de Carta',
                M: 'Fecha Denuncio',
                N: 'Fecha Reserva',
                O: 'Fecha Registro',
                P: 'Interfaz',
                Q: 'Nro Documento Siniestrado',
                R: 'Nombre de Siniestrado',
                S: 'Fecha Ocurrencia',
                T: 'Placa',
                U: 'Clase',
                V: 'Uso',
                W: 'Marca',
                X: 'Modelo',
                Y: 'Canal Venta',
                Z: 'Inicio Vigencia',
                AA: 'Fin Vigencia',
                AB: 'Departamento',
                AC: 'Provincia',
                AD: 'Distrito',
                AE: 'Usuario',
                AF: 'Nombre IPRESS',
                AG: 'RUC IPRESS',
                AH: 'Tipo de Atencion',
                AI: 'Complejidad de dignostico',
                AJ: 'Nro Dias de Descanso Medico', 
                AK: 'Del (inicio de descanso)',
                AL: 'Hasta (fin de descanso)',
              },
            ],
            {
              header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' , 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL'],
              skipHeader: true,
            }
          );
         const listadosReser = [];
         for (let i = 0; i < jsonReser.length; i++) {
           const object = {
            A: jsonReser[i].NRO_SINIESTRO,
            B: jsonReser[i].COBERTURA,
            C: jsonReser[i].CODIGO_COBERTURA,
            D: jsonReser[i].NUM_SIN_PROVEEDOR,
            E: jsonReser[i].CASO,
            F: jsonReser[i].NRO_POLIZA,
            G: jsonReser[i].ESTADO_POLIZA,
            H: jsonReser[i].NRO_DOCUMENTO,
            I: jsonReser[i].NOMBRE_COMPLETO,
            J: jsonReser[i].RESERVA,
            K: jsonReser[i].TIPO_RESERVA,
            L: jsonReser[i].NUM_CARTA,
            M: jsonReser[i].FECHA_DENUNCIO,
            N: jsonReser[i].FECHA_RESERVA,
            O: jsonReser[i].FECHA_REGISTRO,
            P: jsonReser[i].INTERFAZ,
            Q: jsonReser[i].NRO_DOC_SINI,
            R: jsonReser[i].NOM_SINIESTRADO,
            S: jsonReser[i].FECHA_OCURRENCIA,
            T: jsonReser[i].PLACA,
            U: jsonReser[i].CLASE,
            V: jsonReser[i].USO,
            W: jsonReser[i].MARCA,
            X: jsonReser[i].MODELO,
            Y: jsonReser[i].CANAL_VENTA,
            Z: jsonReser[i].INI_VIGENCIA,
            AA: jsonReser[i].FIN_VIGENCIA,
            AB: jsonReser[i].DEPARTAMENTO,
            AC: jsonReser[i].PROVINCIA,
            AD: jsonReser[i].DISTRITO,
            AE: jsonReser[i].USUARIO,
            AF: jsonReser[i].NOMBRE_IPRESS,
            AG: jsonReser[i].RUC_IPRESS,
            AH: jsonReser[i].TIPO_ATENCION,
            AI: jsonReser[i].COMPLE_DIAGNOS,
            AJ: jsonReser[i].DIAS_DESCANSO,
            AK: jsonReser[i].INICIO_DESCANSO,
            AL: jsonReser[i].FIN_DESCANSO,
           };    
           listadosReser.push(object);
         }
         
         const wl = XLSX.utils.json_to_sheet(
          [
            {
              A: 'Nro Siniestro',
              B: 'Cobertura',
              C: 'Cod Cobertura',
              D: 'Nro de Siniestro del Proveedor',
              E: 'Nro caso',
              F: 'Nro Póliza',
              G: 'Monto de Liquidacion',
              H: 'Nombre Persona a Pagar',
              I: 'Nro Documento Contratante',
              J: 'Nombre Completo Contratante',
              K: 'Nro Factura',
              L: 'Fec. Emisión Factura',
              M: 'Fec. Recepción Factura',
              N: 'Ruc. Proveedor',
              O: 'Nombre. Proveedor',
              P: 'Especialidad',
              Q: 'Diagnostico',
              R: 'Nro Carta',
              S: 'Fecha Liquidacion',
              T: 'Fecha Registro',
              U: 'Interfaz',
              V: 'Nombre de Siniestrado',
              W: 'Nro Documento Siniestrado',
              X: 'Nombre de Beneficiario',
              Y: 'Nro Documento Beneficiario',
              Z: 'Fecha de Ocurrencia',
              AA: 'Placa',
              AB: 'Clase',
              AC: 'Marca',
              AD: 'Modelo',
              AE: 'Uso',
              AF: 'Inicio Vigencia',
              AG: 'Fin Vigencia',
              AH: 'Departamento',
              AI: 'Provincia',
              AJ: 'Distrito',
              AK: 'Canal Venta',
              AL: 'Usuario CreaciOn',
              AM: 'Tipo Atencion',
              AN: 'Complejidad de Diagnostico',
              AO: 'Procedimiento',
              AP: 'Hospitalizacion dias',
              AQ: 'Tipo de Pago',
              AR: 'Banco',
              AS: 'Nro Cuenta',
              AT: 'RED IPRESS',
              AU: 'Estado de Cobertura',
              AV: 'IPRESS donde se Atendio',
              AW: 'RUC IPRESS',
            },
          ],
          {
            header: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW'],
            skipHeader: true,
          }
        );
       const listadosLiqui = [];
       for (let i = 0; i < jsonLiqui.length; i++) {
         const object = {
          A: jsonLiqui[i].NRO_SINIESTRO,
          B: jsonLiqui[i].COBERTURA,
          C: jsonLiqui[i].COD_COBERTURA,
          D: jsonLiqui[i].NRO_SINI_PROV,
          E: jsonLiqui[i].CASO,
          F: jsonLiqui[i].NRO_POLIZA,
          G: jsonLiqui[i].MONTO_LIQUIDACION,
          H: jsonLiqui[i].NOMBRE_PER_PAG,
          I: jsonLiqui[i].NRO_DOC_CONTRATANTE,
          J: jsonLiqui[i].NOM_CONTRATANTE,
          K: jsonLiqui[i].NRO_FACTURA,
          L: jsonLiqui[i].FEC_EMISION_FAC,
          M: jsonLiqui[i].FEC_RECEPCION_FAC,
          N: jsonLiqui[i].RUC_PROVEEDOR,
          O: jsonLiqui[i].NOMBRE_PROVEEDOR,
          P: jsonLiqui[i].ESPECIALIDAD,
          Q: jsonLiqui[i].DIAGNOSTICO,
          R: jsonLiqui[i].NUM_CARTA,
          S: jsonLiqui[i].FEC_LIQUIDACION,
          T: jsonLiqui[i].FEC_REGISTRO,
          U: jsonLiqui[i].INTERFAZ,
          V: jsonLiqui[i].NOMBRE_SINI,
          W: jsonLiqui[i].NRO_DOC_SINI,
          X: jsonLiqui[i].NOMBRE_BENEF,
          Y: jsonLiqui[i].NRO_DOC_BENEF,
          Z: jsonLiqui[i].FECHA_OCURRENCIA,
          AA: jsonLiqui[i].PLACA,
          AB: jsonLiqui[i].CLASE,
          AC: jsonLiqui[i].MARCA,
          AD: jsonLiqui[i].MODELO,
          AE: jsonLiqui[i].USO,
          AF: jsonLiqui[i].INICIO_VIGENCIA,
          AG: jsonLiqui[i].FIN_VIGENCIA,
          AH: jsonLiqui[i].DEPARTAMENTO,
          AI: jsonLiqui[i].PROVINCIA,
          AJ: jsonLiqui[i].DISTRITO,
          AK: jsonLiqui[i].CANAL_VENTA,
          AL: jsonLiqui[i].USUARIO_CREACION,
          AM: jsonLiqui[i].TIPO_ATENCION,
          AN: jsonLiqui[i].COMPLE_DIAGNOS,
          AO: jsonLiqui[i].PROCEDIMIENTO,
          AP: jsonLiqui[i].DIAS_HOSPITAL,
          AQ: jsonLiqui[i].TIPO_PAGO,
          AR: jsonLiqui[i].BANCO,
          AS: jsonLiqui[i].NRO_CUENTA,
          AT: jsonLiqui[i].RED_IPRESS,
          AU: jsonLiqui[i].ESTADO_COBERTURA,
          AV: jsonLiqui[i].IPRESS_ATENCION,
          AW: jsonLiqui[i].RUC_IPRESS,
         };    
         listadosLiqui.push(object);
       }

         XLSX.utils.sheet_add_json(ws, listadoSini, { skipHeader: true, origin: 'A2' }); 
         XLSX.utils.sheet_add_json(wr, listadosReser, { skipHeader: true, origin: 'A2' });
         XLSX.utils.sheet_add_json(wl, listadosLiqui, { skipHeader: true, origin: 'A2' });
    
         const workbook: XLSX.WorkBook = {
           Sheets: { Siniestros_SOAT: ws,
                     Reservas_SOAT : wr,
                     Liquidaciones_SOAT : wl },
           SheetNames: ['Siniestros_SOAT','Reservas_SOAT','Liquidaciones_SOAT'],
         };
         const excelBuffer: any = XLSX.write(workbook, {
           bookType: 'xlsx',
           bookSST: false,
           type: 'array',
         });
         //const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = excelFileName + '.xlsx';
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
       }

       public exportReportApertura(jsonSini: any[], excelFileName: string): void {
      
        const ws = XLSX.utils.json_to_sheet(
           [
             {
                A: 'Nro Siniestro',
                B: 'Nro de Siniestro del Proveedor',
                C: 'Caso',
                D: 'Nro Póliza',
                E: 'Estado Póliza',
                F: 'Cod Causa Siniestro',
                G: 'Causa Siniestro',
                H: 'Nro Documento Del lesionado',
                I: 'Nombre Completo del lesionado',
                J: 'Tipo Atención',
                K: 'Fecha Ocurrencia',
                L: 'Fecha Aviso',
                M: 'Fecha Registro',
                N: 'Placa',
                O: 'Clase',
                P: 'Uso',
                Q: 'Marca',
                R: 'Modelo',
                S: 'Canal Venta',
                T: 'Inicio Vigencia',
                U: 'Fin Vigencia',
                V: 'Departamento',
                W: 'Provincia',
                X: 'Distrito',
                Y: 'Usuario',
                Z: 'Fecha Nacimiento Conductor',
             },
           ],
           {
              header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' , 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
              skipHeader: true,
           }
           
         );
         const listadoSini = [];
         for (let i = 0; i < jsonSini.length; i++) {
           const object = {
             A: jsonSini[i].NRO_SINIESTRO,
             B: jsonSini[i].NRO_SIN_PROVEEDOR,
             C: jsonSini[i].CASO,
             D: jsonSini[i].NRO_POLIZA,
             E: jsonSini[i].ESTADO_POLIZA,
             F: jsonSini[i].COD_CAUSA_SIN,
             G: jsonSini[i].DESC_CAU_SIN,
             H: jsonSini[i].NRO_DOCUMENTO,
             I: jsonSini[i].NOMBRE_COMPLETO,
             J: jsonSini[i].TIPO_ATENCION,
             K: jsonSini[i].FECHA_OCURRENCIA,
             L: jsonSini[i].FECHA_AVISO,
             M: jsonSini[i].FECHA_REGISTRO,
             N: jsonSini[i].PLACA,
             O: jsonSini[i].CLASE,
             P: jsonSini[i].USO,
             Q: jsonSini[i].MARCA,
             R: jsonSini[i].MODELO,
             S: jsonSini[i].CANAL_VENTA,
             T: jsonSini[i].INICIO_VIGENCIA,
             U: jsonSini[i].FIN_VIGENCIA,
             V: jsonSini[i].DEPARTAMENTO,
             W: jsonSini[i].PROVINCIA,
             X: jsonSini[i].DISTRITO,
             Y: jsonSini[i].USUARIO,
             Z: jsonSini[i].FECNACCONDUCTOR,
           };    
           listadoSini.push(object);
         }
         XLSX.utils.sheet_add_json(ws, listadoSini, { skipHeader: true, origin: 'A2' }); 
    
         const workbook: XLSX.WorkBook = {
           Sheets: { Siniestros_SOAT: ws },
           SheetNames: ['Siniestros_SOAT'],
         };
         const excelBuffer: any = XLSX.write(workbook, {
           bookType: 'xlsx',
           bookSST: false,
           type: 'array',
         });
         //const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = excelFileName + '.xlsx';
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
       }

       public exportReportReservas(jsonReser: any[], excelFileName: string): void {
         const wr = XLSX.utils.json_to_sheet(
            [
              {
                A: 'Nro Siniestro',
                B: 'Cobertura',
                C: 'Codigo de cobertura',
                D: 'Nro de Siniestro del Proveedor ',
                E: 'Caso',
                F: 'Nro Póliza',
                G: 'Estado Póliza',
                H: 'Nro Documento Contratante',
                I: 'Nombre Completo Contratante',
                J: 'Reserva',
                K: 'Tipo de Reserva',
                L: 'Número de Carta',
                M: 'Fecha Denuncio',
                N: 'Fecha Reserva',
                O: 'Fecha Registro',
                P: 'Interfaz',
                Q: 'Nro Documento Siniestrado',
                R: 'Nombre de Siniestrado',
                S: 'Fecha Ocurrencia',
                T: 'Placa',
                U: 'Clase',
                V: 'Uso',
                W: 'Marca',
                X: 'Modelo',
                Y: 'Canal Venta',
                Z: 'Inicio Vigencia',
                AA: 'Fin Vigencia',
                AB: 'Departamento',
                AC: 'Provincia',
                AD: 'Distrito',
                AE: 'Usuario',
                AF: 'Nombre IPRESS',
                AG: 'RUC IPRESS',
                AH: 'Tipo de Atencion',
                AI: 'Complejidad de dignostico',
                AJ: 'Nro Dias de Descanso Medico', 
                AK: 'Del (inicio de descanso)',
                AL: 'Hasta (fin de descanso)',
              },
            ],
            {
              header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L' , 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL'],
              skipHeader: true,
            }
          );
         const listadosReser = [];
         for (let i = 0; i < jsonReser.length; i++) {
           const object = {
            A: jsonReser[i].NRO_SINIESTRO,
            B: jsonReser[i].COBERTURA,
            C: jsonReser[i].CODIGO_COBERTURA,
            D: jsonReser[i].NUM_SIN_PROVEEDOR,
            E: jsonReser[i].CASO,
            F: jsonReser[i].NRO_POLIZA,
            G: jsonReser[i].ESTADO_POLIZA,
            H: jsonReser[i].NRO_DOCUMENTO,
            I: jsonReser[i].NOMBRE_COMPLETO,
            J: jsonReser[i].RESERVA,
            K: jsonReser[i].TIPO_RESERVA,
            L: jsonReser[i].NUM_CARTA,
            M: jsonReser[i].FECHA_DENUNCIO,
            N: jsonReser[i].FECHA_RESERVA,
            O: jsonReser[i].FECHA_REGISTRO,
            P: jsonReser[i].INTERFAZ,
            Q: jsonReser[i].NRO_DOC_SINI,
            R: jsonReser[i].NOM_SINIESTRADO,
            S: jsonReser[i].FECHA_OCURRENCIA,
            T: jsonReser[i].PLACA,
            U: jsonReser[i].CLASE,
            V: jsonReser[i].USO,
            W: jsonReser[i].MARCA,
            X: jsonReser[i].MODELO,
            Y: jsonReser[i].CANAL_VENTA,
            Z: jsonReser[i].INI_VIGENCIA,
            AA: jsonReser[i].FIN_VIGENCIA,
            AB: jsonReser[i].DEPARTAMENTO,
            AC: jsonReser[i].PROVINCIA,
            AD: jsonReser[i].DISTRITO,
            AE: jsonReser[i].USUARIO,
            AF: jsonReser[i].NOMBRE_IPRESS,
            AG: jsonReser[i].RUC_IPRESS,
            AH: jsonReser[i].TIPO_ATENCION,
            AI: jsonReser[i].COMPLE_DIAGNOS,
            AJ: jsonReser[i].DIAS_DESCANSO,
            AK: jsonReser[i].INICIO_DESCANSO,
            AL: jsonReser[i].FIN_DESCANSO,
           };    
           listadosReser.push(object);
         }
         
         XLSX.utils.sheet_add_json(wr, listadosReser, { skipHeader: true, origin: 'A2' });
    
         const workbook: XLSX.WorkBook = {
           Sheets: { Reservas_SOAT : wr },
           SheetNames: ['Reservas_SOAT'],
         };
         const excelBuffer: any = XLSX.write(workbook, {
           bookType: 'xlsx',
           bookSST: false,
           type: 'array',
         });
         //const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = excelFileName + '.xlsx';
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
       }

       public exportReportLiquidacones(jsonLiqui: any[], excelFileName: string): void {
               
         const wl = XLSX.utils.json_to_sheet(
          [
            {
              A: 'Nro Siniestro',
              B: 'Cobertura',
              C: 'Cod Cobertura',
              D: 'Nro de Siniestro del Proveedor',
              E: 'Nro caso',
              F: 'Nro Póliza',
              G: 'Monto de Liquidacion',
              H: 'Nombre Persona a Pagar',
              I: 'Nro Documento Contratante',
              J: 'Nombre Completo Contratante',
              K: 'Nro Factura',
              L: 'Fec. Emisión Factura',
              M: 'Fec. Recepción Factura',
              N: 'Ruc. Proveedor',
              O: 'Nombre. Proveedor',
              P: 'Especialidad',
              Q: 'Diagnostico',
              R: 'Nro Carta',
              S: 'Fecha Liquidacion',
              T: 'Fecha Registro',
              U: 'Interfaz',
              V: 'Nombre de Siniestrado',
              W: 'Nro Documento Siniestrado',
              X: 'Nombre de Beneficiario',
              Y: 'Nro Documento Beneficiario',
              Z: 'Fecha de Ocurrencia',
              AA: 'Placa',
              AB: 'Clase',
              AC: 'Marca',
              AD: 'Modelo',
              AE: 'Uso',
              AF: 'Inicio Vigencia',
              AG: 'Fin Vigencia',
              AH: 'Departamento',
              AI: 'Provincia',
              AJ: 'Distrito',
              AK: 'Canal Venta',
              AL: 'Usuario CreaciOn',
              AM: 'Tipo Atencion',
              AN: 'Complejidad de Diagnostico',
              AO: 'Procedimiento',
              AP: 'Hospitalizacion dias',
              AQ: 'Tipo de Pago',
              AR: 'Banco',
              AS: 'Nro Cuenta',
              AT: 'RED IPRESS',
              AU: 'Estado de Cobertura',
              AV: 'IPRESS donde se Atendio',
              AW: 'RUC IPRESS',
            },
          ],
          {
            header: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW'],
            skipHeader: true,
          }
        );
       const listadosLiqui = [];
       for (let i = 0; i < jsonLiqui.length; i++) {
         const object = {
          A: jsonLiqui[i].NRO_SINIESTRO,
          B: jsonLiqui[i].COBERTURA,
          C: jsonLiqui[i].COD_COBERTURA,
          D: jsonLiqui[i].NRO_SINI_PROV,
          E: jsonLiqui[i].CASO,
          F: jsonLiqui[i].NRO_POLIZA,
          G: jsonLiqui[i].MONTO_LIQUIDACION,
          H: jsonLiqui[i].NOMBRE_PER_PAG,
          I: jsonLiqui[i].NRO_DOC_CONTRATANTE,
          J: jsonLiqui[i].NOM_CONTRATANTE,
          K: jsonLiqui[i].NRO_FACTURA,
          L: jsonLiqui[i].FEC_EMISION_FAC,
          M: jsonLiqui[i].FEC_RECEPCION_FAC,
          N: jsonLiqui[i].RUC_PROVEEDOR,
          O: jsonLiqui[i].NOMBRE_PROVEEDOR,
          P: jsonLiqui[i].ESPECIALIDAD,
          Q: jsonLiqui[i].DIAGNOSTICO,
          R: jsonLiqui[i].NUM_CARTA,
          S: jsonLiqui[i].FEC_LIQUIDACION,
          T: jsonLiqui[i].FEC_REGISTRO,
          U: jsonLiqui[i].INTERFAZ,
          V: jsonLiqui[i].NOMBRE_SINI,
          W: jsonLiqui[i].NRO_DOC_SINI,
          X: jsonLiqui[i].NOMBRE_BENEF,
          Y: jsonLiqui[i].NRO_DOC_BENEF,
          Z: jsonLiqui[i].FECHA_OCURRENCIA,
          AA: jsonLiqui[i].PLACA,
          AB: jsonLiqui[i].CLASE,
          AC: jsonLiqui[i].MARCA,
          AD: jsonLiqui[i].MODELO,
          AE: jsonLiqui[i].USO,
          AF: jsonLiqui[i].INICIO_VIGENCIA,
          AG: jsonLiqui[i].FIN_VIGENCIA,
          AH: jsonLiqui[i].DEPARTAMENTO,
          AI: jsonLiqui[i].PROVINCIA,
          AJ: jsonLiqui[i].DISTRITO,
          AK: jsonLiqui[i].CANAL_VENTA,
          AL: jsonLiqui[i].USUARIO_CREACION,
          AM: jsonLiqui[i].TIPO_ATENCION,
          AN: jsonLiqui[i].COMPLE_DIAGNOS,
          AO: jsonLiqui[i].PROCEDIMIENTO,
          AP: jsonLiqui[i].DIAS_HOSPITAL,
          AQ: jsonLiqui[i].TIPO_PAGO,
          AR: jsonLiqui[i].BANCO,
          AS: jsonLiqui[i].NRO_CUENTA,
          AT: jsonLiqui[i].RED_IPRESS,
          AU: jsonLiqui[i].ESTADO_COBERTURA,
          AV: jsonLiqui[i].IPRESS_ATENCION,
          AW: jsonLiqui[i].RUC_IPRESS,
         };    
         listadosLiqui.push(object);
       }

         XLSX.utils.sheet_add_json(wl, listadosLiqui, { skipHeader: true, origin: 'A2' });
    
         const workbook: XLSX.WorkBook = {
           Sheets: { Liquidaciones_SOAT : wl },
           SheetNames: ['Liquidaciones_SOAT'],
         };
         const excelBuffer: any = XLSX.write(workbook, {
           bookType: 'xlsx',
           bookSST: false,
           type: 'array',
         });
         //const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = excelFileName + '.xlsx';
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
       }
       
}