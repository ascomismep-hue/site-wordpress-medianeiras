<?php get_header(); ?>
<main class="container" style="padding: 40px 0;">
    <h2><?php the_title(); ?></h2>
    <?php if (have_posts()) : while (have_posts()) : the_post(); the_content(); endwhile; endif; ?>
</main>
<?php get_footer(); ?>