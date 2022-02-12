const spoilerBtn = document.querySelectorAll('.questions__caption');
spoilerBtn.forEach(item => {
	item.addEventListener('click', spolierHandler);
})

function spolierHandler(event) {
	event.preventDefault();

	const spoilerBody = this.nextElementSibling;

	checkCurrentSpoiler(this);

	this.classList.toggle('questions__caption--active');
	console.log('work?');

	if (this.classList.contains('questions__caption--active')) {
		spoilerBody.style.maxHeight = spoilerBody.scrollHeight + 'px';

	} else {
		spoilerBody.style.maxHeight = 0;
	}

}

function checkCurrentSpoiler(spoiler) {
	const current = document.querySelector('.questions__caption--active');

	if (current && current !== spoiler) {
		current.classList.remove('questions__caption--active');
		current.nextElementSibling.style.maxHeight = 0;
	}
}

