import { Component, OnInit, Input } from '@angular/core';
import { ClaimBenefCuentasModelRequesBM } from 'src/app/core/models/benefCuentaResponse';
import { ClaimComboBERequestBM } from 'src/app/core/models/claimBeneficiarioModelRequest';
import { ClientBank } from 'src/app/core/models/clientBank';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-cuenta-bancaria',
  templateUrl: './modal-cuenta-bancaria.component.html',
  styleUrls: ['./modal-cuenta-bancaria.component.scss']
})
export class ModalCuentaBancariaComponent implements OnInit {

  @Input() public reference: any;
  @Input() public bancos : ClaimComboBERequestBM[] = [];
  @Input() public tipoCuentas : ClaimComboBERequestBM[] = [];
  @Input() public addCtaBank: boolean;
  @Input() public ctaBancaria: ClaimBenefCuentasModelRequesBM = new ClaimBenefCuentasModelRequesBM();

  // tipoCuentas : ClaimComboBERequestBM[] = [
  //   {Codigo : '0' , Descripcion: 'SELECCIONE'},
  //   {Codigo : '2' , Descripcion: 'CUENTA CORRIENTE'},
  //   {Codigo : '1' , Descripcion: 'CUENTA DE AHORRO'},
  // ]

  monedas : ClaimComboBERequestBM[]=[
    {Codigo : '0' , Descripcion: 'SELECCIONE'},
    {Codigo : '1' , Descripcion: 'SOLES'},
    {Codigo : '2' , Descripcion: 'DOLARES'}
  ]

  estados: ClaimComboBERequestBM[]=[
    {Codigo : '1' , Descripcion: 'HABILITADO'},
    {Codigo : '0' , Descripcion: 'INHABILITADO'}
  ]

  listBank : ClaimBenefCuentasModelRequesBM[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initCte();
  }

  initCte(){
    
    if(this.addCtaBank){
      let cteP = new ClaimBenefCuentasModelRequesBM();
      this.listBank.push({
        ...cteP,
        Posicion  :   this.listBank.length + 1,
        length      :   20
      })
    }else{
      this.listBank.push(this.ctaBancaria)
    }
  }

  closeModal() {
    this.reference.close();
  }

  changeBank(bank: ClaimBenefCuentasModelRequesBM){
    bank.NroCuenta = '';
    
    if(bank.CodBanco == "02" && bank.CodTipoCuenta == "2"){
      bank.length = 13
    }else{
      if(bank.CodBanco == "02" && bank.CodTipoCuenta == "1"){
        bank.length = 14
      }else{
        if(bank.CodBanco == "11"){
          bank.length = 20
        }else{
          if(bank.CodBanco == "03"){
            bank.length = 13
          }else{
            if(bank.CodBanco == "41"){
              bank.length = 10
            }else{
              bank.length = 20
            }
          }
        }
      }
    }
    //const numeros = ["02", "03", "11", "41"];
  }


  validateCCI(cte: ClaimBenefCuentasModelRequesBM){
    const numeros = ["02", "03", "11", "41"];
    
    if(!numeros.includes(cte.CodBanco) && (cte.NroCuentaCCI == "" ||  cte.NroCuentaCCI == undefined || cte.NroCuentaCCI == null )){
      
      Swal.fire('Información','Para el banco seleccionado debe ingresar el Número CCI','warning');
      return false;
    }else{
    
      return true;
    }
  }

