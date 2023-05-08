import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jQuery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('toggleButton',{static: false}) toggleButton: ElementRef;
  @ViewChild('menu',{static: false}) menu: ElementRef;
  @ViewChild('mySidenav',{static: false}) contenido: ElementRef;
  public optionList: any = [];
  public optionListSubMenu: any = [];
  public suboptionList: any = [];
  public pruebaSubmenu: any = [];
  public updateModal = false;
  public STIPO_USUARIO

  sidebarNav: any;
  contentButton: any;
  linkactual = "";

  isMenuOpen = false;



  FECHAINICIO: Date = null;
  FECHAFIN: Date = null;

  constructor(private renderer: Renderer2, public router: Router) { }

  ngOnInit(): void {
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
    this.llenarMenu();
  }


  closeNav(){
    this.renderer.removeClass(this.contenido.nativeElement, "abrirNav");
  }

  openNav(){
    if (this.contenido.nativeElement.classList.contains("abrirNav")){
      this.renderer.removeClass(this.contenido.nativeElement, "abrirNav");
    }
    else {
      this.renderer.addClass(this.contenido.nativeElement, "abrirNav");
    }
  }

  activeSidenav(context){
    let div = document.getElementById(context);
    let nav = div.getElementsByClassName("sideNav2");
    for (let i = 0; i< nav.length ; i++){
      if (nav[i].getAttribute("style") == "display: block")
        nav[i].setAttribute("style","display: none");
      else
        nav[i].setAttribute("style","display: block");
    } 
  }

  activarStyle(){
    if(this.linkactual == "clientes" ){
      return 'PositionAbsolute'
     }
     else{
       return 'PositionFixed'
     }
  }

  Ocultar(){
    if(this.linkactual == "clientes" ){
      return false
     }
     else{
       return true
     }
  }

  Home(){
    this.router.navigate(['/home']);
  }

  llenarMenu(){
    this.optionList.push({nTieneHijo :1 , sName : 'SINIESTROS', subgruposnuevos :[
      {sName : 'TRATAMIENTO DE CASO / SINIESTRO', sRouterLink : 'tratamiento-caso-siniestro'},
      {sName : 'RESERVA DE SINIESTRO', sRouterLink: 'reserva-siniestro'}
    ]})
  }

}
