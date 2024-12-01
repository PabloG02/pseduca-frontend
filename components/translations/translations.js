translations = {};


function translatePage(language) {
    // Buscar todos los elementos con el atributo data-translate
    const elements = document.querySelectorAll("[data-translate]");

    elements.forEach(element => {
        const key = element.getAttribute("data-translate");
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
}
//TO DO: Cargar el json para las traducciones
function chooseTranslationFile(){
    switch (initialLang) {
        case "gal":
            
            break;
    
        case "es":
            
            break;
    
        default:

            break;
    }
}

// Cambiar idioma al hacer clic en un botón
document.getElementById("change-lang").addEventListener("click", () => {
    const currentLang = document.documentElement.lang;

    const newLang = currentLang === "es" ? "es" : "gal";
    document.documentElement.lang = newLang;

    translatePage(newLang);
});

document.addEventListener("DOMContentLoaded", () => {
    const initialLang = document.documentElement.lang || "es";

    translatePage(initialLang);
});
