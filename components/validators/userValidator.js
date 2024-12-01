function validateField(input) {
    const column = input.dataset.column; // Obtenemos el atributo data-column
    const value = input.type === 'checkbox' ? input.checked : input.value.trim();
    let errorMessage = '';

    switch (column) {
        case 'username':
        case 'name':
            if (!value) {
                errorMessage = `${column} is required.`;
            }
            break;

        case 'password':
            if (!value) {
                errorMessage = `${column} is required.`;
            } else {
                if (!validatePassword(value)) {

                }
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = `${column} must be a valid email address.`;
            }
            break;

        default:
            errorMessage = `Unknown field: ${column}`;
    }

    // Mostrar error debajo del campo o limpiar si es válido
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

    return !errorMessage; // Retorna true si no hay errores
}

function validatePassword(password) {
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

function validateAllFields() {
    const inputs = document.querySelectorAll('.form-input');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function test(){
    console.log("* click! *");
}
