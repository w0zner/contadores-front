import { FormGroup } from "@angular/forms";

export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

export function campoValido(form: FormGroup, campo: string, isSubmit: boolean): boolean{
  if(form.get(campo)?.invalid && isSubmit){
    return true
  } else {
    return false
  }
}
