// Configuración del código correcto (puedes cambiarlo)
const CORRECT_CODE = '1319'; // Código especial de amor

// Elementos del DOM
const loadingScreen = document.getElementById('loading-screen');
const codeScreen = document.getElementById('code-screen');
const letterScreen = document.getElementById('letter-screen');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const codeInputs = document.querySelectorAll('.code-input');
const submitBtn = document.getElementById('submit-btn');
const errorMessage = document.getElementById('error-message');
const hintText = document.getElementById('hint-text');
const closeLetterBtn = document.getElementById('close-letter-btn');
const resetViewBtn = document.getElementById('reset-view-btn');
const loading3D = document.getElementById('loading-3d');
const kissGif = document.getElementById('kiss-gif');
const backgroundMusic = document.getElementById('background-music');

// Variables de estado
let currentProgress = 0;
let isCodeComplete = false;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    startLoadingAnimation();
    setupCodeInputs();
    setupSubmitButton();
    setupLetterScreen();
    setupHeartEffect();
    setupMusic();
    setupNumericKeyboard();
});

// Función de carga con barra de progreso
function startLoadingAnimation() {
    const loadingDuration = 5000; // 5 segundos (más lento)
    const updateInterval = 50; // Actualizar cada 50ms
    const progressIncrement = (updateInterval / loadingDuration) * 100;
    
    const loadingInterval = setInterval(() => {
        currentProgress += progressIncrement;
        
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(loadingInterval);
            
            // Esperar un poco antes de cambiar de pantalla
            setTimeout(() => {
                switchToCodeScreen();
            }, 500);
        }
        
        updateProgressBar();
    }, updateInterval);
}

function updateProgressBar() {
    progressFill.style.width = `${currentProgress}%`;
    progressText.textContent = `${Math.round(currentProgress)}%`;
}

function switchToCodeScreen() {
    loadingScreen.classList.remove('active');
    codeScreen.classList.add('active');
    
    // Enfocar el primer input después de la animación
    setTimeout(() => {
        codeInputs[0].focus();
    }, 800);
}

// Configuración de los inputs de código
function setupCodeInputs() {
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Solo permitir números
            if (!/^\d$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Agregar clase de animación
            e.target.classList.add('filled');
            
            // Mover al siguiente input
            if (value && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }
            
            checkCodeCompletion();
        });
        
        input.addEventListener('keydown', function(e) {
            // Manejar tecla de retroceso
            if (e.key === 'Backspace') {
                if (!e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
                e.target.classList.remove('filled');
            }
            
            // Manejar tecla Enter
            if (e.key === 'Enter') {
                if (isCodeComplete) {
                    submitCode();
                } else if (e.target.value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text');
            const numbers = pastedData.replace(/\D/g, '').slice(0, 4);
            
            if (numbers.length === 4) {
                numbers.split('').forEach((num, i) => {
                    if (codeInputs[i]) {
                        codeInputs[i].value = num;
                        codeInputs[i].classList.add('filled');
                    }
                });
                checkCodeCompletion();
                codeInputs[3].focus();
            }
        });
    });
}

function checkCodeCompletion() {
    const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
    isCodeComplete = enteredCode.length === 4;
    
    submitBtn.disabled = !isCodeComplete;
    
    if (isCodeComplete) {
        submitBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #ff8fab)';
    } else {
        submitBtn.style.background = '#ccc';
    }
}

// Configuración del botón de envío
function setupSubmitButton() {
    submitBtn.addEventListener('click', submitCode);
}

function submitCode() {
    if (!isCodeComplete) return;
    
    const enteredCode = Array.from(codeInputs).map(input => input.value).join('');
    
    // Mostrar animación de carga en el botón
    submitBtn.style.pointerEvents = 'none';
    submitBtn.innerHTML = '<span class="btn-text">Verificando...</span><span class="btn-icon">⏳</span>';
    
    // Simular verificación con delay
    setTimeout(() => {
        if (enteredCode === CORRECT_CODE) {
            handleCorrectCode();
        } else {
            handleIncorrectCode();
        }
    }, 1500);
}

function handleCorrectCode() {
    // Limpiar mensaje de error
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    // Animación de éxito
    submitBtn.innerHTML = '<span class="btn-text">¡Correcto!</span><span class="btn-icon">✅</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
    
    // Efecto de confeti o celebración
    createConfetti();
    
    // Aquí puedes agregar la lógica para mostrar el contenido del regalo
    setTimeout(() => {
        alert('¡Felicitaciones! Has ingresado el código correcto. 🎉\n\nPróximamente aquí aparecerá tu regalo especial...');
        // Aquí puedes redirigir a otra página o mostrar el contenido del regalo
    }, 2000);
}

