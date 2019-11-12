import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PersonaService } from 'app/services/persona.service';
import { SucursalService } from 'app/services/sucursal.service';
import { MunicipioService } from 'app/services/municipio.service';
import { DepartamentoService } from 'app/services/departamento.service';
import { PaisService } from 'app/services/pais.service';
import { GeneroService } from 'app/services/genero.service';
import { Pais } from 'app/models/pais';
import { Departamento } from 'app/models/departamento';
import { Municipio } from 'app/models/municipio';
import { Persona } from 'app/models/persona';
import { Sucursal } from 'app/models/sucursal';
import { forkJoin } from 'rxjs';
import { ProductoService } from 'app/services/producto.service';
import Swal from 'sweetalert2';
import { Producto } from 'app/models/producto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  hide: boolean;
  hide2: boolean;
  /**Formulario para crear personas */
  productoForm: FormGroup;
 

  /** Listas*/
  todosProductos: Producto [] = [];
  productos: Producto [] = [];
  servicios: Producto [] = [];
  /** Lista tipos documento */


  displayedColumns: string[] = ['id', 'producto', 'referencia', 'marca', 'valor'];
  dataSource = null;
  dataSourceServicios = null;

  // new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor( private formBuilder: FormBuilder,
      private productoService: ProductoService) {
  }

  ngOnInit() {
      /** Creamos el formulario junto a sus validaciones */
      this.productoForm = this.formBuilder.group({
          idProducto: [null],
          producto: ['', [Validators.required]],
          descripcion: ['', [Validators.required]],
          marca: ['', [Validators.required]],
          referencia: ['', [Validators.required]],
          valorUnidadVenta: ['', [Validators.required]],
          indicadorHabilitado: [true],
          indicadorServicio: [true, [Validators.required]],
        });

       /** Se carga la data inicial */
       forkJoin(this.productoService.getAllEnabled()
       ).subscribe(
           ([productos]) => {
             this.todosProductos = productos
              
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



  onSubmitProducto() {
      if ( this.productoForm.valid ) {
          this.productoService.create( this.productoForm.value ).subscribe(
            res => {
              Swal.fire({
                  icon: 'success',
                  title: 'Producto agregado!',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.productoForm.reset();
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
