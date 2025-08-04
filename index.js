import { menuArray,orders } from "./data.js";
const recieptContainer = document.querySelector('.reciept');
const formContainer = document.querySelector('.form-container');

renderMenu();
document.addEventListener('click', (e) => {
    if (e.target.dataset.add) {
        handleAddItemToCart(e.target.dataset.add)
    }
    else if (e.target.dataset.remove) {
        handleRemoveItemFromCart(e.target.dataset.remove)
    }
    else if (e.target.id === 'place-order-btn') {
        formContainer.classList.add('display');
          
    }
    else if (e.target.id === 'pay-btn') {
        e.preventDefault()
        handleFormData()
    }
     
})
function handleFormData() {
    const customerData = new FormData(formContainer);
    const customerName = customerData.get('fullName')
    const customerCardNum = customerData.get('card')
    const customerCVV = customerData.get('cvv');
    formContainer.classList.remove('display')
    recieptContainer.classList.remove('display')
    const postOrderMsg = document.querySelector('.thankYou-msg')
    postOrderMsg.innerHTML = `<p>Thanks ${customerName}! your order is on its way</p>`;
    postOrderMsg.classList.add('display');
    setTimeout(() => {
       postOrderMsg.classList.remove('display') 
    },2000)
    
    
}




function handleRemoveItemFromCart(orderId) {
    const indexToRemove = orders.findIndex(item => item.id == orderId)
    if (orders.length === 1) {
        orders.splice(indexToRemove, 1)
        recieptContainer.classList.remove('display')
        
    }
    else {
        orders.splice(indexToRemove, 1)
         renderReciept(orders)
    }
 
}


function renderReciept(orders) {
    if (orders.length > 0) {
        let totalPrice = 0;
    let recieptHtml=`<h3>Your Order</h3>`
     recieptHtml += orders.map((order) => {
        totalPrice += Number(order.price)*order.quantity;
        return  `
        <div class="bill-item-details">
            <p class="item-name">${order.name} : ${order.quantity}</p>
            <p class="remove" data-remove='${order.orderId}'>remove</p>
            <p class="price">$${order.price}</p>
            </div> `
    }).join('')
    recieptHtml+=`<div class="border-bottom"></div>
                    <div class="TotalPrice bill-item-details">
                        <h3 class="total "item-name">Total Price :</h3>
                        <p class="price">$${totalPrice}</p>
                    </div>
                    <button class="place-order" id='place-order-btn'>Complete Order</button>`
  
    recieptContainer.innerHTML =recieptHtml
    recieptContainer.classList.add('display');
    }
    
}



function handleAddItemToCart(itemId) {
    const itemObj = menuArray.find(item => item.id == itemId)
    const existedorder=orders.find(order=>itemObj.name===order.name)
    if (existedorder) {
        existedorder.quantity++;
        if (existedorder.name === 'Pizza' && existedorder.quantity > 1) {
            orders.push({
                name: 'hamburger',
                price: 0,
                quantity:1
            })
           
     }
        
    }
    else {
         if (itemObj.name === 'Beer') {
                itemObj.price=itemObj.price-(itemObj.price*0.15)
            }
        orders.push({
        name: `${itemObj.name}`,
        price: `${itemObj.price}`,
        orderId: `${itemObj.id}`,
        quantity:1
    });
    }
    console.log(orders)
     renderReciept(orders);
    

}





function renderMenu() {
    const mainContainer = document.querySelector('.main-content');
const menuHtml = menuArray.map((menu) => {
    const ingredientsString = menu.ingredients.join(' , ')
     return `<section class="item-container">
                <div class="item-img-icon">${menu.emoji}</div>
                    <div class="item-details">
                        <h2>${menu.name}</h2>
                        <p>${ingredientsString}</p>
                        <h3>$${menu.price}</h3>
                    </div>
                    <button data-add=${menu.id}>+</button>
                </section>`
})
mainContainer.innerHTML = menuHtml;
}
