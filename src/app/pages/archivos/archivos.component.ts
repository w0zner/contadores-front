import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuarios } from 'src/app/models/usuarios.model';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { DocumentosService } from 'src/app/services/documentos.service';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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
  public usuarioLogueadoID: string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private fileUploadService: FileuploadService,
    private usuariosService: UsuarioService,
    private documentosService: DocumentosService,
    private alertMessageService: AlertMessageService
  ) { }

  ngOnInit(): void {
    this.usuarioLogueadoID = this.localStorageService.getItem('user', false)

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
          this.alertMessageService.mensajeExitosoOk(resp.msg, "Archivo subido con nombre: " + resp.archivo)

          //Actualiza el estado del documento luego de subir el archivo
          this.documentosService.obtenerDocumentoPorId(this.id || '').subscribe({
            next: (resp) => {
              if(resp.tipo !== 'INFORME') {
                resp.estado = 'PENDIENTE'
                console.log(resp)
                this.documentosService.editarDocumento(resp).subscribe({
                  next: (response) => {
                    console.log("documento con estado actualizado")
                    this.obtenerRolUsuario()
                  }
                })
              } else {
                this.obtenerRolUsuario()
              }
            }
          })
        })
        .catch(error => {
          this.alertMessageService.mensajeErrorOk("Oops...",  "Ocurrio un error al subir el archivo")
        })
    }
  }

  regresarADocumentos(){
    this.obtenerRolUsuario()
  }

  obtenerRolUsuario() {
    this.usuariosService.obtenerUsuarioPorId(this.usuarioLogueadoID).subscribe({
      next: (resp) => {
        if(resp.role==='USER_ROLE') {
          this.router.navigateByUrl(`/dashboard/documentos/mis-documentos/${this.usuarioLogueadoID}`)
        } else if(resp.role==='ADMIN_ROLE') {
          this.router.navigateByUrl(`/dashboard/documentos`)
        }
      }
    })
  }
}
