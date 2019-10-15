import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';

import { from, forkJoin } from 'rxjs';
import { Genero } from 'app/models/genero';
import { GeneroService } from 'app/services/genero.service';
@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    hide: boolean;
    hide2: boolean;
    /**Formulario para crear personas */
    personaForm: any;

    /** Lista de géneros */
    generos: Genero[] = [];

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource(ELEMENT_DATA);

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    constructor( private formBuilder: FormBuilder,
        private generoService: GeneroService) {
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
            email: [ '', [Validators.required, Validators.email]],
            primerNombre: ['', [Validators.required]],
            segundoNombre: ['', [Validators.required]],
            primerApellido: ['', [Validators.required]],
            segundoApellido: ['', [Validators.required]],
            fechaNacimiento: ['', [Validators.required]],
            idGenero: ['', [Validators.required]],
            idTipoDocumento: ['', [Validators.required]],
            numeroDocumento:['', [Validators.required]],
          });
        
          forkJoin( this.generoService.getAll() ).subscribe(
              ([generos]) => {
                this.generos = generos;
              }
          );
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
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
