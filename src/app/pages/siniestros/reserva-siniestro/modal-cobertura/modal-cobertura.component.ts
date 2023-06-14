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
import { FormControl, Validators } from '@angular/forms';
import { ClaimRmvRequest } from 'src/app/core/models/claimRmvRequest';
import { ClaimRmvResponse } from 'src/app/core/models/claimRmvResponse';

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
  
  public model = new ClaimCodDiagnosticoResponse()
  dataReserva = new ClaimCoverTmpRequestBM();

  inicioDescanso = new FormControl('', Validators.required)
  finDescanso= new FormControl('', Validators.required)
  menoscabo= new FormControl('', Validators.required)

  fechaDerivacion = new Date();
  fechaRespuesta = new Date();
  fechaEmision = new Date();
  fechaRecepcion = new Date();

  rmvResponse = new ClaimRmvResponse();
  modelCabo : any;

  diagnosticoValue = "";

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
    
    this.validacionPorCobertura();
    this.getCobertura();
  }

  validacionPorCobertura(){
    if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Gastos_Sepelio) {
      this.obtenerTiposComprobantes(); 
      this.dataReserva.NTYPERECEIPT = 0;
      this.dataReserva.SAFFECTIGV = "1";
      if(this.data == Cobertura.Gastos_Medicos)  this.dataReserva.SREFUND = '0';
    }

    if(this.data == Cobertura.Incapacidad_Temporal) this.obtenerRMV();

    if(this.data == Cobertura.Incapacidad_Temporal || this.data == Cobertura.Invalidez_Permanente) {
      this.dataReserva.SINR_REFERRAL = '0';
    }

    this.dataReserva.SPROCESSOR = '1';
    this.dataReserva.SLOCATED = '0';
    this.dataReserva.SPROCESSORNAME = "";
    this.dataReserva.SPROCESSORZONE = "";
    
    if(this.data != Cobertura.Muerte) this.dataReserva.SDIAGNOSTICCOMPLEXITY = "0";
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
        if(res.SKEY != null){
          this.claimCoverReserveResponse = res;
          //Mapeo
          this.dataReserva.LIST_BENEF_COVERS = res.LIST_BENEF_COVERS;
          this.model.CCODCIE10 = res.SDIAGNOSTICCODE;
          this.model.CDESCRIPT = res.SDIAGNOSTIC;
          this.diagnosticoValue = res.SDIAGNOSTIC;
          this.dataReserva.SPROCESSOR = res.SPROCESSOR;
          this.dataReserva.SPROCESSORNAME = res.SPROCESSORNAME;
          this.dataReserva.SPROCESSORZONE = res.SPROCESSORZONE;
          this.dataReserva.SLOCATED = res.SLOCATED;

          if(this.data == Cobertura.Incapacidad_Temporal ){
            this.dataReserva.SSPECIALTY = res.SSPECIALTY;
            this.dataReserva.SDIAGNOSTICCOMPLEXITY = res.SDIAGNOSTICCOMPLEXITY;
            this.dataReserva.SATTENDINGMEDIC = res.SATTENDINGMEDIC;
            this.dataReserva.SATENTIONIPRESS = res.SATENTIONIPRESS;
            this.dataReserva.NMINIMUNREMUNERATION = res.NMINIMUNREMUNERATION;
            this.dataReserva.NDAYSOFF = res.NDAYSOFF;
            this.dataReserva.NRESERVEAMOUNT = res.NRESERVEAMOUNT;
            let anio = new Date(res.DRESTSTART).getFullYear()
            let mes = new Date(res.DRESTSTART).getFullYear()
            console.log(mes, anio);
            
            this.inicioDescanso.setValue(this.datePipe.transform(res.DRESTSTART, 'yyyy-MM-dd'));
            this.finDescanso.setValue(this.datePipe.transform(res.DRESTEND, 'yyyy-MM-dd'));
            this.dataReserva.SINR_REFERRAL = res.SINR_REFERRAL;
            this.dataReserva.SINR_FILENUMBER = res.SINR_FILENUMBER;
            this.fechaDerivacion = new Date(this.datePipe.transform(res.DINR_REFERRALDATE, 'yyyy-MM-dd'))
            this.fechaRecepcion = new Date(this.datePipe.transform(res.DINR_RESPONSEDATE, 'yyyy-MM-dd'));
          }
        }
        Swal.close()
      },
      err => {
        Swal.close();
        console.log(err);
      }
    )
  }

  obtenerRMV(){
    let rmv = new ClaimRmvRequest();
    rmv.P_DOCCURDAT = this.reservaCaso.DOCCURDAT;
    this.reserveService.GetRmv(rmv).subscribe(
      res => {
        this.rmvResponse = res[0];
        this.dataReserva.NMINIMUNREMUNERATION = res[0].N_RMV;
      },
      err => {
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

  changeFechasDescanso(){
    let inicio = new Date(this.inicioDescanso.value);
    let fin = new Date(this.finDescanso.value);

    if(this.inicioDescanso.value != "" && this.finDescanso.value != ""){
      if(inicio > fin){
        Swal.fire('Información','La fecha de inicio de descanso no debe ser mayor a la fecha fin de descanso', 'warning');
        this.dataReserva.NDAYSOFF = null;
        this.dataReserva.NRESERVEAMOUNT = null;
        return;
      }else{
        this.dataReserva.NDAYSOFF = ((fin.getTime() - inicio.getTime())/(1000*60*60*24)) + 1;
        this.dataReserva.NRESERVEAMOUNT = Number((this.rmvResponse.N_RMV / (30 * this.dataReserva.NDAYSOFF)).toFixed(2))
      }
    }
  }

  changeMenoscabo(){
    let menoscabo = this.menoscabo.value;
    if(menoscabo < 0 || menoscabo > 100){
      Swal.fire('Información','Debe introducir un porcentaje válido','warning');
      this.dataReserva.NIMPAIRMENT = null;
      this.dataReserva.NRESERVEAMOUNT = null
      return;
    }else{
      let cover = this.reservaCaso.LISTA_COVERCLAIM.find(x => x.NCOVER == this.data).NDAMAGES;
      this.dataReserva.NIMPAIRMENT = menoscabo;
      this.dataReserva.NRESERVEAMOUNT = this.reservaCaso.UIT * cover * (this.dataReserva.NIMPAIRMENT / 100)
    }
  }

  guardarTablaTemporal(){
    if(this.beneficiarios.length > 0){
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
    }else{
      this.dataReserva.LIST_BENEF_COVERS = [];
    }

    let claimData = this.reservaCaso.LISTA_COVERCLAIM.find(x => x.NCOVER == this.data);
    this.dataReserva.NUITQUANTITY = claimData.NDAMAGES;
    this.dataReserva.NUITAMOUNT = this.reservaCaso.UIT;
    this.dataReserva.NAMOUNT = claimData.NSUMINSURED;

    this.dataReserva.SKEY = this.reservaCaso.SKEY;
    this.dataReserva.NCASE = Number(this.reservaCaso.NCASE_NUM);
    this.dataReserva.NCLAIM = Number(this.reservaCaso.NCLAIM);
    this.dataReserva.NCOVER = this.data;
    if(this.model){
      this.dataReserva.SDIAGNOSTICCODE = this.model.CCODCIE10;
      this.dataReserva.SDIAGNOSTIC = this.model.CDESCRIPT;
    }

    this.dataReserva.STYPEATTENTION = this.reservaCaso.STIPOATENCION;

    if(this.data == Cobertura.Incapacidad_Temporal){
      if(this.inicioDescanso.invalid || this.finDescanso.invalid){
        this.inicioDescanso.markAllAsTouched();
        this.finDescanso.markAllAsTouched();
        return;
      }else{
        this.changeFechasDescanso() //Validacion de fechas;
        this.dataReserva.DRESTSTART =  this.datePipe.transform(this.inicioDescanso.value, 'dd/MM/yyyy')
        this.dataReserva.DRESTEND = this.datePipe.transform(this.finDescanso.value, 'dd/MM/yyyy')
      }
    }

    if(this.data == Cobertura.Invalidez_Permanente){
      if(this.menoscabo.invalid){
        this.menoscabo.markAllAsTouched();
        return;
      }else{
        this.changeMenoscabo()
      }
    }

    if(this.data == Cobertura.Incapacidad_Temporal || this.data == Cobertura.Invalidez_Permanente){
      this.dataReserva.DINR_REFERRALDATE =  this.datePipe.transform(this.fechaDerivacion, 'dd/MM/yyyy')
      this.dataReserva.DINR_RESPONSEDATE = this.datePipe.transform(this.fechaRespuesta, 'dd/MM/yyyy')
    }

    if(this.dataReserva.SPROCESSOR == "1"){
      if (this.dataReserva.SPROCESSORNAME.replace(/ /g, "") == "" || this.dataReserva.SPROCESSORZONE.replace(/ /g, "") == ""){
        Swal.fire('Información','Debe completar los campos de tramitador.', 'warning');
        return;
      }
    }else{
      this.dataReserva.SPROCESSORNAME = "";
      this.dataReserva.SPROCESSORZONE = "";
    }

    if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Muerte){
      this.dataReserva.DDATEOFISSUE = this.datePipe.transform(this.fechaEmision, 'dd/MM/yyyy');
      this.dataReserva.DDATERECEPTION = this.datePipe.transform(this.fechaRecepcion, 'dd/MM/yyyy');
    }


    console.log(this.dataReserva);
    Swal.showLoading();
    this.reserveService.InsertDatCoversTmp(this.dataReserva).subscribe(
      res => {
        Swal.close();
        this.reference.close(res)
      },
      err => {
        Swal.close();
        console.log(err);        
      }
    )
    

  }


}
