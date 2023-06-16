import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteBE, CasosBM } from 'src/app/core/models/caso';
import { SiniestroBM } from 'src/app/core/models/siniestroBM';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import { ConsultaSiniestroComponent } from 'src/app/pages/siniestros/tratamiento-caso-siniestro/consulta-siniestro/consulta-siniestro.component';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export class Generic{
  id:string;
  nombre:string;
}

export class TratamientoCaso{
  certificado : string;
  nroPlaca: string;
  inicioVigencia:string;
  finVigencia:string;
  nombreContratante:string;
  documentoContratante:string;
  nombreConductor: string;
  nroDocumentoConductor: string;
  ubicacion:string;
  referencia:string;
  delegacion:string;
  observacion:string;
  fechaOcurrencia:any;
  horaOcurrencia:any;
  fechaNacimientoConductor:any;
  apellidoPaternoConductor:string;
  apellidoMaternoConductor:string;
}

@Component({
  selector: 'app-form-caso',
  templateUrl: './form-caso.component.html',
  styleUrls: ['./form-caso.component.scss']
})
export class FormCasoComponent implements OnInit {

  @ViewChild('referencia') referencia: ElementRef;

  @Input() tipoForm = true;
  showBotones = false;
  declararActive = '';
  modificarActive = '';
  tipoTab = 0;
  @Output() tituloTratamiento = new EventEmitter<boolean>();
  @Output() formSiniestro = new EventEmitter<number>();
  casoIndex = new CasosBM();
  nBranch = "";
  nProduct = "";

  stateTituloSiniestro = 2;
  form!: FormGroup;
  @Output() casoEmit = new EventEmitter<CasosBM>();

  @Input() tipoTabForm = 0;
  casoBM = new CasosBM();

  //RESULTADO
  tratamientoCaso = new TratamientoCaso();
  siniestros: SiniestroBM[] = [];

