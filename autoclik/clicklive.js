// ==============================================
// CLIC MASIVO CONTINUO - MILES DE CLICS
// ==============================================

(function() {
    // Limpiar consola
    console.clear();
    
    // Variables de control
    let isRunning = false;
    let intervalId = null;
    let clickCount = 0;
    let scanCount = 0;
    let targetNumber = null;
    let clicksPorCiclo = 10; // Clics por cada ejecucion
    
    // Mostrar cabecera
    console.log('%c💥 CLIC MASIVO ACTIVADO', 'color: #FF0000; font-size: 24px; font-weight: bold;');
    console.log('%c🔢 Modo: Miles de clics continuos', 'color: #FF9800; font-weight: bold;');
    console.log('='.repeat(70));
    
    // FUNCION PARA DETECTAR ELEMENTOS (RAPIDA)
    function detectarRapido() {
        const elementosClic = document.querySelectorAll('div.sc-gSmbic.bYHgVX');
        let elementosValidos = [];
        
        if (elementosClic.length === 0) {
            return [];
        }
        
        // Analizar rapidamente
        elementosClic.forEach(function(elementoClic, index) {
            const contenedor = elementoClic.closest('div.sc-gtLWhw.jywoSP');
            if (contenedor) {
                const span = contenedor.querySelector('span');
                const numero = span ? span.textContent.trim() : null;
                
                if (numero) {
                    // Si no tenemos numero objetivo, usar el primero
                    if (!targetNumber) {
                        targetNumber = numero;
                    }
                    
                    // Si coincide con el numero objetivo
                    if (numero === targetNumber) {
                        elementosValidos.push({
                            elemento: elementoClic,
                            numero: numero,
                            index: index
                        });
                    }
                }
            }
        });
        
        return elementosValidos;
    }
    
    // FUNCION PARA HACER MULTIPLES CLICS EN UN ELEMENTO
    function clicMasivoElemento(elemento, numero, index) {
        let clicsEnEsteElemento = 0;
        
        // Hacer MULTIPLES clics rapidos
        for (let i = 0; i < clicksPorCiclo; i++) {
            clickCount++;
            clicsEnEsteElemento++;
            
            // MANTENER resaltado ROJO CONSTANTE
            elemento.style.cssText = 'border: 5px solid #FF0000 !important; background: rgba(255,0,0,0.4) !important; box-shadow: 0 0 25px red !important; transform: scale(1.1) !important; z-index: 99999 !important; position: relative !important;';
            
            // METODOS DE CLIC SIMULTANEOS (todos a la vez)
            try {
                // 1. Click directo
                if (typeof elemento.click === 'function') {
                    elemento.click();
                }
                
                // 2. Evento de click
                const rect = elemento.getBoundingClientRect();
                const evtClick = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + rect.width/2,
                    clientY: rect.top + rect.height/2
                });
                elemento.dispatchEvent(evtClick);
                
                // 3. mousedown + mouseup
                const evtDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: rect.left + rect.width/2,
                    clientY: rect.top + rect.height/2
                });
                const evtUp = new MouseEvent('mouseup', {
                    bubbles: true,
                    clientX: rect.left + rect.width/2,
                    clientY: rect.top + rect.height/2
                });
                
                elemento.dispatchEvent(evtDown);
                elemento.dispatchEvent(evtUp);
                
                // 4. Doble click
                const evtDbl = new MouseEvent('dblclick', {
                    bubbles: true,
                    cancelable: true
                });
                elemento.dispatchEvent(evtDbl);
                
            } catch(e) {
                // Ignorar errores para velocidad
            }
            
            // Tambien clic en padres
            const padres = [
                elemento.parentElement,
                elemento.closest('div.sc-blHHSb'),
                elemento.closest('div.sc-jBISsm'),
                elemento.closest('div.sc-gtLWhw.jywoSP')
            ];
            
            padres.forEach(function(padre) {
                if (padre && typeof padre.click === 'function') {
                    try {
                        padre.click();
                    } catch(e) {
                        // Ignorar errores
                    }
                }
            });
            
            // Pequeno delay entre clics individuales
            // Esto es intencionalmente MUY corto para velocidad
        }
        
        // Mostrar progreso cada 100 clics
        if (clickCount % 100 === 0) {
            console.log('%c💥 CLIC #' + clickCount.toLocaleString(), 'color: #FF0000; font-weight: bold;');
            console.log('   • En elemento ' + (index + 1) + ' (' + numero + ')');
            console.log('   • Clics este ciclo: ' + clicsEnEsteElemento);
        }
        
        return clicsEnEsteElemento;
    }
    
    // FUNCION PRINCIPAL DE CICLO MASIVO
    function cicloClicMasivo() {
        // Detectar elementos rapidamente
        const elementos = detectarRapido();
        
        if (elementos.length === 0) {
            // Cada 100 ciclos sin elementos
            if (clickCount % 1000 === 0) {
                console.log('%c🔍 Buscando elementos...', 'color: #2196F3;');
            }
            return;
        }
        
        // Hacer MULTIPLES clics en TODOS los elementos
        let totalClicsEsteCiclo = 0;
        
        elementos.forEach(function(item) {
            const clics = clicMasivoElemento(item.elemento, item.numero, item.index);
            totalClicsEsteCiclo += clics;
        });
        
        // Mostrar estadisticas cada 500 clics
        if (clickCount % 500 === 0) {
            console.log('%c📊 ESTADISTICAS', 'color: #4CAF50; font-weight: bold;');
            console.log('   • Clics totales: ' + clickCount.toLocaleString());
            console.log('   • Clics este ciclo: ' + totalClicsEsteCiclo);
            console.log('   • Elementos activos: ' + elementos.length);
            console.log('   • Numero objetivo: "' + targetNumber + '"');
            console.log('   • Velocidad: ' + clicksPorCiclo + ' clics/elemento/ciclo');
        }
    }
    
    // FUNCION PARA INICIAR CLIC MASIVO
    function iniciarMasivo(velocidad, clicsPorCicloParam) {
        velocidad = velocidad || 50;
        clicksPorCiclo = clicsPorCicloParam || 10;
        
        if (isRunning) {
            console.log('%c⚠ Ya esta en ejecucion', 'color: #FF9800;');
            return;
        }
        
        // Primera deteccion
        const elementosIniciales = detectarRapido();
        
        if (elementosIniciales.length === 0) {
            console.log('%c❌ No se encontraron elementos', 'color: #f44336;');
            console.log('💡 Ejecuta escanear() primero');
            return;
        }
        
        if (!targetNumber) {
            targetNumber = elementosIniciales[0].numero;
        }
        
        isRunning = true;
        console.log('%c💥 INICIANDO CLIC MASIVO', 'color: #FF0000; font-size: 22px; font-weight: bold;');
        console.log('⚡ Velocidad: ' + velocidad + 'ms entre ciclos');
        console.log('🔢 Clics por ciclo: ' + clicksPorCiclo + ' (por elemento)');
        console.log('🎯 Numero objetivo: "' + targetNumber + '"');
        console.log('📍 Elemento: sc-gSmbic.bYHgVX');
        console.log('📊 Elementos iniciales: ' + elementosIniciales.length);
        console.log('🛑 Para detener: detener()');
        console.log('='.repeat(70));
        
        // Calcular velocidad estimada
        const clicsPorSegundo = Math.round((1000 / velocidad) * clicksPorCiclo * elementosIniciales.length);
        console.log('⚡ Velocidad estimada: ~' + clicsPorSegundo.toLocaleString() + ' clics/segundo');
        
        // Iniciar ciclo
        intervalId = setInterval(cicloClicMasivo, velocidad);
        
        // Primer ciclo inmediato
        setTimeout(cicloClicMasivo, 10);
    }
    
    // FUNCION PARA DETENER
    function detener() {
        if (!isRunning) {
            console.log('%cℹ No esta en ejecucion', 'color: #2196F3;');
            return;
        }
        
        isRunning = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        
        // Quitar resaltado
        const elementos = document.querySelectorAll('div.sc-gSmbic.bYHgVX');
        elementos.forEach(function(el) {
            el.style.cssText = '';
        });
        
        console.log('%c⏹ CLIC MASIVO DETENIDO', 'color: #f44336; font-size: 20px; font-weight: bold;');
        console.log('💥 Total clics realizados: ' + clickCount.toLocaleString());
        console.log('🎯 Numero usado: "' + targetNumber + '"');
        console.log('⏱  Duracion: ' + scanCount + ' ciclos');
    }
    
    // FUNCION ESCANEAR
    function escanear() {
        scanCount++;
        console.log('%c🔍 ESCANEO #' + scanCount, 'color: #2196F3; font-weight: bold;');
        
        const elementos = detectarRapido();
        
        if (elementos.length === 0) {
            console.log('%c❌ No se encontraron elementos', 'color: #f44336;');
            return [];
        }
        
        console.log('📊 Elementos encontrados: ' + elementos.length);
        console.log('🎯 Numero detectado: "' + (targetNumber || elementos[0].numero) + '"');
        
        // Mostrar cada elemento
        elementos.forEach(function(item, i) {
            console.log('   ' + (i+1) + '. Elemento con numero: ' + item.numero);
            
            // Resaltar brevemente
            const originalStyle = item.elemento.style.cssText;
            item.elemento.style.cssText = 'border: 3px solid #2196F3 !important; background: rgba(33,150,243,0.2) !important;';
            
            setTimeout(function() {
                item.elemento.style.cssText = originalStyle;
            }, 1500);
        });
        
        return elementos;
    }
    
    // FUNCION HACER CLIC MANUAL (para probar)
    function hacerClic() {
        console.log('%c🖱 CLIC MANUAL', 'color: #FF9800; font-weight: bold;');
        
        const elementos = detectarRapido();
        
        if (elementos.length === 0) {
            console.log('%c❌ No hay elementos', 'color: #f44336;');
            return false;
        }
        
        // Hacer multiples clics en cada elemento
        elementos.forEach(function(item, i) {
            console.log('   • ' + clicksPorCiclo + ' clics en elemento ' + (i+1) + ' (' + item.numero + ')');
            clicMasivoElemento(item.elemento, item.numero, i);
        });
        
        console.log('✅ ' + (elementos.length * clicksPorCiclo) + ' clic(s) realizados');
        return true;
    }
    
    // FUNCION CAMBIAR CONFIGURACION
    function configurar(nuevaVelocidad, nuevosClics) {
        if (isRunning) {
            console.log('%c⚡ Cambiando configuracion en vivo...', 'color: #FF9800; font-weight: bold;');
            
            if (nuevaVelocidad) {
                // Cambiar velocidad en tiempo real
                clearInterval(intervalId);
                intervalId = setInterval(cicloClicMasivo, nuevaVelocidad);
                console.log('   • Nueva velocidad: ' + nuevaVelocidad + 'ms');
            }
            
            if (nuevosClics) {
                clicksPorCiclo = nuevosClics;
                console.log('   • Nuevos clics por ciclo: ' + clicksPorCiclo);
            }
            
            const elementos = detectarRapido();
            const clicsPorSegundo = Math.round((1000 / (nuevaVelocidad || 50)) * clicksPorCiclo * elementos.length);
            console.log('   • Nueva velocidad estimada: ~' + clicsPorSegundo.toLocaleString() + ' clics/segundo');
            
        } else {
            if (nuevaVelocidad) console.log('⚡ Velocidad configurada: ' + nuevaVelocidad + 'ms');
            if (nuevosClics) console.log('🔢 Clics por ciclo: ' + nuevosClics);
            console.log('💡 Usa iniciar() para comenzar');
        }
    }
    
    // FUNCION PARA MODOS PREDEFINIDOS
    function modoExtremo() {
        console.log('%c💀 MODO EXTREMO ACTIVADO', 'color: #FF0000; font-size: 18px; font-weight: bold;');
        console.log('   • Velocidad: 10ms (maxima)');
        console.log('   • Clics por ciclo: 50');
        console.log('   • ¡ADVERTENCIA: Maximo rendimiento!');
        iniciarMasivo(10, 50);
    }
    
    function modoRapido() {
        console.log('%c⚡ MODO RAPIDO ACTIVADO', 'color: #FF9800; font-weight: bold;');
        console.log('   • Velocidad: 30ms');
        console.log('   • Clics por ciclo: 20');
        iniciarMasivo(30, 20);
    }
    
    function modoNormal() {
        console.log('%c🐇 MODO NORMAL ACTIVADO', 'color: #4CAF50; font-weight: bold;');
        console.log('   • Velocidad: 100ms');
        console.log('   • Clics por ciclo: 10');
        iniciarMasivo(100, 10);
    }
    
    function modoLento() {
        console.log('%c🐢 MODO LENTO ACTIVADO', 'color: #2196F3; font-weight: bold;');
        console.log('   • Velocidad: 500ms');
        console.log('   • Clics por ciclo: 5');
        iniciarMasivo(500, 5);
    }
    
    // FUNCION PARA CLIC UNICO MASIVO (1000 clics de una vez)
    function clicMasivoUnico() {
        console.log('%c💥 CLIC MASIVO UNICO', 'color: #FF0000; font-weight: bold;');
        console.log('   • Realizando 1000 clics inmediatos...');
        
        const elementos = detectarRapido();
        
        if (elementos.length === 0) {
            console.log('%c❌ No hay elementos', 'color: #f44336;');
            return;
        }
        
        let clicsRealizados = 0;
        const clicsTotales = 1000;
        
        // Funcion recursiva para hacer clics
        function hacerClicRecursivo() {
            if (clicsRealizados >= clicsTotales) {
                console.log('✅ ' + clicsRealizados.toLocaleString() + ' clics realizados');
                return;
            }
            
            elementos.forEach(function(item) {
                // Hacer 10 clics rapidos por elemento
                for (let i = 0; i < 10 && clicsRealizados < clicsTotales; i++) {
                    try {
                        item.elemento.click();
                        clickCount++;
                        clicsRealizados++;
                    } catch(e) {}
                }
            });
            
            // Continuar despues de 1ms
            setTimeout(hacerClicRecursivo, 1);
        }
        
        hacerClicRecursivo();
    }
    
    // FUNCION VER ESTADO
    function estado() {
        console.log('%c📊 ESTADO DEL SISTEMA', 'color: #9C27B0; font-weight: bold;');
        console.log('🕒 Hora: ' + new Date().toLocaleTimeString());
        console.log('💥 Clics totales: ' + clickCount.toLocaleString());
        console.log('🎯 Numero objetivo: "' + (targetNumber || 'No configurado') + '"');
        console.log('📍 Elemento: sc-gSmbic.bYHgVX');
        console.log('⚡ Modo: ' + (isRunning ? 'CLIC MASIVO ACTIVO' : 'INACTIVO'));
        console.log('🔢 Clics por ciclo: ' + clicksPorCiclo);
        console.log('🔍 Escaneos: ' + scanCount);
        
        // Deteccion rapida
        const elementos = document.querySelectorAll('div.sc-gSmbic.bYHgVX');
        console.log('📊 Elementos disponibles: ' + elementos.length);
    }
    
    // FUNCION BUSCAR NUMEROS
    function buscarNumeros() {
        console.log('%c🔍 BUSCANDO NUMEROS', 'color: #2196F3; font-weight: bold;');
        
        const elementos = document.querySelectorAll('div.sc-gSmbic.bYHgVX');
        const numeros = new Set();
        
        elementos.forEach(function(el) {
            const contenedor = el.closest('div.sc-gtLWhw.jywoSP');
            if (contenedor) {
                const span = contenedor.querySelector('span');
                if (span) {
                    numeros.add(span.textContent.trim());
                }
            }
        });
        
        if (numeros.size > 0) {
            console.log('📋 NUMEROS ENCONTRADOS (' + numeros.size + '):');
            const numerosArray = Array.from(numeros);
            numerosArray.forEach(function(num, i) {
                console.log('   ' + (i+1) + '. "' + num + '"');
            });
        }
    }
    
    // FUNCION LIMPIAR
    function limpiar() {
        console.clear();
        console.log('%c🧹 CONSOLA LIMPIADA', 'color: #2196F3; font-weight: bold;');
        ayuda();
    }
    
    // FUNCION AYUDA
    function ayuda() {
        console.log('\n' + '='.repeat(70));
        console.log('%c💥 CLIC MASIVO - AYUDA', 'color: #FF0000; font-weight: bold;');
        console.log('='.repeat(70));
        console.log('🎯 CARACTERISTICAS:');
        console.log('   • Miles de clics continuos');
        console.log('   • Multiples clics por ciclo');
        console.log('   • Resaltado ROJO constante');
        console.log('='.repeat(70));
        console.log('🚀 MODOS PREDEFINIDOS:');
        console.log('   modoExtremo()    - 50 clics/ciclo, 10ms (MAXIMO)');
        console.log('   modoRapido()     - 20 clics/ciclo, 30ms');
        console.log('   modoNormal()     - 10 clics/ciclo, 100ms');
        console.log('   modoLento()      - 5 clics/ciclo, 500ms');
        console.log('='.repeat(70));
        console.log('📋 COMANDOS PRINCIPALES:');
        console.log('   iniciar()        - Clic masivo continuo');
        console.log('   detener()        - Detener completamente');
        console.log('   clicMasivoUnico()- 1000 clics inmediatos');
        console.log('   configurar(50,20)- Cambiar velocidad y clics');
        console.log('='.repeat(70));
    }
    
    // CREAR COMANDOS GLOBALES
    window.escanear = escanear;
    window.hacerClic = hacerClic;
    window.iniciar = function() { iniciarMasivo(50, 10); };
    window.detener = detener;
    window.estado = estado;
    window.buscarNumeros = buscarNumeros;
    window.limpiar = limpiar;
    window.ayuda = ayuda;
    window.configurar = configurar;
    
    // Modos predefinidos
    window.modoExtremo = modoExtremo;
    window.modoRapido = modoRapido;
    window.modoNormal = modoNormal;
    window.modoLento = modoLento;
    window.clicMasivoUnico = clicMasivoUnico;
    
    // Alias
    window.ESCANEAR = escanear;
    window.CLIC = hacerClic;
    window.INICIAR = function() { iniciarMasivo(50, 10); };
    window.DETENER = detener;
    window.ESTADO = estado;
    
    // Mostrar ayuda
    ayuda();
    
    // Deteccion inicial
    setTimeout(function() {
        console.log('\n%c🤖 DETECCION AUTOMATICA...', 'color: #9C27B0; font-weight: bold;');
        escanear();
        
        console.log('\n' + '='.repeat(70));
        console.log('%c💥 SISTEMA LISTO PARA CLIC MASIVO', 'color: #FF0000; font-weight: bold;');
        console.log('\n%c🚀 PARA MILES DE CLICS:', 'color: #FF9800; font-weight: bold;');
        console.log('   • modoExtremo()  ← MAXIMA VELOCIDAD');
        console.log('   • modoRapido()   ← Velocidad alta');
        console.log('   • iniciar()      ← Velocidad normal');
        console.log('   • detener()      ← Solo para detener');
        console.log('='.repeat(70));
    }, 1000);
    
})();
