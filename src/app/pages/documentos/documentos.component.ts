import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Documentos } from 'src/app/models/documentos.model';
import { BuscarService } from 'src/app/services/buscar.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  public actualizacionDocumentoForm: FormGroup
  public documentos: Documentos[] = []
  public documento: any
  private subscription: Subscription | undefined;

  p: number = 1;

  constructor(private buscarService: BuscarService, private documentosService: DocumentosService, private fb: FormBuilder, private router: Router) {
    this.actualizacionDocumentoForm = fb.group({
      nombre: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.subscription = this.router.events.subscribe(event => {
      console.log(event)
      if (event instanceof NavigationEnd) {
        // Lógica para recargar los datos o el componente
        this.reloadComponent();
      }
    });
    this.cargarDocumentos()
  }

  reloadComponent() {
    // Lógica de recarga del componente
    console.log('Componente recargado');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarDocumentos(){
    this.documentosService.cargarDocumentosGenerales().subscribe({
      next: (resp) => {
        console.log("Documentos Generales ", resp)
        this.documentos = resp
      }
    })
  }

  buscar(termino: string) {
    if(termino.length > 0) {
      this.buscarService.buscarTermino('documentos', termino).subscribe({
        next: (resp: any[]) => {
          console.log("BUSCANDO ",resp)
          this.documentos = resp
        }
      })
    } else {
      this.cargarDocumentos()
    }
  }

  editarDocumento(id: string){
    console.log(id)
    this.documento = this.documentos.filter(doc => doc._id === id)
    console.log(this.documento[0])
    this.actualizacionDocumentoForm.patchValue({
      nombre: this.documento[0].nombre
    })
  }

  actualizarDocumento() {
    console.log(this.documento[0])
    let doc: Documentos = this.documento[0]
    doc.nombre = this.actualizacionDocumentoForm.get('nombre')?.value
    this.documentosService.editarDocumento(doc).subscribe({
      next: (resp) => {
        console.log(resp)
        Swal.fire({
          text: "Documento actualizado exitosamente!",
          icon: "success"
        });
        
        this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(`/dashboard/documentos`);
        });
      }, 
      error: (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un error al actualizar el documento",
        });
      }
    })
  }

  editarArchivo(id: string) {
    this.router.navigateByUrl(`/dashboard/documentos/${id}`)
  }

  eliminarDocumento(id: string) {
    Swal.fire({
      title: "Confirma la acción?",
      text: "Confirma que desea eliminar el documento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#06d79c",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentosService.eliminarDocumento(id).subscribe({
          next: (resp: any) => {
            Swal.fire({
              text: resp.msg,
              icon: "success"
            });

            this.router.navigate(['/dashboard/temporary-route'], { skipLocationChange: true }).then(() => {
              this.router.navigateByUrl(`/dashboard/documentos`);
            });
          },
          error: (error) => {
            Swal.fire({
              title: "Oops...",
              icon: "error",
              text: error.msg,
            });
          }
        })
      }
    });
  }
}
