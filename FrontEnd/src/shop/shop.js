let $products = $('#products');
let storage = require('../localStorage');
const templates = require('../viewDeliveries/delTemp');
const ProductCart = require('../productCart/Cart');
let productList = []
let API = require('../API')
function initializeProducts() {
    let products;

    API.getProducts([],function (err, data) {
        products = [];
        if (err) {
            console.log(err.toString());
            return;
        } else {
            products = data;
        }
        // console.log('hello from back',products);
        if (products.length === 0) {
            $('#is-empty').css('display', 'block');
        }
        for (let i = 0; i < products.length; i++) {
            productList.push({
                id: products[i].id,
                description: products[i].description,
                date: products[i].date,
                cost: products[i].cost,
                icon: products[i].icon,
            });
        }
        updateShop();
    });
}

$('#buyProducts').click(function (){
    if (ProductCart.getCart().length===0){
        console.log(ProductCart.getCart());
        alert("Cart is empty");
        return;
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear() + 444;
    today = yyyy + '-' + mm + '-' + dd;
    console.log('hello');
    let sum = $("#totalSum").text();
    let delivery = {
        name: storage.get("name"),
        surname: storage.get("surname"),
        phone: storage.get("country-code") + storage.get("phone"),
        destination: storage.get("destination"),
        date: today,
        cost: sum,
        status: "sent",
        description: "Cool math stuff",
        paid: "false",
        payer: "Sender"
    };
    let user = JSON.parse(sessionStorage.getItem('user'));
    let data = {
        delivery: delivery,
        user: user
    }
    API.createDelivery(data, function (error, data) {
        if (error){
            console.log("Wrong in creating delivery from shop products");
        }
    });
    alert('Great! Check deliveries to see your order')

    $('#myModal').css("display","none");
});
let ascPrice = 0;
let ascDescription = 0;
function sortByCostAsc(product1, product2) {
    if (product1.cost < product2.cost) return -1;
    else if (product1.cost === product2.cost) return 0;
    else return 1;
}

function sortByCostDesc(product1, product2) {
    return -sortByCostAsc(product1, product2);
}
function sortByDescriptionAsc(product1, product2) {
    if (product1.description < product2.description) return -1;
    else if (product1.description === product2.description) return 0;
    else return 1;
}

function sortByDescriptionDesc(product1, product2) {
    return -sortByDescriptionAsc(product1, product2);
}
$("#price").on('click',function () {
    if (ascPrice===0){
        productList.sort(sortByCostAsc);
        ascPrice = 1;
    }
    else{
        productList.sort(sortByCostDesc);
        ascPrice = 0;
    }
    updateShop();
})

$("#description").on('click',function () {
    if (ascDescription===0){
        productList.sort(sortByDescriptionAsc);
        ascDescription = 1;
    }
    else{
        productList.sort(sortByDescriptionDesc);
        ascDescription = 0;
    }
    updateShop();
})

function updateShop () {
    $products.html("");
    function showOneProduct(product){
        let html_code =templates.shopIitem({product:product});
        let $node = $(html_code);

        $node.find('.addProductToCart').click(function () {
            ProductCart.addToCart(product);
        });
        $products.append($node);
        }

    productList.forEach(showOneProduct);
}

if (window.location.href !=='http://localhost:3989/shop.html'){
    $('#basket').css('display','none');
    $('#cart-len').css('display','none');

}
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
let $modal = $('#myModal');
// When the user clicks on the button, open the modal
$('#basket').click(function () {
   $modal.css('display','block');
   ProductCart.showProductInCart();
});
$('#cart-len').click(function () {
    $modal.css('display','block');
    ProductCart.showProductInCart();
});

// When the user clicks on <span> (x), close the modal
if (span) {
    span.onclick = function () {
        $modal.css('display', 'none');
    }
}

exports.initializeProducts = initializeProducts;
exports.updateShop = updateShop;