import {Component} from '@angular/core';
import {DateTimeComponent} from '../date-time';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    directives: [
        DateTimeComponent
    ]
})
export class AppComponent {
    dt: Date = new Date();

    refresh() {
        console.log(this.dt);
    }
}
