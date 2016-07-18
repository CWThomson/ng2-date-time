import {Component, OnInit, Input, Output, EventEmitter, forwardRef, Provider} from '@angular/core';
import {DatePipe, FORM_DIRECTIVES, ControlValueAccessor, NG_VALUE_ACCESSOR, CORE_DIRECTIVES} from '@angular/common';
import {MdButton} from 'ng2-material/dist';
import {MdIcon, MdIconRegistry} from '@angular2-material/icon';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => DateTimeComponent),
    multi: true
  });

@Component({
  moduleId: module.id,
  selector: 'date-time',
  templateUrl: 'date-time.component.html',
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
})
export class DateTimeComponent implements ControlValueAccessor {

  // @Input('theme') theme: string;
  @Input('autosave') _autosave: boolean;
  @Input('orientation') _verticalMode: boolean;
  @Input('compact') _compact: boolean;
  @Input('display-twentyfour') _hours24: boolean;
  @Input('theme') _theme: string;
  @Input('default-mode') _mode: string;
  @Input('display-mode') _displayMode: string;
  @Input('weekdays') _weekdays: String[];

  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSave: EventEmitter<Date> = new EventEmitter<Date>();

  private _value: any = '';

  _dateFilter: DatePipe = new DatePipe();

  get value(): any {
    console.log('get');
    return this._value;
  };

  set value(v: any) {
    console.log('set');
    if (v !== this._value) {
      this._value = v;
      // this.onChange(v);
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
      let _timeString = this._hours24 ? 'HH:mm' : 'h:mm a';
      if (this._displayMode === 'full' && !this._verticalMode) {
        return this._dateFilter.transform(this.date, 'EEEE d MMMM yyyy, ' + _timeString);
      } else if (this._displayMode === 'time') {
        return this._dateFilter.transform(this.date, _timeString);
      } else if (this._displayMode === 'date') {
        return this._dateFilter.transform(this.date, 'EEE d MMM yyyy');
      } else {
        return this._dateFilter.transform(this.date, 'd MMM yyyy, ' + _timeString);
      }
    },
    title: () => {
      if (this._mode === 'date') {
        return this._dateFilter.transform(this.date, (this._displayMode === 'date' ? 'EEEE' : 'EEEE ' + (this._hours24 ? 'HH:mm' : 'h:mm a')));
      } else {
        return this._dateFilter.transform(this.date, 'MMMM d yyyy');
      }
    },
    'super': () => {
      if (this._mode === 'date') {
        return this._dateFilter.transform(this.date, 'MMM');
      } else {
        return '';
      }
    },
    main: () => {
      return this._mode === 'date' ? this._dateFilter.transform(this.date, 'd') : this._hours24 ? this._dateFilter.transform(this.date, 'HH:mm') : (this._dateFilter.transform(this.date, 'h:mm')) + '<small class="small">' + (this._dateFilter.transform(this.date, 'a')) + '</small>';
    },
    sub: () => {
      if (this._mode === 'date') {
        return this._dateFilter.transform(this.date, 'yyyy');
      } else {
        return this._dateFilter.transform(this.date, 'HH:mm');
      }
    },
    month: () => {
      return this._dateFilter.transform(this.date, 'MMM');
    },
    amPm : () => {
      return this._dateFilter.transform(this.date, 'a');
    }
  };

