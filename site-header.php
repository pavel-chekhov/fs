<?php
/**
 * Displays the site header.
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_One
 * @since Twenty Twenty-One 1.0
 */

$wrapper_classes  = 'site-header';
$wrapper_classes .= has_custom_logo() ? ' has-logo' : '';
$wrapper_classes .= ( true === get_theme_mod( 'display_title_and_tagline', true ) ) ? ' has-title-and-tagline' : '';
$wrapper_classes .= has_nav_menu( 'primary' ) ? ' has-menu' : '';
?>

<header id="masthead" class="<?php echo esc_attr( $wrapper_classes ); ?>">
	<div class="menu-container"> 
		<?php get_template_part( 'template-parts/header/site-branding' ); ?>
		<?php get_template_part( 'template-parts/header/site-nav' ); ?>
	</div>
	<h1 class="motto">
		Affordable and quality<br>built&nbsp;fences<span style="text-transform: none; display:block;"> </span>
		<!--<span>from&nbsp;$55 per&nbsp;linear&nbsp;ft.</span>-->
	</h1>	
	<h3 class="tagline">
		<span style="display:block; padding: 1em 0 0 0;">Residential and commercial fencing across Niagara, Hamilton, Toronto and GTA.</span>
		<br>
		<br>
		<br>
	</h3>
<!-- 	<p class="motto" style="text-transform: lowercase; padding: 1em 0;">
		from&nbsp;$55 per&nbsp;linear&nbsp;ft.
	</p> -->
	<!--<div class="">
		<a class="get-quote" href="#fence-calculator">
			Fence Calculator
		</a>
	</div>-->
<style>
  .sale-sticker {
    position: relative;
    display: inline-block;
	margin: 3em 0;
    padding: 10px 20px;
    background-color: #ff6347; /* ярко-красный цвет */
    color: white;
    font-size: 1.15em;
    font-weight: bold;
    text-transform: none;
	text-align: center;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: rotate(-10deg); /* наклон */
  }

  .sale-sticker::before {
    content: "";
    position: absolute;
    top: 43%;
    left: -9px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 10px 0;
    border-color: transparent #ff6347 transparent transparent;
  }

  .sale-sticker::after {
    content: "";
    position: absolute;
    top: 43%;
    right: -9px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent #ff6347;
  }
</style>
	
<!-- 	<p class="sale-sticker">
		Prices <span style="font-size: 1.2em;">2024</span> still&nbsp;available.<br><span style="font-size: 1.2em;">Call&nbsp;now!</span>
	</p> -->
	
	<p class="sale-sticker">
		Save up to <span style="font-size: 1.2em;">$1,000</span> &ndash; Spring&nbsp;Offer<br>Call&nbsp;now!
	</p>

	
</header><!-- #masthead -->
