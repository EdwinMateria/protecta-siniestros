import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalBeneficiarioComponent } from '../modal-beneficiario/modal-beneficiario.component';
import { ReserveService } from 'src/app/core/services/reserve/reserve.service';
import { ClaimComboResponse } from 'src/app/core/models/claimComboResponse';
import { Observable, OperatorFunction, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { ClaimCodDiagnosticoRequest } from 'src/app/core/models/claimCodDiagnosticoRequest';
import { ClaimCodDiagnosticoResponse } from 'src/app/core/models/claimCodDiagnosticoResponse';

export class Beneficiario {
  codigoCliente: string;
  beneficiario: string;
  tipoDocumento: string;
  tipoBeneficiario: string;
  nroCuenta: string;
  cobertura: string;
  nroDocumento: string;
}
const states = [
	'Alabama',
	'Alaska',
	'American Samoa',
	'Arizona',
	'Arkansas',
	'California',
	'Colorado',
	'Connecticut',
	'Delaware',
	'District Of Columbia',
	'Federated States Of Micronesia',
	'Florida',
	'Georgia',
	'Guam',
	'Hawaii',
	'Idaho',
	'Illinois',
	'Indiana',
	'Iowa',
	'Kansas',
	'Kentucky',
	'Louisiana',
	'Maine',
	'Marshall Islands',
	'Maryland',
	'Massachusetts',
	'Michigan',
	'Minnesota',
	'Mississippi',
	'Missouri',
	'Montana',
	'Nebraska',
	'Nevada',
	'New Hampshire',
	'New Jersey',
	'New Mexico',
	'New York',
	'North Carolina',
	'North Dakota',
	'Northern Mariana Islands',
	'Ohio',
	'Oklahoma',
	'Oregon',
	'Palau',
	'Pennsylvania',
	'Puerto Rico',
	'Rhode Island',
	'South Carolina',
	'South Dakota',
	'Tennessee',
	'Texas',
	'Utah',
	'Vermont',
	'Virgin Islands',
	'Virginia',
	'Washington',
	'West Virginia',
	'Wisconsin',
	'Wyoming',
];

@Component({
  selector: 'app-modal-cobertura',
  templateUrl: './modal-cobertura.component.html',
  styleUrls: ['./modal-cobertura.component.scss']
})
export class ModalCoberturaComponent implements OnInit {

  @Input() public reference: any;
  @Input() public data: any;

  beneficiarios: Beneficiario[] = [];
  datosTramitador = "1";
  comboGeneral$ = this.reserveService.GetComboGeneral();
  comboDiagnostico : ClaimComboResponse []=[{SCODIGO:'SELECCIONE',SDESCRIPCION:'Diagnóstico (CIE10)'}];

  codigoDiagnostico = new ClaimComboResponse();
  codigoComplejidad = "0";
  comboComplejidadDiagnostico$ = this.reserveService.GetComboComplejidadDiagnostico();

  tiposComprobantes : ClaimComboResponse[]=[];


  public model: any;

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(1000),
			distinctUntilChanged(),
			switchMap((term) => term.length < 4 ? of([]) : 
        this.reserveService.GetComboCodDiagnostico(term)
			),
		);

  formatter = (result: ClaimCodDiagnosticoResponse) => result.CDESCRIPT;


  constructor(private modalService: NgbModal, public reserveService: ReserveService) { }

  ngOnInit(): void {
    if(this.data == 4 || this.data == 5) this.obtenerTiposComprobantes();
  }

  closeModal() {
    this.reference.close();
  }

  obtenerTiposComprobantes(){
    this.reserveService.GetComboTipoComprobante().subscribe(
      res =>{
        this.tiposComprobantes = res
      }
    )
  }

  addRow(index: number) {
    if (this.beneficiarios[index].nroDocumento.replace(/ /g, "") == "") {
      Swal.fire('Información', 'Debe introducir el nro de documento del beneficiario', 'warning');
      return;
    } else {
      if(this.beneficiarios.length < 8){
        this.beneficiarios.push({
          codigoCliente: "", beneficiario: "", tipoDocumento: "", tipoBeneficiario: "", nroCuenta: "", cobertura: "", nroDocumento: ""
        })
      }else{
        return;
      }
    }
  }

  completarCampos(index: number) {
    if (this.beneficiarios[index].nroDocumento.replace(/ /g, "") != "") {
      this.beneficiarios[index].codigoCliente = "020001545259";
      this.beneficiarios[index].beneficiario = "Juan Pérez Mujica";
      this.beneficiarios[index].tipoDocumento = "DNI";
      this.beneficiarios[index].tipoBeneficiario = "Reclamanate";
      if(this.data == 1)  this.beneficiarios[index].cobertura = "1- Muerte";
      if(this.data == 2)  this.beneficiarios[index].cobertura = "2- Incapacidad Temporal";
      if(this.data == 3)  this.beneficiarios[index].cobertura = "3- Invalidez Permanente";
      if(this.data == 4)  this.beneficiarios[index].cobertura = "4- Gastos Médicos";
      if(this.data == 5)  this.beneficiarios[index].cobertura = "5- Gastos de Sepelio";      
    }
  }


  openBeneficiario(){
    const modalRef = this.modalService.open(ModalBeneficiarioComponent, { size: 'lg', backdrop:'static', keyboard: false});
    modalRef.componentInstance.reference = modalRef;  
    modalRef.result.then((benef) => {
      console.log(benef);
    });
  }


}
