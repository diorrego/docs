// Script para traducir la interfaz de Mintlify al español
(function() {
  'use strict';
  
  // Mapeo de traducciones
  const translations = {
    'On this page': 'En esta página',
    'Search...': 'Buscar...',
    'Search': 'Buscar',
    'Copy page': 'Copiar página',
    'Copy': 'Copiar',
    'Was this page helpful?': '¿Te resultó útil esta página?',
    'Yes': 'Sí',
    'No': 'No',
    'Previous': 'Anterior',
    'Next': 'Siguiente',
    'Skip to main content': 'Saltar al contenido principal',
    'Open search': 'Abrir búsqueda',
    'More actions': 'Más acciones',
    'Navigation': 'Navegación',
    'Ask a question...': 'Haz una pregunta...',
    'Send message': 'Enviar mensaje',
    'Report incorrect code': 'Reportar código incorrecto',
    'Ask AI': 'Preguntar a la IA',
    // Menú contextual
    'Copy page as Markdown for LLMs': 'Copiar página como Markdown para LLMs',
    'View as Markdown': 'Ver como Markdown',
    'View this page as plain text': 'Ver esta página como texto plano',
    'Open in ChatGPT': 'Abrir en ChatGPT',
    'Open in Claude': 'Abrir en Claude',
    'Open in Perplexity': 'Abrir en Perplexity',
    'Ask questions about this page': 'Hacer preguntas sobre esta página',
    'Copy MCP Server': 'Copiar servidor MCP',
    'Copy MCP Server URL to clipboard': 'Copiar URL del servidor MCP al portapapeles',
    'Connect to Cursor': 'Conectar a Cursor',
    'Install MCP Server on Cursor': 'Instalar servidor MCP en Cursor',
    'Connect to VS Code': 'Conectar a VS Code',
    'Install MCP Server on VS Code': 'Instalar servidor MCP en VS Code'
  };

  // Función para traducir texto en un nodo
  function translateNode(node) {
    if (!node) return;
    
    // Traducir nodos de texto
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text && translations[text]) {
        node.textContent = translations[text];
        return;
      }
    }
    
    // Traducir atributos
    if (node.nodeType === Node.ELEMENT_NODE) {
      const attrs = ['placeholder', 'aria-label', 'title', 'alt'];
      attrs.forEach(attr => {
        const value = node.getAttribute(attr);
        if (value && translations[value]) {
          node.setAttribute(attr, translations[value]);
        }
      });
      
      // Buscar y traducir texto en elementos que contienen solo texto o texto con iconos
      // Esto captura subtítulos y descripciones en el menú contextual
      const allTextNodes = Array.from(node.childNodes).filter(
        n => n.nodeType === Node.TEXT_NODE
      );
      
      allTextNodes.forEach(textNode => {
        const text = textNode.textContent.trim();
        if (text && translations[text]) {
          textNode.textContent = translations[text];
        }
      });
      
      // También buscar en el texto completo del elemento si es simple
      const fullText = node.textContent.trim();
      if (fullText && translations[fullText] && 
          node.childNodes.length <= 3 && // Elementos simples (texto + 1-2 iconos)
          allTextNodes.length > 0) {
        // Si el texto completo coincide y hay nodos de texto, traducirlos
        allTextNodes.forEach(textNode => {
          if (textNode.textContent.trim() === fullText) {
            textNode.textContent = translations[fullText];
          }
        });
      }
      
      // Traducir hijos recursivamente
      node.childNodes.forEach(translateNode);
    }
  }

  // Función para buscar y traducir textos en elementos específicos
  function translateSpecificElements() {
    // Buscar todos los elementos que puedan contener texto traducible
    const selectors = ['span', 'div', 'p', 'button', 'a', 'label'];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        // Buscar texto directo en el elemento
        const text = element.textContent.trim();
        if (text && translations[text]) {
          // Si el elemento solo tiene texto, reemplazarlo
          if (element.childNodes.length === 1 && 
              element.childNodes[0].nodeType === Node.TEXT_NODE) {
            element.textContent = translations[text];
          } else {
            // Buscar nodos de texto hijos y reemplazarlos
            element.childNodes.forEach(child => {
              if (child.nodeType === Node.TEXT_NODE && 
                  child.textContent.trim() === text) {
                child.textContent = translations[text];
              }
            });
          }
        }
      });
    });
  }

  // Función para traducir todo el documento
  function translateDocument() {
    if (document.body) {
      translateNode(document.body);
      translateSpecificElements();
    }
  }

  // Función para observar cambios en el DOM
  function observeChanges() {
    if (!document.body) return;
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            translateNode(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Ejecutar traducción cuando el DOM esté listo
  function init() {
    translateDocument();
    observeChanges();
    
    // Traducir después de delays para elementos que se cargan dinámicamente
    setTimeout(translateDocument, 500);
    setTimeout(translateDocument, 1000);
    setTimeout(translateDocument, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

