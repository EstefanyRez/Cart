//Selectors
const cards = document.getElementById('cards'); 
const items = document.getElementById('items');
const footer = document.getElementById('footer');

//Templates
const templateCard = document.getElementById('template-card').content; 
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;

//Fragment
const fragment = document.createDocumentFragment(); 

//Empty object
let cart = {}; 

//DOMContentLoaded
document.addEventListener('DOMContentLoaded', () =>{ 
	fetchData(); 

	if (localStorage.getItem('cart')){
		cart = JSON.parse(localStorage.getItem('cart'));
		drawCart();
	}
});

//If you click inside div.cards then execute addCart function
cards.addEventListener('click', e =>{
	addCart(e);
});

items.addEventListener('click', e =>{
	btnAction(e);
})

//Fetching data
const fetchData = async() =>{
	try{ 
		const res = await fetch('api.json'); 
		const data = await res.json();
		console.log(data)
		//Once the data have been fetched execute this function 
		drawCards(data); 
	} catch (error){ 
		console.log(error); 
	}
}

//Function to create the cards
drawCards = data =>{ 
	//Execute a function for each element inside the array (those elements are objects)
	data.forEach(product =>{
		templateCard.querySelector('h5').textContent = product.title;
		templateCard.querySelector('p').textContent = product.precio;
		templateCard.querySelector('img').setAttribute('src', product.thumbnailUrl);
		templateCard.querySelector('.btn-dark').dataset.id = product.id //Set this id to btn-dark

		const clone = templateCard.cloneNode(true); 
		fragment.appendChild(clone); 
	});

	cards.appendChild(fragment);
}

//addCart function states that if an elemnt with the btn-dark class is clicked then execute the setCart function
const addCart = e =>{ 
	if (e.target.classList.contains('btn-dark')){ 
		setCart(e.target.parentElement) 
	}
	e.stopPropagation();
}

//setCart function creates an object 
const setCart = object =>{ 
	const product = { 
		id: object.querySelector('.btn-dark').dataset.id, 
		title: object.querySelector('h5').textContent,
		price: object.querySelector('p').textContent,
		cuantity: 1 
	}

	//If there's already a property product.id then add 1 to product.cuantity
	if(cart.hasOwnProperty(product.id)){ 
		product.cuantity = cart[product.id].cuantity + 1;
	}
	cart[product.id] = {...product}; 
	drawCart()
}

const drawCart = () =>{ //IN THIS FUNCTION WE ARE GOING TO ADD DYNAMICALLY THE ELEMENTS WE ADDED INTO THE CART WHEN THE BUTTON IS CLICKED
	// console.log(cart);
	items.innerHTML = ''; //WITHOUT THIS THE PRODUCT WOULD APPEAR IN THE TABLE AS MANY TIMES AS CLICK THE BUTTON TO ADD IT TO THE CART BUT MODIFYING THE CUANTITY EACH TIME. THIS EMPTY innerHTML "REMOVES" THESE PRODUCTS THAT SHOULDNT'T APPEAR IN THE TABLE. WHAT IT REALLY DOES IS THAT THIS EMPTIES TH CAR JUST LEAVING THE LAST CLICK LEFT
	Object.values(cart).forEach(product =>{ //Objects.value METHOD RETURNS AN ARRAY OF A GIVEN OBJECT'S OWN ENUMERABLE PROPERTY VALUES, IN THE SAME ORDER AS THAT PROVIDED BY A FOR IN LOOP HENCE WE CAN USE forEach()
		templateCarrito.querySelector('th').textContent = product.id;
		templateCarrito.querySelectorAll('td')[0].textContent = product.title;
		templateCarrito.querySelectorAll('td')[1].textContent = product.cuantity;
		templateCarrito.querySelector('.btn-info').dataset.id = product.id;
		templateCarrito.querySelector('.btn-danger').dataset.id = product.id;
		templateCarrito.querySelector('span').textContent = product.cuantity * product.price;

		const clone = templateCarrito.cloneNode(true);
		fragment.appendChild(clone);
	});
	items.appendChild(fragment);

	drawFooter();

	localStorage.setItem('cart', JSON.stringify(cart));
}

//TO DRAW THE FOOTER WITH THE MESSAGE "VACIAR CARRITO" OR EMPTY CART EVERYTIME WE HAVE PRODUCTS INSIDE OUR CART BUT ALSO TO MAKE IT DISAPPEAR AGAIN EVERYTIME THE COSTUMER EMPTIES THE CART WITHOUT NECESSARILY PRESSING THE BUTTON "VACIAR CARRITO" AND DRAW BACK AGAIN THE MASSAGE "CARRITO VACIO" OR EMPTY CART
const drawFooter = () =>{
	footer.innerHTML = '';
	if (Object.values(cart).length === 0){ //IF THE LENGHT (CUANTITY OF ELEMENTS) INSIDE THE CART IS 0 
		footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>` //THEN DISPLAY THIS AS IT WAS IN THE BEGGINNING
		return
	}
	const nCuantity = Object.values(cart).reduce((acc, {cuantity}) => acc + cuantity, 0); //
	const nPrice = Object.values(cart).reduce((acc, {cuantity, price}) => acc + (cuantity * price), 0);

	templateFooter.querySelectorAll('td')[0].textContent = nCuantity;
	templateFooter.querySelector('span').textContent = nPrice;

	const clone = templateFooter.cloneNode(true);
	fragment.appendChild(clone);
	footer.appendChild(fragment);

	const btnEmpty = document.getElementById('vaciar-carrito');
	btnEmpty.addEventListener('click', () =>{
		cart = {};
		drawCart()
	})
}

const btnAction = e =>{
	//Increase
	if (e.target.classList.contains('btn-info')){
		const product = cart[e.target.dataset.id];
		product.cuantity++;
		cart[e.target.dataset.id] = {...product};
		drawCart()
	}

	if (e.target.classList.contains('btn-danger')){
		const product = cart[e.target.dataset.id];
		product.cuantity--;
		if (product.cuantity === 0){
			delete cart[e.target.dataset.id]
		}
		drawCart()
	}

	e.stopPropagation();
}

