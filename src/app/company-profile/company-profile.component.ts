import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { DepartamentoService } from 'app/services/departamento.service';
import { forkJoin } from 'rxjs';
import { Departamento } from 'app/models/departamento';
import { PaisService } from 'app/services/pais.service';
import { Pais } from 'app/models/pais';

@Component({
    selector: 'app-company-profile',
    templateUrl: './company-profile.component.html',
    styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);
    dataSourceProductsCompany = new MatTableDataSource();

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    /** Listas */
    departamentos: Departamento[] = [];
    departamentosByPais: Departamento[] = [];
    paises: Pais[] = [];

    constructor( 
        /*** Instanciación de Servicios */
        private departamentoService: DepartamentoService,
        private paisService: PaisService
        ) {
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    } /*Para tener en cuenta*/

    ngOnInit() {
        /** Cargamos la información inicial */
        forkJoin(this.departamentoService.getAll(),
        this.paisService.getAll()).subscribe(
            ([ departamentos, paises ]) => {
                this.departamentos = departamentos;
                this.paises = paises;
                console.log(departamentos);
            }
        );
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    applyFilterRegisteredProducts(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSourceProductsCompany.filter = filterValue;
    }

    selectCountry( pais: Pais) {
        this.departamentosByPais = this.departamentos.filter(
            x => x.idPais === pais.idPais
        );
        console.log(this.departamentosByPais);
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

