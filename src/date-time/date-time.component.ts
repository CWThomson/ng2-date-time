import {OnInit, Input, Output, EventEmitter, forwardRef, Provider} from '@angular/core';
import {DatePipe, ControlValueAccessor} from '@angular/common';

// @Component({
//     moduleId: module.id,
//     selector: 'date-time',
//     templateUrl: 'date-time.component.html',
//     styleUrls: ['date-time.component.css'],
//     directives: [
//         MdButton,
//         MdIcon,
//         FORM_DIRECTIVES,
//         CORE_DIRECTIVES
//     ],
//     providers: [
//         MdIconRegistry,
//         CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
//     ]
// })
export class DateTimeComponent implements ControlValueAccessor, OnInit {

    // @Input('theme') theme: string;
    @Input() autosave: boolean;
    @Input() verticalMode: boolean;
    @Input() compact: boolean;
    @Input() hours24: boolean;
    @Input() defaultMode: string;
    @Input() displayMode: string;
    @Input() weekdays: String[];
    @Input() defaultDate: Date;
    @Input() minDate: Date;
    @Input() maxDate: Date;

    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSave: EventEmitter<Date> = new EventEmitter<Date>();

    private _value: any = '';
    private mode: string;

    _dateFilter: DatePipe = new DatePipe();

    get value(): any {
        return this._value;
    };

    set value(v: any) {
        if (v !== this._value) {
            this._value = new Date(v);
            this.onChange(this._value);
        }
    }

    scDateTimeConfig = {
        defaultTheme: 'material',
        autosave: false,
        defaultMode: 'date',
        defaultDate: void 0,
        displayMode: void 0,
        defaultOrientation: false,
        displayTwentyfour: false,
        compact: false
    };

    scDateTimeI18n = {
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        incrementHours: 'Increment Hours',
        decrementHours: 'Decrement Hours',
        incrementMinutes: 'Increment Minutes',
        decrementMinutes: 'Decrement Minutes',
        switchAmPm: 'Switch AM/PM',
        now: 'Now',
        cancel: 'Cancel',
        save: 'Save',
        weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        switchTo: 'Switch to',
        clock: 'Clock',
        calendar: 'Calendar'
    };

    display = {
        fullTitle: () => {
            let _timeString = this.hours24 ? 'HH:mm' : 'h:mm a';
            if (this.displayMode === 'full' && !this.verticalMode) {
                return this._dateFilter.transform(this.date, 'EEEE d MMMM yyyy, ' + _timeString);
            } else if (this.displayMode === 'time') {
                return this._dateFilter.transform(this.date, _timeString);
            } else if (this.displayMode === 'date') {
                return this._dateFilter.transform(this.date, 'EEE d MMM yyyy');
            } else {
                return this._dateFilter.transform(this.date, 'd MMM yyyy, ' + _timeString);
            }
        },
        title: () => {
            if (this.mode === 'date') {
                return this._dateFilter.transform(this.date, (this.displayMode === 'date' ? 'EEEE' : 'EEEE ' +
                (this.hours24 ? 'HH:mm' : 'h:mm a')));
            } else {
                return this._dateFilter.transform(this.date, 'MMMM d yyyy');
            }
        },
        'super': () => {
            if (this.mode === 'date') {
                return this._dateFilter.transform(this.date, 'MMM');
            } else {
                return '';
            }
        },
        main: () => {
            return this.mode === 'date' ? this._dateFilter.transform(this.date, 'd') : this.hours24 ?
                this._dateFilter.transform(this.date, 'HH:mm') : (this._dateFilter.transform(this.date, 'h:mm')) +
            '<small class="small">' + (this._dateFilter.transform(this.date, 'a')) + '</small>';
        },
        sub: () => {
            if (this.mode === 'date') {
                return this._dateFilter.transform(this.date, 'yyyy');
            } else {
                return this._dateFilter.transform(this.date, 'HH:mm');
            }
        },
        month: () => {
            return this._dateFilter.transform(this.date, 'MMM');
        },
        amPm: () => {
            return this._dateFilter.transform(this.date, 'a');
        }
    };

