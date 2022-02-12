const menu = ['Для салата', 'Итальянское', 'Для мяса', 'Восточное'];

new Swiper('.slider', {
	centeredSlides: true,
	slidesPerView: 1,
	observer: true,
	observeParents: true,
	watchOverflow: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	hashNavigation: {
		watchState: true,
	},

	pagination: {
		el: '.swiper-pagination',
		clickable: true,
		renderBullet: function (index, className) {
			return '<span class="' + className + ' ">' + (menu[index]) + '</span>'
		}
	},

});

new Swiper('.reviews__items', {
	slidesPerView: 3,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	breakpoints: {
		320: {
			spaceBetween: 0,
			slidesPerView: 1,
		},
		768: {
			spaceBetween: 10,
			slidesPerView: 2,

		},
		900: {
			slidesPerView: 3,
		}


	}
});
