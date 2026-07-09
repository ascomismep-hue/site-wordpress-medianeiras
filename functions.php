<?php
/**
 * Tema Medianeiras da Paz - Funções estruturais
 */

if ( ! function_exists( 'medianeiras_setup' ) ) :
    function medianeiras_setup() {
        // Adiciona suporte a títulos automáticos
        add_theme_support( 'title-tag' );
        
        // Adiciona suporte a imagens destacadas
        add_theme_support( 'post-thumbnails' );
    }
endif;
add_action( 'after_setup_theme', 'medianeiras_setup' );

if ( ! function_exists( 'medianeiras_scripts' ) ) :
    function medianeiras_scripts() {
        // Carrega o arquivo CSS principal do tema
        wp_enqueue_style( 'medianeiras-style', get_stylesheet_uri(), array(), '1.0.0' );
    }
endif;
add_action( 'wp_enqueue_scripts', 'medianeiras_scripts' );
