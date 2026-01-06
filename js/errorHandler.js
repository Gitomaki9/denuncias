// En un archivo js/errorHandler.js
class ErrorHandlerCusco {
  constructor() {
    this.errors = [];
    this.setupGlobalHandlers();
  }
  
  setupGlobalHandlers() {
    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
      this.registrar('global', event.error);
    });
    
    // Capturar promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      this.registrar('promise', event.reason);
    });
  }
  
  registrar(tipo, error, contexto = {}) {
    const errorObj = {
      id: Date.now(),
      tipo,
      mensaje: error.message || String(error),
      stack: error.stack,
      contexto,
      fecha: new Date().toISOString(),
      pagina: window.location.href,
      usuario: sessionStorage.getItem('user') ? 'logueado' : 'anonimo'
    };
    
    this.errors.push(errorObj);
    console.error('📝 Error registrado:', errorObj);
    
    // Guardar en localStorage para debug
    if (this.errors.length > 10) this.errors.shift();
    localStorage.setItem('cusco_errores', JSON.stringify(this.errors));
    
    return errorObj;
  }
  
  mostrarUsuario(error, nivel = 'error') {
    const mensajes = {
      error: {
        network: '📡 Problema de conexión. Revisa tu internet.',
        auth: '🔐 Sesión expirada. Vuelve a iniciar sesión.',
        validation: '📝 Verifica los datos ingresados.',
        database: '🗃️ Error en la base de datos. Intenta más tarde.',
        default: '❌ Algo salió mal. Intenta nuevamente.'
      },
      warning: {
        slow: '⚠️ La respuesta está tardando más de lo normal...',
        duplicate: 'ℹ️ Este registro ya existe en el sistema.'
      },
      info: {
        saved: '✅ Guardado exitosamente',
        deleted: '🗑️ Eliminado correctamente'
      }
    };
    
    // Determinar tipo de error
    let tipo = 'default';
    if (error.message.includes('network') || error.message.includes('fetch')) tipo = 'network';
    if (error.message.includes('JWT') || error.message.includes('auth')) tipo = 'auth';
    if (error.message.includes('validation')) tipo = 'validation';
    if (error.message.includes('database') || error.message.includes('SQL')) tipo = 'database';
    
    const mensaje = mensajes[nivel][tipo] || mensajes[nivel].default;
    
    // Mostrar en UI bonita (no alert)
    this.mostrarNotificacion(mensaje, nivel);
  }
  
  mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación bonita
    const notif = document.createElement('div');
    notif.className = `notificacion notificacion-${tipo}`;
    notif.innerHTML = `
      <div class="notificacion-contenido">
        <span class="notificacion-icono">${this.getIcono(tipo)}</span>
        <span class="notificacion-texto">${mensaje}</span>
        <button class="notificacion-cerrar">×</button>
      </div>
    `;
    
    document.body.appendChild(notif);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => notif.remove(), 5000);
  }
  
  getIcono(tipo) {
    const iconos = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return iconos[tipo] || 'ℹ️';
  }
}

// Inicializar
const errorHandler = new ErrorHandlerCusco();
