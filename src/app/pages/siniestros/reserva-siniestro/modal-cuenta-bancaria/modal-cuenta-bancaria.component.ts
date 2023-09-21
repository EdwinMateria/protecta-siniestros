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
    {Codigo : '0' , Descripcion: 'DESHABILITADO'}
  ]

  listBank : ClaimBenefCuentasModelRequesBM[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initCte();
  }

  initCte(){
    console.log(this.ctaBancaria);
    
    if(this.addCtaBank){
      let cteP = new ClaimBenefCuentasModelRequesBM();
      this.listBank.push({
        ...cteP,
        Posicion  :   this.listBank.length + 1,
        length      :   20
      })
    }else{
      console.log(this.ctaBancaria);
      this.listBank.push(this.ctaBancaria)
    }
  }

  closeModal() {
    this.reference.close();
  }

  changeBank(bank: ClaimBenefCuentasModelRequesBM){
    bank.NroCuenta = '';
    if(bank.CodBanco == "02" && bank.NroCuenta == "2"){
      bank.length = 13
    }else{
      if(bank.CodBanco == "02" && bank.NroCuenta == "1"){
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

  changeCteBank(cte: ClaimBenefCuentasModelRequesBM){
    const numeros = ["02", "03", "11", "41"];

    if(cte.CodBanco == ''){
      Swal.fire('Información','Debe seleccionar un banco','warning');
      return false;
    }

    if(cte.NroCuenta == '0'){
      Swal.fire('Información','Debe seleccionar el tipo de cuenta','warning');
      return false;
    }

    if(cte.MonedaCod == '0'){
      Swal.fire('Información','Debe seleccionar una moneda','warning');
      return false;
    }

    //validacion numero de cuenta por banco
    if(cte.CodBanco == "02"){ //BCP
      if(cte.NroCuenta == "1" && cte.NroCuenta.toString().length != 14){
        Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 14 dígitos.','warning');
        return false;
      }
      if(cte.NroCuenta == "2" && cte.NroCuenta.toString().length != 13){
        Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 13 dígitos.','warning');
        return false;
      }
    }

    if(cte.CodBanco == "11" && cte.NroCuenta.toString().length != 20){ //BBVA
      Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 20 dígitos.','warning');
      return false;
    }

    if(cte.CodBanco == "03" && cte.NroCuenta.toString().length != 13){ //INTERBANK
      Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 13 dígitos.')
      return false;
    }

    if(cte.CodBanco == "41" && cte.NroCuenta.toString().length != 10){ //SCOTIABANK
      Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 10 dígitos.')
      return false;
    }

    if(numeros.includes(cte.CodBanco) && (cte.NroCuentaCCI == "" || cte.NroCuentaCCI == null || cte.NroCuentaCCI == undefined)){
      Swal.fire('Información','Para el banco seleccionado es obligatorio ingresar el número CCI','warning');
      return false;
    }
    return true;
  }

  controlCuentaBancaria(cte: ClaimBenefCuentasModelRequesBM){
    let result = this.changeCteBank(cte);
    if(result){
      this.initCte();
    }
  }

  addCtesBancarias(){
    if(this.listBank.length > 0){
      let result : boolean;
      this.listBank.forEach((bank, index) => {
         result = this.changeCteBank(bank)
         if(!result) return;
         bank.Banco = this.bancos.find(x => x.Codigo == bank.CodBanco).Descripcion;
         bank.TipoCuenta = this.tipoCuentas.find(x => x.Codigo == Number(bank.CodTipoCuenta).toString()).Descripcion;
         bank.SMoneda = this.monedas.find(x => x.Codigo == bank.MonedaCod).Descripcion;
         bank.Insupd = "N";
         bank.Posicion = index + 1;
         bank.Modifica = "0"
      })

      if(!result) return;

      this.reference.close(this.listBank);
    }
  }

  editCteBancaria(){
    let result = this.changeCteBank(this.ctaBancaria)
    if(!result) return;
    this.ctaBancaria = this.listBank[0]
    this.ctaBancaria.Banco = this.bancos.find(x => x.Codigo == this.ctaBancaria.CodBanco).Descripcion;
    this.ctaBancaria.TipoCuenta = this.tipoCuentas.find(x => x.Codigo == Number(this.ctaBancaria.CodTipoCuenta).toString()).Descripcion;
    this.ctaBancaria.SMoneda = this.monedas.find(x => x.Codigo == this.ctaBancaria.MonedaCod).Descripcion;
    this.reference.close(this.ctaBancaria);
  }


  

}