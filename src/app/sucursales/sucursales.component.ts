import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DepartamentoService } from 'app/services/departamento.service';
import { PaisService } from 'app/services/pais.service';
import { GeneroService } from 'app/services/genero.service';
import { MunicipioService } from 'app/services/municipio.service';
import { SucursalService } from 'app/services/sucursal.service';
import { PersonaService } from 'app/services/persona.service';
import {from, forkJoin, Observable} from 'rxjs';
import { Genero } from 'app/models/genero';
import { Pais } from 'app/models/pais';
import { Departamento } from 'app/models/departamento';
import { Municipio } from 'app/models/municipio';
import { Persona } from 'app/models/persona';
import { Sucursal } from 'app/models/sucursal';
import { Inventario } from 'app/models/inventario';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit {
    hide: boolean;
    hide2: boolean;
    /**Formulario para crear personas */
    sucursalForm: FormGroup;
   

    /** Listas*/
    generos: any [] = [];
    paises: Pais [] = [];
    departamentos: Departamento [] = [];
    municipios: Municipio [] = [];
    personas: Persona [] = [];
    empleados: Persona [] = [];
    sucursales: Sucursal [] = [];
    inventarios: Inventario [] = [];
    inventariosTodos: Inventario [] = [];
    /** Lista tipos documento */


    displayedColumns: string[] = ['id', 'nombre', 'tel', 'email'];
    displayedColumnsInventarios: string[] = ['id', 'producto', 'cantidad'];
    dataSource = null;
    dataSourceEmpleados = null;
    /*dataSourceInventario: string[] = ['id', 'producto', 'cantidad'];*/
    dataSourceInventario = null;

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
        this.sucursalForm = this.formBuilder.group({
            idSucursal: [null],
            idMunicipio: [ null, [Validators.required]],
            email: [ '', [Validators.required, Validators.email]],
            celular: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            barrio: ['', [Validators.required]],
            indicadorCliente: [true, [Validators.required]],
            indicadorHabilitado: true,
          });
        
         this.generos.push({nombre: 'Masculino'});
         this.generos.push({nombre: 'Femenino'});

         /** Se carga la data inicial */
         forkJoin(this.paisService.getAllEnabled(),
         this.personaService.getAllEnabled(),
         this.sucursalesService.getAllEnabled(),
         this.sucursalesService.getAllInventario()
         ).subscribe(
             ([paises, personas, sucursales, inventarios]) => {
                this.paises = paises;
                this.personas = personas;
                this.sucursales = sucursales;
                 this.inventarios = inventarios;
                console.log(this.sucursales);
                /*** Se filtra personas cliente */
                this.personas = this.personas.filter(
                    x => x.indicadorCliente === true
                );
                this.inventariosTodos = inventarios;
                /*** Se filtran empleados */
                this.empleados = personas;
                this.empleados = this.empleados.filter(
                    x => x.indicadorCliente === false
                );
                this.dataSource = new MatTableDataSource(this.sucursales);
                this.dataSourceEmpleados = new MatTableDataSource( this.empleados );
                this.dataSourceInventario = new MatTableDataSource( this.inventarios );
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
    onSubmitSucursal() {
        console.log(this.sucursalForm.value);
        if ( this.sucursalForm.valid ) {
            this.sucursalesService.create( this.sucursalForm.value ).subscribe(
                persona => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucursal agregada!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                },
                error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ups, hubo un error al agregar!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            );
        }
    }

    filtrarPorSucursal( idSucursal: any ) {
        this.inventarios = this.inventariosTodos;
        this.inventarios = this.inventarios.filter(
            x => x.idSucursal === idSucursal
        );
        this.dataSourceInventario = this.inventarios
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
