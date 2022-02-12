const header = document.querySelector('.header');
const navLinks = document.querySelectorAll('.menu__link ,.footer-nav__link , .footer__logo , .logo,.logo__img');


function headeHendler(entries, observer) {
	if (entries[0].isIntersecting) {
		header.classList.remove('scroll');

	} else {
		header.classList.add('scroll');
	}
}

const headerObserver = new IntersectionObserver(headeHendler, { threshold: 1 });
headerObserver.observe(header);

// ***********************************************************************
function sectionHendler(enties) {
	enties.forEach(entry => {
		if (entry.isIntersecting) {

			navLinks.forEach(link => {
				const linkAttribute = `${link.getAttribute('data-section').replace('.', '')}`;

				if (entry.target.classList.contains(linkAttribute)) {
					link.classList.add('active');
				} else {
					link.classList.remove('active');
				}
			})
		}
	})
}
const observerOfSections = new IntersectionObserver(sectionHendler, { threshold: 0.7 });

const section = document.querySelectorAll('section').forEach(section => {
	observerOfSections.observe(section);
});

// ***********************************************************************

navLinks.forEach(item => {
	item.addEventListener('click', navToSection)
})

function navToSection(event) {
	event.preventDefault();
	const menuLink = event.target;
	const goToSection = document.querySelector(menuLink.dataset.section);

	const goToSectionValue = goToSection.getBoundingClientRect().top + pageYOffset - header.offsetHeight;

	if (iconMenu.classList.contains('active')) {
		document.body.classList.remove('lock');
		iconMenu.classList.remove("active");
		menuBody.classList.remove("active");
	}

	window.scrollTo({
		top: goToSectionValue,
		behavior: "smooth"
	})
}


