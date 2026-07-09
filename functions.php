<?php
/**
 * Tema Medianeiras da Paz - Funções estruturais
 */

function medianeiras_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'medianeiras_setup' );

function medianeiras_assets() {
    // Carrega o arquivo style.css na hora exata exigida pelo WordPress
    wp_enqueue_style( 'medianeiras-style', get_stylesheet_uri(), array(), '1.0.0' );
}
// É este gancho abaixo que impede o erro de "chamada incorretamente"
add_action( 'wp_enqueue_scripts', 'medianeiras_assets' );
