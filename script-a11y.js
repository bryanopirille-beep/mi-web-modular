document.getElementById('btn-auditar').addEventListener('click', () => {
    const htmlInput = document.getElementById('html-input').value;
    const listaErrores = document.getElementById('lista-errores');
    const scoreBox = document.getElementById('score-box');
    
    // Limpiar resultados anteriores
    listaErrores.innerHTML = '';
    
    if (!htmlInput.trim()) {
        listaErrores.innerHTML = '<li>Por favor, ingresa algo de código HTML para auditar.</li>';
        scoreBox.textContent = 'Puntuación: --/100';
        return;
    }

    // Parsear el texto HTML ingresado para poder analizarlo como un DOM real
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlInput, 'text/html');

    let errores = [];
    let puntuacion = 100;

    // Validación 1: Atributo lang en la etiqueta html
    const htmlTag = doc.querySelector('html');
    if (!htmlTag || !htmlTag.getAttribute('lang')) {
        errores.push({
            tipo: 'Error Grave',
            mensaje: 'Falta el atributo lang en la etiqueta <html> (necesario para la pronunciación de los lectores de pantalla).'
        });
        puntuacion -= 30;
    }

    // Validación 2: Existencia y unicidad del H1
    const h1Tags = doc.querySelectorAll('h1');
    if (h1Tags.length === 0) {
        errores.push({
            tipo: 'Error Grave',
            mensaje: 'No se encontró ninguna etiqueta <h1>. Es vital para la estructura jerárquica.'
        });
        puntuacion -= 30;
    } else if (h1Tags.length > 1) {
        errores.push({
            tipo: 'Advertencia',
            mensaje: 'Se encontraron múltiples etiquetas <h1>. Lo ideal es tener solo un título principal por página.'
        });
        puntuacion -= 10;
    }

    // Validación 3: Imágenes sin texto alternativo (alt)
    const imagenes = doc.querySelectorAll('img');
    imagenes.forEach((img, index) => {
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
            errores.push({
                tipo: 'Error de Accesibilidad',
                mensaje: `La imagen #${index + 1} no tiene un atributo alt descriptivo.`
            });
            puntuacion -= 20;
        }
    });

    // Asegurar que la puntuación no baje de 0
    puntuacion = Math.max(0, puntuacion);

    // Mostrar puntuación
    scoreBox.textContent = `Puntuación: ${puntuacion}/100`;
    
    // Cambiar color del marcador según la puntuación
    if (puntuacion >= 80) {
        scoreBox.style.backgroundColor = '#d4edda';
        scoreBox.style.color = '#155724';
    } else if (puntuacion >= 50) {
        scoreBox.style.backgroundColor = '#fff3cd';
        scoreBox.style.color = '#856404';
    } else {
        scoreBox.style.backgroundColor = '#f8d7da';
        scoreBox.style.color = '#721c24';
    }

    // Mostrar errores en la lista
    if (errores.length === 0) {
        listaErrores.innerHTML = '<li class="exito">¡Excelente! No se detectaron errores graves de accesibilidad en este fragmento.</li>';
    } else {
        errores.forEach(err => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>[${err.tipo}]:</strong> ${err.mensaje}`;
            listaErrores.appendChild(li);
        });
    }
});