<?php get_header(); ?>

<main>
    <!-- 1. BANNER PRINCIPAL (HERO) -->
    <section class="hero-section" style="background: linear-gradient(135deg, var(--cor-primaria-azul), #05537d); color: #fff; padding: 90px 0; text-align: center;">
        <div class="container">
            <h1 style="font-size: 38px; margin-bottom: 15px; font-weight: 700;">Instituto Social das Irmãs Medianeiras da Paz</h1>
            <p style="font-size: 18px; max-width: 800px; margin: 0 auto 25px auto; opacity: 0.9;">
                Promovendo a paz, a assistência social e a humanização na saúde no Sertão do Araripe e em todo o Nordeste.
            </p>
            <a href="#quem-somos" class="btn-principal" style="background-color: var(--cor-secundaria-vermelho); color: #fff; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Conheça Nossa História</a>
        </div>
    </section>

    <!-- 2. QUEM SOMOS & MISSÃO -->
    <section id="quem-somos" class="container" style="padding: 60px 0;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; align-items: center;">
            <div>
                <h2 class="titulo-secao" style="font-size: 28px; margin-bottom: 20px; color: var(--cor-primaria-azul); border-left: 5px solid var(--cor-detalhe-dourado); padding-left: 15px;">Quem Somos</h2>
                <p style="font-size: 16px; line-height: 1.8; color: #444; margin-bottom: 15px;">
                    A Congregação das Irmãs Medianeiras da Paz (ISIMP) nasceu sob a égide da caridade, da justiça e da busca incessante pela paz social. Com forte atuação na Província Eclesiástica e em parceria com redes de saúde e assistência, a instituição tornou-se referência na gestão de unidades hospitalares e projetos socioeducativos.
                </p>
                <p style="font-size: 16px; line-height: 1.8; color: #444;">
                    Guiadas pelo acolhimento humano e cristão, as Irmãs Medianeiras coordenam serviços essenciais de saúde, garantindo um atendimento digno e focado no bem-estar das comunidades vulneráveis do interior do Nordeste.
                </p>
            </div>
            <div style="background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 4px solid var(--cor-detalhe-dourado);">
                <h3 style="font-size: 20px; margin-bottom: 15px; color: #1a1a1a;">Nosso Carisma</h3>
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 12px; font-size: 15px; color: #555;">🕊️ <strong>Mediação da Paz:</strong> Ser instrumento de reconciliação e harmonia social.</li>
                    <li style="margin-bottom: 12px; font-size: 15px; color: #555;">🏥 <strong>Humanização do Cuidado:</strong> Dedicação integral à saúde física e espiritual do próximo.</li>
                    <li style="margin-bottom: 12px; font-size: 15px; color: #555;">🎒 <strong>Promoção Humana:</strong> Apoio socioeducacional a crianças, jovens e famílias.</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- 3. LINHA DO TEMPO INSTITUCIONAL -->
    <section style="background-color: #fff; padding: 60px 0;">
        <div class="container">
            <h2 class="titulo-secao" style="font-size: 28px; text-align: center; margin-bottom: 50px; color: #1a1a1a; border-left: none; padding-left: 0;">Nossa Trajetória Histórica</h2>
            
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">1968</div>
                    <div class="timeline-content">
                        <h3>Fundação da Congregação</h3>
                        <p>Início das missões pastorais e acolhimento comunitário pelas Irmãs Fundadoras, fincando as raízes do carisma da paz.</p>
                    </div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">1985</div>
                    <div class="timeline-content">
                        <h3>Expansão de Obras Sociais</h3>
                        <p>Implantação de creches, centros profissionalizantes e amparo a famílias em situação de vulnerabilidade extrema.</p>
                    </div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">2002</div>
                    <div class="timeline-content">
                        <h3>Gestão e Humanização Hospitalar</h3>
                        <p>A congregação assume a liderança e suporte administrativo de hospitais regionais e maternidades, tornando-se um braço forte do SUS e da filantropia hospitalar.</p>
                    </div>
                </div>

                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-date">Presente</div>
                    <div class="timeline-content">
                        <h3>Consolidação no Sertão do Araripe</h3>
                        <p>Reconhecida amplamente pela excelência na gestão em saúde pública, transparência em editais de recrutamento e forte impacto social na região.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 4. SEÇÃO DINÂMICA DE NOTÍCIAS E EDITAIS (ESTILO IMIP) -->
    <section class="container" style="padding: 60px 0;">
        <h2 class="titulo-secao" style="font-size: 28px; margin-bottom: 30px; color: #1a1a1a; border-left: 5px solid var(--cor-primaria-azul); padding-left: 15px;">Últimas Notícias e Processos Seletivos</h2>
        
        <div class="grid-noticias">
            <?php
            // Puxa os 3 últimos posts cadastrados no painel administrativo
            $query_portal = new WP_Query( array( 'posts_per_page' => 3 ) );
            
            if ( $query_portal->have_posts() ) :
                while ( $query_portal->have_posts() ) : $query_portal->the_post(); ?>
                    <article class="card-noticia">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <div class="noticia-imagem"><?php the_post_thumbnail('medium'); ?></div>
                        <?php else: ?>
                            <div class="noticia-imagem" style="background: #e5e5e5; height: 180px; display: flex; align-items: center; justify-content: center; color: #aaa;">
                                <span>Sem imagem cadastrada</span>
                            </div>
                        <?php endif; ?>
                        <div class="noticia-corpo">
                            <span class="noticia-data">📅 <?php echo get_the_date(); ?></span>
                            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <p><?php echo wp_trim_words( get_the_excerpt(), 18, '...' ); ?></p>
                        </div>
                    </article>
                <?php endwhile; wp_reset_postdata();
            else : ?>
                <div style="grid-column: 1 / -1; background: #fff; padding: 30px; text-align: center; border-radius: 6px; border: 1px solid var(--cor-borda);">
                    <p style="color: #777;">Nenhum edital ou comunicado publicado no momento. Use o painel administrativo para adicionar novas postagens.</p>
                </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>