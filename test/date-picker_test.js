import {DatePicker} from '../date-picker.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('date-picker', () => {
    test('is defined', () => {
        const el = document.createElement('date-picker');
        assert.instanceOf(el, DatePicker);
    });

    test('renders with default values', async () => {
        const options = {weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit'};
        let now = new Date().toLocaleDateString("de-DE", options);
        const el = await fixture(html`
            <date-picker></date-picker>`);
        assert.shadowDom.equal(
            el,
            '<div\n' +
            '  class="relative"\n' +
            '  id="datepicker"\n' +
            '>\n' +
            '  <input\n' +
            '    size="14"\n' +
            '    type="text"\n' +
            '    value="' + now + '"\n' +
            '  >\n' +
            '</div>\n'
        );
    });

});
