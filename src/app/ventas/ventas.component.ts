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
import { VentaService } from 'app/services/venta.service';

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
  DTOproductosCarrito: any [] = [];
  productosCarrito: Producto [] = [];
  totalCompras: number = 0;
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
      private ventaService: VentaService,
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
       forkJoin(
       this.personaService.getAllEnabled(),
       this.sucursalService.getAllEnabled()
       ).subscribe(
           ([ persona, sucursales ]) => {
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
    this.DTOproductosCarrito = [];
    this.ventaForm.controls['idPersonaVenta'].setValue(null);
    this.ventaForm.controls['idSucursal'].setValue(event);
    this.personasSucursal = this.personas.filter(
      x => x.idSucursal === event && !x.indicadorCliente
    );
    if (this.personasSucursal.length > 0 ){
      this.productos = [];
      this.productoService.getBySucursal(event).subscribe(
        res => {
          this.productos = res;
          this.dataSource = new MatTableDataSource(this.productos);
        }
      );
    }
  }
  
  seleccionarPersona( event: any ){
    this.ventaForm.controls['idPersonaVenta'].setValue(event);
  }

  limpiarFormulario(){
    this.DTOproductosCarrito = [];
    this.productos = [];
    this.ventaForm.reset();
    this.dataSource = new MatTableDataSource(this.productos);
  }

  async seleccionarProducto( producto: Producto ) {
    const { value: number } = await Swal.fire({
      title: 'Cantidad',
      input: 'number',
    })
    
    if (!number) {
      Swal.fire('Debes asignar una cantidad!')
    } else {
      this.agregarProductoAlCarro( producto , number );
    }
  }
  agregarProductoAlCarro( producto: Producto, cantidad: number){
    const productoAgregar = {
      cantidad: cantidad,
      producto: producto
    }
    this.totalCompras = this.totalCompras + cantidad * producto.valorUnidadVenta;
    this.DTOproductosCarrito.push(productoAgregar);
    this.productosCarrito.push(producto);
  }

  onSubmitVenta() {
    const venta = this.ventaForm.getRawValue();
    let productos : any = [];
    for (let index = 0; index < this.DTOproductosCarrito.length; index++) {
      const element = this.DTOproductosCarrito[index];
      productos.push(
        {
          idProducto: element.producto.idProducto,
          cantidad: element.cantidad
        }
      );
    }
    this.ventaForm.controls['productosVentasDTOList'].setValue(productos);
    venta.productosVentasDTOList = productos;
      if ( this.ventaForm.valid ) {
          this.ventaService.create( this.ventaForm.value ).subscribe(
            res => {
              Swal.fire({
                  icon: 'success',
                  title: 'Venta realizada',
                  showConfirmButton: false,
                  timer: 1500
                });
               this.limpiarFormulario();
          },
          error => {
              Swal.fire({
                  icon: 'error',
                  title: 'Ups, hubo un error al realizar la venta!',
                  showConfirmButton: false,
                  timer: 1500
                })
          }
          );
      }
  }
}