  calendar = {
    _month: 0,
    _year: 0,
    _months: [],

    _allMonths: ( () => {
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
      // console.log(new Date(this.calendar._year, this.calendar._month, d).getMonth().constructor);
      // console.log(this.calendar._month.constructor);
      let visible = new Date(this.calendar._year, this.calendar._month, d).getMonth() === this.calendar._month;
      return visible;
    },
    isDisabled: (d) => {
      let currentDate, maxdate, mindate;
      currentDate = new Date(this.calendar._year, this.calendar._month, d);
      mindate = this.restrictions.mindate;
      maxdate = this.restrictions.maxdate;
      return ((mindate != null) && currentDate < mindate) || ((maxdate != null) && currentDate > maxdate);
    },
    isPrevMonthButtonHidden : () => {
      let date = this.restrictions['mindate'];
      return (date != null) && this.calendar._month <= date.getMonth() && this.calendar._year <= date.getFullYear();
    },
    isNextMonthButtonHidden: () => {
      let date = this.restrictions['maxdate'];
      return (date != null) && this.calendar._month >= date.getMonth() && this.calendar._year >= date.getFullYear();
    },
  'class': (d) => {
      let classString = '';
      if ((this.date != null) && new Date(this.calendar._year, this.calendar._month, d).getTime() === new Date(this.date.getTime()).setHours(0, 0, 0, 0)) {
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
      let maxdate, mindate;
      if (save == null) {
        save = true;
      }
      if ((this.calendar._year == null) || isNaN(this.calendar._year)) {
        this.calendar._year = new Date().getFullYear();
      }
      mindate = this.restrictions.mindate;
      maxdate = this.restrictions.maxdate;
      if ((mindate != null) && mindate.getFullYear() === this.calendar._year && mindate.getMonth() >= this.calendar._month) {
        this.calendar._month = Math.max(mindate.getMonth(), this.calendar._month);
      }
      if ((maxdate != null) && maxdate.getFullYear() === this.calendar._year && maxdate.getMonth() <= this.calendar._month) {
        this.calendar._month = Math.min(maxdate.getMonth(), this.calendar._month);
      }

      this.date.setFullYear(this.calendar._year, this.calendar._month);

      if (this.date.getMonth() !== this.calendar._month) {
        this.date.setDate(0);
      }
      if ((mindate != null) && this.date < mindate) {
        this.date.setDate(mindate.getTime());
        this.calendar.select(mindate.getDate());
      }
      if ((maxdate != null) && this.date > maxdate) {
        this.date.setDate(maxdate.getTime());
        this.calendar.select(maxdate.getDate());
      }
      if (save) {
        return this.saveUpdateDate();
      }
    },
    _incMonth: (months) => {
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
      let len, maxdate, mindate;
      if (save == null) {
        save = true;
      }
      if ((this.calendar._year == null) || this.calendar._year === 0) {
        return;
      }
      mindate = this.restrictions.mindate;
      maxdate = this.restrictions.maxdate;
      let i = (mindate != null) && mindate.getFullYear() === this.calendar._year ? mindate.getMonth() : 0;
      len = (maxdate != null) && maxdate.getFullYear() === this.calendar._year ? maxdate.getMonth() : 11;
      this.calendar._months = this.calendar._allMonths.slice(i, len + 1);
      return this.calendar.monthChange(save);
    }
  };

  clock = {
    _minutes: 0,
    _hours: 0,
    _incHours: (inc) => {
      this.clock._hours = this._hours24 ? Math.max(0, Math.min(23, this.clock._hours + inc)) : Math.max(1, Math.min(12, this.clock._hours + inc));
      if (isNaN(this.clock._hours)) {
        this.clock._hours = 0;
      }

      let val = this.clock._hours;
      if (!this._hours24) {
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
    _incMinutes: (inc) => {
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

  // i;
  _defaultDate = this.scDateTimeConfig.defaultDate;

  translations = this.scDateTimeI18n;
  restrictions = {
    mindate: void 0,
    maxdate: void 0
  };

  date: Date;

  constructor() {}

  ngOnInit() {
    this._weekdays = this._weekdays || this.scDateTimeI18n.weekdays;
    // this.theme = this.theme || this.scDateTimeConfig.defaultTheme;
    this._autosave = this._autosave || this.scDateTimeConfig.autosave;
    this._mode = this._mode || this.scDateTimeConfig.defaultMode;
    // this.defaultDate = this.defaultDate || this.scDateTimeConfig.defaultDate;
    this._displayMode = this._displayMode || this.scDateTimeConfig.displayMode;
    this._verticalMode = this._verticalMode || this.scDateTimeConfig.defaultOrientation;
    this._hours24 = this._hours24 || this.scDateTimeConfig.displayTwentyfour;
    // this.compact = this.compact || this.scDateTimeConfig.compact;
    // this.minDate = this.minDate || this.scDateTimeConfig;
    // this.maxDate = this.maxDate || this.scDateTimeConfig.compact;

    this.setDate();
  }

  setDate = (newVal?, save?) => {
    if (save == null) {
      save = true;
    }
    this.date = newVal ? new Date(newVal) : new Date();

    this.calendar._year = this.date.getFullYear();
    this.calendar._month = this.date.getMonth();
    this.clock._minutes = this.date.getMinutes();
    this.clock._hours = this._hours24 ? this.date.getHours() : this.date.getHours() % 12;
    if (!this._hours24 && this.clock._hours === 0) {
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
    if (this._displayMode != null) {
      this._mode = this._displayMode;
    }
    return '' + (this._verticalMode ? 'vertical ' : '') + (this._displayMode === 'full' ? 'full-mode' :
        this._displayMode === 'time' ? 'time-only' : this._displayMode === 'date' ? 'date-only' : this._mode === 'date'
          ? 'date-mode' : 'time-mode') + ' ' + (this._compact ? 'compact' : '');
  };

  modeSwitch = () => {
    let ref;
    return this._mode = (ref = this._displayMode) != null ? ref : this._mode === 'date' ? 'time' : 'date';
  };

  saveUpdateDate = () => {
    if (this._autosave) {
      this.value = this.date;
    }
  }

  // return
  modeSwitchText = () => {
    return this.scDateTimeI18n.switchTo + ' ' + (this._mode === 'date' ? this.scDateTimeI18n.clock : this.scDateTimeI18n.calendar);
  };


  writeValue(value: any) {
    this._value = value;
    // this.onChange(value);
  }

  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

}


// angular.module('scDateTime', []).value().directive('timeDatePicker', [
//   '$filter', '$sce', '$rootScope', '$parse', 'scDateTimeI18n', 'scDateTimeConfig', function($filter, $sce, $rootScope, $parse, scDateTimeI18n, scDateTimeConfig) {
//     var _dateFilter;
//     _dateFilter = $filter('date');
//     return {
//       restrict: 'AE',
//       replace: true,
//       scope: {
//         _weekdays: '=?tdWeekdays'
//       },
//       require: 'ngModel',
//       templateUrl: function(tElement, tAttrs) {
//         if ((tAttrs.theme == null) || tAttrs.theme === '') {
//           tAttrs.theme = scDateTimeConfig.defaultTheme;
//         }
//         if (tAttrs.theme.indexOf('/') <= 0) {
//           return "scDateTime-" + tAttrs.theme + ".tpl";
//         } else {
//           return tAttrs.theme;
//         }
//       },
//       link: function(scope, element, attrs, ngModel) {
//         var cancelFn, saveFn;
//         attrs.$observe('defaultMode', function(val) {
//           if (val !== 'time' && val !== 'date') {
//             val = scDateTimeConfig.defaultMode;
//           }
//           return mode = val;
//         });
//         attrs.$observe('defaultDate', function(val) {
//           return _defaultDate = (val != null) && Date.parse(val) ? Date.parse(val) : scDateTimeConfig.defaultDate;
//         });
//         attrs.$observe('displayMode', function(val) {
//           if (val !== 'full' && val !== 'time' && val !== 'date') {
//             val = scDateTimeConfig.displayMode;
//           }
//           return displayMode = val;
//         });
//         attrs.$observe('orientation', function(val) {
//           return verticalMode = val != null ? val === 'true' : scDateTimeConfig.defaultOrientation;
//         });
//         attrs.$observe('compact', function(val) {
//           return _compact = val != null ? val === 'true' : scDateTimeConfig.compact;
//         });
//         attrs.$observe('displayTwentyfour', function(val) {
//           return hours24 = val != null ? val : scDateTimeConfig.displayTwentyfour;
//         });
//         attrs.$observe('mindate', function(val) {
//           if ((val != null) && Date.parse(val)) {
//             restrictions.mindate = new Date(val);
//             return restrictions.mindate.setHours(0, 0, 0, 0);
//           }
//         });
//         attrs.$observe('maxdate', function(val) {
//           if ((val != null) && Date.parse(val)) {
//             restrictions.maxdate = new Date(val);
//             return restrictions.maxdate.setHours(23, 59, 59, 999);
//           }
//         });
//         _weekdays = _weekdays || scDateTimeI18n.weekdays;
//         $watch('_weekdays', function(value) {
//           if ((value == null) || !angular.isArray(value)) {
//             return _weekdays = scDateTimeI18n.weekdays;
//           }
//         });
//         ngModel.$render = function() {
//           var ref;
//           return setDate((ref = ngModel.$modelValue) != null ? ref : _defaultDate, ngModel.$modelValue != null);
//         };
//         angular.forEach(element.find('input'), function(input) {
//           return angular.element(input).on('focus', function() {
//             return setTimeout((function() {
//               return input.select();
//             }), 10);
//           });
//         });
//         autosave = false;
//         if ((attrs['autosave'] != null) || scDateTimeConfig.autosave) {
//           saveUpdateDate = function() {
//             return ngModel.$setViewValue(date);
//           };
//           return autosave = true;
//         } else {
//           saveFn = $parse(attrs.onSave);
//           cancelFn = $parse(attrs.onCancel);
//           saveUpdateDate = function() {
//             return true;
//           };
//           save = function() {
//             ngModel.$setViewValue(new Date(date));
//             return saveFn($parent, {
//               $value: new Date(date)
//             });
//           };
//           return cancel = function() {
//             cancelFn($parent, {});
//             return ngModel.$render();
//           };
//         }
//       }
//     };
//   }
// ]);