    calendar = {
        _month: 0,
        _year: 0,
        _months: [],

        _allMonths: (() => {
            let results = [];
            for (let i = 0; i <= 11; i++) {
                results.push(this._dateFilter.transform(new Date(2000, i, 1), 'MMMM'));
            }
            return results;
        })(),

        offsetMargin: () => {
            let margin = (new Date(this.calendar._year, this.calendar._month).getDay() * 2.7) + 'rem';
            return margin;
        },
        isVisible: (d) => {
            let visible = new Date(this.calendar._year, this.calendar._month, d).getMonth() === this.calendar._month;
            return visible;
        },
        isDisabled: (d) => {
            let currentDate = new Date(this.calendar._year, this.calendar._month, d);
            return ((this.minDate != null) && currentDate < this.minDate) || ((this.maxDate != null) && currentDate > this.maxDate);
        },
        isPrevMonthButtonHidden: () => {
            return (this.minDate != null) && this.calendar._month <= this.minDate.getMonth() && this.calendar._year <= this.minDate.getFullYear();
        },
        isNextMonthButtonHidden: () => {
            return (this.maxDate != null) && this.calendar._month >= this.maxDate.getMonth() && this.calendar._year >= this.maxDate.getFullYear();
        },
        'class': (d) => {
            let classString = '';
            if ((this.date != null) && new Date(this.calendar._year, this.calendar._month, d).getTime() ===
                new Date(this.date.getTime()).setHours(0, 0, 0, 0)) {
                classString += 'selected';
            }
            if (new Date(this.calendar._year, this.calendar._month, d).getTime() === new Date().setHours(0, 0, 0, 0)) {
                classString += ' today';
            }
            return classString;
        },
        select: (d) => {
            this.date.setFullYear(this.calendar._year, this.calendar._month, d);
            return this.saveUpdateDate();
        },
        monthChange: (save?) => {
            this.calendar._month = Number(this.calendar._month);
            console.log(this.calendar._year.constructor);
            // let maxdate, mindate;
            if (save == null) {
                save = true;
            }
            if ((this.calendar._year == null) || isNaN(this.calendar._year)) {
                this.calendar._year = new Date().getFullYear();
            }
            if ((this.minDate != null) && this.minDate.getFullYear() === this.calendar._year && this.minDate.getMonth() >=
                this.calendar._month) {
                this.calendar._month = Math.max(this.minDate.getMonth(), this.calendar._month);
            }
            if ((this.maxDate != null) && this.maxDate.getFullYear() === this.calendar._year && this.maxDate.getMonth() <=
                this.calendar._month) {
                this.calendar._month = Math.min(this.maxDate.getMonth(), this.calendar._month);
            }

            this.date.setFullYear(this.calendar._year, this.calendar._month);

            if (this.date.getMonth() !== this.calendar._month) {
                this.date.setDate(0);
            }
            if ((this.minDate != null) && this.date < this.minDate) {
                this.date.setDate(this.minDate.getTime());
                this.calendar.select(this.minDate.getDate());
            }
            if ((this.maxDate != null) && this.date > this.maxDate) {
                this.date.setDate(this.maxDate.getTime());
                this.calendar.select(this.maxDate.getDate());
            }
            if (save) {
                return this.saveUpdateDate();
            }
        },
        incMonth: (months) => {
            this.calendar._month += months;
            while (this.calendar._month < 0 || this.calendar._month > 11) {
                if (this.calendar._month < 0) {
                    this.calendar._month += 12;
                    this.calendar._year--;
                } else {
                    this.calendar._month -= 12;
                    this.calendar._year++;
                }
            }
            return this.calendar.monthChange();
        },
        yearChange: (save) => {
            let len; //, maxdate, mindate;
            if (save == null) {
                save = true;
            }
            if ((this.calendar._year == null) || this.calendar._year === 0) {
                return;
            }
            let i = (this.minDate != null) && this.minDate.getFullYear() === this.calendar._year ? this.minDate.getMonth() : 0;
            len = (this.maxDate != null) && this.maxDate.getFullYear() === this.calendar._year ? this.maxDate.getMonth() : 11;
            this.calendar._months = this.calendar._allMonths.slice(i, len + 1);
            return this.calendar.monthChange(save);
        }
    };

