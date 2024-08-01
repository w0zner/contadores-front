import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileuploadService } from 'src/app/services/fileupload.service';
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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private fileUploadService: FileuploadService) { }

  ngOnInit(): void {
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
          this.router.navigateByUrl(`/dashboard/documentos`)
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
    this.router.navigateByUrl('/dashboard/documentos')
  }
}
