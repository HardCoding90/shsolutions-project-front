import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    hide: boolean;
    hide2: boolean;

    constructor() {
    }

    ngOnInit() {
    }

}
