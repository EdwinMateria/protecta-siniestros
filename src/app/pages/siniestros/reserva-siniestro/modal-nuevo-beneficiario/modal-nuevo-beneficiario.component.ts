import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClaimBeneficiarioModelRequestBM } from 'src/app/core/models/claimBeneficiarioModelRequest';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { distinctUntilChanged } from "rxjs/operators";
import { Data } from 'src/app/core/models/data';
import Swal from 'sweetalert2';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import { CombosGenericoVM } from 'src/app/core/models/caso';

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
  objBeneficiarioModel = new ClaimBeneficiarioModelRequestBM();

  data = new Data();
  provincias : CombosGenericoVM[]=[];
  distritos: CombosGenericoVM[]=[]

  notAllowed(input: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = input.test(control.value);
      return forbidden ? {notAllowed: {value: control.value}} : null;
    };
  }

  constructor(public fb: FormBuilder, public reserveService: ReserveService, public casoService: CasosService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      P_NIDDOC_TYPE: [ '', Validators.required],
      P_SIDDOC: [ '', Validators.required],
      P_SLASTNAME: [ '', Validators.required],
      P_SLASTNAME2: [ '', Validators.required],
      P_SFIRSTNAME: [ '', Validators.required],
      P_DBIRTHDAT: [ '', Validators.required],
      P_SSEXCLIEN: [ '', Validators.required],
      P_NCIVILSTA: [ '', Validators.required],
      P_NNATIONALITY: [ '', Validators.required],
      P_STI_DIRE: [ '', Validators.required],
      P_SNOM_DIRECCION: [ ''],
      P_SNUM_DIRECCION: [ ''],
      P_STI_INTERIOR: [ '' ],
      P_SNUM_INTERIOR: [ '' ],
      P_SMANZANA: [ '' ],
      P_SLOTE: [ '' ],
      P_SETAPA: [ '' ],
      P_STI_CJHT: [ '' ],
      P_SNOM_CJHT: [ '' ],
      P_STI_BLOCKCHALET: [ '' ],
      P_SBLOCKCHALET: [ '' ],
      P_SREFERENCIA: [ '' ],
      P_NPROVINCE: [ '' ],
      P_NLOCAL: [ '0' ],
      P_NMUNICIPALITY: [ '0' ],
      P_NAREA_CODE: [ '' ],
      telefDom: [ '' ],
      celular: [ '' ],
      telefOfic: [ '' ],
      anexo: [ '' ],
      P_SE_MAIL: [ '' ],
      viaPago: [ '' ],
      banco: [ '' ],
      tipoCuenta: [ '' ],
      nroCuenta: [ '' ],
      nroCuentaCCI: [ '' ],
    })

    this.obtenerComboBeneficiarios()
  }
  
  closeModal() {
    this.reference.close();
  }

  obtenerComboBeneficiarios(){
    this.reserveService.GetComboBeneficiarios().subscribe(
      res =>{
        this.objBeneficiarioModel = res;
      }
    )
  }

  tipoDocumentoSeleccion(){
    let value = this.form.get('P_NIDDOC_TYPE').value;
    if(value == 1){
      this.showApellidos = false;
      this.form.removeControl('P_SLASTNAME');
      this.form.removeControl('P_SLASTNAME2');
      this.labelNombres = 'Razón Social'
    }else{
      this.showApellidos = true;
      this.form.addControl('P_SLASTNAME', this.fb.control('', [Validators.required])); 
      this.form.addControl('P_SLASTNAME2', this.fb.control('', [Validators.required])); 
      this.labelNombres = 'Nombres'
    }
  }

  saveBeneficiario(){
    if(this.form.invalid){
      this.form.markAllAsTouched();
    }else{
      Swal.showLoading();
      this.data = {
        ...this.form.getRawValue(),
        P_DBIRTHDAT : new Date(this.form.controls['P_DBIRTHDAT'].value).toLocaleDateString('en-GB'),
        p_CodAplicacion : "SINIESTRO",
        p_TipOper : "INS",
        p_NUSERCODE : "JRENIQUE",
        p_NSPECIALITY : "99",
        p_NTITLE : "99",
        p_SISCLIENT_IND : "1",
        p_SISRENIEC_IND : "2",
        P_SLEGALNAME : "NOMBRE LEGAL",
        EListAddresClient : [],
        EListPhoneClient : [],
        EListEmailClient : [],
        EListContactClient: []
      }

      this.data.EListAddresClient.push({
        ...this.form.getRawValue()
      })

      if(this.form.controls['telefDom'].value != ""){
        this.data.EListPhoneClient.push({
          P_SPHONE : this.form.controls['telefDom'].value,
          P_NPHONE_TYPE : '4'
        })
      }

      if(this.form.controls['celular'].value != ""){
        this.data.EListPhoneClient.push({
          P_SPHONE : this.form.controls['celular'].value,
          P_NPHONE_TYPE : '2'
        })
      }

      if(this.form.controls['telefOfic'].value != ""){
        this.data.EListPhoneClient.push({
          P_SPHONE : this.form.controls['telefOfic'].value,
          P_NPHONE_TYPE : '1',
          P_NEXTENS1 : this.form.controls['anexo'].value,
          P_NAREA_CODE : this.form.controls['P_NAREA_CODE'].value,
        })
      }

      if(this.form.controls['P_SE_MAIL'].value != ""){
        this.data.EListEmailClient.push({
          P_SE_MAIL : this.form.controls['P_SE_MAIL'].value,
          P_SRECTYPE : '4'
        })
      }

      console.log(this.data);
      
      this.reserveService.SaveApi(this.data).subscribe(
        res =>{
          Swal.close();
          if(res.P_NCODE == 1){
            Swal.fire('Información', res.P_SMESSAGE ,'error')
          }else{
            console.log(res);
          }
        },
        err => {
          Swal.close();
          console.log(err);
        }
      )
    }
  }


  changeDepartamento(){
    let departamento = this.form.controls['P_NPROVINCE'].value;
    Swal.showLoading();
    this.casoService.GetProvincias(departamento).subscribe(
      res => {
        Swal.close();
        this.provincias = [];
        this.distritos = [];
        this.form.controls['P_NLOCAL'].setValue('0');
        this.form.controls['P_NMUNICIPALITY'].setValue('0');
        this.provincias = res
      }
    )
  }

  changeProvincia(){
    let provincia = this.form.controls['P_NLOCAL'].value;
    Swal.showLoading();
    this.casoService.GetDistritos(provincia).subscribe(
      res => {
        Swal.close();
        this.distritos = [];
        this.distritos = res;
        this.form.controls['P_NMUNICIPALITY'].setValue('0');
      }
    )
  }

}
