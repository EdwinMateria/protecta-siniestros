import { Component, OnInit, Input } from '@angular/core';
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
  @Input() public ctaBancaria: ClientBank = new ClientBank();

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

  listBank : ClientBank[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initCte();
  }

  initCte(){
    if(this.addCtaBank){
      this.listBank.push({
        sbank       :   '',
        scuenta     :   '0',
        scta        :   '',
        scci        :   '',
        state       :   '1',
        scoin       :   '0',
        num_movent  :   this.listBank.length + 1,
        length      :   20
      })
    }else{
      this.listBank.push(this.ctaBancaria)
    }
  }

  closeModal() {
    this.reference.close();
  }

  deleteCuentasBancarias(index: number){
    if(this.listBank.length > 1){
      this.listBank.splice(index,1);
    }
  }

  changeBank(bank: ClientBank){
    bank.scta = '';
    if(bank.sbank == "02" && bank.scuenta == "2"){
      bank.length = 13
    }else{
      if(bank.sbank == "02" && bank.scuenta == "1"){
        bank.length = 14
      }else{
        if(bank.sbank == "11"){
          bank.length = 20
        }else{
          if(bank.sbank == "03"){
            bank.length = 13
          }else{
            if(bank.sbank == "41"){
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

  changeCteBank(cte: ClientBank){
    const numeros = ["02", "03", "11", "41"];

    if(cte.sbank == ''){
      Swal.fire('Información','Debe seleccionar un banco','warning');
      return false;
    }

    if(cte.scuenta == '0'){
      Swal.fire('Información','Debe seleccionar el tipo de cuenta','warning');
      return false;
    }

    if(cte.scoin == '0'){
      Swal.fire('Información','Debe seleccionar una moneda','warning');
      return false;
    }

    //validacion numero de cuenta por banco
    if(cte.sbank == "02"){ //BCP
      if(cte.scuenta == "1" && cte.scta.toString().length != 14){
        Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 14 dígitos.','warning');
        return false;
      }
      if(cte.scuenta == "2" && cte.scta.toString().length != 13){
        Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 13 dígitos.','warning');
        return false;
      }
    }

    if(cte.sbank == "11" && cte.scta.toString().length != 20){ //BBVA
      Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 20 dígitos.','warning');
      return false;
    }

    if(cte.sbank == "03" && cte.scta.toString().length != 13){ //INTERBANK
      Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 13 dígitos.')
      return false;
    }

    if(cte.sbank == "41" && cte.scta.toString().length != 10){ //SCOTIABANK
      Swal.fire('Información','La cuenta de ahorros para el banco seleccionado debe tener 10 dígitos.')
      return false;
    }

    if(numeros.includes(cte.sbank) && (cte.scci == "" || cte.scci == null || cte.scci == undefined)){
      Swal.fire('Información','Para el banco seleccionado es obligatorio ingresar el número CCI','warning');
      return false;
    }
    return true;
  }

  controlCuentaBancaria(cte: ClientBank){
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
        bank.sbankName = this.bancos.find(x => x.Codigo == bank.sbank).Descripcion;
        bank.scuentaName = this.tipoCuentas.find(x => x.Codigo == bank.scuenta).Descripcion;
        bank.num_movent = index + 1
      })

      if(!result) return;
      
      console.log(this.listBank);
      this.reference.close(this.listBank);
    }
  }

  editCteBancaria(){
    let result = this.changeCteBank(this.ctaBancaria)
    if(!result) return;
    this.ctaBancaria.sbankName = this.bancos.find(x => x.Codigo == this.ctaBancaria.sbank).Descripcion;
    this.ctaBancaria.scuentaName = this.tipoCuentas.find(x => x.Codigo == this.ctaBancaria.scuenta).Descripcion;
    this.reference.close(this.ctaBancaria);
  }


  

}
