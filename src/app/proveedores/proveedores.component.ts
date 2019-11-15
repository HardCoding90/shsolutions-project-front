import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Pais } from 'app/models/pais';
import { Departamento } from 'app/models/departamento';
import { Municipio } from 'app/models/municipio';
import { Persona } from 'app/models/persona';
import { Proveedor } from 'app/models/proveedor';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { GeneroService } from 'app/services/genero.service';
import { PaisService } from 'app/services/pais.service';
import { DepartamentoService } from 'app/services/departamento.service';
import { MunicipioService } from 'app/services/municipio.service';
import { SucursalService } from 'app/services/sucursal.service';
import { ProveedorService } from 'app/services/proveedor.service';
import { PersonaService } from 'app/services/persona.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductoService } from 'app/services/producto.service';
import { Producto } from 'app/models/producto';
import { ProductoProveedorService } from 'app/services/producto-proveedor.service';
import { ProductoProveedor } from 'app/models/producto-proveedor';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
    hide: boolean;
    hide2: boolean;
    /**Formulario para crear personas */
    proveedorForm: FormGroup;

    /** Listas*/
    proveedor: Proveedor;
    todosProductoProveedor: ProductoProveedor [] = [];
    productosProveedor: ProductoProveedor [] = [];
    todosProveedores: Proveedor [] = [];
    todosProductos: Producto [] = [];
    productosFiltrados: Producto [] = [];

    /** Lista tipos documento */

    // controles filtro empresa
    indicadorProveedor: boolean = true;
    indicadorCliente: boolean = true;



    displayedColumns: string[] = ['id', 'producto', 'referencia', 'marca'];
    dataSourceProductos = null;
    dataSourceProductosProveedores = null;

    // new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    constructor( private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private proveedorService: ProveedorService,
        private productoProveedorService: ProductoProveedorService,
        private productoService: ProductoService) {
    }


    ngOnInit() {
      const idProveedor = Number(this.route.snapshot.paramMap.get("id"));
         /** Se carga la data inicial */
         forkJoin(this.proveedorService.getById(idProveedor),
         this.productoProveedorService.getByProveedor(idProveedor),
         this.productoService.getAllEnabled()
         ).subscribe(
             ([proveedor, productosProveedor, productos]) => {
                this.proveedor = proveedor;
                this.productosProveedor = productosProveedor;
                this.todosProductoProveedor = productosProveedor;
                this.todosProductos = productos;
                this.todosProductos.forEach(producto => {
                  let agregarProducto = true;
                  this.productosProveedor.forEach(productoProveedor => {
                    if ( producto.idProducto === productoProveedor.idProducto ) {
                      agregarProducto = false;
                    }
                  });
                  if (agregarProducto) {
                    this.productosFiltrados.push(producto);
                  }
                });
          
                this.dataSourceProductos = new MatTableDataSource(this.productosFiltrados);
                this.dataSourceProductosProveedores = new MatTableDataSource( this.productosProveedor );
                this.dataSourceProductos.paginator = this.paginator;
                this.dataSourceProductos.sort = this.sort;
                this.dataSourceProductosProveedores.paginator = this.paginator;
                this.dataSourceProductosProveedores.sort = this.sort;
             }
         );
    }
   
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceProductos.filter = filterValue;
    }

   async registrarPrecio( producto: Producto ) {
      const { value: number } = await Swal.fire({
        title: 'Precio de compra',
        input: 'number',
      })
      
      if (!number) {
        Swal.fire('Debes asignar un precio de venta!')
      } else {
        this.pasarProducto( producto , number );
      }
    }

    pasarProducto( producto: Producto, precioVenta: number ) {
      const productoProveedor: ProductoProveedor = {
        idProductoProveedor: null,
        idProducto: producto.idProducto,
        idProveedor: this.proveedor.idProveedor,
        producto: producto.producto,
        marca: producto.marca,
        referencia: producto.referencia,
        valorUnidadCompra: precioVenta,
        indicadorHabilitado: true
      }
      this.productosProveedor.push( productoProveedor );
      this.productosFiltrados = this.productosFiltrados.filter(obj => obj.idProducto !== producto.idProducto);
      this.dataSourceProductos = new MatTableDataSource(this.productosFiltrados);
      this.dataSourceProductosProveedores = new MatTableDataSource( this.productosProveedor );
    }

    devolverProducto( productoProveedor: ProductoProveedor ) {
      const producto = this.todosProductos.find(x => x.idProducto === productoProveedor.idProducto);
      this.productosProveedor = this.productosProveedor.filter(
        x => x.idProducto !== productoProveedor.idProducto
      );
        this.productosFiltrados.push(producto);
        this.dataSourceProductos = new MatTableDataSource(this.productosFiltrados);
        this.dataSourceProductosProveedores = new MatTableDataSource( this.productosProveedor );
    }
    onSubmitProductosProveedor() {
      /*
      if ( this.productosProveedor.length === 0 && this.todosProductoProveedor.length > 0 ) {
        this.todosProductoProveedor.forEach(element => {
          element.indicadorHabilitado = false;
        });
        this.productoProveedorService.bulk( this.todosProductoProveedor).subscribe(
          res => {
            Swal.fire({
                icon: 'success',
                title: 'Productos Asignados!',
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
       } else { 
         */
        this.productoProveedorService.bulk( this.productosProveedor, this.proveedor.idProveedor).subscribe(
          res => {
            Swal.fire({
                icon: 'success',
                title: 'Productos Asignados!',
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
       //}
    }

}



