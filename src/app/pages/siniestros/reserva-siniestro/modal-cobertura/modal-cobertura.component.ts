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
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  tipoAtencion= new FormControl('0', [Validators.required, this.notAllowed(/^0/)])
  baseImponible= new FormControl(0, [Validators.required, this.notAllowed(/^0/)])

  fechaDerivacion : any;
  fechaRespuesta : any;
  fechaEmision : any;
  fechaRecepcion : any;

  rmvResponse = new ClaimRmvResponse();
  modelCabo : any;
  modelBase: any;

  diagnosticoValue = "";
  tiposAtencion : ClaimComboResponse[]=[];

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(800),
			distinctUntilChanged(),
			switchMap((term) => term.length < 4 ? of([]) : 
        this.reserveService.GetComboCodDiagnostico(term)
			),
		);

  formatter = (result: ClaimCodDiagnosticoResponse) => result.CDESCRIPT;
      
  notAllowed(input: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = input.test(control.value);
      return forbidden ? {notAllowed: {value: control.value}} : null;
    };
  }

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

      if(this.data == Cobertura.Gastos_Medicos) {
        this.dataReserva.SREFUND = '0';
        this.reserveService.GetComboTipoAtencion().subscribe(
          res => {
            this.tiposAtencion = res;
          },
          err => {
            console.log(err);
          }
        );
      } 
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
            this.inicioDescanso.setValue(this.datePipe.transform(res.DRESTSTART, 'yyyy-MM-dd'));
            this.finDescanso.setValue(this.datePipe.transform(res.DRESTEND, 'yyyy-MM-dd'));
            this.dataReserva.SINR_REFERRAL = res.SINR_REFERRAL;
            this.dataReserva.SINR_FILENUMBER = res.SINR_FILENUMBER;

            if(res.DINR_REFERRALDATE) this.fechaDerivacion = this.datePipe.transform(res.DINR_REFERRALDATE, 'yyyy-MM-dd')
            if(res.DINR_RESPONSEDATE) this.fechaRespuesta = this.datePipe.transform(res.DINR_RESPONSEDATE, 'yyyy-MM-dd');
          }

          if(this.data == Cobertura.Invalidez_Permanente){
            this.menoscabo.setValue(res.NIMPAIRMENT);
            this.dataReserva.NRESERVEAMOUNT = res.NRESERVEAMOUNT;
            this.dataReserva.SINR_REFERRAL = res.SINR_REFERRAL;
            this.dataReserva.SINR_FILENUMBER = res.SINR_FILENUMBER;
            if(res.DINR_REFERRALDATE) this.fechaDerivacion = this.datePipe.transform(res.DINR_REFERRALDATE, 'yyyy-MM-dd')
            if(res.DINR_RESPONSEDATE) this.fechaRespuesta = this.datePipe.transform(res.DINR_RESPONSEDATE, 'yyyy-MM-dd');
          }

          if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Gastos_Sepelio){

            if(this.data == Cobertura.Gastos_Medicos) {
              this.dataReserva.SNROLETTER = res.SNROLETTER;
              this.dataReserva.SREFUND = res.SREFUND;
              this.tipoAtencion.setValue(res.STYPEATTENTION);
            }

            this.dataReserva.NTYPERECEIPT = res.NTYPERECEIPT;
            this.dataReserva.SVOUCHERNUMBER = res.SVOUCHERNUMBER;
            this.dataReserva.SREFERENTIALNAMEIPRESS = res.SREFERENTIALNAMEIPRESS;
            this.dataReserva.SRUC = res.SRUC;
            this.dataReserva.SRED_IPRESS = res.SRED_IPRESS;
            this.baseImponible.setValue(res.NAMOUNTBASE);
            this.dataReserva.NIGV = res.NIGV;
            this.dataReserva.NAMOUNTTOTAL = res.NAMOUNTTOTAL;
            this.dataReserva.SAFFECTIGV = res.SAFFECTIGV;

            if(res.DDATEOFISSUE) this.fechaEmision = this.datePipe.transform(res.DDATEOFISSUE, 'yyyy-MM-dd')
            if(res.DDATERECEPTION) this.fechaRecepcion = this.datePipe.transform(res.DDATERECEPTION, 'yyyy-MM-dd');
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
            if(res.ListBeneficiaries[0].SBANK == "") res.ListBeneficiaries[0].SBANK = "0";
            
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

  changeBaseImponible(){
    if(this.modelBase > 0){
      if(this.dataReserva.SAFFECTIGV == "1"){
        this.dataReserva.NIGV = Number((this.modelBase * 0.18).toFixed(2));
        this.dataReserva.NAMOUNTTOTAL = Number((this.modelBase + this.dataReserva.NIGV).toFixed(2));
      }else{
        this.dataReserva.NIGV = 0;
        this.dataReserva.NAMOUNTTOTAL = this.modelBase;
      }
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
    this.dataReserva.SMOVETYPE = this.reservaCaso.SMOVETYPE;

    this.dataReserva.SKEY = this.reservaCaso.SKEY;
    this.dataReserva.NCASE = Number(this.reservaCaso.NCASE_NUM);
    this.dataReserva.NCLAIM = Number(this.reservaCaso.NCLAIM);
    this.dataReserva.NCOVER = this.data;
    if(this.model){
      this.dataReserva.SDIAGNOSTICCODE = this.model.CCODCIE10;
      this.dataReserva.SDIAGNOSTIC = this.model.CDESCRIPT;
    }

    if(this.data == Cobertura.Gastos_Medicos){
        if(this.modelBase < 0){
          Swal.fire('Información', 'Base imponible inválida.','error');
          return;
        }

        if(this.tipoAtencion.invalid || this.baseImponible.invalid){
          this.tipoAtencion.markAllAsTouched();
          this.baseImponible.markAllAsTouched();
          return;
        }else{
          this.dataReserva.STYPEATTENTION = this.tipoAtencion.value;
          this.dataReserva.NAMOUNTBASE = this.baseImponible.value;
        }
    }

    if(this.data == Cobertura.Gastos_Sepelio){
      if(this.modelBase < 0){
        Swal.fire('Información', 'Base imponible inválida.','error');
        return;
      }
      if(this.baseImponible.invalid){
        this.tipoAtencion.markAllAsTouched();
        return;
      }else{
        this.dataReserva.STYPEATTENTION = this.tipoAtencion.value;
        this.dataReserva.NAMOUNTBASE = this.baseImponible.value;
      }
    }

    //this.dataReserva.STYPEATTENTION = this.reservaCaso.STIPOATENCION;

    if(this.data == Cobertura.Incapacidad_Temporal){
      if(this.inicioDescanso.invalid || this.finDescanso.invalid){
        this.inicioDescanso.markAllAsTouched();
        this.finDescanso.markAllAsTouched();
        return;
      }else{
        this.changeFechasDescanso() //Validacion de fechas;
        this.dataReserva.DRESTSTART =  this.datePipe.transform(this.inicioDescanso.value, 'dd/MM/yyyy')
        this.dataReserva.DRESTEND = this.datePipe.transform(this.finDescanso.value, 'dd/MM/yyyy');
        this.dataReserva.DOCCURDAT = this.reservaCaso.DOCCURDAT;
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

    if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Gastos_Sepelio){
      this.dataReserva.DDATEOFISSUE = this.datePipe.transform(this.fechaEmision, 'dd/MM/yyyy');
      this.dataReserva.DDATERECEPTION = this.datePipe.transform(this.fechaRecepcion, 'dd/MM/yyyy');
    }


    console.log(this.dataReserva);
    Swal.showLoading();
    this.reserveService.InsertDatCoversTmp(this.dataReserva).subscribe(
      res => {
        Swal.close();
        if(res.SRESULT == "OK"){
          this.reference.close(res);
          Swal.fire('Información', 'Datos de la cobertura ingresados correctamente.','success')
        }else{
          Swal.fire('Información',res.SRESULT,'error');
          return;
        }
      },
      err => {
        Swal.close();
        console.log(err);        
      }
    )
    

  }


}