function handleIncorrectCode() {
    // Mostrar mensaje de error
    errorMessage.textContent = '❌ Código incorrecto. Intenta de nuevo.';
    errorMessage.classList.add('show');
    
    // Resetear botón
    submitBtn.innerHTML = '<span class="btn-text">Abrir Regalo</span><span class="btn-icon">💝</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #ff8fab)';
    submitBtn.style.pointerEvents = 'auto';
    
    // Limpiar inputs con animación
    codeInputs.forEach((input, index) => {
        setTimeout(() => {
            input.value = '';
            input.classList.remove('filled');
            input.style.transform = 'scale(0.9)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 100);
        }, index * 100);
    });
    
    // Enfocar el primer input
    setTimeout(() => {
        codeInputs[0].focus();
    }, 500);
    
    // Ocultar mensaje de error después de 3 segundos
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

// Función para crear efecto de confeti
function createConfetti() {
    const colors = ['#ff6b9d', '#ff8fab', '#ffa8c5', '#ffb3d1', '#ffc0dd'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 20);
    }
}

function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    
    document.body.appendChild(confetti);
    
    // Animación de caída
    const animation = confetti.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
    ], {
        duration: 3000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => {
        confetti.remove();
    };
}

// Función para vibrar en dispositivos móviles (si está disponible)
function vibrate(pattern = [100, 50, 100]) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

// Agregar vibración en caso de código incorrecto
function handleIncorrectCode() {
    vibrate([200, 100, 200]); // Vibración de error
    
    // Cambiar pista dinámicamente
    hintText.textContent = 'LO USABAS MUCHO SIEMPRE';
    hintText.style.color = '#ff6b9d';
    hintText.style.fontWeight = '600';
    
    // Mostrar mensaje de error
    errorMessage.textContent = '❌ Código incorrecto. Intenta de nuevo.';
    errorMessage.classList.add('show');
    
    // Resetear botón
    submitBtn.innerHTML = '<span class="btn-text">Abrir Regalo</span><span class="btn-icon">💝</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #ff8fab)';
    submitBtn.style.pointerEvents = 'auto';
    
    // Limpiar inputs con animación
    codeInputs.forEach((input, index) => {
        setTimeout(() => {
            input.value = '';
            input.classList.remove('filled');
            input.style.transform = 'scale(0.9)';
            setTimeout(() => {
                input.style.transform = 'scale(1)';
            }, 100);
        }, index * 100);
    });
    
    // Enfocar el primer input
    setTimeout(() => {
        codeInputs[0].focus();
    }, 500);
    
    // Ocultar mensaje de error después de 3 segundos
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

// Función para vibrar en caso de código correcto
function handleCorrectCode() {
    vibrate([100, 50, 100, 50, 100]); // Vibración de éxito
    
    // Limpiar mensaje de error
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    // Animación de éxito
    submitBtn.innerHTML = '<span class="btn-text">¡Correcto!</span><span class="btn-icon">✅</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #66BB6A)';
    
    // Efecto de confeti o celebración
    createConfetti();
    
    // Reproducir música
    playMusic();
    
    // Mostrar GIF de beso
    showKissGif();
    
    // Mostrar la carta después de un delay
    setTimeout(() => {
        switchToLetterScreen();
    }, 4000);
}

function showKissGif() {
    kissGif.classList.add('show');
    
    // Ocultar el GIF después de 3 segundos
    setTimeout(() => {
        kissGif.classList.remove('show');
    }, 3000);
}

// Prevenir zoom en inputs en iOS
document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('code-input')) {
        e.preventDefault();
    }
}, { passive: false });

// Mejorar la experiencia táctil
codeInputs.forEach(input => {
    input.addEventListener('touchstart', function() {
        this.focus();
    });
});

// Funciones para la carta
function setupLetterScreen() {
    closeLetterBtn.addEventListener('click', function() {
        // Volver a la pantalla de código
        letterScreen.classList.remove('active');
        codeScreen.classList.add('active');
        
        // Resetear el formulario
        resetCodeForm();
    });
}


function switchToLetterScreen() {
    codeScreen.classList.remove('active');
    letterScreen.classList.add('active');
    
    // Iniciar el efecto de escritura después de un delay
    setTimeout(() => {
        startTypingEffect();
    }, 1000);
}

function startTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    let currentElementIndex = 0;
    
    function startNextElement() {
        if (currentElementIndex < typingElements.length) {
            const element = typingElements[currentElementIndex];
            const text = element.getAttribute('data-text');
            
            // Limpiar el elemento completamente
            element.textContent = '';
            element.classList.add('typing');
            element.classList.remove('completed');
            
            typeTextSimple(element, text, 60, () => {
                // Callback cuando termina de escribir este elemento
                element.classList.remove('typing');
                element.classList.add('completed');
                currentElementIndex++;
                
                // Esperar un poco antes de continuar con el siguiente
                setTimeout(() => {
                    startNextElement();
                }, 1000);
            });
        }
    }
    
    // Iniciar el primer elemento
    startNextElement();
}

