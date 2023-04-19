import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Persona } from 'src/app/model/Persona';
import { PersonasDialogComponent } from './personas-dialog/personas-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { PersonasService } from 'src/app/services/personas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.css']
})
export class PersonasComponent implements OnInit, AfterViewInit{

  constructor(private formBuilder: FormBuilder,
              public dialog: Dialog,
              public personasService: PersonasService,
              private _snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<PersonasDialogComponent>) { }


  formularioBusqueda!: FormGroup;
  control!: FormControl;

  displayedColumns: string[] = ['id','nombre','apellido','nroDoc','tipoDoc','fechaNac','editar','eliminar'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.personasService.dataSource.paginator = this.paginator;
  }


  ngOnInit(): void {

    this.formularioBusqueda = this.formBuilder.group({
      nombreBuscado: new FormControl('', []),
      tipoDocumentoBuscado: new FormControl('', []),
    });

    this.getPersonas();

  }


  getPersonas() {
    this.personasService.obtenerTodos().subscribe(
      (personas: Persona[]) => {
      this.personasService.dataSource.data = personas;
      this.personasService.dataSource.paginator = this.paginator;
    });
  }


  getPersonasPorNombreYTipoDoc() {
    this.personasService.obtenerPorNombreYTipoDoc(this.formularioBusqueda.value.nombreBuscado, this.formularioBusqueda.value.tipoDocumentoBuscado).subscribe(
      (personas: Persona[]) => {
      this.personasService.dataSource.data = personas;
      this.personasService.dataSource.paginator = this.paginator;
    });
  }


  editarPersona(persona: Persona): void {

    let per: Persona = new Persona();
    per.perId = persona.perId;
    per.perNombre = persona.perNombre;
    per.perApellido = persona.perApellido;
    per.perNumeroDocumento = persona.perNumeroDocumento;
    per.perTipoDocumento = persona.perTipoDocumento;
    per.perFechaNacimiento = persona.perFechaNacimiento;

    this.personasService.setPersona(per);

    const dialogRef = this.dialog.open(PersonasDialogComponent, {
      width: '500px'
    });

  }


  eliminarPersona(persona: Persona): void {
    this._snackBar
      .open("¿Está seguro que desea eliminar esta persona?", "Aceptar")
      .onAction()
      .subscribe(() => {
        this.personasService.eliminar(persona.perId)
          .pipe(
            tap(() => {
              this._snackBar.open("La persona se eliminó correctamente", "Aceptar")
              this.eliminarPersonaLista(persona);
            }),
            catchError(error => {
              console.error('Ocurrió un error al eliminar la persona:', error);
              return [];
            })
          )
          .subscribe();
      });

  }


  agregarPersona(): void {

    this.personasService.setPersona(new Persona());

    const dialogRef = this.dialog.open(PersonasDialogComponent, {
      width: '500px'
    });

  }



  eliminarPersonaLista(persona: Persona) {
    const index = this.personasService.dataSource.data.findIndex(p => p.perId === persona.perId);
    this.personasService.dataSource.data.splice(index, 1);
  }




}
