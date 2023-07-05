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
import { ClaimValCoverRequest } from 'src/app/core/models/claimValCoverRequest';
import { ClaimDeleteBenefRequest } from 'src/app/core/models/claimDeleteBenefReques';
import { ClaimUpdateDatAddRequestBM } from 'src/app/core/models/claimUpdateDatAddRequest';
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';
import { SwalCarga } from "src/app/core/swal-loading";

@Component({
  selector: 'app-modal-cobertura',
  templateUrl: './modal-cobertura.component.html',
  styleUrls: ['./modal-cobertura.component.scss']
})
export class ModalCoberturaComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: any;
  @Input() public reservaCaso: ClaimCoverResponse;
  @Input() public tab : number;
  @Input() public disabledBotones : boolean;

  beneficiarios: BeneficiariesVM[] = [];
  listCodeBeneficiarios : string[] = [];

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

  constructor(private modalService: NgbModal, public reserveService: ReserveService, private datePipe: DatePipe, public authProtectaService: AuthProtectaService) { }

  ngOnInit(): void {
    this.validacionPorCobertura();
    //this.getCobertura();

    if(this.tab == 2) this.obtenerReservaDefinitiva();
  }

  obtenerReservaDefinitiva(){
    let request = new ClaimValCoverRequest();
    request.NCASE_NUM = Number(this.reservaCaso.NCASE_NUM);
    request.NCLAIM =  Number(this.reservaCaso.NCLAIM);
    request.NCOVER = this.data;
    SwalCarga();
    this.reserveService.GetDataAddBenefCover(request).subscribe(
      res => {
        Swal.close();
        if(res.ListBeneficiariesUltimates != null){
          this.obtenerBancos()
          res.ListBeneficiariesUltimates.forEach(benef => {
            this.beneficiarios.push({
              SCODE : benef.SCLIENT,
              SNAME : benef.SCLIENTNAME,
              SDOCUMENTTYPE : benef.SDESCRIPTYPCLIENTDOC,
              SDOCUMENTNUMBER : benef.SDOCUMENTNUMBER,
              SBENEFICIARYTYPE : benef.SBENEFICIARYTYPE,
              NCODBENEFICIARYTYPE : benef.NCODBENEFICIARYTYPE.toString(),
              SCOVER_DESC : this.data,
              SBANK : benef.NBANK_CODE.toString(),
              SACCOUNTNUMBER :  benef.SACCOUNT,
              NCODDOCUMENTTYPE : benef.NTYPCLIENTDOC.toString()
            })
            this.listCodeBeneficiarios.push(benef.SCLIENT);
          })
        }

        this.dataReserva.NCLAIM = res.NCLAIM;
        this.dataReserva.NCASE = res.NCASE_NUM;
        this.dataReserva.NCOVER = res.NCOVER;
        this.dataReserva.SLOCATED  = res.SLOCATED;
        this.dataReserva.SPROCESSOR = res.SPROCESSOR;
        this.dataReserva.SPROCESSORNAME = res.SPROCESSOR_NAME;
        this.dataReserva.SPROCESSORZONE = res.SPROCESSOR_AREA;
        this.model.CCODCIE10 = res.SCODIGODIAGNOSTICO;
        this.model.CDESCRIPT = res.CDESCRIPT;
        this.diagnosticoValue = res.CDESCRIPT ;
        
        this.dataReserva.NTRANSAC = res.NTRANSAC;
        //this.model.CDESCRIPT = res.SDIAGNOSTIC;

        if(this.data == Cobertura.Incapacidad_Temporal ){
          this.dataReserva.SSPECIALTY = res.SESPECIALIDAD;
          this.dataReserva.SDIAGNOSTICCOMPLEXITY = res.SCOMPLEXITY;
          this.dataReserva.SATTENDINGMEDIC = res.SNOMBREDOCTOR;
          this.dataReserva.SATENTIONIPRESS = res.SIPRESS_AT;
          this.dataReserva.NMINIMUNREMUNERATION = res.NRMV;
          //this.dataReserva.NDAYSOFF = res.NDAYSOFF;
          //this.dataReserva.NRESERVEAMOUNT = res.NRESERVEAMOUNT;
          this.inicioDescanso.setValue(res.FINIDESCANSO);
          this.inicioDescanso.disable();
          this.finDescanso.setValue(res.FFINDESCANSO);
          this.finDescanso.disable();
          this.dataReserva.SINR_REFERRAL = res.SDERIVATIONINR;
          this.dataReserva.SINR_FILENUMBER = res.SPROCEEDING;

          //Calculo reserva - dias descanso 
          let fIni = res.FINIDESCANSO.split("/");
          let fechaInicio = new Date(fIni[2] + '/' + fIni[1] + '/' + fIni[0]);
          let fFin = res.FFINDESCANSO.split("/");
          let fechaFinal = new Date(fFin[2] + '/' + fFin[1] + '/' + fFin[0]);
          this.dataReserva.NDAYSOFF = ((fechaFinal.getTime() - fechaInicio.getTime())/(1000*60*60*24)) + 1;
          this.dataReserva.NRESERVEAMOUNT = Number(((this.rmvResponse.N_RMV / 30) * this.dataReserva.NDAYSOFF).toFixed(2))


          if(res.FDERIVATION){
            let fDeriva = res.FDERIVATION.split("/");
            let fechaDerivac = new Date(fDeriva[2] + '/' + fDeriva[1] + '/' + fDeriva[0]);
            this.fechaDerivacion = this.datePipe.transform(fechaDerivac, 'yyyy-MM-dd');
          }

          if(res.FANSWER){
            let fRest = res.FANSWER.split("/");
            let fechaResp = new Date(fRest[2] + '/' + fRest[1] + '/' + fRest[0]);
            this.fechaRespuesta = this.datePipe.transform(fechaResp, 'yyyy-MM-dd');
          }
        }

        if(this.data == Cobertura.Invalidez_Permanente){
          this.menoscabo.setValue(res.NIMPAIRMENT);
          this.menoscabo.disable();
          //this.dataReserva.NRESERVEAMOUNT = res.NRESERVEAMOUNT;
          this.dataReserva.SINR_REFERRAL = res.SDERIVATIONINR;
          this.dataReserva.SINR_FILENUMBER = res.SPROCEEDING;
          this.dataReserva.SSPECIALTY = res.SESPECIALIDAD;
          this.dataReserva.SDIAGNOSTICCOMPLEXITY = res.SCOMPLEXITY;
          this.dataReserva.SATTENDINGMEDIC = res.SNOMBREDOCTOR;
          this.dataReserva.SATENTIONIPRESS = res.SIPRESS_AT;
          this.modelCabo = res.NIMPAIRMENT;
          this.changeMenoscabo();

          if(res.FDERIVATION){
            let fDeriva = res.FDERIVATION.split("/");
            let fechaDerivac = new Date(fDeriva[2] + '/' + fDeriva[1] + '/' + fDeriva[0]);
            this.fechaDerivacion = this.datePipe.transform(fechaDerivac, 'yyyy-MM-dd');
          }

          if(res.FANSWER){
            let fRest = res.FANSWER.split("/");
            let fechaResp = new Date(fRest[2] + '/' + fRest[1] + '/' + fRest[0]);
            this.fechaRespuesta = this.datePipe.transform(fechaResp, 'yyyy-MM-dd');
          }
        }

        if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Gastos_Sepelio){

          this.dataReserva.SSPECIALTY = res.SESPECIALIDAD;
          this.dataReserva.SDIAGNOSTICCOMPLEXITY = res.SCOMPLEXITY;
          this.dataReserva.SATTENDINGMEDIC = res.SNOMBREDOCTOR;
          this.dataReserva.SATENTIONIPRESS = res.SIPRESS_AT;

          if(this.data == Cobertura.Gastos_Medicos) {
            this.dataReserva.SNROLETTER = res.SORDER_NUM;
            this.dataReserva.SREFUND = res.SREFUND;
            this.tipoAtencion.setValue(res.STIPOATENCION);
          }

          this.dataReserva.NTYPERECEIPT = res.NDOC_TYPE;
          this.dataReserva.SVOUCHERNUMBER = res.SBILL;
          this.dataReserva.SRUC = res.SRUCPROVEEDOR;
          this.dataReserva.SRED_IPRESS = res.SRED_IPRESS;
          this.baseImponible.setValue(res.NAMOUNT);
          this.baseImponible.disable();
          //this.dataReserva.NIGV = res.NIGV;
          //this.dataReserva.NAMOUNTTOTAL = res.NAMOUNTTOTAL;
          this.dataReserva.SREFERENTIALNAMEIPRESS = res.SNOMBREPROVEEDOR;
          this.dataReserva.SAFFECTIGV = res.SAFFECTS_IGV;

          if(res.FECHAEMISIONFACTURA){
            let fEmi = res.FECHAEMISIONFACTURA.split("/");
            let fechaEmi = new Date(fEmi[2] + '/' + fEmi[1] + '/' + fEmi[0]);
            this.fechaEmision = this.datePipe.transform(fechaEmi, 'yyyy-MM-dd');
          }

          if(res.FECHARECEPCIONFACTURA){
            let fRecep = res.FECHARECEPCIONFACTURA.split("/");
            let fechaRecep = new Date(fRecep[2] + '/' + fRecep[1] + '/' + fRecep[0]);
            this.fechaRecepcion = this.datePipe.transform(fechaRecep, 'yyyy-MM-dd');
          }
        }
      },
      err => {
        Swal.close();
        Swal.fire('Error', err , 'error');
      }
    )
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
            Swal.fire('Información',err,'error');
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
    Swal.fire({
      title: 'Información',
      text: 'Desea salir de la operación',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.reference.close();
      }
    })
  }

  getCobertura(){
    let data = new ClaimsCoversReserveRequest();
    data.SKEY = this.reservaCaso.SKEY;
    data.NCOVER = this.data;
    SwalCarga();
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
        Swal.fire('Información',err,'error');
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
        Swal.fire('Información',err,'error');
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

  obtenerBancos(){
    this.reserveService.GetComboBanco().subscribe(
      res => {
        this.bancos = res;
      }
    )
  }

  openBeneficiario(){
    const modalRef = this.modalService.open(ModalBeneficiarioComponent, { size: 'lg', backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.componentInstance.beneficiarios = this.beneficiarios;
    modalRef.result.then((benef) => {
      if((benef != undefined && benef.SCODE) || (benef != undefined && benef.P_SCOD_CLIENT)){
        SwalCarga();
        let data = new ClaimBeneficiarioRequest();
        if(benef.SCODE) data.SCODCLI = benef.SCODE.trim();
        if(benef.P_SCOD_CLIENT) data.SCODCLI = benef.P_SCOD_CLIENT.trim();

        this.reserveService.GetBeneficiariesAdditionalDataCover(data).subscribe(
          res =>{
            Swal.close();
            if(res.ListBeneficiaries[0].SBANK == "") res.ListBeneficiaries[0].SBANK = "0";
            
            this.beneficiarios.push(res.ListBeneficiaries[0])
            if(this.beneficiarios.length == 1){
              this.obtenerBancos()
            }
          },
          err => {
            Swal.close();
            Swal.fire('Información',err,'error');
          }
        )
      }
    });
  }

  borrarBeneficiario(i:number, sclient?:any){
    if(this.tab == 1){
      this.beneficiarios.splice(i,1);
    }else{
      let clientDelete = this.listCodeBeneficiarios.find(x => x == sclient);
      if(!clientDelete){
        this.beneficiarios.splice(i,1);
      }else{
        Swal.fire({
          title: 'Información',
          text: "¿Está seguro de eliminar al beneficiario?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'De acuerdo',
          cancelButtonText: 'No',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            let request = new ClaimDeleteBenefRequest();
            request.NCASE_NUM = this.reservaCaso.NCASE_NUM;
            request.NCLAIM = this.reservaCaso.NCLAIM;
            request.NCOVER = this.data;
            request.SCLIENT = sclient;
            SwalCarga();
            this.reserveService.DeleteBenefCover(request).subscribe(
              res => {
                Swal.close()
                if (res == 'OK') {
                  this.beneficiarios.splice(i, 1);
                  Swal.fire('Información', 'Beneficiario eliminado correctamente', 'success');
                } else {
                  Swal.fire('Información', res, 'warning');
                  return;
                }
              },
              err => {
                Swal.close()
                Swal.fire('Error', err, 'error');
              }
            )
          }
        })
      }
    }
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
        this.dataReserva.NRESERVEAMOUNT = Number(((this.rmvResponse.N_RMV / 30) * this.dataReserva.NDAYSOFF).toFixed(2))
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
      this.dataReserva.NRESERVEAMOUNT = Number((this.reservaCaso.UIT * cover * (this.dataReserva.NIMPAIRMENT / 100)).toFixed(2))
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
    let claimData = this.reservaCaso.LISTA_COVERCLAIM.find(x => x.NCOVER == this.data);
    this.dataReserva.NUITQUANTITY = claimData.NDAMAGES;
    this.dataReserva.NUITAMOUNT = this.reservaCaso.UIT;
    this.dataReserva.NAMOUNT = claimData.NSUMINSURED;
    this.dataReserva.SMOVETYPE = this.reservaCaso.SMOVETYPE;
    if(this.data == Cobertura.Muerte) this.dataReserva.NRESERVEAMOUNT = claimData.NSUMINSURED;
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
          this.dataReserva.LIST_BENEF_COVERS = [];
          return;
        }

        if(this.tipoAtencion.invalid || this.baseImponible.invalid){
          this.tipoAtencion.markAllAsTouched();
          this.baseImponible.markAllAsTouched();
          this.dataReserva.LIST_BENEF_COVERS = [];
          return;
        }else{
          this.dataReserva.STYPEATTENTION = this.tipoAtencion.value;
          this.dataReserva.NAMOUNTBASE = this.baseImponible.value;
        }
    }

    if(this.data == Cobertura.Gastos_Sepelio){
      if(this.modelBase < 0){
        Swal.fire('Información', 'Base imponible inválida.','error');
        this.dataReserva.LIST_BENEF_COVERS = [];
        return;
      }
      if(this.baseImponible.invalid){
        this.baseImponible.markAllAsTouched();
        this.dataReserva.LIST_BENEF_COVERS = [];
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
        this.dataReserva.LIST_BENEF_COVERS = [];
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
        this.dataReserva.LIST_BENEF_COVERS = [];
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
        this.dataReserva.LIST_BENEF_COVERS = [];
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

    if(this.beneficiarios.length > 0){
      this.beneficiarios.forEach(benef => {
        this.dataReserva.LIST_BENEF_COVERS.push({
          SCODCLI : benef.SCODE,
          SBENEFICIARY : benef.SNAME,
          SDOCUMENTTYPE : benef.SDOCUMENTTYPE,
          SDOCUMENTNUMBER : benef.SDOCUMENTNUMBER,
          SBENEFICIARYTYPE : benef.NCODBENEFICIARYTYPE,
          SCOVER_DESC : this.data,
          SBANK : benef.SBANK,
          SACCOUNTNUMBER :  benef.SACCOUNTNUMBER
        })
      })
    }else{
      this.dataReserva.LIST_BENEF_COVERS = [];
      Swal.fire('Información', 'Debe ingresar al menos un beneficiario', 'warning');
      return;
    }


    console.log(this.dataReserva);


    Swal.fire({
      title: 'Información',
      text: 'Se procederá a grabar la información. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        SwalCarga();
        this.reserveService.InsertDatCoversTmp(this.dataReserva).subscribe(
          res => {
            Swal.close();
            if (res.SRESULT == "OK") {
              this.reference.close(res);
              Swal.fire('Información', 'Datos de la cobertura ingresados correctamente.', 'success')
            } else {
              this.dataReserva.LIST_BENEF_COVERS = [];
              Swal.fire('Información', res.SRESULT, 'error');
              return;
            }
          },
          err => {
            this.dataReserva.LIST_BENEF_COVERS = [];
            Swal.close();
            Swal.fire('Información', err, 'error');
          }
        )
      }
    })

  }

  editarTablaTemporal(){
    let reservaUpdate = new ClaimUpdateDatAddRequestBM();

    if(this.data == Cobertura.Gastos_Medicos){
      if(this.tipoAtencion.invalid){
        this.tipoAtencion.markAllAsTouched();
        return;
      }
    }


    let cookie = this.authProtectaService.getCookie('AppSiniestro');
    let codUsuario = this.authProtectaService.getValueCookie('CodUsu',cookie);

    reservaUpdate.NCASE_NUM = Number(this.reservaCaso.NCASE_NUM);
    reservaUpdate.NCLAIM = Number(this.reservaCaso.NCLAIM);
    reservaUpdate.NCOVER = this.data;
    reservaUpdate.SCODIGODIAGNOSTICO = this.model.CCODCIE10;
    reservaUpdate.SESPECIALIDAD = this.dataReserva.SSPECIALTY;
    reservaUpdate.SCOMPLEXITY = this.dataReserva.SDIAGNOSTICCOMPLEXITY;
    reservaUpdate.SPROCESSOR = this.dataReserva.SPROCESSOR;
    reservaUpdate.SLOCATED = this.dataReserva.SLOCATED;
    reservaUpdate.NTRANSAC = this.dataReserva.NTRANSAC;
    if(this.dataReserva.SPROCESSOR == "1"){
      if (this.dataReserva.SPROCESSORNAME.replace(/ /g, "") == "" || this.dataReserva.SPROCESSORZONE.replace(/ /g, "") == ""){
        Swal.fire('Información','Debe completar los campos de tramitador.', 'warning');
        return;
      }else{
        reservaUpdate.SPROCESSOR_NAME = this.dataReserva.SPROCESSORNAME;
        reservaUpdate.SPROCESSOR_AREA = this.dataReserva.SPROCESSORZONE;
      }
    }else{
      reservaUpdate.SPROCESSOR_NAME = "";
      reservaUpdate.SPROCESSOR_AREA = "";
    }
    reservaUpdate.SNOMBREDOCTOR = this.dataReserva.SATTENDINGMEDIC;
    reservaUpdate.SIPRESS_AT = this.dataReserva.SATENTIONIPRESS;

    if(this.data == Cobertura.Incapacidad_Temporal || this.data == Cobertura.Invalidez_Permanente){
      reservaUpdate.FDERIVATION =  this.datePipe.transform(this.fechaDerivacion, 'dd/MM/yyyy')
      reservaUpdate.FANSWER = this.datePipe.transform(this.fechaRespuesta, 'dd/MM/yyyy')
      reservaUpdate.SDERIVATIONINR = this.dataReserva.SINR_REFERRAL;
      reservaUpdate.SPROCEEDING = this.dataReserva.SINR_FILENUMBER
    }

    if(this.data == Cobertura.Gastos_Medicos || this.data == Cobertura.Gastos_Sepelio){
      reservaUpdate.FECHAEMISIONFACTURA = this.datePipe.transform(this.fechaEmision, 'dd/MM/yyyy');
      reservaUpdate.FECHARECEPCIONFACTURA = this.datePipe.transform(this.fechaRecepcion, 'dd/MM/yyyy');
      reservaUpdate.NDOC_TYPE = this.dataReserva.NTYPERECEIPT;
      reservaUpdate.SBILL = this.dataReserva.SVOUCHERNUMBER;
      reservaUpdate.NAMOUNT = this.modelBase
      reservaUpdate.SAFFECTS_IGV = this.dataReserva.SAFFECTIGV;
      reservaUpdate.SNOMBREPROVEEDOR = this.dataReserva.SREFERENTIALNAMEIPRESS;
      reservaUpdate.SRED_IPRESS = this.dataReserva.SRED_IPRESS;
      reservaUpdate.SRUCPROVEEDOR = this.dataReserva.SRUC;
      reservaUpdate.SDOCUMENTTYPE = reservaUpdate.ListBeneficiariesMod[0].SDESCRIPTYPCLIENTDOC

      if(this.data == Cobertura.Gastos_Medicos){
        reservaUpdate.STIPOATENCION = this.tipoAtencion.value;
        reservaUpdate.SORDER_NUM = this.dataReserva.SNROLETTER;
        reservaUpdate.SREFUND = this.dataReserva.SREFUND
        reservaUpdate.NAMOUNT_LETTER = this.modelBase;
      }
    }

    reservaUpdate.NUSERCODE = Number(atob(codUsuario));

    if(this.beneficiarios.length > 0){
      this.beneficiarios.forEach(benef => {
        reservaUpdate.ListBeneficiariesMod.push({
          SCLIENT : benef.SCODE,
          SCLIENTNAME : benef.SNAME,
          NTYPCLIENTDOC : Number(benef.NCODDOCUMENTTYPE),
          SDESCRIPTYPCLIENTDOC : benef.SDOCUMENTTYPE,
          SDOCUMENTNUMBER : benef.SDOCUMENTNUMBER,
          NCODBENEFICIARYTYPE : Number(benef.NCODBENEFICIARYTYPE),
          SBENEFICIARYTYPE : benef.SBENEFICIARYTYPE,
          NBANK_CODE : benef.SBANK,
          SACCOUNT :  benef.SACCOUNTNUMBER,
          NCLAIM : Number(this.reservaCaso.NCLAIM),
          NCASE_NUM : Number(this.reservaCaso.NCASE_NUM),
          NCOVER : this.data,
          NUSERCODE: Number(atob(codUsuario)),
        })
      })
    }else{
      Swal.fire('Información', 'Debe ingresar al menos un beneficiario','warning');
      return;
    }

    console.log(reservaUpdate);

    Swal.fire({
      title: 'Información',
      text: 'Se procederá a actualizar la información. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      reverseButtons: true,
      showCloseButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        SwalCarga();
        this.reserveService.UpdateDataAddBenefCover(reservaUpdate).subscribe(
          res => {
            Swal.close();
            if (res.SRESULT == "OK") {
              this.reference.close();
              Swal.fire('Información', 'Datos de la cobertura actualizados correctamente.', 'success')
            } else {
              Swal.fire('Información', res.SRESULT, 'error');
              return;
            }
          },
          err => {
            Swal.close();
            Swal.fire('Información', err, 'error');
          }
        )
      }
    })

  }


}
