import {Component} from '@angular/core';
import {MaterialDateTimeComponent} from '../date-time';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [
        MaterialDateTimeComponent
    ]
})
export class AppComponent {
    dt: Date = new Date();

    mode: string = 'date';

    defaultDate: Date = new Date(2016,1,1);
    minDate: Date = new Date(2015,1,1);
    maxDate: Date = new Date(2017,6,1);
}