function typeTextSimple(element, text, speed, onComplete) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            if (onComplete) {
                onComplete();
            }
        }
    }, speed);
}

function resetCodeForm() {
    // Limpiar inputs
    codeInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    
    // Resetear botón
    submitBtn.innerHTML = '<span class="btn-text">Abrir Regalo</span><span class="btn-icon">💝</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #ff8fab)';
    submitBtn.disabled = true;
    submitBtn.style.pointerEvents = 'auto';
    
    // Resetear pista
    hintText.textContent = 'El código es una fecha especial';
    hintText.style.color = '';
    hintText.style.fontWeight = '';
    
    // Limpiar mensaje de error
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    
    // Resetear efecto de escritura
    resetTypingEffect();
    
    // Enfocar el primer input
    setTimeout(() => {
        codeInputs[0].focus();
    }, 500);
}

function resetTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-text');
    typingElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('typing', 'completed');
    });
}

// Función para reproducir música
function playMusic() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3; // Volumen moderado
        backgroundMusic.play().catch(error => {
            console.log('No se pudo reproducir la música:', error);
        });
    }
}

// Función para pausar música
function pauseMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

// Configurar música
function setupMusic() {
    if (backgroundMusic) {
        backgroundMusic.loop = true; // Repetir la canción
        backgroundMusic.volume = 0.3;
    }
}

// Efecto de corazones al tocar la pantalla
function setupHeartEffect() {
    document.addEventListener('click', createHeartEffect);
    document.addEventListener('touchstart', createHeartEffect);
}

function createHeartEffect(event) {
    const hearts = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '💟'];
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = randomHeart;
    
    // Posición del click/touch
    const x = event.clientX || (event.touches && event.touches[0].clientX);
    const y = event.clientY || (event.touches && event.touches[0].clientY);
    
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    document.body.appendChild(heart);
    
    // Remover el corazón después de la animación
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
        }
    }, 2000);
}


// Configuración del teclado numérico
function setupNumericKeyboard() {
    const keyboardKeys = document.querySelectorAll('.keyboard-key[data-number]');
    const clearKey = document.getElementById('clear-key');
    const backspaceKey = document.getElementById('backspace-key');
    
    // Teclas numéricas
    keyboardKeys.forEach(key => {
        key.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            addNumberToInput(number);
            addKeyPressEffect(this);
        });
    });
    
    // Tecla de borrar todo
    if (clearKey) {
        clearKey.addEventListener('click', function() {
            clearAllInputs();
            addKeyPressEffect(this);
        });
    }
    
    // Tecla de retroceso
    if (backspaceKey) {
        backspaceKey.addEventListener('click', function() {
            removeLastNumber();
            addKeyPressEffect(this);
        });
    }
}

// Añadir número al input
function addNumberToInput(number) {
    const currentIndex = getCurrentInputIndex();
    if (currentIndex < codeInputs.length) {
        codeInputs[currentIndex].value = number;
        codeInputs[currentIndex].classList.add('filled');
        
        // Verificar si se completó el código
        checkCodeCompletion();
        
        // Si se completaron los 4 números, verificar automáticamente
        if (isCodeComplete) {
            setTimeout(() => {
                verifyCode();
            }, 500); // Pequeño delay para que se vea el último número
        } else if (currentIndex < codeInputs.length - 1) {
            // Ir al siguiente input si no es el último
            setTimeout(() => {
                codeInputs[currentIndex + 1].focus();
            }, 100);
        }
    }
}

// Obtener el índice del input actual
function getCurrentInputIndex() {
    for (let i = 0; i < codeInputs.length; i++) {
        if (!codeInputs[i].value) {
            return i;
        }
    }
    return codeInputs.length - 1; // Si todos están llenos, usar el último
}

// Borrar todos los inputs
function clearAllInputs() {
    codeInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
    });
    checkCodeCompletion();
    codeInputs[0].focus();
}

// Remover el último número
function removeLastNumber() {
    for (let i = codeInputs.length - 1; i >= 0; i--) {
        if (codeInputs[i].value) {
            codeInputs[i].value = '';
            codeInputs[i].classList.remove('filled');
            break;
        }
    }
    checkCodeCompletion();
}

// Efecto visual al presionar una tecla
function addKeyPressEffect(key) {
    key.classList.add('pressed');
    setTimeout(() => {
        key.classList.remove('pressed');
    }, 300);
}

