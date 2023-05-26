import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export class TipoDocumento{
  id: number;
  nombre:string;
}

@Component({
  selector: 'app-modal-nuevo-beneficiario',
  templateUrl: './modal-nuevo-beneficiario.component.html',
  styleUrls: ['./modal-nuevo-beneficiario.component.scss']
})
export class ModalNuevoBeneficiarioComponent implements OnInit {

  @Input() public reference: any;
  form!: FormGroup;
  documentos: TipoDocumento[]=[];
  labelNombres = 'Nombres';

  showApellidos = true;

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      tipoDocumento: [ '', Validators.required],
      nroDocumento: [ '', Validators.required],
      apellidoPaterno: [ '', Validators.required],
      apellidoMaterno: [ '', Validators.required],
      nombres: [ '', Validators.required],
      fechaNacimiento: [ '', Validators.required],
      sexo: [ '', Validators.required],
      estadoCivil: [ '', Validators.required],
      nacionalidad: [ '', Validators.required],
      tipoVia: [ '', Validators.required],
      direccion: [ '', Validators.required],
      numero: [ '', Validators.required],
      prefDepart: [ '' ],
      interior: [ '' ],
      manzana: [ '' ],
      lote: [ '' ],
      etapa: [ '' ],
      conjHab: [ '' ],
      nomConjHab: [ '' ],
      bloqueChalet: [ '' ],
      numLet: [ '' ],
      referencia: [ '' ],
      departamento: [ '', Validators.required ],
      provincia: [ '', Validators.required ],
      distrito: [ '', Validators.required ],
      codigo: [ '' ],
      telefDom: [ '' ],
      celular: [ '' ],
      telefOfic: [ '' ],
      anexo: [ '' ],
      correo: [ '' ],
      viaPago: [ '' ],
      banco: [ '' ],
      tipoCuenta: [ '' ],
      nroCuenta: [ '' ],
      nroCuentaCCI: [ '' ],
    })


    //Tipos Documentos
    this.documentos.push({ id : 1, nombre: 'SIN CÓDIGO'})
    this.documentos.push({ id : 2, nombre: 'DNI'})
    this.documentos.push({ id : 3, nombre: 'RUC'})
    this.documentos.push({ id : 4, nombre: 'CARNET EXTRANJERIA'})
  }
  
  closeModal() {
    this.reference.close();
  }

  tipoDocumentoSeleccion(){
    let value = this.form.get('tipoDocumento').value;
    if(value == 3){
      this.showApellidos = false;
      this.form.removeControl('apellidoPaterno');
      this.form.removeControl('apellidoMaterno');
      this.labelNombres = 'Razón Social'
    }else{
      this.showApellidos = true;
      this.form.addControl('apellidoPaterno', this.fb.control('', [Validators.required])); 
      this.form.addControl('apellidoMaterno', this.fb.control('', [Validators.required])); 
      this.labelNombres = 'Nombres'
    }
  }

  saveBeneficiario(){
    console.log(this.form);
    if(this.form.invalid){
      this.form.markAllAsTouched();
    }else{
      console.log('PASO');
      //this.reference.close();
    }
  }

}
