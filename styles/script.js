const menu= document.getElementById("menu")
const cartbtn= document.getElementById("cart-btn")
const cartmodal= document.getElementById("cart-modal")
const cartitemscontainer= document.getElementById("cart-items")
const carttotal= document.getElementById("cart-total")
const checkoutbtn= document.getElementById("checkout-btn")
const closemodalbtn= document.getElementById("close-modal-btn")
const cartcounter= document.getElementById("cart-count")
const addressinput= document.getElementById("address")
const addresswarn= document.getElementById("address-warn")

let cart= [];

// Abrir modal do carrinho ao clicar 
cartbtn.addEventListener("click", function(){
    updatecartmodal();
    cartmodal.style.display = "flex"
})
//Fechar o modal quando o cursor estiver fora
cartmodal.addEventListener("click", function(event){
    if(event.target=== cartmodal)
    cartmodal.style.display = "none"
})
closemodalbtn.addEventListener("click",function(){
    cartmodal.style.display = "none"
})
menu.addEventListener("click", function(event){
//    console.log(event.target)
let parentbutton= event.target.closest(".add-to-cart-btn")
if (parentbutton){
    const name= parentbutton.getAttribute("data-name")
    const price= parseFloat(parentbutton.getAttribute("data-price"))
    addtocart(name, price)
}
})
//Função para adicionar no carrinho
function addtocart(name, price){
    const existingitem= cart.find(item=>item.name=== name)
    if(existingitem){
        //Se o item já existe, aumenta apenas a quantidade + 1
        existingitem.quantity+=1;
    }else {
        cart.push({
            name,
            price,
            quantity:1,
    
        })
    }
    

    updatecartmodal()

}
// Atualiza o carrinho
function updatecartmodal(){
cartitemscontainer.innerHTML= "";
let total= 0;

cart.forEach(item=>{
    const cartitemelement= document.createElement("div");
    cartitemelement.classList.add("flex", "justify-between", "mb-4", "flex-col")
    
    cartitemelement.innerHTML= `
    <div class="flex items-center justify-between">
    <div>
    <p class="font-medium">${item.name}</p>
    <p>Qtd: ${item.quantity}</p>
    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
    </div>

    <div>
    <button class="remove-from-cart-btn" data-name="${item.name}">
    Remover
    </button>
    </div>
    </div>
    
    `

    total+= item.price * item.quantity

    cartitemscontainer.appendChild(cartitemelement)

})

carttotal.textContent= total.toLocaleString("pt-br",{
    style: "currency",
    currency: "BRL"
});

cartcounter.innerHTML= cart.length;

}
// Função para remover o item do carrinho
cartitemscontainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name= event.target.getAttribute("data-name")
        removeitemcart(name)
    };
})
function removeitemcart(name){
    const index =cart.findIndex(item=>item.name=== name);
    if(index !== -1){
        const item = cart[index];
    if(item.quantity >1){
        item.quantity -=1;
        updatecartmodal();
        return;
    }
    cart.splice(index,1);
    updatecartmodal();
}
}
addressinput.addEventListener("input", function(event){
    let inputvalue= event.target.value;
    if(inputvalue !== ""){
        addressinput.classList.remove("border-red-500")
        addresswarn.classList.add("hidden")
    }
})
//Finalizar pedido
checkoutbtn.addEventListener("click", function(){
    const isopen= checkrestaurantopen();
    if(!isopen){
        Toastify({
            text: "Ops o Restaurante Está Fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }
    if(cart.length=== 0) return;
    if(addressinput.value=== ""){
        addresswarn.classList.remove("hidden")
        addressinput.classList.add("border-red-500")
        return;
    }
//Enviar pedido api whatsapp
const cartitems= cart.map((item) =>{
    return(
        ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
    )
}).join("")

const message= encodeURIComponent(cartitems);
const phone= "11932117794"

window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressinput.value}`, "_black")

cart= [];
updatecartmodal();

    
})
//Verificar a hora e manipular o card horario
function checkrestaurantopen(){
    const data= new Date();
    const hora= data.getHours();
    return hora >= 18 && hora < 22; //true

}
const spanitem= document.getElementById("date-span")
const isopen= checkrestaurantopen();
if(isopen){
    spanitem.classList.remove("bg-red-500")
    spanitem.classList.add("bg-green-500")
}else {
    spanitem.classList.remove("bg-green-500")
    spanitem.classList.add("bg-red-500")
}