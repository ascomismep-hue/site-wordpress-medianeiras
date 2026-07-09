<?php
/**
 * Funções e definições do tema site-congregacao (Estilo Portal Dinâmico)
 */

function congregacao_setup_avancado() {
    // Carrega o CSS
    wp_enqueue_style( 'congregacao-estilo', get_stylesheet_uri(), array(), '1.3' );
    
    // Ativa Imagens Destacadas (Thumbnails) para as notícias
    add_theme_support( 'post-thumbnails' );
    
    // Ativa o suporte de Logomarca Customizada
    add_theme_support( 'custom-logo', array(
        'height'      => 100,
        'width'       => 250,
        'flex-width'  => true,
        'flex-height' => true,
    ) );

    // Registra o Menu de Navegação Superior
    register_nav_menus( array(
        'menu-principal' => 'Menu Principal Superior',
    ) );
}
add_action( 'after_setup_theme', 'congregacao_setup_avancado' );


// AUTOMATIZAÇÃO DE PÁGINAS ESTRUTURAIS
function configurar_paginas_automaticas() {
    // 1. Configuração da Página Inicial
    $slug_home = 'inicio';
    $pagina_home_existe = get_page_by_path($slug_home);

    if ( ! $pagina_home_existe ) {
        $id_home = wp_insert_post( array(
            'post_type'    => 'page',
            'post_title'   => 'Início',
            'post_name'    => $slug_home,
            'post_status'  => 'publish',
        ) );
        if ( $id_home && ! is_wp_error( $id_home ) ) {
            update_option( 'show_on_front', 'page' );
            update_option( 'page_on_front', $id_home );
        }
    } else {
        $id_home_existente = $pagina_home_existe->ID;
        if ( get_option( 'page_on_front' ) != $id_home_existente ) {
            update_option( 'show_on_front', 'page' );
            update_option( 'page_on_front', $id_home_existente );
        }
    }

    // 2. Configuração da Página "Irmãs Medianeiras"
    $slug_irmas = 'irmas-medianeiras';
    $pagina_irmas_existe = get_page_by_path($slug_irmas);

    if ( ! $pagina_irmas_existe ) {
        wp_insert_post( array(
            'post_type'    => 'page',
            'post_title'   => 'Irmãs Medianeiras',
            'post_name'    => $slug_irmas,
            'post_status'  => 'publish',
            // Associamos o arquivo de modelo que vamos criar abaixo (page-irmas-medianeiras.php)
            'page_template' => 'page-irmas-medianeiras.php'
        ) );
    }
}
add_action( 'init', 'configurar_paginas_automaticas' );


// 3. CRIAR O MENU "IRMÃS" NO PAINEL DO WORDPRESS (CUSTOM POST TYPE)
function registrar_custom_post_irmas() {
    $labels = array(
        'name'               => 'Irmãs',
        'singular_name'      => 'Irmã',
        'menu_name'          => 'Irmãs',
        'add_new'            => 'Adicionar Nova',
        'add_new_item'       => 'Adicionar Nova Irmã',
        'edit_item'          => 'Editar Irmã',
        'new_item'           => 'Nova Irmã',
        'view_item'          => 'Ver Irmã',
        'search_items'       => 'Buscar Irmãs',
        'not_found'          => 'Nenhuma irmã encontrada',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'menu_icon'          => 'dashicons-heart', // Ícone de coração no painel
        'supports'           => array( 'title', 'editor', 'thumbnail' ), // Título, resumo e foto
        'has_archive'        => false,
    );

    register_post_type( 'irmas', $args );
}
add_action( 'init', 'registrar_custom_post_irmas' );