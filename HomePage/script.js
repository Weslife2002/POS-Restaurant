// header
window.onload = function(){
    var delayInMilliseconds = 500; //1 second
    setTimeout(function() {
    //your code to be executed after 1 second
    window.scrollTo({
        top: 450,
        behavior: 'smooth'
    });
    }, delayInMilliseconds);
}
// products

/////                    GRID ITEMS                      ///// 
//  init

let total_price = 0;
let cart_numbers = 0;
let products_dict = {};

let products = document.querySelectorAll('.product-top');
let products_name = document.querySelectorAll('.product-name');
let products_price = document.querySelectorAll('.product-price');

for(let i=0 ; i< products_name.length; i++){
    // find all product and add to products_dict for later use
    let price = parseFloat(products_price[i].innerHTML.substring(1));
    let products_name_innerHTML = products_name[i].innerHTML
    products_dict[products_name_innerHTML] = {
        name : products_name_innerHTML,
        price : price,
        quantity : 0
    }

    // Update HTML content corresponding to local storage when loading page
    if(localStorage.getItem(products_name_innerHTML)){
        products_dict[products_name_innerHTML].quantity = JSON.parse(localStorage.getItem(products_name_innerHTML)).quantity;
        total_price += products_dict[products_name_innerHTML].price * products_dict[products_name_innerHTML].quantity;
        if(products_dict[products_name_innerHTML].quantity > 0){
            cart_numbers++;
        }
    }
}

// payment button handle
var payment_buttton = document.querySelector("#payment-btn")
var modal_container = document.querySelector(".modal-container")
var continue_button = document.querySelector("#continue-btn")
payment_buttton.addEventListener('click', () => {
    var invoice_list = document.getElementsByClassName("invoice-list")[0];
    if(invoice_list.innerHTML){
        modal_container.classList.add('show');
    }
})
continue_button.addEventListener('click', () => {
    modal_container.classList.remove('show');
    for(let i=0 ; i< products_name.length; i++){
        let products_name_innerHTML = products_name[i].innerHTML;
        if(localStorage.getItem(products_name_innerHTML)){
            products_dict[products_name_innerHTML].quantity = 0;
            localStorage.setItem(products_name_innerHTML, JSON.stringify(products_dict[products_name_innerHTML]));
        }
    }
    cart_numbers = 0;
    update_total_price();
    update_cart();           
    update_cart_numbers();
    display_cart();
})


update_total_price();           // update total price accroding to products_dict
update_cart_numbers();          // Update YOUR CART () according to cart_numbers
update_cart();                  // Get products quantity from local storage and store it into dict

function update_cart(){
    let new_dict = {}
    for(let i=0; i<products_name.length; i++){
        if(localStorage.getItem(products_name[i].innerHTML)){
            new_dict[products_name[i].innerHTML] = JSON.parse(localStorage.getItem(products_name[i].innerHTML));
        }
    }
    localStorage.setItem("cart", JSON.stringify(new_dict))
}
function update_total_price(){
    let total = document.querySelector('#total');
    let new_total_price = 0;
    for(let i =0 ; i < products_name.length;i++){
        new_total_price += products_dict[products_name[i].innerHTML].quantity * products_dict[products_name[i].innerHTML].price; 
    }
    total_price = new_total_price;
    localStorage.setItem(total, total_price);
    total.innerHTML = "$"+Number((total_price).toFixed(2));
}
function update_cart_numbers(){
    let your_cart = document.querySelector('#your-cart');
    your_cart.innerHTML = "Your Cart ("+ cart_numbers +")";
}

//  listen
for(let i=0 ; i<products.length; i++){
    products[i].addEventListener('click', () => {
        cartNumbers(products_name[i].innerHTML);
    })
}

//  add product to cart, update cart_numbers and total price
function cartNumbers(a){
    if(products_dict[a].quantity == 0){
        cart_numbers ++;
    }
    products_dict[a].quantity++;
    localStorage.setItem(products_dict[a].name, JSON.stringify(products_dict[a]));
    total_price += products_dict[a].price;
    update_total_price();
    update_cart_numbers();
    update_cart();
    display_cart();
}

