import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CasosBM } from 'src/app/core/models/caso';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import { ConsultaSiniestroComponent } from 'src/app/pages/siniestros/tratamiento-caso-siniestro/consulta-siniestro/consulta-siniestro.component';
import Swal from 'sweetalert2';

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



  stateTituloSiniestro = 2;
  form!: FormGroup;


  @Input() tipoTabForm = 0;

  //RESULTADO
  tratamientoCaso = new TratamientoCaso();


  culpabilidades$ = this.casoService.GetCulpabilidadList();
  causaSiniestro$ = this.casoService.GetCausaSiniestroList();
  
  departamentos: Generic[]=[{
    id: '1', nombre: 'Lima',
  }];
  provincias: Generic[]=[{
    id: '1', nombre: 'Lima',
  }];
  distritos: Generic[]=[{
    id: '1', nombre: 'San Isidro',
  }];

  

  constructor(private modalService: NgbModal, public fb: FormBuilder, public casoService: CasosService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nPolicy: ['', Validators.required],
      nCertif: [{value:'', disabled: true}],
      sNroPlaca: [{value:'', disabled: true}],
      nCaso: [{value:'', disabled: true}],
      dFecOcurrencia: [{value:'', disabled: this.tipoForm == true ? false : true}, Validators.required],
      sHoraOcurrencia : [{value:'', disabled: this.tipoForm == true ? false : true}, Validators.required],
      nCulpabilidad: [{value:'', disabled: this.tipoForm == true && this.tipoTab != 2 ? false:true}, Validators.required],
      nCausaSiniestro: [{value:'', disabled: this.tipoForm == true ? false:true}, Validators.required],
      dIniVigencia: [{value:'', disabled: true}],
      dFinVigencia: [{value:'', disabled: true}],
      sNombreContratante: [{value:'', disabled: true}],
      sDocContratante: [{value:'', disabled: true}],
      sNombreConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sPaternoConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sMaternoConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      nTipDocConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sDocConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      dFecNacConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      sUbicacion:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      sDelegacion: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      nDelegacion:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      nDepartamento: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},Validators.required],
      nProvincia: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},Validators.required],
      nDistrito: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},Validators.required],
      sObservacion: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
    })
  }

  buscador(){
    let valorInput = this.referencia.nativeElement.value as string;
    if(valorInput != "" && this.form.controls['dFecOcurrencia'].value != ""){
      if (!this.tipoForm) {
        this.tratamientoCaso.nroPlaca = "2676"
        this.showBotones = true
        this.llenarTratamiento();
      } else {
        Swal.showLoading()
        this.casoService.GetPolicyForCase(Number(valorInput), this.form.controls['dFecOcurrencia'].value).subscribe(
          res => {
            let caso = new CasosBM();
            caso = res.GenericResponse[0];
            console.log(res);
            this.form.controls['nCertif'].setValue(caso.nCertif);
            this.form.controls['sNroPlaca'].setValue(caso.sNroPlaca);
            this.form.controls['nCaso'].setValue(caso.nCaso);
            this.form.controls['dIniVigencia'].setValue(new Date(caso.dIniVigencia).toLocaleDateString('en-GB'));
            this.form.controls['dFinVigencia'].setValue(new Date(caso.dFinVigencia).toLocaleDateString('en-GB'));
            this.form.controls['sNombreContratante'].setValue(caso.sNombreContratante);
            this.form.controls['sDocContratante'].setValue(caso.sDocContratante);
            Swal.close();
          },
          err => {
            console.log(err);
          }
        )
        // this.llenarTratamiento();
      }
    }
  }

  llenarTratamiento(){
    this.tratamientoCaso.certificado = "0";
    this.tratamientoCaso.nroPlaca = "WR4-567";
    this.tratamientoCaso.inicioVigencia = "25/04/2022";
    this.tratamientoCaso.finVigencia = "25/04/2023";
    //this.tratamientoCaso.contratante = "0200018143 - Escajadillo Chamorro Miguel Angel";
    this.tratamientoCaso.documentoContratante = "DNI - 45348029";
    this.tratamientoCaso.nombreConductor = "Pedro Suarez M";
    this.tratamientoCaso.nroDocumentoConductor = "44047021";
    this.tratamientoCaso.ubicacion = "Calle Chinchón 508 - San Isidro";
    this.tratamientoCaso.referencia = "Cruce con Petit Thouars";
    this.tratamientoCaso.delegacion = "Comisaría Santa Rosa";
    this.tratamientoCaso.observacion = "El siniestro tiene que ser evaluado";

    this.form.patchValue({
      ...this.tratamientoCaso
    })
  }

  consultaSiniestro() {
    const modalRef = this.modalService.open(ConsultaSiniestroComponent,  { windowClass : "my-class"});
    modalRef.componentInstance.reference = modalRef;
    //modalRef.componentInstance.data = data;
    modalRef.result.then((Interval) => {
    });
  }

  rechazarSiniestro(){
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
        this.stateTituloSiniestro = 3
        this.tipoTab = 1;
      }
    })
  }

  tabControl(index:number, stateTituloSiniestro?:number){
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
    }
    if(this.tipoTab == 2){
      this.declararActive = ''
      this.modificarActive = 'active'
      this.tituloTratamiento.emit(false);
      this.form.controls['nPolicy'].disable();
      this.form.controls['sUbicacion'].enable();
      this.form.controls['sDelegacion'].enable();
      this.form.controls['nDelegacion'].enable();
      this.form.controls['nDepartamento'].enable();
      this.form.controls['nProvincia'].enable();
      this.form.controls['nDistrito'].enable();
      this.form.controls['sObservacion'].enable();
      this.form.controls['nCulpabilidad'].enable();
      this.form.controls['nCausaSiniestro'].enable();
    }
  }

  rechazarCaso(){
    Swal.fire({
      title: 'Información',
      text: "¿Deseas rechazar el siniestro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'De acuerdo',
      cancelButtonText: 'No',
      reverseButtons: true
    }).then((result) => {
      
      if(result.isConfirmed){
        this.tipoTab = 3;
        this.tituloTratamiento.emit(false);
      }
    })
  }

  opcionVolver(){
    this.form.controls['nPolicy'].enable();
    this.form.controls['sUbicacion'].disable();
    this.form.controls['sDelegacion'].disable();
    this.form.controls['nDelegacion'].disable();
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

  siniestroCancel(cancel:boolean){
    if(cancel){
      this.opcionVolver();
    }
  }

  saveCaso() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
      if(this.form.controls['sDelegacion'].invalid){
        msj += 'Debe ingresar la referencia. <br/>';
      }
      if(this.form.controls['nDelegacion'].invalid){
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
    else {
      this.tratamientoCaso.nroPlaca = "2676"
      Swal.fire({
        title: 'Información',
        text: "Se declaró el caso correctamente: 2676. ¿Desea declarar los siniestros?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'De acuerdo',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {

        if (result.isConfirmed) {
          this.tipoForm = false;
          this.showBotones = true
          this.tabControl(1, 2);
        }else{
          this.form.reset()
        }
      })
    }
  }

}
