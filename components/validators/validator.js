class Validator {
    constructor() {
        this.validations = {}; 
    }

    /**
     * Permite añadir validaciones personalizadas para cada tipo de campo
     * @param {string} type - Campo a validar (ej: 'email', 'password').
     * @param {function} validationFn - Función personalizada para hacer la validacion. Debe retornar un mensaje de error en caso de fallo
     */
    addValidation(type, validationFn) {
        this.validations[type] = validationFn;
    }

    /**
     * Valida un input basado en su tipo de validación.
     * @param {HTMLElement} input - El elemento input a validar.
     * @returns {boolean} - Retorna true si el campo es válido, false en caso contrario.
     */
    validateField(input) {
        const column = input.dataset.column; // Tipo de campo (e.g., 'email', 'password')
        const value = input.type === 'checkbox' ? input.checked : input.value.trim();
        let errorMessage = '';

        // Comprueba si hay validacion personalizada, si no hace una implementada por defecto para ese campo
        if (this.validations.includes(column)) {
            errorMessage = this.validations[column](value);
        } else {
            errorMessage = defaultValidaton(column, value);
        }

        this.toggleErrorMessage(input, errorMessage);

        return !errorMessage; // Retorna true si no hay errores
    }

    /**
     * Funcion que valida el input de forma por defecto
     * @param {string} column - Tipo de campo
     * @param {string} value - Valor del campo a validar
     * @returns {string} - Devuelve un mesaje de error en caso de que no se pase la validacion, vacio en caso contrario.
      */
    defaultValidaton(column, value){
        let errorMessage = '';
        switch (column) {
            case "user":
                if (!value) {
                    errorMessage = `${column} is required.`;
                }
                break;
            case "name":
                if (!value) {
                    errorMessage = `${column} is required.`;
                }
                break;
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = `${column} must be a valid email address.`;
                }
                break;
            case "password":
                if (!value) {
                    errorMessage = `${column} is required.`;
                }else{
                   errorMessage = this.#validatePassword(value); 
                }
                break;
            //Añadir mas casos para mas tipos de inputs para validar
        }
        return errorMessage;
    }

    
    #validatePassword(password) {
        var valid = true;
        //validar longitud contraseña
        if (password.length < 8) {
            errorMessage = "Too short."
            valid = false;
        }
        //validar letra
        if (password.match(/[A-z]/)) {
            errorMessage = "The password must contain a letter."
            valid = false;
        }
    
        //validar letra mayúscula
        if (password.match(/[A-Z]/)) {
            errorMessage = "The password must contain a capital letter."
            valid = false;
        }
    
        //validar numero
        if (password.match(/\d/)) {
            errorMessage = "The password must contain a number."
            valid = false;
        } 
    
        return valid;
    }

    /**
     * Valida todos los campos'.
     * @returns {boolean} - Retorna true si todos los campos son válidos.
     */
    validateAllFields() {
        const inputs = document.querySelectorAll('.form-input');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Muestra o elimina el mensaje de error debajo del campo correspondiente.
     * @param {HTMLElement} input - El input que se está validando.
     * @param {string} errorMessage - El mensaje de error (vacío si no hay errores).
     */
    toggleErrorMessage(input, errorMessage) {
        const errorElement = input.nextElementSibling;
        if (errorMessage) {
            if (!errorElement || !errorElement.classList.contains('error-message')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.color = 'red';
                errorDiv.textContent = errorMessage;
                input.insertAdjacentElement('afterend', errorDiv);
            } else {
                errorElement.textContent = errorMessage;
            }
        } else {
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.remove();
            }
        }
    }
}