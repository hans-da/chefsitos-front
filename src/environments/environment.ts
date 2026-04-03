export const environment = {
  production: false,
  
  /**
   * REGLA ESTRUCTURAL ESTRICTA (FLUJO CERRADO):
   * ---------------------------------------------------------------------
   * El Frontend NUNCA DEBE comunicarse de forma directa con los microservicios
   * individuales (puertos 8081, 8082, 8083, etc.).
   * 
   * Toda petición REST sin excepción en el front DEBE viajar a través de la 
   * capa del API Gateway en el puerto 8080.
   * En desarrollo, Angular usa `proxy.conf.json` para redirigir todo el
   * tráfico `/api/**` hacia `http://localhost:8080`.
   */
  apiUrl: '' // Se mantiene vacío forzosamente para forzar el uso del proxy interno hacia 8080
};
