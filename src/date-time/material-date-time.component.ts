import {Component, forwardRef, Provider} from '@angular/core';
import {FORM_DIRECTIVES, CORE_DIRECTIVES} from '@angular/common';
import {MdButton} from '@angular2-material/button';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

import {DateTimeComponent} from './date-time.component';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {
        useExisting: forwardRef(() => MaterialDateTimeComponent),
        multi: true
    });

@Component({
    moduleId: module.id,
    selector: 'material-date-time',
    templateUrl: 'material-date-time.component.html',
    styleUrls: ['date-time.component.css'],
    directives: [
        MdButton,
        MdIcon,
        FORM_DIRECTIVES,
        CORE_DIRECTIVES
    ],
    providers: [
        MdIconRegistry,
        CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
    ]
    inputs: ['autosave','verticalMode','defaultDate', 'hours24','minDate','maxDate','mode'],
    outputs: ['onSave','onCancel']
})
export class MaterialDateTimeComponent extends DateTimeComponent {

}