    clock = {
        _minutes: 0,
        _hours: 0,
        incHours: (inc) => {
            this.clock._hours = this.hours24 ? Math.max(0, Math.min(23, this.clock._hours + inc)) :
                Math.max(1, Math.min(12, this.clock._hours + inc));
            if (isNaN(this.clock._hours)) {
                this.clock._hours = 0;
            }

            let val = this.clock._hours;
            if (!this.hours24) {
                if (val === 24) {
                    val = 12;
                } else if (val === 12) {
                    val = 0;
                } else if (!this.clock.isAM()) {
                    val += 12;
                }
            }

            if (val !== this.date.getHours()) {
                this.date.setHours(val);
                return this.saveUpdateDate();
            }
        },
        incMinutes: (inc) => {
            this.clock._minutes = Math.max(0, Math.min(59, this.clock._minutes + inc));
            if (isNaN(this.clock._minutes)) {
                this.clock._minutes = 0;
            }

            if (this.clock._minutes !== this.date.getMinutes()) {
                this.date.setMinutes(this.clock._minutes);
                return this.saveUpdateDate();
            }
        },
        setAM: (b) => {
            if (b == null) {
                b = !this.clock.isAM();
            }
            if (b && !this.clock.isAM()) {
                this.date.setHours(this.date.getHours() - 12);
            } else if (!b && this.clock.isAM()) {
                this.date.setHours(this.date.getHours() + 12);
            }
            return this.saveUpdateDate();
        },
        isAM: () => {
            return this.date.getHours() < 12;
        }
    };

    translations = this.scDateTimeI18n;

    date: Date;

    constructor() {
    }

    ngOnInit() {
        this.weekdays = this.weekdays || this.scDateTimeI18n.weekdays;
        // this.theme = this.theme || this.scDateTimeConfig.defaultTheme;
        this.autosave = this.autosave || this.scDateTimeConfig.autosave;
        this.mode = this.defaultMode || this.scDateTimeConfig.defaultMode;
        this.displayMode = this.displayMode || this.scDateTimeConfig.displayMode;
        this.verticalMode = this.verticalMode || this.scDateTimeConfig.defaultOrientation;
        this.hours24 = this.hours24 || this.scDateTimeConfig.displayTwentyfour;
        this.compact = this.compact || this.scDateTimeConfig.compact;
        this.minDate = this.minDate || void 0;
        this.maxDate = this.maxDate || void 0;

        this.setDate(this._value || this.defaultDate || this.scDateTimeConfig.defaultDate);
    }

    setDate = (newVal?, save?) => {
        if (save == null) {
            save = true;
        }
        this.date = newVal ? new Date(newVal) : new Date();

        this.calendar._year = this.date.getFullYear();
        this.calendar._month = this.date.getMonth();
        this.clock._minutes = this.date.getMinutes();
        this.clock._hours = this.hours24 ? this.date.getHours() : this.date.getHours() % 12;
        if (!this.hours24 && this.clock._hours === 0) {
            this.clock._hours = 12;
        }
        return this.calendar.yearChange(save);
    };

    setNow = () => {
        this.setDate();
        return this.saveUpdateDate();
    };

    save() {
        this.value = this.date;
    }

    cancel() {
        this.onCancel.emit(false);
    }

    modeClass = () => {
        if (this.displayMode != null) {
            this.mode = this.displayMode;
        }
        return '' + (this.verticalMode ? 'vertical ' : '') + (this.displayMode === 'full' ? 'full-mode' :
                this.displayMode === 'time' ? 'time-only' : this.displayMode === 'date' ? 'date-only' : this.mode === 'date'
                    ? 'date-mode' : 'time-mode') + ' ' + (this.compact ? 'compact' : '');
    };

    modeSwitch = () => {
        let ref;
        return this.mode = (ref = this.displayMode) != null ? ref : this.mode === 'date' ? 'time' : 'date';
    };

    saveUpdateDate = () => {
        if (this.autosave) {
            this.value = this.date;
        }
    }

    modeSwitchText = () => {
        let switchTo = this.scDateTimeI18n.switchTo + ' ' + (this.mode === 'date' ? this.scDateTimeI18n.clock :
                this.scDateTimeI18n.calendar);
        return switchTo;
    };


    writeValue(value: any) {
        this._value = value;
        this.setDate(value,false);
        this.onChange(value);
    }

    onChange = (_) => {
    };
    onTouched = () => {
    };

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

}
