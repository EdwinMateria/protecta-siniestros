import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public pass:string = 'password'
  public eye: { show: boolean };
  public user: { susername: string , spassword:string}; 
  constructor(public router: Router) { }

  ngOnInit(): void {
    this.user = {susername :'', spassword:''}
    this.eye = {show : false}
    this.Inputs()
  }

  Inputs(){
    const inputs = document.querySelectorAll(".input");


      function addcl(){
        let parent = this.parentNode.parentNode;
        parent.classList.add("focus");
      }

      function remcl(){
        let parent = this.parentNode.parentNode;
        if(this.value == ""){
          parent.classList.remove("focus");
        }
      }


      inputs.forEach(input => {
        input.addEventListener("focus", addcl);
        input.addEventListener("blur", remcl);
        });
  }


  MostrarPass() {
    if (this.pass === 'password') {
      this.pass = 'text';
      this.eye.show = true;
    } else {
      this.pass = 'password';
      this.eye.show = false;
    }
  }

  login(){
    this.router.navigate(['/home']);
    // if ((this.user.susername == null || this.user.spassword == null || this.user.susername == null && this.user.spassword == null)
    //  || (this.user.susername == '' || this.user.spassword == '' || this.user.susername == '' && this.user.spassword == '')) {
    //   swal.fire({
    //     title: 'Información',
    //     icon: 'warning',
    //     text: 'Debe ingresar todos los campos',
    //     showCancelButton: false,
    //     confirmButtonColor: '#FA7000',
    //     confirmButtonText: 'Continuar'
    //   }).then((result) => {
    //   })
    //   return;
    // }else{
    //   //SERVICIO LOGIN

    // }
  }

}
