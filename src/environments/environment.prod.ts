export const environment = {
  production: true,
  
  /**
   * REGLA ESTRUCTURAL ESTRICTA (FLUJO CERRADO):
   * ---------------------------------------------------------------------
   * El Frontend NUNCA DEBE comunicarse de forma directa con los microservicios
   * individuales (puertos 8081, 8082, 8083, etc.).
   * 
   * Toda petición REST sin excepción en el front DEBE viajar a través de la 
   * capa del API Gateway en el puerto 8080.
   * En producción (Docker), Nginx proxea `/api/**` -> `http://host.docker.internal:8080/api/`
   */
  apiUrl: '' // Se mantiene vacío forzosamente para forzar el uso del proxy interno hacia 8080
};
