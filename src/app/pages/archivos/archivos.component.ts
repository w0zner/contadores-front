import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuarios } from 'src/app/models/usuarios.model';
import { DocumentosService } from 'src/app/services/documentos.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2'
declare var JQuery: any;
declare var $: any;

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {

  public file: File | undefined
  public id: string | undefined
  public userLogged: string = ''

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private fileUploadService: FileuploadService, private usuariosService: UsuarioService, private documentosService: DocumentosService) { }

  ngOnInit(): void {
    this.userLogged = this.usuariosService.getUserLogged()
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id']
    })
    $(document).ready(function() {
      // Basic
      $('.dropify').dropify();

      // Translated
      $('.dropify-fr').dropify({
          messages: {
              default: 'Glissez-déposez un fichier ici ou cliquez',
              replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
              remove: 'Supprimer',
              error: 'Désolé, le fichier trop volumineux'
          }
      });

      // Used events
      var drEvent = $('#input-file-events').dropify();

      drEvent.on('dropify.beforeClear', function(event: any, element: any) {
          return confirm("Do you really want to delete \"" + element.file.name + "\" ?");
      });

      drEvent.on('dropify.afterClear', function(event: any, element: any) {
          alert('File deleted');
      });

      drEvent.on('dropify.errors', function(event: any, element: any) {
          console.log('Has Errors');
      });

      var drDestroy = $('#input-file-to-destroy').dropify();
      drDestroy = drDestroy.data('dropify')
      $('#toggleDropify').on('click', function(e: any) {
          e.preventDefault();
          if (drDestroy.isDropified()) {
              drDestroy.destroy();
          } else {
              drDestroy.init();
          }
      })
  });
  }

  cambiarArchivo(e: any){
    this.file = e.files[0]
  }

  subirArchivo() {
    if(this.file) {
      this.fileUploadService.subirArchivo(this.file, 'documentos', this.id || '')
        .then(resp => {
          Swal.fire({
            title: resp.msg,
            text: "Archivo subido con nombre: " + resp.archivo,
            icon: "success"
          });

          this.documentosService.getDocumentoByID(this.id || '').subscribe({
            next: (resp) => {
              resp.estado = 'PENDIENTE'
              this.documentosService.editarDocumento(resp).subscribe({
                next: (response) => {
                  console.log("documento con estado actualizado")
                  this.obtenerRolUsuario()
                }
              })
            }
          })

          //const usuarioRole = this.obtenerRolUsuario()



          /*
          if(usuarioRole==='USER_ROLE') {
            this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.userLogged}`)
          } else if(usuarioRole==='ADMIN_ROLE') {
            this.router.navigateByUrl(`/dashboard/documentos`)
          }
          */

        })
        .catch(error => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurrio un error al subir el archivo",
          });
        })
    }
  }

  regresarADocumentos(){
    this.obtenerRolUsuario()

    //this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.userLogged}`)
  }

  obtenerRolUsuario() {
    this.usuariosService.getUsuario(this.userLogged).subscribe({
      next: (resp) => {
        console.log(resp.role)

        if(resp.role==='USER_ROLE') {
          console.log(1)
          this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.userLogged}`)
        } else if(resp.role==='ADMIN_ROLE') {
          console.log(2)
          this.router.navigateByUrl(`/dashboard/documentos`)
        }
      }
    })
  }
}
