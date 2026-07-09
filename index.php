<?php
/**
 * Tema Medianeiras da Paz - Arquivo Principal (Index)
 */
get_header();
?>

<!-- BLOCO DE DIAGNÓSTICO VISÍVEL -->
<div style="background: #fff; padding: 40px 0; text-align: center; border-bottom: 3px solid #ff0000;">
    <div class="container">
        <h1 style="color: #000fa0; font-size: 2.5rem; margin-bottom: 10px; font-weight: 800;">
            O Tema das Medianeiras Está Ativo!
        </h1>
        <p style="color: #64748b; font-size: 1.1rem;">
            Se você está vendo esta faixa, o WordPress encontrou os arquivos do tema com sucesso.
        </p>
    </div>
</div>

<main id="primary" class="site-main" style="padding: 60px 0;">
    <div class="container">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                // Renderiza o conteúdo que foi digitado dentro do painel do WordPress
                the_content();
            endwhile;
        else :
            // Mensagem de segurança caso a página selecionada esteja sem texto nenhum dentro do painel
            echo '<p style="text-align:center; color:#64748b;">Nenhum conteúdo cadastrado para esta página ainda.</p>';
        endif;
        ?>
    </div>
</main>

<?php
get_footer();
