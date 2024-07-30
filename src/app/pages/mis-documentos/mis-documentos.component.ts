import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentosService } from 'src/app/services/documentos.service';

@Component({
  selector: 'app-mis-documentos',
  templateUrl: './mis-documentos.component.html',
  styleUrls: ['./mis-documentos.component.css']
})
export class MisDocumentosComponent implements OnInit{

  cargando: boolean = false
  public documentos: any[] = []

  constructor(private activatedRouted: ActivatedRoute, private documentosService: DocumentosService){

  }

  ngOnInit(): void {
    this.activatedRouted.params.subscribe(({id}) => {
      this.cargandoDocumentosPersonalesID(id)
    })
  }

  cargandoDocumentosPersonalesID(id: string) {
    this.cargando = true
    this.documentosService.cargarMisDocumentos(id).subscribe(resp => {
      this.documentos = resp
      console.log(this.documentos)
      this.cargando = false
    })
  }


}
