const openCart = document.querySelector('.actions__basket');
const productsDOM = document.querySelector('.products__wrapper');
const totalProducts = document.querySelector('.actions__amount');
const basket = document.querySelector('.cart__main');
const totalAmount = document.querySelector('.cart__total');
const clearCart = document.querySelectorAll('.cart__btn-remove ,.cart__btn-send');

let cart = [];
let buttons = [];

class UI {

	renderProducts(obj) {
		let result = '';
		obj.forEach(({ id, title, descTop, descBottom, price, capacity, image }) => {
			result += `
				<div class="swiper-slide products-card products-card__item--${id}">
				<div class="products-card__header">
					<img src="${image}" alt="olive" class="products-card__img">
				</div>
				<div class="products-card__main">
					<h3 class="products-card__title">${title}</h3>
					<div class="products-card__text">
						<p class="products-card__paragraph">${descTop}</p>
						<p class="products-card__paragraph"> ${descBottom}</p>
					</div>
				</div>
				<div class="products-card__actions">
					<div class="products-card__desc">
						<div class="products-card__capacity">${capacity} мл</div>
						<div class="products-card__price">${price} грн</div>
					</div>
					<div class="products-card__forms">
						<button class="products-card__btn btn" type="button" data-id=${id}>В КОРЗИНУ</button>
					</div>
				</div>
			</div>
			`;
		});
		productsDOM.innerHTML = result;
	}
	getButtons() {
		const addToCart = [...document.querySelectorAll('.products-card__btn')];
		buttons = addToCart;

		buttons.forEach(button => {
			const id = button.dataset.id;

			button.addEventListener('click', event => {
				event.preventDefault();
				event.target.disabled = true;
				event.target.innerHTML = "добавлено";
				const cartItem = { ...Storage.getProducts(id), amount: 1 };

				cart = [...cart, cartItem];

				Storage.saveCart(cart);

				this.setItemValues(cart);
				this.addToCart(cartItem);
			})
		})
	}
	setItemValues(cart) {
		let tempTotal = 0;
		let itemTotal = 0;

		cart.map(item => {
			tempTotal += item.price * item.amount;
			itemTotal += item.amount;
		})
		totalProducts.innerText = itemTotal;
		totalAmount.innerText = parseFloat(tempTotal.toFixed(2));
	}

	addToCart({ title, price, capacity, image, id }) {
		if (basket.children.length == 0) {
			basket.textContent = '';
		}

		let div = document.createElement('div');
		div.classList.add('cart-item');
		div.innerHTML = `
				<div class="cart-item__top">
					<h4 class="cart-item__caption">${title}</h4>
					<p class="cart-item__capacity">${capacity} мл</p>
				</div>
				<div class="cart-item__content">
					<div class="cart-item__box">
						<img src="${image}" alt="olive" class="cart-item__img">
					</div>
					<div class="cart-item__quantity">
					   <button type="button" class="cart-item__decrease icon__minus btn" data-id="${id}" ></button>
					   <span cart-item__amount>1</span>
						<button type="button" class="cart-item__increase icon__plus btn" data-id="${id}" ></button>
					</div>
					<div class="cart-item__actions">
						<div class="cart-item__price">${price} грн</div>
						<button class="cart-item__btn btn--close icon__close " data-id="${id}" ></button>
					</div>
				</div>
				`;
		basket.appendChild(div);
	}
	setApp() {
		cart = Storage.checkLocalStorage();
		this.setItemValues(cart);
		this.populate(cart);

	}
	populate(cart) {
		cart.forEach(item => this.addToCart(item));
	}

	cardActions(event) {
		clearCart.forEach(item => {
			item.addEventListener('click', event => {
				console.log("work");
				this.removeAllItems();
			});
		})


		basket.addEventListener('click', event => {
			const target = event.target.closest("button");
			const targetElement = target.classList.contains("cart-item__btn");

			console.log(target);
			console.log('!!!' + targetElement);
			if (!target) return;

			if (targetElement) {
				const id = parseInt(target.dataset.id);
				this.removeItem(id);
				basket.removeChild(target.closest(".cart-item"));
			}
			else if (target.classList.contains("cart-item__increase")) {
				const id = parseInt(target.dataset.id);
				let tempItem = cart.find(item => item.id === id);

				tempItem.amount++;
				Storage.saveCart(cart);
				this.setItemValues(cart);
				target.previousElementSibling.innerText = tempItem.amount;
			}
			else if (target.classList.contains("cart-item__decrease")) {
				const id = parseInt(target.dataset.id);
				let tempItem = cart.find(item => item.id === id);
				tempItem.amount--;

				if (tempItem.amount > 0) {
					Storage.saveCart(cart);
					this.setItemValues(cart);
					target.nextElementSibling.innerText = tempItem.amount;
				} else {
					this.removeItem(id);
					basket.removeChild(target.closest(".cart-item"));
				}
			}

		})
	}
	removeAllItems() {
		const allItems = cart.map(item => item.id);
		allItems.forEach(id => this.removeItem(id));
		while (basket.children.length > 0) {
			basket.removeChild(basket.children[0]);
		};
		basket.textContent = "Ваша корзина пуста!";
	}
	removeItem(id) {
		cart = cart.filter(item => item.id !== id);
		this.setItemValues(cart);
		Storage.saveCart(cart);

		let button = this.validButton(id);
		button.disabled = false;
		button.innerHTML = "в корзину";
	}
	validButton(id) {
		return buttons.find(button => parseInt(button.dataset.id) === id);
	}
}

