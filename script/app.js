// ****** SELECT ITEMS **********
const groceryForm = document.querySelector('[data-grocery-form]');
const groceryInput = document.querySelector('[data-input-grocery]');
const addBtn = document.querySelector('[data-add-btn]');
const groceryList = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('[data-clear-btn]');

const section = document.querySelector('[data-section]');

// edit option
let editElement;
let editing = false;
let editID = '';
// ****** EVENT LISTENERS **********
//window on load saved items in localStorage
window.addEventListener('load', setItems);

groceryForm.addEventListener('submit', addItem);

//clearBtn
clearBtn.addEventListener('click', clearItems);

// ****** FUNCTIONS **********
function addItem(e) {
		e.preventDefault();
		const value = groceryInput.value;
		const id = new Date().getTime().toString();

		//conditions
		if (value && !editing) {
			
			//add Items
			createListItems(id, value);
						
   	//show success message
			displayMessage('success', 'Item added to list');	
			
  		clearBtn.classList.add('added');
    
    //set back to default
				setBackToDefault();
    
    //add To local storage
			addToLocalStorage(id,value);
			
		} else if (value && editing) {
				editElement.textContent = value;
				displayMessage('success', 'Item Edited');
				editLocalStorage(editID, value);
				setBackToDefault();
		} else {
				displayMessage('danger', 'Can\'t add the empty value');
		}
}

//delete item
function deleteItem(e) {
		const element = e.currentTarget.closest('.item-container');
		const id = element.dataset.id;

	 groceryList.removeChild(element);
		displayMessage('danger', 'Item Removed');
		if (groceryList.children.length === 0) {
				clearBtn.classList.remove('added');
		}
		
		setBackToDefault();
		removeFromLocalStorage(id);
}

//edit Item 
function editItem(e) {
		const element = e.currentTarget.closest('.item-container');
		const id = element.dataset.id;
		editElement = e.currentTarget.parentElement.previousElementSibling;

	 groceryInput.value = editElement.innerHTML;
	 addBtn.textContent = 'EDIT';
	 editing = true;
	 editID = element.dataset.id;
}

//display message alert/success
function displayMessage(value, message) {
		const messageElem = document.querySelector('[data-action-message]');
		messageElem.textContent = message;
		messageElem.classList.add(value);
		setTimeout(function() {
				messageElem.classList.remove(value);
		}, 700);
}

//Set back to default
function setBackToDefault() {
		groceryInput.value = '';
 		editing = false;
	 editID = '';
	 addBtn.textContent = 'Add Item'; 
}

//clearitems
function clearItems() {
		const items = document.querySelectorAll('.item-container');
		items.forEach(item => {
			if (items.length > 0) groceryList.removeChild(item);
		});
		displayMessage('danger', 'Items Removed');
		clearBtn.classList.remove('added');
		localStorage.clear('list');
		setBackToDefault();
}

// ****** LOCAL STORAGE **********
//add to local storage
function addToLocalStorage(id, value) {
		const grocery = {id,value};
		const items = getLocalStorage();
		items.push(grocery);
		localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage(id) {
		let items = getLocalStorage();
		items.forEach(item => {
				if (item.id !== id) {
						return item;
				}
		localStorage.removeItem(id);
		});
		localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value) {
		let items = getLocalStorage();
		items.forEach(item => {
				if (item.id === id) {
						item.value = value;
				}
				return item;
		});
		localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
		return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}
// ****** SETUP ITEMS **********
function setItems() {
		const items = getLocalStorage();
		if (items.length > 0) {
				items.forEach(item => {
						createListItems(item.id, item.value);
				})
		clearBtn.classList.add('added');
		}
}

function createListItems(id, value) {
		const itemContainer = document.createElement('div');
		itemContainer.classList.add('item-container');
		let attr = document.createAttribute('data-id');
		attr.value = id;
		itemContainer.setAttributeNode(attr);
		
		 itemContainer.insertAdjacentHTML('beforeend', `<p>${value}</p>
    						<div class="buttons">
    								<button data-edit-btn type="button" class="edit-btn">
              		 <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button data-trash-btn type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
          	 </div>`);
              
   	groceryList.appendChild(itemContainer);
   	
   	//action buttons
   	const trashBtn = itemContainer.querySelector('[data-trash-btn]');
   	trashBtn.addEventListener('click', deleteItem);
			
			//edit btn
		 	const editBtn = itemContainer.querySelector('[data-edit-btn]');
			editBtn.addEventListener('click', editItem);

}