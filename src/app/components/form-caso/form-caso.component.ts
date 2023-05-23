import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  stateTituloSiniestro = 2;
  form!: FormGroup;


  @Input() tipoTabForm = 0;

  //RESULTADO
  tratamientoCaso = new TratamientoCaso();


  culpabilidad: Generic[]=[{
    id: '1', nombre: 'Culpable'
  }];
  causaSiniestro: Generic[]=[{
    id: '1', nombre: 'Exceso de velocidad'
  }];

  departamentos: Generic[]=[{
    id: '1', nombre: 'Lima',
  }];
  provincias: Generic[]=[{
    id: '1', nombre: 'Lima',
  }];
  distritos: Generic[]=[{
    id: '1', nombre: 'San Isidro',
  }];

  

  constructor(private modalService: NgbModal, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      poliza: ['', Validators.required],
      certificado: [{value:'', disabled: true}],
      nroPlaca: [{value:'', disabled: true}],
      nroCaso: [{value:'', disabled: true}],
      fechaOcurrencia: [{value:'', disabled: this.tipoForm == true ? false : true}, Validators.required],
      horaOcurrencia : [{value:'', disabled: this.tipoForm == true ? false : true}, Validators.required],
      culpabilidad: [{value:'', disabled: this.tipoForm == true && this.tipoTab != 2 ? false:true}, Validators.required],
      causaSiniestro: [{value:'', disabled: this.tipoForm == true ? false:true}, Validators.required],
      inicioVigencia: [{value:'', disabled: true}],
      finVigencia: [{value:'', disabled: true}],
      nombreContratante: [{value:'', disabled: true}],
      documentoContratante: [{value:'', disabled: true}],
      nombreConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      apellidoPaternoConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      apellidoMaternoConductor:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      tipoDocumentoConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      nroDocumentoConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      fechaNacimientoConductor: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
      ubicacion:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      referencia: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      delegacion:[{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}, Validators.required],
      departamento: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},Validators.required],
      provincia: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},Validators.required],
      distrito: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false},Validators.required],
      observacion: [{value:'', disabled: !this.tipoForm && this.tipoTab != 2 ? true : false}],
    })
  }

  buscador(){
    let valorInput = this.referencia.nativeElement.value as string;
    if(valorInput != ""){
      if (!this.tipoForm) {
        this.tratamientoCaso.nroPlaca = "2676"
        this.showBotones = true
        this.llenarTratamiento();
      } else {
        this.llenarTratamiento();
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
    }
    if(this.tipoTab == 2){
      this.declararActive = ''
      this.modificarActive = 'active'
      this.tituloTratamiento.emit(false);
      this.form.controls['poliza'].disable();
      this.form.controls['ubicacion'].enable();
      this.form.controls['referencia'].enable();
      this.form.controls['delegacion'].enable();
      this.form.controls['departamento'].enable();
      this.form.controls['provincia'].enable();
      this.form.controls['distrito'].enable();
      this.form.controls['observacion'].enable();
      this.form.controls['culpabilidad'].enable();
      this.form.controls['causaSiniestro'].enable();
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
    this.form.controls['poliza'].enable();
    this.form.controls['ubicacion'].disable();
    this.form.controls['referencia'].disable();
    this.form.controls['delegacion'].disable();
    this.form.controls['departamento'].disable();
    this.form.controls['provincia'].disable();
    this.form.controls['distrito'].disable();
    this.form.controls['observacion'].disable();
    this.form.controls['culpabilidad'].disable();
    this.form.controls['causaSiniestro'].disable();
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
      if(this.form.controls['poliza'].invalid){
        msj += 'Debe ingresar la póliza.<br/>';
      }
      if(this.form.controls['fechaOcurrencia'].invalid){
        msj += 'Debe ingresar la fecha de ocurrencia. <br/>';
      }
      if(this.form.controls['horaOcurrencia'].invalid){
        msj += 'Debe ingresar la hora de ocurrencia. <br/>';
      }
      if(this.form.controls['culpabilidad'].invalid){
        msj += 'Debe ingresar la culpabilidad. <br/>';
      }
      if(this.form.controls['causaSiniestro'].invalid){
        msj += 'Debe ingresar la causa del siniestro. <br/>';
      }
      if(this.form.controls['ubicacion'].invalid){
        msj += 'Debe ingresar la ubicación. <br/>';
      }
      if(this.form.controls['delegacion'].invalid){
        msj += 'Debe ingresar la delegación. <br/>';
      }
      if(this.form.controls['departamento'].invalid){
        msj += 'Debe ingresar la departamento. <br/>';
      }
      if(this.form.controls['provincia'].invalid){
        msj += 'Debe ingresar la provincia. <br/>';
      }
      if(this.form.controls['distrito'].invalid){
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
