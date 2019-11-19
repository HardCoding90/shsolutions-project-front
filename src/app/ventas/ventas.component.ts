import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from 'app/models/producto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ProductoService } from 'app/services/producto.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { SucursalService } from 'app/services/sucursal.service';
import { PersonaService } from 'app/services/persona.service';
import { Persona } from 'app/models/persona';
import { Sucursal } from 'app/models/sucursal';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  hide: boolean;
  hide2: boolean;
  /**Formulario para crear personas */
  ventaForm: FormGroup;
 

  /** Listas*/
  todosProductos: Producto [] = [];
  productos: Producto [] = [];
  servicios: Producto [] = [];
  personas: Persona [] = [];
  personasSucursal: Persona [] = [];
  sucursales: Sucursal [] = [];

  /** Lista tipos documento */


  displayedColumns: string[] = ['id', 'producto', 'referencia', 'marca', 'valor'];
  dataSource = null;
  dataSourceServicios = null;

  // new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor( private formBuilder: FormBuilder,
      private sucursalService: SucursalService,
      private personaService: PersonaService,
      private productoService: ProductoService) {
  }

  ngOnInit() {
      /** Creamos el formulario junto a sus validaciones */
      this.ventaForm = this.formBuilder.group({
          idVenta: [null],
          idPersonaVenta: [null, [Validators.required]],
          idSucursal: [null, [Validators.required]],
          indicadorHabilitado: [true],
          productosVentasDTOList:[null, [Validators.required]],
        });

       /** Se carga la data inicial */
       forkJoin(this.productoService.getAllEnabled(),
       this.personaService.getAllEnabled(),
       this.sucursalService.getAllEnabled()
       ).subscribe(
           ([productos, persona, sucursales ]) => {
             this.todosProductos = productos
             this.personas = persona;
             this.sucursales = sucursales;
              
              // se filtran los productos
              this.productos = this.todosProductos.filter(
                x => x.indicadorServicio === false
              );
              // se filtran los servicios
              this.servicios = this.todosProductos.filter(
                x => x.indicadorServicio === true
              );
              this.dataSource = new MatTableDataSource(this.productos);
              this.dataSourceServicios = new MatTableDataSource(this.servicios);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.dataSourceServicios.paginator = this.paginator;
              this.dataSourceServicios.sort = this.sort;
           }
       );
  }


  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
  }

  applyFilterServicios(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceServicios.filter = filterValue;
  }

  seleccionarSucursal( event: any ){
    this.ventaForm.controls['idPersonaVenta'].setValue(null);
    this.personasSucursal = this.personas.filter(
      x => x.idSucursal === event && !x.indicadorCliente
    );
  }
  
  seleccionarPersona( event: any ){
    this.ventaForm.controls['idPersonaVenta'].setValue(event);
    

  }

  onSubmitProducto() {
      if ( this.ventaForm.valid ) {
          this.productoService.create( this.ventaForm.value ).subscribe(
            res => {
              Swal.fire({
                  icon: 'success',
                  title: 'Venta realizada',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.ventaForm.reset();
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
