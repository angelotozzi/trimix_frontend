import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, tap } from 'rxjs';
import { Persona } from 'src/app/model/Persona';
import { PersonasService } from 'src/app/services/personas.service';



@Component({
  selector: 'app-personas-dialog',
  templateUrl: './personas-dialog.component.html',
  styleUrls: ['./personas-dialog.component.css']
})
export class PersonasDialogComponent implements OnInit {

  personaForm!: FormGroup;

  tiposDocumento = [
    {value: 'dni', viewValue: 'DNI'},
    {value: 'pasaporte', viewValue: 'Pasaporte'},
    {value: 'cedula', viewValue: 'Cedula'}
  ];

  constructor(private formBuilder: FormBuilder,
    private personasService: PersonasService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<PersonasDialogComponent>) {

      this.personaForm = this.formBuilder.group({
        perNombre: new FormControl('', [Validators.required]),
        perApellido: new FormControl('', [Validators.required]),
        perNumeroDocumento: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        perTipoDocumento: new FormControl('', [Validators.required]),
        perFechaNacimiento: new FormControl('', [Validators.required])

      });

    }

  ngOnInit(): void {

    if(Object.keys(this.personasService.getPersona()).length !== 0){

      this.personaForm.setValue({
        perNombre : this.personasService.getPersona().perNombre,
        perApellido : this.personasService.getPersona().perApellido,
        perNumeroDocumento : this.personasService.getPersona().perNumeroDocumento,
        perTipoDocumento : this.personasService.getPersona().perTipoDocumento,
        perFechaNacimiento : this.personasService.getPersona().perFechaNacimiento
      });

      return;

    }

    this.limpiarForm();

  }

  onSubmit() {

    if(Object.keys(this.personasService.getPersona()).length !== 0){

      this.personasService.getPersona().perNombre = this.personaForm.value.perNombre;
      this.personasService.getPersona().perApellido = this.personaForm.value.perApellido;
      this.personasService.getPersona().perNumeroDocumento = this.personaForm.value.perNumeroDocumento;
      this.personasService.getPersona().perTipoDocumento = this.personaForm.value.perTipoDocumento;
      this.personasService.getPersona().perFechaNacimiento = this.personaForm.value.perFechaNacimiento;

      this.personasService.editar(this.personasService.getPersona().perId, this.personasService.getPersona()).pipe(
        tap(persona => {
          this._snackBar.open("La persona se actualizó correctamente", "Aceptar").onAction().subscribe(() => {
            this.editarPersonaLista(persona);
            this.personasService.setPersona(new Persona());
            this.limpiarForm();
          });
        }),
        catchError(error => error)
      ).subscribe();

      return;
    }

    let persona: Persona = new Persona();
    persona.perNombre = this.personaForm.value.perNombre;
    persona.perApellido = this.personaForm.value.perApellido;
    persona.perNumeroDocumento = this.personaForm.value.perNumeroDocumento;
    persona.perTipoDocumento = this.personaForm.value.perTipoDocumento;
    persona.perFechaNacimiento = this.personaForm.value.perFechaNacimiento;

    this.personasService.crear(persona).pipe(
      tap(persona => {
        this._snackBar.open("La persona se creó correctamente", "Aceptar").onAction().subscribe(() => {
          this.agregarPersonaLista(persona);
          this.personasService.setPersona(new Persona());
          this.limpiarForm();
        });
      }),
      catchError(error => error)
    ).subscribe();

    this.dialogRef.close();

  }

  cerrarDialog(){
    this.dialogRef.close();
  }


  limpiarForm(){
    this.personaForm.setValue({
      perNombre : '',
      perApellido : '',
      perNumeroDocumento : '',
      perTipoDocumento : '',
      perFechaNacimiento : ''
    });
  }

  editarPersonaLista(persona: Persona) {
    const index = this.personasService.dataSource.data.findIndex(p => p.perId === persona.perId);
    this.personasService.dataSource.data[index] = persona;
  }

  agregarPersonaLista(persona: Persona) {
    this.personasService.dataSource.data.push(persona);
  }



}
