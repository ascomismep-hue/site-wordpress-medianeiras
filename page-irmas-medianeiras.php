<?php
/**
 * Template Name: Página Irmãs Medianeiras
 */
get_header(); ?>

<main class="container page-content" style="padding: 50px 0;">
    
    <section class="apresentacao-irmas" style="text-align: center; margin-bottom: 50px;">
        <h1 class="titulo-pagina-irmas">Conheça nossas Irmãs</h1>
        <p style="font-size: 16px; color: #666; max-width: 600px; margin: 15px auto 0 auto; line-height: 1.6;">
            Conheça as vidas dedicadas à oração, à mediação da paz e ao serviço ao próximo que compõem a nossa congregação.
        </p>
    </section>

    <div class="grid-irmas">
        <?php
        // BUSCA AUTOMÁTICA: Puxa todas as irmãs cadastradas no painel
        $query_irmas = new WP_Query( array(
            'post_type'      => 'irmas',
            'posts_per_page' => -1, // -1 significa trazer todas sem limite
            'order'          => 'ASC'
        ) );
        
        if ( $query_irmas->have_posts() ) :
            while ( $query_irmas->have_posts() ) : $query_irmas->the_post(); 
                
                // Pegamos o texto que você vai digitar no painel e separamos por linhas
                $linhas = explode("\n", get_the_excerpt());
                
                // Organiza os dados para a tabela de forma limpa
                $nascimento = isset($linhas[0]) ? trim($linhas[0]) : 'Não informado';
                $primeiros  = isset($linhas[1]) ? trim($linhas[1]) : 'Não informado';
                $perpetuos  = isset($linhas[2]) ? trim($linhas[2]) : 'Não informado';
            ?>
                
                <article class="card-irma">
                    <div class="irma-foto-wrapper">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail('thumbnail'); ?>
                        <?php else : ?>
                            <div class="irma-foto-placeholder"><span>🕊️</span></div>
                        <?php endif; ?>
                    </div>
                    <div class="irma-dados">
                        <h3><?php the_title(); ?></h3>
                        <table class="tabela-dados-irma">
                            <tr>
                                <td><strong>Nome Completo:</strong></td>
                                <td><?php the_content(); // O texto completo será o Nome Real ?></td>
                            </tr>
                            <tr>
                                <td><strong>Local de Nascimento:</strong></td>
                                <td><?php echo $nascimento; ?></td>
                            </tr>
                            <tr>
                                <td><strong>Primeiros Votos:</strong></td>
                                <td><?php echo $primeiros; ?></td>
                            </tr>
                            <tr>
                                <td><strong>Votos Perpétuos:</strong></td>
                                <td><?php echo $perpetuos; ?></td>
                            </tr>
                        </table>
                    </div>
                </article>

            <?php 
            endwhile; 
            wp_reset_postdata();
        else : ?>
            <p style="grid-column: 1/-1; text-align: center; color: #777;">Nenhuma irmã cadastrada ainda no painel.</p>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>