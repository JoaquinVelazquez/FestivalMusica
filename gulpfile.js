//NodeJS tiene dos claves, una es require que sirve para importar las dependencias. La otra es exports, que sirve para hacer disponible nuestro codigo de forma externa (mandar a llamar funciones, por ej.)

//EJECUTAR ESTE CODIGO PARA HABILITAR LA POLITICA DE EJECUCIÓN:
//Set-ExecutionPolicy -Scope LocalMachine unrestricted

/*
//Tareas de gulp (funciones de JavaScript)
const { series, parallel } = require('gulp');

function css(done) {
    console.log("Compilando SASS...");

    done();
}
function javascript(done) {
    console.log('compilando JavaScript')

    done();
}
function minificarHTML(done) {
    console.log('Minificando...');

    done();
}
exports.css = css;
exports.javascript = javascript;
//default para solo poner gulp en la terminal y ejecutar esta funcion 
exports.default = series(css, javascript, minificarHTML);
*/

//Cuando un paquete tiene multiples funciones, se colocan llaves para especificar que funcion queremos. Cuando un paquete solo tiene una funcion, no se necesitan llaves.
const { series, src, dest, watch, parallel } = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');
//
//Utilidades CSS
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
//
//Utilidades JS
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const paths = {
    imagenes: 'src/img/**/*',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js'
}

function css() {
    return src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss( [autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./build/css'))
        .pipe(notify ({message: 'SASS compilado con éxito!'}));
}

function minificarCss() {
    return src(paths.scss)
        .pipe(sass({
            //expanded para formatear el codigo de la forma comun, compressed para minificar el archivo css para que sea mas ligero
            outputStyle: 'compressed'
        }))
        .pipe(dest('./build/css'))
}

function javascript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({suffix: '.min'}))
        .pipe(dest('./build/js'))
        .pipe(notify ({message: 'JavaScript compilado con éxito!'}));
}

function imagenes() {
    return src(paths.imagenes)
    .pipe(imagemin())
    .pipe(dest('./build/img'))
    .pipe( notify({message: 'Imagen Minificada'}));
}

function versionWebp() {
    return src(paths.imagenes)
    .pipe(webp())
    .pipe(dest('./build/img'))
    .pipe(notify ({message: 'Version WebP lista!'}));
}

function watchArchivos() {
    //* para escuchar los cambios de todos los archivos con esa extension
    watch(paths.scss, css); //* = la carpeta actual | **/*para todos los archivos en todas las carpetas
    watch(paths.js, javascript);
}

exports.css = css;
exports.minificarCss = minificarCss;
exports.imagenes = imagenes;
exports.watchArchivos = watchArchivos;

exports.default = series(css, javascript, imagenes, versionWebp, watchArchivos);