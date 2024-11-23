class DataTable extends HTMLElement {
    // Private fields
    #baseUrl = 'http://localhost:80/';
    #data = [];

    #currentPage = 1;
    #rowsPerPage = 10;
    #totalPages = 1;
    #activeFilters = new Map();

    constructor() {
        super();
    }

    static get observedAttributes() {
        return ['columns', 'data-controller'];
    }

    async connectedCallback() {
        if (this.hasAttribute('data-controller')) {
            await this.#firstTimeLoadData();
        }
    }

    async #firstTimeLoadData() {
        this.#data = await this.#fetchData();
        this.renderAll();
    }

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

    #buildUrl(action) {
        const url = new URL(this.#baseUrl);
        const params = new URLSearchParams();

        // Add controller and action
        const controller = this.getAttribute('data-controller');

        params.set('controller', controller);
        params.set('action', action);

        url.search = params.toString();
        return url;
    }

    async #fetchData() {
        try {
            const url = this.#buildUrl('list');

            // Add filters to POST body if they exist replacing camelCase with underscores in lowercase
            const filters = Object.fromEntries([...this.#activeFilters.entries()].map(([key, value]) => [key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(), value]));
            // Pagination
            filters.limit = this.#rowsPerPage;
            filters.offset = (this.#currentPage - 1) * this.#rowsPerPage;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filters)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { data, total_count } = await response.json();
            this.#totalPages = total_count / this.#rowsPerPage;
            return data;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return [];
        }
    }

    parseJSON(attr) {
        try {
            return JSON.parse(this.getAttribute(attr) || '[]');
        } catch (e) {
            console.error(`Invalid JSON for attribute: ${attr}`, e);
            return [];
        }
    }

    #createTableHead(columns) {
        const thead = document.createElement('thead');
        const trLabels = document.createElement('tr');
        const trFilters = document.createElement('tr');

        columns.forEach((col) => {
            const thLabel = document.createElement('th');
            const thFilter = document.createElement('th');
            const label = col.label || col.name;

            // Add the column label
            thLabel.textContent = label;

            // Add a filter input if the column is filterable
            if (col.filterable) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'filter-input';
                input.placeholder = `Filter ${label}`;
                input.dataset.column = col.name;

                thFilter.appendChild(input);
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
                const td = document.createElement('td');
                td.textContent = this.#formatCell(row[col.name], col.type);
                tr.appendChild(td);
            });

            // Add buttons
            const buttonTd = document.createElement('td');
            ['View', 'Edit', 'Delete'].forEach((action) => {
                const button = document.createElement('button');
                button.textContent = action;
                button.className = `button ${action.toLowerCase()}-button`;
                buttonTd.appendChild(button);
            });

            tr.appendChild(buttonTd);
            tbody.appendChild(tr);
        });

        return tbody;
    }

    #formatCell(value, type) {
        if (value == null) return '';

        const formatters = {
            text: (v) => v,
            number: (v) => v.toLocaleString(),
            date: (v) => new Date(v).toLocaleDateString(),
            boolean: (v) => v ? 'Yes' : 'No'
        };

        return formatters[type]?.(value) ?? value;
    }

    renderAll() {
        const columns = this.parseJSON('columns');

        // Styles for the component
        const styles = `
      <style>
        data-table {
            display: block;
          
            .crud-header {
                padding-block: 20px;
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 10px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
            }
            
            th {
                background: #f9fafb;
                text-align: left;
                padding: 12px 16px;
                font-size: var(--text-sm-font-size);
                line-height: var(--text-sm-line-height);
                border-spacing: 0;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .filter-input {
                width: 100%;
                padding: 8px 32px 8px 10px;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                background: white;
            }
            
            .filter-icon {
                position: absolute;
                right: 8px;
                color: #6b7280;
                font-size: 14px;
            }
            
            td {
                padding: 16px;
                border-bottom: 1px solid #e5e7eb;
                color: #6b7280;
            }
            
            .table-key {
                color: #111827;
                font-weight: 500;
            }
            
            .view-button, .edit-button, .delete-button {
                color: white;
                border: none;
                padding: 8px 12px;
                margin-right: 8px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .view-button {
                background: #10b981;
            }
            
            .edit-button {
                background: #2563eb;
            }
            
            .delete-button {
                background: #ef4444;
            }
            
            .pagination {
                padding: 20px 0 20px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .page-link {
                padding: 8px 12px;
                border: 1px solid #e5e7eb;
                color: #374151;
                text-decoration: none;
            }
            
            .page-link:hover {
                background: #f3f4f6;
            }
        }
      </style>
    `;

        // HTML structure
        const header = `
          <div class="crud-header">
            <button class="primary-button">+ Add Row</button>
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
          ${styles}
          ${header}
          <table>
            ${tableHeader}
            ${tableBody}
          </table>
          ${pagination}
        `;

        this.addEventListeners();
    }

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

    addEventListeners() {
        // Filter listeners
        this.querySelectorAll('.filter-input').forEach(filter => {
            filter.addEventListener('input', this.#debounce((e) => {
                const column = e.target.dataset.column;
                const value = e.target.value.trim();

                if (value) {
                    this.#activeFilters.set(column, value);
                } else {
                    this.#activeFilters.delete(column);
                }

                this.#currentPage = 1; // Reset to first page when filtering
                this.#loadData(); // Fetch new filtered data
            }, 300));
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

        const buttons = this.querySelectorAll('tbody button');
        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const action = e.target.textContent.toLowerCase();
                const rowId = e.target.closest('tr').getAttribute('data-row-index'); // Assuming rows have IDs
                if (action === 'view') this.handleView(rowId);
                if (action === 'edit') this.handleEdit(rowId);
                if (action === 'delete') this.handleDelete(rowId);
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

    handleView(rowIndex) {
        const rowData = this.#data[rowIndex];
        alert(`View clicked for row: ${JSON.stringify(rowData)}`);
    }

    handleEdit(rowIndex) {
        const rowData = this.#data[rowIndex];
        alert(`Edit clicked for row: ${JSON.stringify(rowData)}`);
    }

    handleDelete(rowIndex) {
        const rowData = this.#data[rowIndex];
        alert(`Delete clicked for row: ${JSON.stringify(rowData)}`);

        const url = this.#buildUrl('delete');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

}

// Define the custom element
customElements.define('data-table', DataTable);
