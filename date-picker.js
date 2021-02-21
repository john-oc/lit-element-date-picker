import {LitElement, html, css} from 'lit-element';
import {getDateRows, setLocales, monthNames, weekdays, convertSelected} from "./date-time.js";
import {iconLeft, iconRight} from "./IconService";
import {unsafeHTML} from "lit-html/directives/unsafe-html";


export class DatePicker extends LitElement {
    static get styles() {
        return css`
        input {
            outline: none;
            border: 1px solid #999999;
            color: #999999;
            background-color: inherit;
            font-size: 1em;
            font-weight: 200;
            cursor: pointer;
        }

       .relative {
            position: relative;
            z-index: 10000;
        }
    
        .box {
            position: absolute;
            top: 0;
            left: 40px;
            border: 1px solid #004666;
            display: inline-block;
            font-weight: 200;
            background-color: #004666;
            color: #ffffff;
        }
    
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    
        button {
            outline: none;
            border: none;
            background-color: white;
            cursor: pointer;
            margin: 2px 8px;
            border-radius: 100%;
            width: 32px;
            height: 32px;
            text-align: center;
        }
    
        button:hover {
            background-color: #4A849F;
            color: white;
        }
        
        .container {
            background-color: #dedede;
        }
    
        .row {
            text-align: center;
            display: grid;
            grid-template-columns: auto auto auto auto auto auto auto;
            font-size: 16px;
            font-weight: 300;
            padding: 0.3em;
            flex-wrap: wrap;
        }
    
        .cell {
            display: flex;
            width: 32px;
            height: 32px;
            text-align: center;
            margin: 3px;
            background-color: #ededed;
            border-radius: 100%;
            justify-content: center;
            align-items: center;
        }
    
        .weekday {
            color: #9a9a9a;
            font-weight: 300;
            background-color: whitesmoke;
        }
    
        .month-name {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 4px 0;
        }
    
        .selected {
            background-color: #4A849F;
            font-weight: 200;
            color: white;
            text-shadow: 0 0 0.5em white;
        }
    
        .highlight {
            background-color: white;
            color: grey;
        }
    
        .disabled {
            background-color: #9d9d9d;
            cursor: not-allowed;
        }
    
        .highlight:hover {
            background-color: #004666;
            color: white;
            cursor: pointer;
        }
    
        .selected.highlight:hover {
            background: #004666;
        }

        `;
    }

    static get properties() {
        return {
            isAllowed: {type: Function},
            selected: {type: Date},
            date: {type: Number},
            month: {type: Number},
            year: {type: Number},
            showDatePicker: {type: Boolean},
            weekdays: {type: Array},
            cells: {type: Function},
            locales: {type: String}
        };
    }


    constructor() {
        super();
        this.isAllowed = () => {
            return true
        };
        this.selected = new Date();
        this.date = this.selected.getUTCDate();
        this.month = this.selected.getUTCMonth();
        this.year = this.selected.getUTCFullYear();
        this.cells = getDateRows(this.month, this.year).map(c => ({
            value: c,
            allowed: this.allow(this.year, this.month, c)
        }));
        this.locales = "de-DE";
        setLocales(this.locales);

        let site = document.getElementsByTagName('html');
        site[0].addEventListener('click', () => {
            this.showDatePicker = false;
        });
    }


    render() {
        return html`
            <div id="datepicker" class="relative"
                 @click=${(e) => {
                     e.stopPropagation();
                 }}>
                ${this.showDatePicker ?
                        html`
                            <div class="box">
                                <div class="month-name">
                                    <div>
                                        <button type=text @click=${this.prev}>${unsafeHTML(iconLeft)}</button>
                                    </div>
                                    <div class="center" style="width: 100%;">${monthNames[this.month]} ${this.year}
                                    </div>
                                    <div>
                                        <button type=text @click=${this.next}>${unsafeHTML(iconRight)}</button>
                                    </div>
                                </div>
                                <!-- Calendar -->
                                <div class="container">
                                    <div class="row">
                                        ${weekdays.map((day) => html`
                                            <div class="cell weekday">
                                                <div class="cell-content">
                                                    ${day}
                                                </div>
                                            </div>`)}
                                    </div>

                                    <div class="row">
                                        ${this.cells.map(({allowed, value}) => html`
                                            <div class="cell ${allowed && value ? 'highlight' : ''}
                                                                 ${!allowed ? 'disabled' : ''}
                                                                 ${new Date(this.selected.getFullYear(), this.selected.getMonth(), this.selected.getDate()).getTime() === new Date(this.year, this.month, value).getTime()} ? 'selected' : ''"
                                                 @click=${allowed && value ? this.onChange.bind(this, value) : () => {
                                                 }}>
                                                ${value || ''}
                                            </div>
                                        `)}
                                    </div>
                                </div>
                            </div>
                        ` :
                        html``}
                <input type="text" size="14" @focus=${this.onFocus} value=${convertSelected(this.selected)}>
            </div>
        `;
    }

    next() {
        if (this.month === 11) {
            this.month = 0;
            this.year = this.year + 1;
            this.setCells();
            return;
        }
        this.month = this.month + 1;
        this.setCells();
    }

    prev() {
        if (this.month === 0) {
            this.month = 11;
            this.year -= 1;
            this.setCells();
            return;
        }
        this.month -= 1;
        this.setCells();
    }

    setCells() {
        this.cells = getDateRows(this.month, this.year).map(c => ({
            value: c,
            allowed: this.allow(this.year, this.month, c)
        }));
    }

    onFocus() {
        this.showDatePicker = true;
    }


    onChange(date) {
        this.selected = new Date(Date.UTC(this.year, this.month, date));
        this.showDatePicker = false;
    }

    allow(year, month, date) {
        if (!date) return true;
        return this.isAllowed(new Date(year, month, date));
    }
}

window.customElements.define('date-picker', DatePicker);
