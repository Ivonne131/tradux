/*
	Story by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

function close_dialog() {
	var $modal = $('div.modal.visible');
	
	$modalImg = $modal.find('img');
	
	// Locked? Bail.
	if ($modal[0]._locked) return;
		
	// Already hidden? Bail.
	if (!$modal.hasClass('visible')) return;
	
	// Lock.
	$modal[0]._locked = true;
	
	// Clear visible, loaded.
	$modal.removeClass('loaded')
	
	// Delay.
	setTimeout(function() {
		$modal.removeClass('visible');
		
		setTimeout(function() {
			
			$body = $('body');
			
			// Clear src.
			$modalImg.attr('src', '');
			
			// Unlock.
			$modal[0]._locked = false;
			
			// Focus.
			$body.focus();
		}, 475);
	}, 125);
}

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Browser fixes.

	// IE: Flexbox min-height bug.
		if (browser.name == 'ie')
			(function() {

				var flexboxFixTimeoutId;

				$window.on('resize.flexbox-fix', function() {

					var $x = $('.fullscreen');

					clearTimeout(flexboxFixTimeoutId);

					flexboxFixTimeoutId = setTimeout(function() {

						if ($x.prop('scrollHeight') > $window.height())
							$x.css('height', 'auto');
						else
							$x.css('height', '100vh');

					}, 250);

				}).triggerHandler('resize.flexbox-fix');

			})();

	// Object fit workaround.
		if (!browser.canUse('object-fit'))
			(function() {

				$('.banner .image, .spotlight .image').each(function() {

					var $this = $(this),
						$img = $this.children('img'),
						positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

					// Set image.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-repeat', 'no-repeat')
							.css('background-size', 'cover');

					// Set position.
						switch (positionClass.length > 1 ? positionClass[1] : '') {

							case 'left':
								$this.css('background-position', 'left');
								break;

							case 'right':
								$this.css('background-position', 'right');
								break;

							default:
							case 'center':
								$this.css('background-position', 'center');
								break;

						}

					// Hide original.
						$img.css('opacity', '0');

				});

			})();

	// Smooth scroll.
		$('.smooth-scroll').scrolly();
		$('.smooth-scroll-middle').scrolly({ anchor: 'middle' });

	// Wrapper.
		$wrapper.children()
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			});

	// Items.
		$('.items')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children()
				.wrapInner('<div class="inner"></div>');

	// Gallery.
		$('.gallery')
			.wrapInner('<div class="inner" style="border-radius: 25px;"></div>')
			.prepend(browser.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
			.scrollex({
				top:		'30vh',
				bottom:		'30vh',
				delay:		50,
				initialize:	function() {
					$(this).addClass('is-inactive');
				},
				terminate:	function() {
					$(this).removeClass('is-inactive');
				},
				enter:		function() {
					$(this).removeClass('is-inactive');
				},
				leave:		function() {

					var $this = $(this);

					if ($this.hasClass('onscroll-bidirectional'))
						$this.addClass('is-inactive');

				}
			})
			.children('.inner')
				//.css('overflow', 'hidden')
				.css('overflow-y', browser.mobile ? 'visible' : 'hidden')
				.css('overflow-x', browser.mobile ? 'scroll' : 'hidden')
				.scrollLeft(0);

	// Style #2.
		$('.gallery')
			.on('wheel', '.inner', function(event) {

				var	$this = $(this),
					delta = (event.originalEvent.deltaX * 10);

				// Cap delta.
					if (delta > 0)
						delta = Math.min(25, delta);
					else if (delta < 0)
						delta = Math.max(-25, delta);

				// Scroll.
					$this.scrollLeft( $this.scrollLeft() + delta );

			})
			.on('mouseenter', '.forward, .backward', function(event) {

				var $this = $(this),
					$inner = $this.siblings('.inner'),
					direction = ($this.hasClass('forward') ? 1 : -1);

				// Clear move interval.
					clearInterval(this._gallery_moveIntervalId);

				// Start interval.
					this._gallery_moveIntervalId = setInterval(function() {
						$inner.scrollLeft( $inner.scrollLeft() + (5 * direction) );
					}, 10);

			})
			.on('mouseleave', '.forward, .backward', function(event) {

				// Clear move interval.
					clearInterval(this._gallery_moveIntervalId);

			});

	// Lightbox.
		for (let i = 1; i < 7; i++) {
			$(`#galeria${i}`)
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('img'),
					href = $a.attr('href');

				// Not an image? Bail.
					if (!href.match(/\.(jpg|gif|png|mp4)$/))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Set src.
					$modalImg.attr('src', href);

				// Set visible.
					$modal.addClass('visible');

				// Focus.
					$modal.focus();

				// Delay.
					setTimeout(function() {

						// Unlock.
							$modal[0]._locked = false;

					}, 600);

			})
			.on('keydown', '.modal', function(event) {
				if (event.keyCode == 27)
					close_dialog();
			})
			.prepend(`
			<div class="modal" tabIndex="-1">
				<div class="cerrar_modal" onclick="close_dialog()"></div>
				<div class="card" style="height: 90%; background-color: black; margin-top: -16px; align-items: center; text-align: center; width: 55%;">
					<img src="" style="width: 60%;">
					<p class="text-white" style="font-family: 'Playfair Display', serif; font-size: 40pt; margin: -87px 0 0 0; width: 100%; background-color: rgba(0, 0, 0, 0.6)">Traductor</p>
					<div style="min-height: max-content; width: 100%; overflow-y: auto; background-color: #1a1a1a !important;">
						<div style="font-size: 20pt; box-shadow: 0px 6px 25px 1px rgba(0,0,0,0.75); font-weight: bold;">Califica al traductor</div>
						<ul class="divided" style="margin: 0.5em 0 1.2em 0;">
							<li style="padding: 0; margin: 0;">
								<form>
									<p class="clasificacion" style="margin: 0; font-size: 20pt;">
										<input id="radio${i}1" type="radio" name="estrellas" value="5">
										<label for="radio${i}1">★</label>
										<input id="radio${i}2" type="radio" name="estrellas" value="4">
										<label for="radio${i}2">★</label>
										<input id="radio${i}3" type="radio" name="estrellas" value="3">
										<label for="radio${i}3">★</label>
										<input id="radio${i}4" type="radio" name="estrellas" value="2">
										<label for="radio${i}4">★</label>
										<input id="radio${i}5" type="radio" name="estrellas" value="1">
										<label for="radio${i}5">★</label>
									</p>
								</form>
								<article style="display: flex; line-height: normal;">
									<div style="margin-bottom: auto; padding: 0 8px 0 8px; width: 76px;">
										<i class="fas fa-user-circle" style="font-family: FontAwesome; font-style: normal; font-size: 2.5em;"></i>
									</div>
									<div style="padding: 0 0 0 5px; text-align: left; width: -webkit-fill-available; margin-top: auto; margin-bottom: auto;">
										<textarea placeholder="Agrega un comentario" rows="1"></textarea>
									</div>
									<div style="margin: auto; padding: 0 8px 0 8px; width: 76px; transform: rotate(45deg);">
										<i class="fa fa-location-arrow" style="cursor: pointer; font-size: 1.8em;"></i>
									</div>
								</article>
							</li>
						</ul>
						<div style="font-size: 20pt; box-shadow: 0px 0px 20px 6px rgba(0,0,0,0.75); font-weight: bold;">Comentarios</div>
						<ul class="divided" style="margin: 1rem 0 0 0;">
							<li style="padding: 15px 0 0 0; margin: 0 0 15px 0;">
								<article style="display: flex; line-height: normal;">
									<div style="margin-bottom: auto; padding: 0 8px 0 8px; width: 76px;">
										<i class="fas fa-user-circle" style="font-family: FontAwesome; font-style: normal; font-size: 2.5em;"></i>
									</div>
									<div style="padding: 0 15px 0 5px; text-align: left; width: -webkit-fill-available; margin-top: auto; margin-bottom: auto;">
										<b style="margin: 0; font-size: 14pt; display: block">Sebastián Esparza</b>
										"Estoy muy satisfecho con la traducción, mi tesis tiene una mejor disponibilidad ahora, no dudaré en volver a usar TRADUX"&nbsp;<span class="timestamp">5 minutes ago</span>
									</div>
								</article>
							</li>
							<li style="padding: 15px 0 0 0; margin: 0 0 15px 0;">
								<article style="display: flex; line-height: normal;">
									<div style="margin-bottom: auto; padding: 0 8px 0 8px; width: 76px;">
										<i class="fas fa-user-circle" style="font-family: FontAwesome; font-style: normal; font-size: 2.5em;"></i>
									</div>
									<div style="padding: 0 15px 0 5px; text-align: left; width: -webkit-fill-available; margin-top: auto; margin-bottom: auto;">
										<b style="margin: 0; font-size: 14pt; display: block">Michael Bech</b>
										"Muchas gracias, a pesar de ser un idioma bastante complicado la traducción es super correcta."&nbsp;<span class="timestamp">30 minutes ago</span>
									</div>
								</article>
							</li>
							<li style="padding: 15px 0 0 0; margin: 0 0 15px 0;">
								<article style="display: flex; line-height: normal;">
									<div style="margin-bottom: auto; padding: 0 8px 0 8px; width: 76px;">
										<i class="fas fa-user-circle" style="font-family: FontAwesome; font-style: normal; font-size: 2.5em;"></i>
									</div>
									<div style="padding: 0 15px 0 5px; text-align: left; width: -webkit-fill-available; margin-top: auto; margin-bottom: auto;">
										<b style="margin: 0; font-size: 14pt; display: block">Ivanna Sauri Bruns</b>
										"Ahora mi investigación va poder estar al alcance de más personas interesadas, ¡muchísimas gracias!"&nbsp;<span class="timestamp">3 hours ago</span>
									</div>
								</article>
							</li>
							<li style="padding: 15px 0 0 0; margin: 0 0 15px 0;">
								<article style="display: flex; line-height: normal;">
									<div style="margin-bottom: auto; padding: 0 8px 0 8px; width: 76px;">
										<i class="fas fa-user-circle" style="font-family: FontAwesome; font-style: normal; font-size: 2.5em;"></i>
									</div>
									<div style="padding: 0 15px 0 5px; text-align: left; width: -webkit-fill-available; margin-top: auto; margin-bottom: auto;">
										<b style="margin: 0; font-size: 14pt; display: block">Larissa Barret Labrot</b>
										"Gracias a la herramienta ahora aspiro a aprender idiomas para también brindar una traducción de calidad e incluso compartir en TRADUX con ustedes."&nbsp;<span class="timestamp">5 hours ago</span>
									</div>
								</article>
							</li>
						</ul>
					</div>
				</div>
			</div>`)
			.find('img')
				.on('load', function(event) {

					var $modalImg = $(this),
						$modal = $modalImg.parents('.modal');

					setTimeout(function() {

						// No longer visible? Bail.
							if (!$modal.hasClass('visible'))
								return;

						// Set loaded.
							$modal.addClass('loaded');

					}, 275);

				});
		}
})(jQuery);