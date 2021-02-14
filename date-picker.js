import {LitElement, html, css} from 'lit-element';
import {getMonthName, getDateRows} from "./date-time.js";


export class DatePicker extends LitElement {
    static get styles() {
        return css`
      
       .relative {
            position: relative;
            z-index: 1000;
        }
    
        .box {
            position: absolute;
            top: 0;
            left: 40px;
            border: 1px solid lightsteelblue;
            display: inline-block;
            opacity: 100%;
            font-size: 0.95em;
            font-weight: 200;
            background-color: #efefef;
        }
    
        .month-name {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 0.2em 0;
        }
    
        .center {
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            outline: none;
            font-size: 0.95em;
            font-weight: 200;
            padding-top: 0.4em;
            height: 1em;
        }
    
        button {
            outline: none;
            border: none;
            color: #999999;
            background-color: inherit;
            font-size: 0.85em;
            font-weight: 200;
            height: 1.3em;
            cursor: pointer;
            margin: 0.4em;
        }
    
        button:hover {
            background-color: #ffffff;
        }
    
        input {
            outline: none;
            border: 1px solid #999999;
            color: #999999;
            background-color: inherit;
            font-size: 0.85em;
            font-weight: 200;
            height: 1.3em;
            border-radius: 3px;
            cursor: pointer;
        }
        
        .container {
            margin-top: 0.4em;
            width: 240px;
            background-color: #ededed;
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
            display: inline-block;
            width: 1.8em;
            height: 1.2em;
            text-align: center;
            font-size: 0.9em;
            padding: 0.2em;
            margin: 0.1em 0.1em 0.2em;
            background-color: #ffffff;
        }
    
        .weekday {
            color: #9a9a9a;
            font-weight: 300;
            background-color: whitesmoke;
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
            cells: {type: Function}
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
        this.weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        this.cells = getDateRows(this.month, this.year).map(c => ({
            value: c,
            allowed: this.allow(this.year, this.month, c)
        }));

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
                                        <button type=text @click=${this.prev}>Prev</button>
                                    </div>
                                    <div class="center" style="width: 100%;">${getMonthName(this.month)} ${this.year}
                                    </div>
                                    <div class="center">
                                        <button type=text @click=${this.next}>Next</button>
                                    </div>
                                </div>
                                <!-- Calendar -->
                                <div>
                                    <div class="container">
                                        <div class="row">
                                            ${this.weekdays.map((day) => html`
                                                <div class="cell weekday">${day}</div>`)}
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
                            </div>
                        ` :
                        html``}
                <input type="text" size="14" @focus=${this.onFocus} value=${this.convertSelected(this.selected)}>
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

    convertSelected() {
        const options = {weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit'};

        return this.selected.toLocaleDateString("de-DE", options);
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
