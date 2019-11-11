import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { from, forkJoin } from 'rxjs';
import { Genero } from 'app/models/genero';
import { GeneroService } from 'app/services/genero.service';
import { PersonaService } from 'app/services/persona.service';
import { PaisService } from 'app/services/pais.service';
import { Pais } from 'app/models/pais';
import { DepartamentoService } from 'app/services/departamento.service';
import { Departamento } from 'app/models/departamento';
import { Municipio } from 'app/models/municipio';
import { MunicipioService } from 'app/services/municipio.service';
import { Persona } from 'app/models/persona';
import { SucursalService } from 'app/services/sucursal.service';
import { Sucursal } from 'app/models/sucursal';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    hide: boolean;
    hide2: boolean;
    /**Formulario para crear personas */
    personaForm: FormGroup;
   

    /** Listas*/
    generos: any [] = [];
    paises: Pais [] = [];
    departamentos: Departamento [] = [];
    municipios: Municipio [] = [];
    personas: Persona [] = [];
    todosEmpleados: Persona [] = [];
    empleados: Persona [] = [];
    sucursales: Sucursal [] = [];
    /** Lista tipos documento */


    displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'cedula', 'email', 'celular'];
    dataSource = null;
    dataSourceEmpleados = null;

    // new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    constructor( private formBuilder: FormBuilder,
        private generoService: GeneroService,
        private paisService: PaisService,
        private departamentoService: DepartamentoService,
        private municipioService: MunicipioService,
        private sucursalesService: SucursalService,
        private personaService: PersonaService) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    } /*Para tener en cuenta*/

    ngOnInit() {
        /** Creamos el formulario junto a sus validaciones */
        this.personaForm = this.formBuilder.group({
            idPersona: [null],
            idSucursal: [null],
            idRol: [null],
            idMunicipio: [ null, [Validators.required]],
            email: [ '', [Validators.required, Validators.email]],
            primerNombre: ['', [Validators.required]],
            segundoNombre: ['', [Validators.required]],
            primerApellido: ['', [Validators.required]],
            segundoApellido: ['', [Validators.required]],
            fechaNacimiento: ['', [Validators.required]],
            genero: ['', [Validators.required]],
            numeroDocumento:['', [Validators.required]],
            celular: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            barrio: ['', [Validators.required]],
            indicadorCliente: [true, [Validators.required]],
          });
        
         this.generos.push({nombre: 'Masculino'});
         this.generos.push({nombre: 'Femenino'});

         /** Se carga la data inicial */
         forkJoin(this.paisService.getAllEnabled(),
         this.personaService.getAllEnabled(),
         this.sucursalesService.getAllEnabled()
         ).subscribe(
             ([paises, personas, sucursales]) => {
                this.paises = paises;
                this.personas = personas;
                this.sucursales = sucursales;
                console.log(this.sucursales);
                /*** Se filtra personas cliente */
                this.personas = this.personas.filter(
                    x => x.indicadorCliente === true
                );

                /*** Se filtran empleados */
                this.empleados = personas;
                this.empleados = this.empleados.filter(
                    x => x.indicadorCliente === false
                );
                this.todosEmpleados = this.empleados;

                this.dataSource = new MatTableDataSource(this.personas);
                this.dataSourceEmpleados = new MatTableDataSource( this.empleados );
             }
         );
    }
    seleccionarPais( event: any) {
        this.departamentos = [];
        this.departamentoService.getByPais(event).subscribe(
            departamentos => {
                this.departamentos = departamentos;
            }
        );
    }

    seleccionarDepartamento( event: any) {
        this.municipios = [];
        this.municipioService.getByDepartamento( event ).subscribe(
            mun => {
                this.municipios = mun;
            }
        );

    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    applyFilterEmpleados(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceEmpleados.filter = filterValue;
    }
    onSubmitPersona() {
        console.log(this.personaForm.value);
        if ( this.personaForm.valid ) {
            this.personaService.create( this.personaForm.value ).subscribe(
                persona => {
                    alert('Persona Creada');
                },
                error => { 
                    console.log(error);
                }
            );
        }
    }

    filtrarPorSucursal( idSucursal: any ) {
        this.empleados = this.todosEmpleados;
        this.empleados = this.empleados.filter(
            x => x.idSucursal === idSucursal
        );
        this.dataSourceEmpleados = this.empleados;
    }
}

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
    {position: 11, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 12, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 13, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 14, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 15, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 16, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 17, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 18, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 19, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 20, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
