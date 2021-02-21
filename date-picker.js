import {LitElement, html, css} from 'lit-element';
import {getDateRows, setLocales, monthNames, weekdays, convertSelected} from "./date-time.js";
import {iconLeft, iconRight} from "./IconService";
import {unsafeHTML} from "lit-html/directives/unsafe-html";


export class DatePicker extends LitElement {
    static get styles() {
        return css`
      
       .relative {
            position: relative;
            z-index: 10000;
        }
    
        .container {
            margin-top: 0.4em;
            width: 262px;
            background-color: #ededed;
        }
    
        .box {
            position: absolute;
            top: 0;
            left: 40px;
            border: 1px solid lightsteelblue;
            display: inline-block;
            opacity: 100%;
            font-size: 1em;
            font-weight: 200;
            background-color: #efefef;
        }
    
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            outline: none;
            font-size: 1em;
            font-weight: 200;
            padding-top: 4px;
        }
    
        button {
            outline: none;
            border: none;
            color: #999999;
            background-color: inherit;
            cursor: pointer;
            margin: 2px 8px;
            border-radius: 100%;
            width: 32px;
            height: 32px;
            text-align: center;
        }
    
        button:hover {
            background-color: #ffffff;
        }
    
        input {
            outline: none;
            border: 1px solid #999999;
            color: #999999;
            background-color: inherit;
            font-size: 1em;
            font-weight: 200;
            cursor: pointer;
        }
        
        .row {
            text-align: center;
            display: flex;
            font-size: 1em;
            font-weight: 300;
            padding: 0.4em 0.3em;
            flex-wrap: wrap;
            background-color: #dedede;
        }
    
        .cell {
            display: table-cell;
            width: 32px;
            height: 32px;
            text-align: center;
            font-size: 1em;
            margin: 2px;
            background-color: #ffffff;
            border-radius: 100%;
            vertical-align: middle;
        }
        .cell-content {
            margin-top: 6px;
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
        }
    
        .selected {
            background-color: lightsteelblue;
            color: black;
            font-weight: 200;
            text-shadow: 0 0 0.5em white;
        }
    
        .highlight {
            transition: transform 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
    
        .disabled {
            background: #efefef;
            cursor: not-allowed;
            color: #bfbfbf;
        }
    
        .highlight:hover {
            color: black;
            background-color: white;
            opacity: 70%;
            font-weight: 400;
            cursor: pointer;
        }
    
        .selected.highlight:hover {
            background: cornflowerblue;
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
                                    <div class="center">
                                        <button type=text @click=${this.prev}>${unsafeHTML(iconLeft)}</button>
                                    </div>
                                    <div class="center" style="width: 100%;">${monthNames[this.month]} ${this.year}
                                    </div>
                                    <div class="center">
                                        <button type=text @click=${this.next}>${unsafeHTML(iconRight)}</button>
                                    </div>
                                </div>
                                <!-- Calendar -->
                                <div>
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
                                                    <div class="cell-content">
                                                        ${value || ''}
                                                    </div>
                                                </div>
                                            `)}
                                        </div>
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