  notAllowed(input: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = input.test(control.value);
      return forbidden ? {notAllowed: {value: control.value}} : null;
    };
  }

  constructor(private modalService: NgbModal, public fb: FormBuilder, public casoService: CasosService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nPolicy: ['', Validators.required],
      nCertif: [{value:'', disabled: true}],
      sNroPlaca: [{value:'', disabled: true}],
      nCaso: [{value:'', disabled: true}],
      dFecOcurrencia: [{value:null, disabled: this.tipoForm == true ? false : true}, Validators.required],
      sHoraOcurrencia : [{value:'', disabled: this.tipoForm == true ? false : true}, Validators.required],
      nCulpabilidad: [{value:'0', disabled: this.tipoForm == true && this.tipoTab != 2 ? false:true}, [Validators.required, this.notAllowed(/^0/)]],
      nCausaSiniestro: [{value:'0', disabled: this.tipoForm == true ? false:true}, [Validators.required, this.notAllowed(/^0/)]],
      dInicioVigencia: [{value:'', disabled: true}],
      dFinDeVigencia: [{value:'', disabled: true}],
      sNombreContratante: [{value:'', disabled: true}],
      sDocContratante: [{value:'', disabled: true}],
      sNombreConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sPaternoConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sMaternoConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      nTipDocConductor: [{value:'0', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sDocConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      dFecNacConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sUbicacion:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      sReferencia: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      sDelegacion:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      nDepartamento: [{value:'0', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},[Validators.required, this.notAllowed(/^0/)]],
      nProvincia: [{value:'0', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},[Validators.required, this.notAllowed(/^0/)]],
      nDistrito: [{value:'0', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},[Validators.required, this.notAllowed(/^0/)]],
      sObservacion: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      nBranch : [''],
      nProduct : [''],
    })
    this.obtenerCasoIndex();
  }

  obtenerCasoIndex(){
    Swal.showLoading();
    this.casoService.Index().subscribe(
      res =>{
        Swal.close();
        this.casoIndex = res;
      },
      err =>{
        Swal.close();
        console.log(err);
      }
    )
  }

  buscador(){
    let valorInput = this.referencia.nativeElement.value as string;
    if(valorInput != ""){
      if (!this.tipoForm) {
        this.showBotones = true
        Swal.showLoading();
        this.casoService.GetSearchCase(Number(valorInput)).subscribe(
          res => {
            Swal.close();
            this.casoBM = res.GenericResponse[0];
            this.form.patchValue({
              ...this.casoBM,
              dInicioVigencia : new Date(this.casoBM.dIniVigencia).toLocaleDateString('en-GB'),
              dFinDeVigencia : new Date(this.casoBM.dFinVigencia).toLocaleDateString('en-GB'),
              dFecOcurrencia : new Date(this.casoBM.dFecOcurrencia).toLocaleDateString('en-GB'),
              dFecNacConductor : new Date(this.casoBM.dFecNacConductor).toLocaleDateString('en-GB'),
              nCaso: this.casoBM.nPolicy,
              nPolicy: valorInput,
            });
            //Provincia
            this.changeDepartamento(false);
            this.form.controls['nProvincia'].setValue(this.casoBM.nProvincia);
            this.changeProvincia(false)
            this.casoBM.nCaso = Number(valorInput)
            console.log(this.casoBM);
            
          },
          err => {
            Swal.close();
            console.log(err);
          }
        )
        //Siniestros del Caso
        Swal.showLoading();
        this.casoService.GetClaimForCase(Number(valorInput)).subscribe(
          res => {
            Swal.close();
            this.siniestros = res.GenericResponse;
          },
          err => {
            Swal.close();
            console.log(err);
          }
        )
      } else {
        if(this.form.controls['dFecOcurrencia'].value != ""){
          Swal.showLoading()

          let docur = new Date(this.form.controls['dFecOcurrencia'].value)
          let date = new Date(docur.setDate(docur.getDate() + 1)).toLocaleDateString('en-GB');
          //let date = new Date(this.form.controls['dFecOcurrencia'].value).toLocaleDateString('en-GB');
          console.log(date);
          console.log(this.form.controls['dFecOcurrencia'].value);
          
          this.casoService.GetPolicyForCase(Number(valorInput), date).subscribe(
            res => {
              let caso = new CasosBM();
              Swal.close();
              caso = res.GenericResponse[0];
              if(caso.sMensaje == 'Ok'){
                this.form.controls['nCertif'].setValue(caso.nCertif);
                this.form.controls['sNroPlaca'].setValue(caso.sNroPlaca);
                this.form.controls['nCaso'].setValue(caso.nCaso);
                this.form.controls['dInicioVigencia'].setValue(new Date(caso.dIniVigencia).toLocaleDateString('en-GB'));
                this.form.controls['dFinDeVigencia'].setValue(new Date(caso.dFinVigencia).toLocaleDateString('en-GB'));
                this.form.controls['sNombreContratante'].setValue(caso.sNombreContratante);
                this.form.controls['sDocContratante'].setValue(caso.sDocContratante);
                this.form.controls['nBranch'].setValue(caso.nBranch);
                this.form.controls['nProduct'].setValue(caso.nProduct);
              }else{
                Swal.fire('Información',caso.sMensaje,'error');
                return;
              }
            },
            err => {
              Swal.close()
              console.log(err);
            }
          )
        }
      }
    }
  }

  consultaSiniestro(codSiniestro:number) {
    const modalRef = this.modalService.open(ConsultaSiniestroComponent,  { windowClass : "my-class"});
    modalRef.componentInstance.reference = modalRef;
    modalRef.componentInstance.data = codSiniestro;
    modalRef.componentInstance.causasSiniestro = this.casoIndex.Lista_CausaSiniestro;
    modalRef.result.then((Interval) => {
    });
  }

  rechazarSiniestro(numSiniestro:number){
    Swal.fire({
      title: 'Información',
      text: "¿Deseas rechazar el caso del siniestro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'De acuerdo',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      
      if(result.isConfirmed){
        this.declararActive = 'active'
        this.modificarActive = ''
        this.tituloTratamiento.emit(true);
        this.formSiniestro.emit(3);

        let cs = new CasosBM();
        cs = this.casoBM;
        cs.Lista_CausaSiniestro = this.casoIndex.Lista_CausaSiniestro;
        cs.Lista_Rechazos = this.casoIndex.Lista_Rechazos;
        cs.nSiniestro = numSiniestro;
        this.casoEmit.emit(cs)
        this.stateTituloSiniestro = 3
        this.tipoTab = 1;
      }
    })
  }

  tabControl(index:number, stateTituloSiniestro?:number, nSiniestro?:number){
    this.tipoTab = index;
    // 1: Declarar siniestro;
    // Tab = 1 ,  
    if(this.tipoTab == 1){
      if(stateTituloSiniestro == 1){
        this.stateTituloSiniestro = 1
      }else if(stateTituloSiniestro == 2){
        this.stateTituloSiniestro = 2
      }
      
      this.declararActive = 'active'
      this.modificarActive = ''
      this.tituloTratamiento.emit(true);
      this.formSiniestro.emit(stateTituloSiniestro);
      this.casoBM.Lista_CausaSiniestro = this.casoIndex.Lista_CausaSiniestro;
      this.casoBM.nSiniestro = nSiniestro;
      this.casoBM.nCaso = this.form.controls['nPolicy'].value; // Para la consulta de caso, se mapeo el n caso en formcontrol nPolicy
      
      this.casoEmit.emit(this.casoBM);
    }
    if(this.tipoTab == 2){
      this.declararActive = ''
      this.modificarActive = 'active'
      this.tituloTratamiento.emit(false);
      this.form.controls['nPolicy'].disable();
      this.form.controls['sUbicacion'].enable();
      this.form.controls['sDelegacion'].enable();
      this.form.controls['sReferencia'].enable();
      this.form.controls['nDepartamento'].enable();
      this.form.controls['nProvincia'].enable();
      this.form.controls['nDistrito'].enable();
      this.form.controls['sObservacion'].enable();
      this.form.controls['nCulpabilidad'].enable();
      this.form.controls['nCausaSiniestro'].enable();
    }
  }

  opcionVolver(){
    this.form.controls['nPolicy'].enable();
    this.form.controls['sUbicacion'].disable();
    this.form.controls['sDelegacion'].disable();
    this.form.controls['sReferencia'].disable();
    this.form.controls['nDepartamento'].disable();
    this.form.controls['nProvincia'].disable();
    this.form.controls['nDistrito'].disable();
    this.form.controls['sObservacion'].disable();
    this.form.controls['nCulpabilidad'].disable();
    this.form.controls['nCausaSiniestro'].disable();
    this.form.reset();
    this.tipoTab = 0;
    this.modificarActive = '';
    this.declararActive = '';
    this.stateTituloSiniestro = 2;
    this.tituloTratamiento.emit(false);
    this.tratamientoCaso = new TratamientoCaso();
    this.showBotones = false;
  }

  validacionFormularioCaso(){
    let msj = '';
      if(this.form.controls['nPolicy'].invalid){
        msj += 'Debe ingresar la póliza.<br/>';
      }
      if(this.form.controls['dFecOcurrencia'].invalid){
        msj += 'Debe ingresar la fecha de ocurrencia. <br/>';
      }
      if(this.form.controls['sHoraOcurrencia'].invalid){
        msj += 'Debe ingresar la hora de ocurrencia. <br/>';
      }
      if(this.form.controls['nCulpabilidad'].invalid){
        msj += 'Debe ingresar la culpabilidad. <br/>';
      }
      if(this.form.controls['nCausaSiniestro'].invalid){
        msj += 'Debe ingresar la causa del siniestro. <br/>';
      }
      if(this.form.controls['sUbicacion'].invalid){
        msj += 'Debe ingresar la ubicación. <br/>';
      }
      if(this.form.controls['sReferencia'].invalid){
        msj += 'Debe ingresar la referencia. <br/>';
      }
      if(this.form.controls['sDelegacion'].invalid){
        msj += 'Debe ingresar la delegación. <br/>';
      }
      if(this.form.controls['nDepartamento'].invalid){
        msj += 'Debe ingresar la departamento. <br/>';
      }
      if(this.form.controls['nProvincia'].invalid){
        msj += 'Debe ingresar la provincia. <br/>';
      }
      if(this.form.controls['nDistrito'].invalid){
        msj += 'Debe ingresar el distrito.';
      }

      Swal.fire('Información', msj, 'warning');
      return;
  }

  saveCaso() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validacionFormularioCaso();
      return;
    }
    else {
      Swal.showLoading();
      let caso = new CasosBM();
      caso = this.form.getRawValue();
      var dateInicio = (this.form.controls['dInicioVigencia'].value).split("/");
      var dateFin = (this.form.controls['dFinDeVigencia'].value).split("/");
      
      caso.dIniVigencia = new Date(+dateInicio[2], dateInicio[1] - 1, +dateInicio[0]);
      caso.dFinVigencia = new Date(+dateFin[2], dateFin[1] - 1, +dateFin[0]);
      caso.nCertif = 0;
      const data: FormData = new FormData();
      data.append('casosData', JSON.stringify(caso));
      this.casoService.AddCasos(data).subscribe(
        res => {
          Swal.close();
          console.log(res);
          if(res.numcase != 0){
            Swal.fire({
              title: 'Información',
              text: `Se declaró el caso correctamente: ${res.numcase}. ¿Desea declarar los siniestros?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'De acuerdo',
              cancelButtonText: 'No',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                // this.tipoForm = false;
                // this.showBotones = true
                this.casoBM.nCaso = res.numcase;
                this.casoBM.nPolicy = this.form.controls['nPolicy'].value;
                this.casoBM.nCertif = 0;
                this.casoBM.sHoraOcurrencia = this.form.controls['sHoraOcurrencia'].value;
                this.casoBM.nCausaSiniestro = this.form.controls['nCausaSiniestro'].value;
                this.casoBM.dFecOcurrencia = this.form.controls['dFecOcurrencia'].value;
                this.declararActive = 'active'
                this.modificarActive = ''
                this.tituloTratamiento.emit(true);
                this.stateTituloSiniestro = 2
                this.formSiniestro.emit(this.stateTituloSiniestro);
                this.casoBM.Lista_CausaSiniestro = this.casoIndex.Lista_CausaSiniestro;
                this.casoEmit.emit(this.casoBM);
              }else{
                this.form.reset()
              }
            })
          }else{
            Swal.fire('Información','No se pudo aperturar el caso.','error');
            return;
          }
        },
        err => {
          Swal.close();
          console.log(err)
        }
      )
    }
  }

  editarCaso(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validacionFormularioCaso();
      return;
    }else{
      let caso = new CasosBM();
      caso = {
        ...this.form.getRawValue(),
        nCaso : this.form.controls['nPolicy'].value
      };
      Swal.close();
      this.casoService.UpdateCase(caso).subscribe(
        res => {
          if(res.Message == "Ok"){
            Swal.close();
            Swal.fire('Información','Caso actualizado correctamente','success');
            this.opcionVolver();
          }else{
            Swal.close();
            Swal.fire('Información',res.Message,'warning');
          } 
        },
        err => {
          Swal.close();
          console.log(err);
        }
      )
    }
  }

  changeDepartamento(origen:boolean){
    let departamento = this.form.controls['nDepartamento'].value;
    Swal.showLoading();
    this.casoService.GetProvincias(departamento).subscribe(
      res => {
        Swal.close();
        this.casoIndex.Lista_Distrito = [];
        this.casoIndex.Lista_Provincia = [];
        if(origen){
          this.form.controls['nProvincia'].setValue('0');
          this.form.controls['nDistrito'].setValue('0');
        }
        this.casoIndex.Lista_Provincia = res
      }
    )
  }

  changeProvincia(origen:boolean){
    let provincia = this.form.controls['nProvincia'].value;
    Swal.showLoading();
    this.casoService.GetDistritos(provincia).subscribe(
      res => {
        Swal.close();
        this.casoIndex.Lista_Distrito = [];
        this.casoIndex.Lista_Distrito = res;
        if(origen){
          this.form.controls['nDistrito'].setValue('0');
        }else{
          this.form.controls['nDistrito'].setValue(this.casoBM.nDistrito)
        }
      }
    )
  }

}
