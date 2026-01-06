const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'html/index.html',
  'html/login.html',
  'html/registro.html',
  'html/contactanos.html',
  'html/normativa.html',
  'html/perfil.html',
  'html/denuncias.html',
  'html/crear_denuncia.html'
];

// Lista de imágenes en assets/ (no en images/)
const rootImages = ['anonimo.svg', 'identificado.svg'];

// Lista de imágenes en assets/images/
const imagesFolder = ['CuscoReporta.png', 'traffic_hero.png', 'MTC.png'];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Primero, corregir imágenes en assets/images/
    imagesFolder.forEach(img => {
      const regex = new RegExp(`src=["']([^"']*${img.replace('.', '\\.')})["']`, 'g');
      content = content.replace(regex, `src="../assets/images/${img}"`);
    });
    
    // Luego, corregir imágenes directamente en assets/
    rootImages.forEach(img => {
      const regex = new RegExp(`src=["']([^"']*${img.replace('.', '\\.')})["']`, 'g');
      content = content.replace(regex, `src="../assets/${img}"`);
    });
    
    // Corrección genérica para cualquier imagen en assets/images/
    content = content.replace(
      /src=["']([^"']*)(CuscoReporta|traffic_hero|MTC)\.(png|jpg|jpeg|svg)["']/gi,
      'src="../assets/images/$2.$3"'
    );
    
    // Corrección genérica para SVG en assets/
    content = content.replace(
      /src=["']([^"']*)(anonimo|identificado)\.svg["']/gi,
      'src="../assets/$2.svg"'
    );
    
    // Corrección para background images
    content = content.replace(
      /background(-image)?:\s*url\(['"]?([^'")]*\/)?(CuscoReporta|traffic_hero|MTC)\.(png|jpg|jpeg)['"]?\)/gi,
      'background$1: url("../assets/images/$3.$4")'
    );
    
    content = content.replace(
      /background(-image)?:\s*url\(['"]?([^'")]*\/)?(anonimo|identificado)\.svg['"]?\)/gi,
      'background$1: url("../assets/$3.svg")'
    );
    
    fs.writeFileSync(file, content);
    console.log(`✓ Corregido: ${file}`);
  }
});
