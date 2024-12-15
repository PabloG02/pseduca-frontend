import DataService from "../../common/data-service.js";
import EnvironmentConfig from "../../common/environment-config.js";
import CustomDialog from "../custom-dialog/custom-dialog.js";

class DataTable extends HTMLElement {
    // Private fields
    #dataService;
    #data = [];
    #multiselectOptions = {};

    #currentPage = 1;
    #rowsPerPage = 10;
    #totalPages = 1;
    #activeFilters = new Map();

    constructor() {
        super();
    }

    /** The attributes the component accepts */
    static get observedAttributes() {
        return ['columns', 'data-controller', 'data-actions'];
    }

    /** Lifecycle method when the component is connected to the DOM */
    async connectedCallback() {
        if (this.hasAttribute('data-controller')) {
            this.#dataService = new DataService(this.getAttribute('data-controller'));
            await this.#firstTimeLoadData();
        }
    }

    /** Fetch data from the server and render the complete table */
    async #firstTimeLoadData() {
        this.#data = await this.#fetchData();
        this.#multiselectOptions = await this.#fetchMultiselectOptions();
        this.renderAll();
    }

    /** Fetch data from the server and update the table partially */
    async #loadData() {
        this.#data = await this.#fetchData();
        this.renderTableBodyAndFooter();
    }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     if (oldValue !== newValue && name === 'data-url') {
    //         console.log('Data URL changed:', newValue);
    //         this.#loadData();
    //     }
    // }

    /** Fetch data from the server with filters and pagination */
    async #fetchData() {
        const filters = Object.fromEntries([...this.#activeFilters.entries()]);
        // Pagination
        filters.limit = this.#rowsPerPage;
        filters.offset = (this.#currentPage - 1) * this.#rowsPerPage;

        const { data, total_count } = await this.#dataService.fetchData(filters, { limit: this.#rowsPerPage, offset: (this.#currentPage - 1) * this.#rowsPerPage });
        this.#totalPages = total_count / this.#rowsPerPage;

        return data;
    }

    async #fetchMultiselectOptions() {
        const columns = this.parseJSON('columns');
        const multiselectColumns = columns.filter(col => col.type === 'multiselect');

        const options = {};
        for (const col of multiselectColumns) {
            const response = await new DataService(col.controller).fetchData(col.name);
            options[col.name] = response.data.map(row => row["name"]);
        }

        return options;
    }

    parseJSON(attr) {
        try {
            return JSON.parse(this.getAttribute(attr) || '[]');
        } catch (e) {
            console.error(`Invalid JSON for attribute: ${attr}`, e);
            return [];
        }
    }

    /** Get the allowed actions from the data-actions attribute to hide unwanted buttons */
    #getAllowedActions() {
        const defaultActions = ['view', 'edit', 'delete', 'create'];
        const actionsAttr = this.getAttribute('data-actions');

        if (!actionsAttr) return defaultActions;

        try {
            const parsedActions = JSON.parse(actionsAttr.toLowerCase());
            return parsedActions.filter(action => defaultActions.includes(action));
        } catch (e) {
            console.error('Invalid data-actions attribute:', e);
            return defaultActions;
        }
    }

    #createTableHead(columns) {
        const thead = document.createElement('thead');
        const trLabels = document.createElement('tr');
        const trFilters = document.createElement('tr');

        columns.forEach((col) => {
            if (col.showIn !== undefined && !col.showIn.includes('table')) return;

            const thLabel = document.createElement('th');
            const thFilter = document.createElement('th');
            const label = col.label || col.name;

            // Add the column label
            thLabel.textContent = label;

            // Add a filter input if the column is filterable
            if (col.filterable) {
                // Create filter inputs based on the column type
                const createFilterInput = (type, placeholder, colName) => {
                    const input = document.createElement('input');
                    input.type = type;
                    input.className = 'filter-input';
                    input.placeholder = placeholder;
                    input.dataset.column = colName;
                    return input;
                };

                if (col.type === 'boolean') {
                    // Create a dropdown filter for boolean values
                    const select = document.createElement('select');
                    select.className = 'filter-input';
                    select.dataset.column = col.name;

                    // Add options for "No filter", "True", and "False"
                    const noFilterOption = document.createElement('option');
                    noFilterOption.value = '';
                    noFilterOption.textContent = `No filter`;

                    const trueOption = document.createElement('option');
                    trueOption.value = 'true';
                    trueOption.textContent = `True`;

                    const falseOption = document.createElement('option');
                    falseOption.value = 'false';
                    falseOption.textContent = `False`;

                    select.append(noFilterOption, trueOption, falseOption);
                    thFilter.appendChild(select);
                } else if (col.type === 'date') {
                    // Create "From" and "To" date filter inputs
                    const inputFrom = createFilterInput('date', `From ${label}`, `${col.name}_from`);
                    const inputTo = createFilterInput('date', `To ${label}`, `${col.name}_to`);
                    const div = document.createElement('div');
                    div.style.display = 'grid';
                    div.append(inputFrom, inputTo);
                    thFilter.appendChild(div);
                } else if (col.type === 'multiselect') {
                    // Create a multiselect filter
                    const select = document.createElement('select');
                    select.className = 'filter-input';
                    select.dataset.column = col.name;

                    // Add "No filter" option
                    const noFilterOption = document.createElement('option');
                    noFilterOption.value = '';
                    noFilterOption.textContent = `No filter`;
                    select.appendChild(noFilterOption);

                    this.#multiselectOptions[col.name]?.forEach(option => {
                        const opt = document.createElement('option');
                        opt.value = option;
                        opt.textContent = option;
                        select.appendChild(opt);
                    });

                    thFilter.appendChild(select);
                } else {
                    // Create a text input filter
                    const input = createFilterInput('text', `Filter ${label}`, col.name);
                    thFilter.appendChild(input);
                }
            }

            trLabels.appendChild(thLabel);
            trFilters.appendChild(thFilter);
        });

        // Empty column for actions
        trLabels.appendChild(document.createElement('th'));
        trFilters.appendChild(document.createElement('th'));

        thead.appendChild(trLabels);
        thead.appendChild(trFilters);
        return thead;
    }

    #createTableBody(data, columns) {
        const tbody = document.createElement('tbody');

        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-row-index', index);

            // Add data cells
            columns.forEach((col) => {
                if (col.showIn !== undefined && !col.showIn.includes('table')) return;

                const td = document.createElement('td');
                td.appendChild(this.#formatCell(row[col.name], col.type));
                tr.appendChild(td);
            });

            // Add buttons
            const buttonTd = document.createElement('td');
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'action-buttons';
            this.#getAllowedActions().forEach((action) => {
                if (action === 'create') return;

                const button = document.createElement('button');
                const icon = document.createElement('svg-icon');
                icon.setAttribute('src', `/assets/fluent-ui-icons/${action}-16-filled.svg`);
                button.appendChild(icon);
                const textNode = document.createTextNode(action.replace(/^\w/, c => c.toUpperCase()));
                button.appendChild(textNode);
                button.className = `button ${action.toLowerCase()}-button`;
                buttonsDiv.appendChild(button);
            });

            buttonTd.appendChild(buttonsDiv);
            tr.appendChild(buttonTd);
            tbody.appendChild(tr);
        });

        return tbody;
    }

    /** Format the cell value based on the column type */
    #formatCell(value, type) {
        if (value == null)
            return document.createTextNode('');

        const formatters = {
            text: (v) => document.createTextNode(v),
            number: (v) => document.createTextNode(v.toLocaleString()),
            date: (v) => document.createTextNode(new Date(v).toLocaleDateString()),
            boolean: (v) => document.createTextNode(v ? 'Yes' : 'No'),
            multiselect: (v) => {
                const fragment = document.createDocumentFragment();
                v.forEach(item => {
                    const span = document.createElement('span');
                    span.textContent = item;
                    span.className = 'multiselect-item';
                    fragment.appendChild(span);
                });
                return fragment;
            },
            image: (v) => {
                const img = document.createElement('img');
                img.src = EnvironmentConfig.backendUrl + v;
                img.className = 'table-image';
                return img;
            }
        };

        return formatters[type]?.(value) ?? document.createTextNode(value);
    }

    /** Render the complete table */
    renderAll() {
        const columns = this.parseJSON('columns');

        // HTML structure
        const header = `
          <div class="crud-header">
            ${this.#getAllowedActions().includes('create') ? '<button class="primary-button add">+ Add Row</button>' : ''}
            <button class="secondary-button">Actions ▾</button>
          </div>
        `;

        const tableHeader = this.#createTableHead(columns).outerHTML;
        const tableBody = this.#createTableBody(this.#data, columns).outerHTML;

        const pagination = `
          <div class="pagination">
            <span>Page ${this.#currentPage}</span>
            <div>
              <button class="page-link secondary-button" data-action="prev">←</button>
              <button class="page-link secondary-button" data-action="next">→</button>
            </div>
          </div>
        `;

        this.innerHTML = `
          ${header}
          <table>
            ${tableHeader}
            ${tableBody}
          </table>
          ${pagination}
          <custom-dialog data-controller="${this.getAttribute('data-controller')}"></custom-dialog>
        `;

        this.addEventListeners();
    }

    /** Render the table body and footer */
    renderTableBodyAndFooter() {
        const columns = this.parseJSON('columns');
        const tableBody = this.#createTableBody(this.#data, columns).outerHTML;
        this.querySelector('tbody').outerHTML = tableBody;

        const pagination = `
          <div class="pagination">
            <span>Page ${this.#currentPage}</span>
            <div>
              <button class="page-link secondary-button" data-action="prev">←</button>
              <button class="page-link secondary-button" data-action="next">→</button>
            </div>
          </div>
        `;
        this.querySelector('.pagination').outerHTML = pagination;

        this.addEventListeners();
    }

    /** Open the dialog and populate it dynamically */
    openDialog(title, data, type) {
        this.dialog = this.querySelector('custom-dialog');

        const options = {};
        if (type === DialogType.VIEW) {
            options.showFooter = false;
        }

        let content = type === DialogType.DELETE ? 'Are you sure you want to delete this entry?' : this.#generateDialogFormContent(data, type);

        this.dialog.open(
            title,
            content,
            () => this.handleDialogConfirm(data, type),
            options
        );
    }

    /** Generate the dialog form content based on the column type */
    #generateDialogFormContent(data = {}, mode = DialogType.VIEW) {
        let content = '';

        this.parseJSON('columns').forEach(col => {
            if (col.showIn !== undefined && !col.showIn.includes(mode)) return;

            const value = data[col.name] || '';
            const isReadOnly = mode === DialogType.VIEW || (mode === DialogType.EDIT && col?.id);

            content += `
                <div>
                    <label class="form-label">${col.label}</label>
                    ${this.#renderInputElement(col, value, isReadOnly)}
                </div>
            `;
        });

        return content;
    }

    /** Render appropriate input element based on column type */
    #renderInputElement(column, value, isReadOnly) {
        const baseAttrs = `
            class="form-input" 
            data-column="${column.name}"
            ${isReadOnly ? 'readonly' : ''}
        `;

        switch (column.type) {
            case 'textarea':
                return `
                    <textarea 
                        ${baseAttrs}
                        rows="${column.rows || 4}"
                        cols="${column.cols || 50}"
                    >${this.#escapeHtml(value)}</textarea>
                `;
            case 'multiselect':
                const options = this.#multiselectOptions[column.name];
                return `
                    <select
                        ${baseAttrs}
                        multiple
                    >
                        ${options.map(option => `
                            <option
                                value="${option}"
                                ${value.includes(option) ? 'selected' : ''}
                            >${option}</option>
                        `).join('')}
                    </select>
                `;
            case 'image':
                return `
                    <input
                        type="file"
                        ${baseAttrs}
                        accept="image/png, image/jpeg"
                    />
                `;
            case 'number':
                return `
                    <input 
                        type="number"
                        ${baseAttrs}
                        value="${Number(value)}"
                    />
                `;
            case 'email':
                return `
                    <input 
                        type="email"
                        ${baseAttrs}
                        value="${this.#escapeHtml(value)}"
                    />
                `;
            case 'boolean':
                return `
                    <input
                        type="checkbox"
                        ${baseAttrs}
                        ${value ? 'checked' : ''}
                    />
                `;
            case 'date':
                return `
                    <input 
                        type="date"
                        ${baseAttrs}
                        value="${this.#escapeHtml(value)}"
                    />
                `;
            case 'text':
            default:
                return `
                    <input 
                        type="text"
                        ${baseAttrs}
                        value="${this.#escapeHtml(value)}"
                    />
                `;
        }
    }

    // Utility method to escape HTML to prevent XSS
    #escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /** Handle the dialog confirm action */
    async handleDialogConfirm(data, type) {
        const newData = {};
        this.querySelectorAll('.form-input').forEach(input => {
            if (input.type === 'date') {
                newData[input.dataset.column] = new Date(input.value).toISOString();
            } else if (input.type === 'file') {
                newData[input.dataset.column] = input.files[0];
            } else {
                newData[input.dataset.column] = input.value;
            }
        });

        if (validateAllFields){
            switch (type) {
                case DialogType.CREATE:
                    await this.#dataService.create(newData);
                    break;
                case DialogType.EDIT:
                    await this.#dataService.update(newData);
                    break;
                case DialogType.DELETE:
                    await this.#dataService.delete(data);
                    break;
            }
    
            this.dialog.close();
    
            // Reload data
            this.#loadData();
        }
    }

    addEventListeners() {
        // Filter listeners
        this.querySelectorAll('.filter-input').forEach(filter => {
            filter.oninput = this.#debounce((e) => {
                const column = e.target.dataset.column;
                let value = e.target.value.trim();

                if (e.target.type === 'date' && value) {
                    value = new Date(value).toISOString();
                }

                if (value) {
                    this.#activeFilters.set(column, value);
                } else {
                    this.#activeFilters.delete(column);
                }

                this.#currentPage = 1; // Reset to first page when filtering
                this.#loadData(); // Fetch new filtered data
            }, 300);
        });

        // Pagination listeners
        this.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                const action = e.target.dataset.action;
                if (action === 'prev' && this.#currentPage > 1) {
                    this.#currentPage--;
                    await this.#loadData();
                } else if (action === 'next' && this.#currentPage < this.#totalPages) {
                    this.#currentPage++;
                    await this.#loadData();
                }
            });
        });

        //Dialog Input Listeners
        this.querySelector('.form-input').forEach(input => {
            input.addEventListener('click', () => test());
        });

        this.querySelector('.add')?.addEventListener('click', () => {
            this.openDialog('Create New Entry', {}, DialogType.CREATE);
        });

        const buttons = this.querySelectorAll('tbody button');
        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const action = e.target.textContent.toLowerCase();
                const rowId = e.target.closest('tr').getAttribute('data-row-index'); // Assuming rows have IDs
                if (action === 'view') this.openDialog('View Details', this.#data[rowId], DialogType.VIEW);
                if (action === 'edit') this.openDialog('Edit Details', this.#data[rowId], DialogType.EDIT);
                if (action === 'delete') {
                    const idField = this.parseJSON('columns').find(col => col.id)?.name;
                    this.openDialog('Delete Entry', { [idField]: this.#data[rowId][idField] }, DialogType.DELETE);
                }
            });
        });
    }

    // Utility method for debouncing
    #debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Define the custom element
customElements.define('data-table', DataTable);

const DialogType = {
    VIEW: 'view',
    CREATE: 'create',
    EDIT: 'edit',
    DELETE: 'delete'
}