function display_cart(){
    let cart_dict = JSON.parse(localStorage.getItem("cart"));
    let cart_container = document.querySelector(".invoice-list");
    cart_container.innerHTML = '';
    let count = 0;
    Object.values(cart_dict).map(item =>{
        if(item.quantity){
            count++;
            cart_container.innerHTML +=`
            <div class="choosed-item-container">
                <div class="choosed-item">
                    <img src="./images/${item.name}.png" alt="">
                    <div class="product-detail">
                        <h3 class = "this-product-name">${count}. ${item.name}</h3>
                        <div class="product-quantity-adjust">
                            <ion-icon class="decrease-quantity" name="chevron-back-outline"></ion-icon>
                            <h2 class="this-product-quantity">${item.quantity}</h2>
                            <ion-icon class="increase-quantity" name="chevron-forward-outline"></ion-icon>
                        </div>
                    </div>
                    <h3>$${item.price}</h3>
                    <div class="product-price"></div>
                    <ion-icon class="remove-btn" name="trash-outline"></ion-icon>
                </div>
            </div>
            `;    
        }
    });
    var remove_btn = document.querySelectorAll(".remove-btn");
    for( var i =0 ; i< remove_btn.length; i++){
        remove_btn[i].addEventListener('click', function(event){
    var target = event.target.parentElement.parentElement;
    var update_taget = target.getElementsByClassName("choosed-item")[0].getElementsByClassName("product-detail")[0].getElementsByClassName("this-product-name")[0];
    var this_product_name = update_taget.innerHTML;
    this_product_name = this_product_name.split(".")[1].substring(1);
    products_dict[this_product_name].quantity = 0;
    localStorage.setItem(products_dict[this_product_name].name, JSON.stringify(products_dict[this_product_name]));
    cart_numbers--;
    update_cart();
    update_cart_numbers();
    update_total_price();
    display_cart();
})
    }
    var decrease_btn = document.querySelectorAll(".decrease-quantity");
    for( var i =0 ; i< decrease_btn.length; i++){
        decrease_btn[i].addEventListener('click', function(event){
            var target = event.target.parentElement.getElementsByClassName("this-product-quantity")[0];
            if(target.innerHTML == "1"){
                remove(event);
            }
            else{
                var this_product_name = event.target.parentElement.parentElement.getElementsByClassName("this-product-name")[0].innerHTML;
                this_product_name = this_product_name.split(".")[1].substring(1);
                products_dict[this_product_name].quantity -= 1;
                target.innerHTML = products_dict[this_product_name].quantity
                localStorage.setItem(products_dict[this_product_name].name, JSON.stringify(products_dict[this_product_name]));
                update_cart();
                update_total_price();
            }
        })
    }
    var increase_btn = document.querySelectorAll(".increase-quantity");
    for( var i =0 ; i< decrease_btn.length; i++){
        increase_btn[i].addEventListener('click', function(event){
            var target = event.target.parentElement.getElementsByClassName("this-product-quantity")[0];
            var this_product_name = event.target.parentElement.parentElement.getElementsByClassName("this-product-name")[0].innerHTML;
            this_product_name = this_product_name.split(".")[1].substring(1);
            products_dict[this_product_name].quantity += 1;
            target.innerHTML = products_dict[this_product_name].quantity
            localStorage.setItem(products_dict[this_product_name].name, JSON.stringify(products_dict[this_product_name]));
            update_cart();
            update_total_price();
        })
    }
}
function remove(event){
    var target = event.target.parentElement.parentElement.parentElement.parentElement;
    var update_taget = target.getElementsByClassName("choosed-item")[0].getElementsByClassName("product-detail")[0].getElementsByClassName("this-product-name")[0];
    var this_product_name = update_taget.innerHTML;
    this_product_name = this_product_name.split(".")[1].substring(1);
    products_dict[this_product_name].quantity = 0;
    localStorage.setItem(products_dict[this_product_name].name, JSON.stringify(products_dict[this_product_name]));
    cart_numbers--;
    update_cart();
    update_cart_numbers();
    update_total_price();
    display_cart();
}
display_cart();
