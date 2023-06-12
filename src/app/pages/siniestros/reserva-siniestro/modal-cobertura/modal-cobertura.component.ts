import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalBeneficiarioComponent } from '../modal-beneficiario/modal-beneficiario.component';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { ClaimComboResponse } from 'src/app/core/models/claimComboResponse';
import { Observable, OperatorFunction, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { ClaimCodDiagnosticoRequest } from 'src/app/core/models/claimCodDiagnosticoRequest';
import { ClaimCodDiagnosticoResponse } from 'src/app/core/models/claimCodDiagnosticoResponse';
import { ClaimBeneficiarioRequest } from 'src/app/core/models/claimBeneficiarioRequest';
import { BeneficiariesVM } from 'src/app/core/models/claimBenefParamResponse';
import { Cobertura } from 'src/app/core/enums/cobertura.enum';
import { ClaimsCoversReserveRequest } from 'src/app/core/models/claimsCoversReserveRequest';
import { ClaimsCoversReserveResponse } from 'src/app/core/models/claimsCoversReserveResponse';
import { ClaimCoverTmpRequestBM, ClaimsBenefCoverVM } from 'src/app/core/models/claimCoverTmpRequest';
import { ClaimCoverResponse } from 'src/app/core/models/claimCoverResponse';
import { DatePipe } from '@angular/common';

export class Beneficiario {
  codigoCliente: string;
  beneficiario: string;
  tipoDocumento: string;
  tipoBeneficiario: string;
  nroCuenta: string;
  cobertura: string;
  nroDocumento: string;
}
@Component({
  selector: 'app-modal-cobertura',
  templateUrl: './modal-cobertura.component.html',
  styleUrls: ['./modal-cobertura.component.scss']
})
export class ModalCoberturaComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: any;
  @Input() public reservaCaso: ClaimCoverResponse;

  beneficiarios: BeneficiariesVM[] = [];
  datosTramitador = "1";
  comboGeneral$ = this.reserveService.GetComboGeneral();
  comboDiagnostico : ClaimComboResponse []=[{SCODIGO:'SELECCIONE',SDESCRIPCION:'Diagnóstico (CIE10)'}];

  codigoDiagnostico = new ClaimComboResponse();
  codigoComplejidad = "0";
  comboComplejidadDiagnostico$ = this.reserveService.GetComboComplejidadDiagnostico();
  bancos : ClaimComboResponse[] = [];

  tiposComprobantes : ClaimComboResponse[]=[];
  @Output() tipoModal : EventEmitter<number>;

  claimCoverReserveResponse = new ClaimsCoversReserveResponse();
  
  public model: any;
  dataReserva = new ClaimCoverTmpRequestBM();

  inicioDescanso = new Date();
  finDescanso= new Date();
  fechaDerivacion = new Date();
  fechaRespuesta = new Date();

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(800),
			distinctUntilChanged(),
			switchMap((term) => term.length < 4 ? of([]) : 
        this.reserveService.GetComboCodDiagnostico(term)
			),
		);

  formatter = (result: ClaimCodDiagnosticoResponse) => result.CDESCRIPT;


  constructor(private modalService: NgbModal, public reserveService: ReserveService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Gastos_Sepelio) this.obtenerTiposComprobantes();
    console.log(this.reservaCaso);
    
    //Get Temp
    this.getCobertura();
    this.dataReserva.SPROCESSOR = '1';
    this.dataReserva.SLOCATED = '0';
    this.dataReserva.SINR_REFERRAL = '0';
    this.dataReserva.NTYPERECEIPT = 0;
    
  }

  closeModal() {
    this.reference.close();
  }

  getCobertura(){
    let data = new ClaimsCoversReserveRequest();
    data.SKEY = this.reservaCaso.SKEY;
    data.NCOVER = this.data;
    Swal.showLoading();
    this.reserveService.GetDatCoversTmp(data).subscribe(
      res => {
        this.claimCoverReserveResponse = res;
        console.log(res);
        Swal.close()
      },
      err => {
        Swal.close();
        console.log(err);
      }
    )
  }

  obtenerTiposComprobantes(){
    this.reserveService.GetComboTipoComprobante().subscribe(
      res =>{
        this.tiposComprobantes = res
      }
    )
  }


  openBeneficiario(){
    const modalRef = this.modalService.open(ModalBeneficiarioComponent, { size: 'lg', backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.result.then((benef) => {
      if(benef != undefined && benef.SCODE){
        Swal.showLoading();
        let data = new ClaimBeneficiarioRequest();
        data.SCODCLI = benef.SCODE.trim();
        this.reserveService.GetBeneficiariesAdditionalDataCover(data).subscribe(
          res =>{
            Swal.close();
            console.log(res);
            
            this.beneficiarios.push(res.ListBeneficiaries[0])
            if(this.beneficiarios.length == 1){
              this.reserveService.GetComboBanco().subscribe(
                res => {
                  this.bancos = res;
                }
              )
            }
          },
          err => {
            Swal.close();
            console.log(err);
          }
        )
      }
    });
  }

  borrarBeneficiario(i:number){
    this.beneficiarios.splice(i,1);
  }

  guardarTablaTemporal(){
    let data = new ClaimCoverTmpRequestBM();
    this.beneficiarios.forEach(benef => {
      this.dataReserva.LIST_BENEF_COVERS.push({
        SCODCLI : benef.SCODE,
        SBENEFICIARY : benef.SNAME,
        SDOCUMENTTYPE : benef.SCODDOCUMENTTYPE,
        SDOCUMENTNUMBER : benef.SDOCUMENTNUMBER,
        SBENEFICIARYTYPE : benef.SCODBENEFICIARYTYPE,
        SCOVER_DESC : this.data,
        SBANK : benef.SBANK,
        SACCOUNTNUMBER :  benef.SACCOUNTNUMBER
      })
    })

    this.dataReserva.SKEY = this.reservaCaso.SKEY;
    this.dataReserva.NCASE = Number(this.reservaCaso.NCASE_NUM);
    this.dataReserva.NCLAIM = Number(this.reservaCaso.NCLAIM);
    this.dataReserva.NCOVER = this.data;
    //Suma Asegurada -->
    //Fecha Fin Analisis
    this.dataReserva.SDIAGNOSTICCODE = this.model.CCODCIE10;
    this.dataReserva.SDIAGNOSTIC = this.model.CDESCRIPT;
    this.dataReserva.STYPEATTENTION = this.reservaCaso.STIPOATENCION;

    if(this.data == Cobertura.Incapacidad_Temporal){
      this.dataReserva.DRESTSTART =  this.datePipe.transform(this.inicioDescanso, 'dd/MM/yyyy')
      this.dataReserva.DRESTEND = this.datePipe.transform(this.finDescanso, 'dd/MM/yyyy')
    }

    if(this.data == Cobertura.Incapacidad_Temporal || this.data == Cobertura.Invalidez_Permanente){
      this.dataReserva.DINR_REFERRALDATE =  this.datePipe.transform(this.fechaDerivacion, 'dd/MM/yyyy')
      this.dataReserva.DINR_RESPONSEDATE = this.datePipe.transform(this.fechaRespuesta, 'dd/MM/yyyy')
    }

    console.log(this.dataReserva);
    

  }


}