  changeCteBank(cte: ClaimBenefCuentasModelRequesBM){
    const numeros = ["02", "03", "11", "41"];

    if(cte.CodBanco == ''){
      Swal.fire('Error','Debe seleccionar un banco','error');
      return false;
    }

    if(cte.CodTipoCuenta == '0'){
      Swal.fire('Error','Debe seleccionar el tipo de cuenta','error');
      return false;
    }

    if(cte.MonedaCod == '0'){
      Swal.fire('Error','Debe seleccionar una moneda','error');
      return false;
    }

    if((cte.CodBanco == "02" || cte.CodBanco == "11" || cte.CodBanco == "03" || cte.CodBanco == "41") && (cte.NroCuenta == "" || cte.NroCuenta == null || cte.NroCuenta == undefined)) {
      Swal.fire('Error','Para el banco seleccionado es obligatorio ingresar el número de cuenta','error');
      return false;
    }

    //validacion numero de cuenta por banco
    if(cte.CodBanco == "02"){ //BCP
      if(cte.CodTipoCuenta == "1" && cte.NroCuenta.toString().length != 14){
        Swal.fire('Error','El número de Cuenta de Ahorro debe tener una longitud de 14 digitos.','error');
        return false;
      }
      if(cte.CodTipoCuenta == "2" && cte.NroCuenta.toString().length != 13){
        Swal.fire('Error','El número de Cuenta Corriente debe tener una longitud de 13 digitos.','error');
        return false;
      }
    }

    if(cte.CodBanco == "11" && cte.NroCuenta.toString().length != 20){ //BBVA
      Swal.fire('Error','El número de cuenta para el banco seleccionado debe tener 20 dígitos.','error');
      return false;
    }

    if(cte.CodBanco == "03" && cte.NroCuenta.toString().length != 13){ //INTERBANK
      Swal.fire('Error','El número de cuenta para el banco seleccionado debe tener 13 dígitos.', 'error')
      return false;
    }

    if(cte.CodBanco == "41" && cte.NroCuenta.toString().length != 10){ //SCOTIABANK
      Swal.fire('Error','El número de cuenta para el banco seleccionado debe tener 10 dígitos.', 'error')
      return false;
    }

    //if(numeros.includes(cte.CodBanco) && (cte.NroCuentaCCI == "" || cte.NroCuentaCCI == null || cte.NroCuentaCCI == undefined)){
      if((cte.CodBanco != "02" && cte.CodBanco != "11" && cte.CodBanco != "03" && cte.CodBanco != "41") && (cte.NroCuentaCCI == "" || cte.NroCuentaCCI == null || cte.NroCuentaCCI == undefined)) {
        Swal.fire('Error','Para el banco seleccionado es obligatorio ingresar el número CCI','error');
        return false;
      }
    //}

    //if(numeros.includes(cte.CodBanco) && (cte.NroCuentaCCI.toString().length != 20)){
      if((cte.CodBanco != "02" && cte.CodBanco != "11" && cte.CodBanco != "03" && cte.CodBanco != "41") && (cte.NroCuentaCCI.toString().length != 20)) {
        Swal.fire('Error','El número CCI debe tener 20 dígitos.','error');
        return false;
      }
    //}
    
    if((cte.CodBanco != "02" && cte.CodBanco != "11" && cte.CodBanco != "03" && cte.CodBanco != "41") && (cte.NroCuenta == "" || cte.NroCuenta == null || cte.NroCuenta == undefined)) {
      Swal.fire('Información','No esta ingresando un número de cuenta','warning');
      //return false;
    }

    return true;
  }

  controlCuentaBancaria(cte: ClaimBenefCuentasModelRequesBM){
    let result = this.changeCteBank(cte);
    if(!result) return;

    let validate = this.validateCCI(cte);
    if(validate) this.initCte();
  }

  addCtesBancarias(){
    if(this.listBank.length > 0){
      let result : boolean;
      let validate : boolean;

      for (let index = 0; index < this.listBank.length; index++) {
        const bank = this.listBank[index];
        result = this.changeCteBank(bank)
         if(!result) break;

         validate = this.validateCCI(bank);
         if(!validate) break;

         bank.Banco = this.bancos.find(x => x.Codigo == bank.CodBanco).Descripcion;
         bank.TipoCuenta = this.tipoCuentas.find(x => x.Codigo == Number(bank.CodTipoCuenta).toString()).Descripcion;
         bank.SMoneda = this.monedas.find(x => x.Codigo == bank.MonedaCod).Descripcion;
         bank.Insupd = "N";
         bank.Posicion = index + 1;
         bank.Modifica = "0"
      }


      // this.listBank.forEach((bank, index) => {

      //    result = this.changeCteBank(bank)
      //    if(!result) return;

      //    validate = this.validateCCI(bank);
      //    if(!validate) return;

      //    bank.Banco = this.bancos.find(x => x.Codigo == bank.CodBanco).Descripcion;
      //    bank.TipoCuenta = this.tipoCuentas.find(x => x.Codigo == Number(bank.CodTipoCuenta).toString()).Descripcion;
      //    bank.SMoneda = this.monedas.find(x => x.Codigo == bank.MonedaCod).Descripcion;
      //    bank.Insupd = "N";
      //    bank.Posicion = index + 1;
      //    bank.Modifica = "0"
      // })

      if(!result) return;
      if(!validate) return;

      this.reference.close(this.listBank);
    }
  }

  editCteBancaria(){
    this.ctaBancaria = this.listBank[0]
    
    let result = this.changeCteBank(this.ctaBancaria)
    if(!result) return;

    let validate = this.validateCCI(this.ctaBancaria);
    if(!validate) return;

    this.ctaBancaria.Banco = this.bancos.find(x => x.Codigo == this.ctaBancaria.CodBanco).Descripcion;
    this.ctaBancaria.TipoCuenta = this.tipoCuentas.find(x => x.Codigo == Number(this.ctaBancaria.CodTipoCuenta).toString()).Descripcion;
    this.ctaBancaria.SMoneda = this.monedas.find(x => x.Codigo == this.ctaBancaria.MonedaCod).Descripcion;
    this.reference.close(this.ctaBancaria);
  }


  

}