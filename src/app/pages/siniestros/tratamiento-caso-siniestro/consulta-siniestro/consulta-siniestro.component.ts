import { Component, OnInit, Input } from '@angular/core';
import { CausasVM, RechazoVM } from 'src/app/core/models/caso';
import { SiniestroBM } from 'src/app/core/models/siniestroBM';
import { CasosService } from 'src/app/core/services/casos/casos.service';
import Swal from 'sweetalert2';
import { SwalCarga } from "src/app/core/swal-loading";

export class SiniestroSelect{
  codigo    : string;
  descript  : string;
}

@Component({
  selector: 'app-consulta-siniestro',
  templateUrl: './consulta-siniestro.component.html',
  styleUrls: ['./consulta-siniestro.component.scss']
})
export class ConsultaSiniestroComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: number;
  @Input() public causasSiniestro : CausasVM[] = [];
  @Input() public listaRechazo : RechazoVM[] = [];
  siniestro = new SiniestroBM();
  fechaOcurrencia = "";
  fechaDenuncia = "";
  fechaApertura = "";
  fechaFallecido = "";
  fechaRechazo = "";

  //Tipos Ocupantes:
  ocupantes : SiniestroSelect[] = [
    {codigo: "", descript: "SELECCIONAR"},
    {codigo : "1", descript : "Ocupante"},
    {codigo : "2", descript : "Tercero"}
  ]
  
  // Tipos Atencion:
  atenciones : SiniestroSelect[] = [
    {codigo: "", descript: "SELECCIONAR"},
    {codigo: "A", descript: "Ambulatorio"},
    {codigo: "H", descript: "Hospitalario"},
    {codigo: "E", descript: "Emergencia"}
  ]

  constructor(public casoService: CasosService) { }

  ngOnInit(): void {
    this.getSiniestro();
  }
  

  closeModal() {
    this.reference.close();
  }

  getSiniestro(){
    SwalCarga()
    this.casoService.GetSearchClaim(this.data).subscribe(
      res => {
        Swal.close();
        this.siniestro = res.GenericResponse[0]
        this.fechaOcurrencia = new Date(this.siniestro.dFecOcurrencia).toLocaleDateString('en-GB');
        this.fechaDenuncia = new Date(this.siniestro.dFecDenuncia).toLocaleDateString('en-GB');
        this.fechaApertura = new Date(this.siniestro.dFecApertura).toLocaleDateString('en-GB');
        this.fechaFallecido = new Date(this.siniestro.dFecFallecido).toLocaleDateString('en-GB');

        if(this.siniestro.nCodRechazo != 0){
          this.fechaRechazo = new Date(this.siniestro.dFecRechazo).toLocaleDateString('en-GB');
        }
      },
      err => {
        Swal.close();
        Swal.fire('Error',err,'error')
      }
    )
  }

}
