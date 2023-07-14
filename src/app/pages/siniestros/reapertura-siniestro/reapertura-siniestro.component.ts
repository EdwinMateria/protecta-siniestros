import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SiniestroBM } from 'src/app/core/models/siniestroBM';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import Swal from 'sweetalert2';
import { SwalCarga } from "src/app/core/swal-loading";

@Component({
  selector: 'app-reapertura-siniestro',
  templateUrl: './reapertura-siniestro.component.html',
  styleUrls: ['./reapertura-siniestro.component.scss']
})
export class ReaperturaSiniestroComponent implements OnInit {
  
  nroSiniestro = new FormControl('', Validators.required);
  fechaSiniestro = new FormControl(null, Validators.required);

  constructor(public casoService: CasosService) { }

  ngOnInit(): void {
  }

  AddReopening(){
    
    if(this.nroSiniestro.invalid || this.fechaSiniestro.invalid){
      this.nroSiniestro.markAllAsTouched();
      this.fechaSiniestro.markAllAsTouched();
      return;
    }else{

      Swal.fire({
        title: 'Información',
        text: 'Se actualizará el estado del siniestro. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed){
          let siniestroBM = new SiniestroBM();
          siniestroBM.dFecReapertura = this.fechaSiniestro.value;
          siniestroBM.nSiniestro = this.nroSiniestro.value;
          const data: FormData = new FormData();
          data.append('siniestrosData', JSON.stringify(siniestroBM));
          SwalCarga();
          this.casoService.AddReopening(data).subscribe(
            res => {
              Swal.close();
              if(res.Message != 'Ok'){
                Swal.fire('Información',res.Message,'warning');
              }else{
                Swal.fire('Información','Se realizo la reapertura correctamente.','success');
              }
              return;
            },
            err => {
              Swal.close();
              Swal.fire('Información',err, 'error');
              return;
            }
          )
        }
      })
    }

  }

  limpiarForm(){
    this.nroSiniestro.reset();
    this.fechaSiniestro.reset();
  }

}
