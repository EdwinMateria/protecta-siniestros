import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ClaimBeneficiarioModelRequestBM } from 'src/app/core/models/claimBeneficiarioModelRequest';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { distinctUntilChanged } from "rxjs/operators";
import { Data } from 'src/app/core/models/data';
import Swal from 'sweetalert2';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import { CombosGenericoVM } from 'src/app/core/models/caso';
import { AuthProtectaService } from 'src/app/core/services/auth-protecta/auth-protecta.service';
import { SwalCarga } from "src/app/core/swal-loading";
import { DataResponse, EListClient } from 'src/app/core/models/data-response';
import { DatePipe } from '@angular/common';

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
  @Input() public origen: number;
  @Input() public datosBeneficiario : EListClient = new EListClient();
  form!: FormGroup;
  documentos: TipoDocumento[]=[];
  labelNombres = 'Nombres';

  showApellidos = true;
  objBeneficiarioModel = new ClaimBeneficiarioModelRequestBM();

  data = new Data();
  provincias : CombosGenericoVM[]=[];
  distritos: CombosGenericoVM[]=[];

  notAllowed(input: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = input.test(control.value);
      return forbidden ? {notAllowed: {value: control.value}} : null;
    };
  }

  constructor(public fb: FormBuilder, public reserveService: ReserveService, public casoService: CasosService, public authProtectaService: AuthProtectaService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    console.log(this.datosBeneficiario);
    
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
      P_SNOM_DIRECCION: [ '', Validators.required],
      P_SNUM_DIRECCION: [ '', Validators.required],
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
      P_NPROVINCE: [ '' , [Validators.required]],
      P_NLOCAL: [ '0' , [Validators.required , this.notAllowed(/^0/)]],
      P_NMUNICIPALITY: [ '0', [Validators.required , this.notAllowed(/^0/)] ],
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

    if(this.datosBeneficiario){
       this.obtenerBeneficiario()     
    }
  }

  obtenerBeneficiario(){
    this.form.patchValue({
      ...this.datosBeneficiario,
      ...this.datosBeneficiario.EListAddresClient[0]
    })
    let correo = this.datosBeneficiario.EListEmailClient;
    if( correo.length > 0 ){
      this.form.controls['P_SE_MAIL'].setValue(correo[0].P_SE_MAIL)
    }
    
    this.form.controls['P_DBIRTHDAT'].setValue(this.datePipe.transform(this.datosBeneficiario.P_DBIRTHDAT, 'yyyy-MM-dd'));

    let direccion = this.datosBeneficiario.EListAddresClient[0];
    this.changeDepartamento(direccion.P_NLOCAL);
    this.changeProvincia(direccion.P_NMUNICIPALITY);

    let moviles = this.datosBeneficiario.EListPhoneClient;
    if(moviles.length > 0){
      let celular = moviles.find(x => x.P_NPHONE_TYPE == "2");

      if(celular){
        this.form.controls['celular'].setValue(celular.P_SPHONE);
      }

      let telefOficina = moviles.find(x => x.P_NPHONE_TYPE == "1")
      if(telefOficina){
        this.form.controls['telefOfic'].setValue(telefOficina.P_SPHONE);
        this.form.controls['anexo'].setValue(telefOficina.P_NEXTENS1);
        this.form.controls['P_NAREA_CODE'].setValue(telefOficina.P_NAREA_CODE);
      }

      let telefDomi = moviles.find(x => x.P_NPHONE_TYPE == "4")
      if(telefDomi){
        this.form.controls['telefDom'].setValue(telefOficina.P_SPHONE);
      }
    }

    //Obtener datos banco
    this.reserveService.GetBank(this.datosBeneficiario.P_SCLIENT).subscribe(
      res => {
        this.form.controls['viaPago'].setValue(res.viaPago);
        this.form.controls['banco'].setValue(res.banco);
        this.form.controls['tipoCuenta'].setValue(res.tipoCuenta);
        this.form.controls['nroCuenta'].setValue(res.nroCuenta);
        this.form.controls['nroCuentaCCI'].setValue(res.nroCuentaCCI.trim());
      }
    )


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
      SwalCarga();
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
        ...this.form.getRawValue(),
        P_SRECTYPE : "2",
        P_NCOUNTRY : "1",
      })

      if(this.form.controls['telefDom'].value != ""){
        this.data.EListPhoneClient.push({
          P_SPHONE : this.form.controls['telefDom'].value,
          P_NPHONE_TYPE : '4',
          P_NAREA_CODE : this.form.controls['P_NAREA_CODE'].value
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
      

      let cookie = this.authProtectaService.getCookie('AppSiniestro');
      let codUsuario = this.authProtectaService.getValueCookie('CodUsu', cookie);

      this.reserveService.SaveApi(this.data).subscribe(
        res =>{
          Swal.close();
          console.log(res);
          
          let jsonResponse = JSON.parse(res);
          if(jsonResponse.P_NCODE == 1){
            Swal.fire('Información', jsonResponse.P_SMESSAGE ,'error')
          }else{
            //UPD_BANK
            let request = new ClaimBeneficiarioModelRequestBM();

            request.SCLIENT_ANT = "";
            request.Accion = "ING";
            request.SCLIENT = jsonResponse.P_SCOD_CLIENT;
            request.Sexo = this.data.P_SSEXCLIEN;
            //Apartamento
            request.Apartamento = null;
            request.ApellidoPaterno = this.data.P_SLASTNAME;
            request.ApellidoMaterno = this.data.P_SLASTNAME2;
            request.Celular = this.form.controls['celular'].value;
            request.CodBanco = this.form.controls['banco'].value;
            request.CodigoUsuario = atob(codUsuario);
            request.CodTipoCuenta = this.form.controls['tipoCuenta'].value;
            request.CodViaPago = this.form.controls['viaPago'].value;
            request.Departamento = this.data.EListAddresClient[0].P_NPROVINCE;
            request.Provincia = this.data.EListAddresClient[0].P_NLOCAL;
            request.Distrito = this.data.EListAddresClient[0].P_NMUNICIPALITY;
            request.EstadoCivil = this.data.P_NCIVILSTA;
            request.FechaNacimiento = this.form.controls['P_DBIRTHDAT'].value;
            request.Lote = this.form.controls['P_SLOTE'].value;
            request.Nacionalidad = this.data.P_NNATIONALITY;
            request.Nombres = this.data.P_SFIRSTNAME;
            request.NroCuenta = this.form.controls['nroCuenta'].value;
            request.NroCuentaCCI = this.form.controls['nroCuentaCCI'].value;
            request.NroDocumento = this.data.P_SIDDOC;
            //Piso
            request.Piso = null;
            request.RazonSocial = this.data.P_SFIRSTNAME;
            request.TeleDom = this.form.controls['telefDom'].value;
            request.TeleOfi = this.form.controls['telefOfic'].value;
            request.TipoDocumento = this.data.P_NIDDOC_TYPE;
            request.Ubicacion = this.form.controls['P_SNOM_DIRECCION'].value;
            request.Via = this.form.controls['P_STI_DIRE'].value
            request.FechaFinPagoPension = null;
            request.FechaFallecimientoPensionista = null;
            request.CondicionEstudiante = null;

            this.reserveService.UPD_BANK(request).subscribe(res => {
              Swal.fire('Información', jsonResponse.P_SMESSAGE ,'success')
              jsonResponse.SCODE = jsonResponse.P_SCOD_CLIENT;
              this.reference.close(jsonResponse);
            },err => {
              jsonResponse.SCODE = jsonResponse.P_SCOD_CLIENT;
              this.reference.close(jsonResponse);
            });
          }
        },
        err => {
          Swal.close();
          Swal.fire('Error',err,'error')
        }
      )
    }
  }


  changeDepartamento(provincia?:any){
    let departamento = this.form.controls['P_NPROVINCE'].value;
    SwalCarga();
    this.casoService.GetProvincias(departamento).subscribe(
      res => {
        Swal.close();
        this.provincias = [];
        this.distritos = [];
        this.form.controls['P_NMUNICIPALITY'].setValue('0');
        this.provincias = res
        if(provincia){
          this.form.controls['P_NLOCAL'].setValue(provincia);
        }else{
          this.form.controls['P_NLOCAL'].setValue('0');
        }
      }
    )
  }

  changeProvincia(distrito?:any){
    let provincia = this.form.controls['P_NLOCAL'].value;
    SwalCarga();
    this.casoService.GetDistritos(provincia).subscribe(
      res => {
        Swal.close();
        this.distritos = [];
        this.distritos = res;

        if(provincia){
          this.form.controls['P_NMUNICIPALITY'].setValue(distrito);
        }else{
          this.form.controls['P_NMUNICIPALITY'].setValue('0');
        }
      }
    )
  }

}