class Storage {

	static saveProducts(obj) {
		localStorage.setItem("Products", JSON.stringify(obj));
	}
	static saveCart(cart) {
		localStorage.setItem("Cart", JSON.stringify(cart));
	}
	static getProducts(id) {
		const products = JSON.parse(localStorage.getItem("Products"));
		return products.find(item => item.id === parseFloat(id, 10));
	}

	static checkLocalStorage() {
		if (localStorage.getItem("Cart")) {
			return JSON.parse(localStorage.getItem("Cart"))
		} else return [];
	}
}

class Products {

	async getProducts() {
		// try {
		// 	const results = await fetch('../json/products.json');
		// 	const data = await results.json();
		// 	console.log('log');
		// 	console.log(data);
		// 	const products = data.items;
		// 	return products;
		// }
		// catch (error) {
		// 	console.log("От Халепа!Дідько! -  " + error);
		// }
		const products =
			[
				{
					id: 1,
					title: "Масло “Для салата”",
					descTop: "Название говорит само за себя. Это идеальная заправка, которая даже скучной и привычной капусте придаст неповторимый вкус и аромат. ",
					descBottom: "Состав: оливковое масло холодного отжима, розмарин, тимьян, базилик, орегано, чеснок, смесь из 5 перцев.",
					price: 115,
					capacity: 250,
					image: "img/card-bottle-salad.png"
				},
				{
					id: 2,
					title: "Масло “Итальянское”",
					descTop: "Добавит ноток Италии в любое ваше блюдо. Паста, ризотто, пицца, салаты - его везде можно использовать.",
					descBottom: "Состав: оливковое масло холодного отжима, чеснок, вяленые томаты, базилик, орегано, майоран, смесь перцев.",
					price: 115,
					capacity: 250,
					image: "img/card-bottle-italy.png"
				},
				{
					id: 3,
					title: "Масло “Для мяса”",
					descTop: "Идеальное решение для легкого и быстрого маринада мяса, можно добавить капельку масла и после приготовления. ",
					descBottom: "Состав: оливковое масло холодного отжима, чеснок, паприку, кориандр, смесь перцев, розмарин, тимьян, перец чили.",
					price: 115,
					capacity: 250,
					image: "img/card-bottle-meat.png"
				},
				{
					id: 4,
					title: "Масло “Восточное”",
					descTop: "Oтлично подойдёт для блюд среднеазиатской кухни: шурпа, плов, лагман с этим маслом приобретут традиционные нотки Средней Азии.",
					descBottom: "Состав: оливковое масло холодного отжима, перец чили, зира, куркума, чеснок, смесь перцев.",
					price: 115,
					capacity: 250,
					image: "img/card-bottle-east.png"
				}
			];
		return products;
	}
}

document.addEventListener("DOMContentLoaded", async () => {

	const ui = new UI();
	const products = new Products();

	ui.setApp();

	const productsAll = await products.getProducts();

	console.log(productsAll);
	ui.renderProducts(productsAll);
	Storage.saveProducts(productsAll);
	ui.getButtons();
	ui.cardActions();


	let myProducts = new Swiper('.products__cards', {
		touchRatio: 2,
		observer: true,
		observeParents: true,
		watchOverflow: true,

		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		breakpoints: {
			320: {

				spaceBetween: 0,
				slidesPerView: 1,
			},
			480: {
				spaceBetween: 10,
				slidesPerView: 2,
				spaceBetween: 15,
			},
			900: {

				slidesPerView: 3,
				spaceBetween: 20,
			},
			1365.98: {
				spaceBetween: 30,
				slidesPerView: 4,
			}


		}
	});

})
