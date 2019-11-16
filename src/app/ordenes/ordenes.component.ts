import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Pais } from 'app/models/pais';
import { Departamento } from 'app/models/departamento';
import { Municipio } from 'app/models/municipio';
import { Persona } from 'app/models/persona';
import { Proveedor } from 'app/models/proveedor';
import { Router } from '@angular/router';
import { GeneroService } from 'app/services/genero.service';
import { PaisService } from 'app/services/pais.service';
import { DepartamentoService } from 'app/services/departamento.service';
import { MunicipioService } from 'app/services/municipio.service';
import { SucursalService } from 'app/services/sucursal.service';
import { ProveedorService } from 'app/services/proveedor.service';
import { PersonaService } from 'app/services/persona.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { Sucursal } from 'app/models/sucursal';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  hide: boolean;
  hide2: boolean;
  /**Formulario para crear personas */
  proveedorForm: FormGroup;

  /** Listas*/
  paises: Pais [] = [];
  departamentos: Departamento [] = [];
  municipios: Municipio [] = [];
  sucursales: Sucursal [] = [];
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
       this.sucursalesService.getAllEnabled(),
       this.proveedorService.getAllEnabled()
       ).subscribe(
           ([paises, sucursales, proveedores]) => {
              this.paises = paises;
              this.sucursales = sucursales;
              this.proveedores = proveedores;
              // filtamos solo los que no sean clientes
              this.proveedores = this.proveedores.filter(
                x => x.indicadorCliente === false
              );

              this.todosProveedores = proveedores;
       
              this.empleados = this.empleados.filter(
                  x => x.indicadorCliente === false
              );
              this.todosEmpleados = this.empleados;

              //this.dataSource = new MatTableDataSource(this.personas);
              this.dataSourceProveedores = new MatTableDataSource( this.proveedores );
           }
       );
  }
  onSubmitOrden(){
    
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
