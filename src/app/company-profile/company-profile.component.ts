import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {DepartamentoService} from 'app/services/departamento.service';
import {forkJoin} from 'rxjs';
import {Departamento} from 'app/models/departamento';
import {PaisService} from 'app/services/pais.service';
import {Pais} from 'app/models/pais';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Proveedor} from 'app/models/proveedor';
import {ProveedorService} from 'app/services/proveedor.service';
import {error} from 'protractor';
import { GeneroService } from 'app/services/genero.service';
import { Municipio } from 'app/models/municipio';
import { Persona } from 'app/models/persona';
import { Sucursal } from 'app/models/sucursal';
import { MunicipioService } from 'app/services/municipio.service';
import { SucursalService } from 'app/services/sucursal.service';
import { PersonaService } from 'app/services/persona.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-profile',
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

    hide: boolean;
    hide2: boolean;
    /**Formulario para crear personas */
    proveedorForm: FormGroup;

    /** Listas*/
    paises: Pais [] = [];
    departamentos: Departamento [] = [];
    municipios: Municipio [] = [];
    personas: Persona [] = [];
    todosEmpleados: Persona [] = [];
    empleados: Persona [] = [];
    proveedores: Proveedor [] = [];
    todosProveedores: Proveedor [] = [];
    /** Lista tipos documento */

    // controles filtro empresa
    indicadorProveedor: boolean = true;
    indicadorCliente: boolean = true;



    displayedColumns: string[] = ['id', 'razon', 'nit', 'telefono', 'email', 'celular'];
    dataSource = null;
    dataSourceProveedores = null;

    // new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    constructor( private formBuilder: FormBuilder,
        private router: Router,
        private generoService: GeneroService,
        private paisService: PaisService,
        private departamentoService: DepartamentoService,
        private municipioService: MunicipioService,
        private sucursalesService: SucursalService,
        private proveedorService: ProveedorService,
        private personaService: PersonaService) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    } /*Para tener en cuenta*/

    ngOnInit() {
        /** Creamos el formulario junto a sus validaciones */
        this.proveedorForm = this.formBuilder.group({
            idProveedor: [null],
            idMunicipio: [ null, [Validators.required]],
            email: [ '', [Validators.required, Validators.email]],
            nit: ['', [Validators.required]],
            razonSocial:['', [Validators.required]],
            celular: ['', [Validators.required]],
            telefono: ['', [Validators.required]],
            direccion: ['', [Validators.required]],
            barrio: ['', [Validators.required]],
            indicadorCliente: [true, [Validators.required]],
            indicadorHabilitado: [true],
          });
    

         /** Se carga la data inicial */
         forkJoin(this.paisService.getAllEnabled(),
         this.personaService.getAllEnabled(),
         this.proveedorService.getAllEnabled()
         ).subscribe(
             ([paises, personas, proveedores]) => {
                this.paises = paises;
                this.personas = personas;
                this.proveedores = proveedores;
                this.todosProveedores = proveedores;
                
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
                this.dataSourceProveedores = new MatTableDataSource( this.proveedores );
             }
         );
    }
    
    irProductoProveedorPanel( proveedor: Proveedor ) {
        if ( !proveedor.indicadorCliente ) {
            this.router.navigateByUrl('/proveedor/' + proveedor.idProveedor);
        }
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
    filtroEmpresas() {
        this.proveedores = this.todosProveedores;
        if ( this.indicadorCliente === false && this.indicadorProveedor === false ){
            this.proveedores = [];
        } else {
            if ( !(this.indicadorCliente && this.indicadorProveedor) ) {
                if (this.indicadorCliente) {
                    this.proveedores = this.proveedores.filter(
                        x => x.indicadorCliente === true
                    );
                }
                if (this.indicadorProveedor) {
                    this.proveedores = this.proveedores.filter(
                        x => x.indicadorCliente === false
                    );
                }
            }
        }
        this.dataSourceProveedores = new MatTableDataSource( this.proveedores );
    
        
    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceProveedores.filter = filterValue;
    }
    onSubmitProveedor() {
        if ( this.proveedorForm.valid ) {
            this.proveedorService.create( this.proveedorForm.value ).subscribe(
                res => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Empresa Agregada!',
                        showConfirmButton: false,
                        timer: 1500
                      })
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
