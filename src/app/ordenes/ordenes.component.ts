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
import { OrdenProducto } from 'app/models/ordenes-productos';
import { ProductoProveedor } from 'app/models/producto-proveedor';
import { ProductoProveedorService } from 'app/services/producto-proveedor.service';
import { OrdenService } from 'app/services/orden.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  hide: boolean;
  hide2: boolean;
  /**Formulario para crear personas */
  ordenForm: FormGroup;

  /** Listas*/
  paises: Pais [] = [];
  departamentos: Departamento [] = [];
  municipios: Municipio [] = [];
  sucursales: Sucursal [] = [];
  todosEmpleados: Persona [] = [];
  empleados: Persona [] = [];
  proveedores: Proveedor [] = [];
  todosProveedores: Proveedor [] = [];

  todosProductoProveedor: ProductoProveedor [] = [];
  productosProveedor: ProductoProveedor [] = [];
  ordenesProductos: OrdenProducto [] = [];
  idSucursalSeleccionada: number;

  /** Lista tipos documento */

  // controles filtro empresa
  indicadorProveedor: boolean = true;
  indicadorCliente: boolean = true;



  displayedColumns: string[] = ['id', 'producto', 'referencia', 'valorCompraUnidad'];
  displayedColumns2: string[] = ['id', 'producto', 'referencia', 'valorUnidadCompra'];

  dataSourceProductosProveedor = null;
  dataSourceOrdenProductos = null;

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
      private productoProveedorService: ProductoProveedorService,
      private ordenService: OrdenService,
      private personaService: PersonaService) {
  }

  ngOnInit() {
      /** Creamos el formulario junto a sus validaciones */
      this.ordenForm = this.formBuilder.group({
          idOrden: [null],
          idSucursal: [ null, [Validators.required]],
          ordenesProductos: [null, [Validators.required]],
          fechaOrden: [null],
          indicadorRecibida: [true],
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

           }
       );
  }

  irProductoProveedorPanel( proveedor: Proveedor ) {
      if ( !proveedor.indicadorCliente ) {
          this.router.navigateByUrl('/proveedor/' + proveedor.idProveedor);
      }
  }
  seleccionarSucursal( event: any) {
    this.idSucursalSeleccionada = event;
    this.ordenForm.controls['idSucursal'].setValue(event);
  }

  seleccionarProveedor( event: any ) {
      this.productosProveedor = [];
      this.productoProveedorService.getByProveedor( event ).subscribe(
          res => {
            this.productosProveedor = res;
            this.todosProductoProveedor = res;
            this.dataSourceProductosProveedor = new MatTableDataSource(this.productosProveedor);
            this.dataSourceOrdenProductos = new MatTableDataSource( this.ordenesProductos );

            this.dataSourceOrdenProductos.paginator = this.paginator;
            this.dataSourceOrdenProductos.sort = this.sort;
            this.dataSourceProductosProveedor.paginator = this.paginator;
            this.dataSourceProductosProveedor.sort = this.sort;
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
      this.dataSourceOrdenProductos = new MatTableDataSource( this.proveedores );
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSourceProductosProveedor.filter = filterValue;
  }
  agregarProducto( productoProveedor: ProductoProveedor, cantida: number ){
    const ordenProducto: OrdenProducto = {
        idOrdenProducto: null,
        idProducto: productoProveedor.idProducto,
        idOrden: null,
        idProductoProveedor: productoProveedor.idProductoProveedor,
        producto: productoProveedor.producto,
        marca: productoProveedor.marca,
        referencia: productoProveedor.referencia,
        valorCompraUnidad: productoProveedor.valorUnidadCompra,
        cantidad: cantida,
        indicadorHabilitado: true
      }
    this.ordenesProductos.push(ordenProducto);
    this.productosProveedor = this.productosProveedor.filter(
        x => x.idProductoProveedor !== productoProveedor.idProductoProveedor
    );
    this.dataSourceProductosProveedor = new MatTableDataSource(this.productosProveedor);
    this.dataSourceOrdenProductos = new MatTableDataSource( this.ordenesProductos );
  }
  devolverProducto( ordenProducto: OrdenProducto ) {
    // eliminamos el registro de la lista
    this.ordenesProductos = this.ordenesProductos.filter(
        x => x.idProductoProveedor !== ordenProducto.idProductoProveedor
    );
    const productoProveedor = this.todosProductoProveedor.find(
        x => x.idProductoProveedor === ordenProducto.idProductoProveedor
    );
    this.productosProveedor.push(productoProveedor);

    this.dataSourceProductosProveedor = new MatTableDataSource(this.productosProveedor);
    this.dataSourceOrdenProductos = new MatTableDataSource( this.ordenesProductos );
  }
  async registrarCantidad( productoProveedor: ProductoProveedor ) {
    const { value: number } = await Swal.fire({
      title: 'Cantidad',
      input: 'number',
    })
    
    if (!number) {
      Swal.fire('Debes asignar una cantidad!')
    } else {
      this.agregarProducto( productoProveedor , number );
    }
  }
  onSubmitOrden() {
    this.ordenForm.controls['ordenesProductos'].setValue(this.ordenesProductos);
      if ( this.ordenForm.valid ) {
          this.ordenService.create( this.ordenForm.value ).subscribe(
              res => {
                  Swal.fire({
                      icon: 'success',
                      title: 'Orden realizada!',
                      showConfirmButton: false,
                      timer: 1500
                    })
              },
              error => {
                  Swal.fire({
                      icon: 'error',
                      title: 'Ups, hubo un error al generar la orden!',
                      showConfirmButton: false,
                      timer: 1500
                    })
              }
          );
      }
  }

}
