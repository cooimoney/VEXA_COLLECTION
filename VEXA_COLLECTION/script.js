/* =========================================================
   VEXA CLOTHING STORE
   COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. GET HTML ELEMENTS
   ========================================================= */

const productContainer =
    document.getElementById("products");

const searchInput =
    document.getElementById("searchInput");

const sortProducts =
    document.getElementById("sortProducts");

const cartCount =
    document.getElementById("cartCount");



/* =========================================================
   2. CART DATA
   ========================================================= */

/*
   Get the cart from the browser.

   If there is no saved cart,
   create an empty array.
*/

let cart =
    JSON.parse(
        localStorage.getItem("vexaCart")
    ) || [];



/* =========================================================
   3. WISHLIST DATA
   ========================================================= */

let wishlist =
    JSON.parse(
        localStorage.getItem("vexaWishlist")
    ) || [];



/* =========================================================
   4. GET ALL 40 PRODUCTS FROM HTML
   ========================================================= */

const productCards =
    document.querySelectorAll(".product");


/*
   Convert the HTML product cards
   into JavaScript product objects.
*/

const products =
    Array.from(productCards).map(
        (card, index) => {

            const image =
                card.querySelector(
                    ".product-image img"
                );


            return {

                id: index + 1,

                name:
                    card.dataset.name,

                price:
                    Number(
                        card.dataset.price
                    ),

                category:
                    card.dataset.category,

                image:
                    image
                        ? image.getAttribute("src")
                        : "",

                description:
                    card.querySelector(
                        ".product-info p"
                    )?.textContent ||
                    "Premium VEXA fashion."

            };

        }
    );



/* =========================================================
   5. CHECK PRODUCT COUNT
   ========================================================= */

console.log(
    "VEXA Products:",
    products.length
);



/* =========================================================
   6. ADD TO CART BUTTONS
   ========================================================= */

productCards.forEach(
    (card, index) => {

        const button =
            card.querySelector(
                ".add-to-cart"
            );


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            function(event) {

                /*
                   Prevent the click from
                   opening product details.
                */

                event.stopPropagation();


                addToCart(
                    products[index]
                );

            }
        );

    }
);



/* =========================================================
   7. ADD PRODUCT TO CART
   ========================================================= */

function addToCart(product) {

    /*
       Check whether the product
       already exists in the cart.
    */

    const existingProduct =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    }

    else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            category: product.category,

            quantity: 1

        });

    }


    saveCart();

    updateCart();


    showToast(
        product.name +
        " added to cart"
    );

}



/* =========================================================
   8. SAVE CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "vexaCart",
        JSON.stringify(cart)
    );

}



/* =========================================================
   9. UPDATE CART COUNT
   ========================================================= */

function updateCart() {

    if (!cartCount) {
        return;
    }


    const totalItems =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;


    renderCart();

}



/* =========================================================
   10. RENDER CART
   ========================================================= */

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (!cartItems) {
        return;
    }


    /*
       If cart is empty.
    */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                Your VEXA cart is empty.

            </div>

        `;


        if (cartTotal) {

            cartTotal.textContent =
                "₦0";

        }


        return;

    }



    /*
       Create cart items.
    */

    cartItems.innerHTML =
        cart.map(
            (item, index) => `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >


                    <div>

                        <h4>
                            ${item.name}
                        </h4>


                        <p>
                            ₦${item.price.toLocaleString()}
                        </p>


                        <p>
                            Quantity:
                            ${item.quantity}
                        </p>


                        <div class="cart-controls">

                            <button
                                onclick="
                                    decreaseQuantity(${index})
                                "
                            >
                                −
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                onclick="
                                    increaseQuantity(${index})
                                "
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        onclick="
                            removeFromCart(${index})
                        "
                    >
                        ×
                    </button>

                </div>

            `
        ).join("");



    /*
       Calculate total.
    */

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    if (cartTotal) {

        cartTotal.textContent =
            "₦" +
            total.toLocaleString();

    }

}



/* =========================================================
   11. INCREASE QUANTITY
   ========================================================= */

function increaseQuantity(index) {

    cart[index].quantity += 1;

    saveCart();

    updateCart();

}



/* =========================================================
   12. DECREASE QUANTITY
   ========================================================= */

function decreaseQuantity(index) {

    if (
        cart[index].quantity >
        1
    ) {

        cart[index].quantity -= 1;

    }

    else {

        cart.splice(
            index,
            1
        );

    }


    saveCart();

    updateCart();

}



/* =========================================================
   13. REMOVE FROM CART
   ========================================================= */

function removeFromCart(index) {

    const product =
        cart[index];


    cart.splice(
        index,
        1
    );


    saveCart();

    updateCart();


    if (product) {

        showToast(
            product.name +
            " removed from cart"
        );

    }

}



/* =========================================================
   14. OPEN CART
   ========================================================= */

function openCart() {

    const cartDrawer =
        document.getElementById(
            "cartDrawer"
        );


    if (!cartDrawer) {
        return;
    }


    renderCart();

    cartDrawer.classList.add(
        "open"
    );

}



/* =========================================================
   15. CLOSE CART
   ========================================================= */

function closeCart() {

    const cartDrawer =
        document.getElementById(
            "cartDrawer"
        );


    if (!cartDrawer) {
        return;
    }


    cartDrawer.classList.remove(
        "open"
    );

}



/* =========================================================
   16. CONNECT CART ICON
   ========================================================= */

document
    .querySelectorAll(
        ".header-icons button"
    )
    .forEach(
        button => {

            const text =
                button.textContent
                    .toLowerCase();


            if (
                text.includes("cart")
            ) {

                button.addEventListener(
                    "click",
                    openCart
                );

            }

        }
    );



/* =========================================================
   17. SEARCH PRODUCTS
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );

}



function searchProducts() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    productCards.forEach(
        card => {

            const name =
                (
                    card.dataset.name ||
                    ""
                ).toLowerCase();


            const category =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            if (
                name.includes(search) ||
                category.includes(search)
            ) {

                card.style.display =
                    "";

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );

}



/* =========================================================
   18. CATEGORY FILTER
   ========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filters button"
    );


filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                const category =
                    this.textContent
                        .toLowerCase()
                        .trim();


                filterByCategory(
                    category
                );

            }
        );

    }
);



function filterByCategory(
    category
) {

    /*
       Clear search.
    */

    if (searchInput) {

        searchInput.value =
            "";

    }


    productCards.forEach(
        card => {

            const productCategory =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            /*
               ALL products.
            */

            if (
                category === "all"
            ) {

                card.style.display =
                    "";

                return;

            }


            /*
               Convert category
               button text to
               data-category format.
            */

            let formattedCategory =
                category
                    .replace(
                        " & ",
                        "-"
                    )
                    .replace(
                        " ",
                        "-"
                    );


            /*
               Special category names.
            */

            if (
                category ===
                "jeans & trousers"
            ) {

                formattedCategory =
                    "jeans-trousers";

            }


            if (
                category ===
                "graphic tanks"
            ) {

                formattedCategory =
                    "graphic-tanks";

            }


            if (
                productCategory ===
                formattedCategory
            ) {

                card.style.display =
                    "";

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );

}



/* =========================================================
   19. SORT PRODUCTS
   ========================================================= */

if (sortProducts) {

    sortProducts.addEventListener(
        "change",
        sortProductCards
    );

}



function sortProductCards() {

    const value =
        sortProducts.value;


    const cards =
        Array.from(
            productContainer
                .querySelectorAll(
                    ".product"
                )
        );


    /*
       Lowest price first.
    */

    if (
        value === "low"
    ) {

        cards.sort(
            (a, b) =>
                Number(
                    a.dataset.price
                ) -
                Number(
                    b.dataset.price
                )
        );

    }


    /*
       Highest price first.
    */

    else if (
        value === "high"
    ) {

        cards.sort(
            (a, b) =>
                Number(
                    b.dataset.price
                ) -
                Number(
                    a.dataset.price
                )
        );

    }


    /*
       Alphabetical order.
    */

    else if (
        value === "az"
    ) {

        cards.sort(
            (a, b) =>
                a.dataset.name
                    .localeCompare(
                        b.dataset.name
                    )
        );

    }


    /*
       Put sorted cards
       back into the grid.
    */

    cards.forEach(
        card =>
            productContainer
                .appendChild(card)
    );

}



/* =========================================================
   20. WISHLIST BUTTONS
   ========================================================= */

const wishlistButtons =
    document.querySelectorAll(
        ".wishlist"
    );


wishlistButtons.forEach(
    (button, index) => {

        const product =
            products[index];


        /*
           Show saved wishlist
           status.
        */

        if (
            wishlist.includes(
                product.id
            )
        ) {

            button.classList.add(
                "liked"
            );

            button.textContent =
                "♥";

        }


        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                toggleWishlist(
                    product,
                    button
                );

            }
        );

    }
);



function toggleWishlist(
    product,
    button
) {

    const position =
        wishlist.indexOf(
            product.id
        );


    /*
       Remove from wishlist.
    */

    if (
        position !== -1
    ) {

        wishlist.splice(
            position,
            1
        );


        button.classList.remove(
            "liked"
        );

        button.textContent =
            "♡";


        showToast(
            "Removed from wishlist"
        );

    }


    /*
       Add to wishlist.
    */

    else {

        wishlist.push(
            product.id
        );


        button.classList.add(
            "liked"
        );

        button.textContent =
            "♥";


        showToast(
            "Added to wishlist"
        );

    }


    localStorage.setItem(
        "vexaWishlist",
        JSON.stringify(
            wishlist
        )
    );

}



/* =========================================================
   21. PRODUCT DETAILS
   ========================================================= */

productCards.forEach(
    (card, index) => {

        const image =
            card.querySelector(
                ".product-image img"
            );


        if (!image) {
            return;
        }


        image.style.cursor =
            "pointer";


        image.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                openProductDetails(
                    products[index]
                );

            }
        );

    }
);



function openProductDetails(
    product
) {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) {

        console.log(
            "Product modal not found."
        );

        return;

    }


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    const modalName =
        document.getElementById(
            "modalName"
        );


    const modalPrice =
        document.getElementById(
            "modalPrice"
        );


    const modalCategory =
        document.getElementById(
            "modalCategory"
        );


    if (modalImage) {

        modalImage.src =
            product.image;

        modalImage.alt =
            product.name;

    }


    if (modalName) {

        modalName.textContent =
            product.name;

    }


    if (modalPrice) {

        modalPrice.textContent =
            "₦" +
            product.price
                .toLocaleString();

    }


    if (modalCategory) {

        modalCategory.textContent =
            product.category
                .replaceAll(
                    "-",
                    " "
                )
                .toUpperCase();

    }


    modal.dataset.productId =
        product.id;


    modal.classList.add(
        "open"
    );

}



/* =========================================================
   22. CLOSE PRODUCT DETAILS
   ========================================================= */

function closeProduct() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove(
            "open"
        );

    }

}



/* =========================================================
   23. CLOSE PRODUCT MODAL
       WHEN CLICKING OUTSIDE
   ========================================================= */

const productModal =
    document.getElementById(
        "productModal"
    );


if (productModal) {

    productModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                productModal
            ) {

                closeProduct();

            }

        }
    );

}



/* =========================================================
   24. MOBILE NAVIGATION
   ========================================================= */

const navigation =
    document.getElementById(
        "navigation"
    );


const menuButton =
    document.querySelector(
        ".menu-button"
    );


if (menuButton) {

    menuButton.addEventListener(
        "click",
        function() {

            navigation.classList.toggle(
                "show"
            );

        }
    );

}



/* =========================================================
   25. CLOSE MOBILE MENU
       AFTER CLICKING LINK
   ========================================================= */

if (navigation) {

    navigation
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    function() {

                        navigation
                            .classList
                            .remove(
                                "show"
                            );

                    }
                );

            }
        );

}



/* =========================================================
   26. ACCOUNT
   ========================================================= */

const accountButtons =
    document.querySelectorAll(
        ".header-icons button"
    );


accountButtons.forEach(
    button => {

        const text =
            button.textContent
                .toLowerCase();


        if (
            text.includes("account")
        ) {

            button.addEventListener(
                "click",
                openAccount
            );

        }

    }
);



function openAccount() {

    const accountModal =
        document.getElementById(
            "accountModal"
        );


    if (accountModal) {

        accountModal.classList.add(
            "open"
        );

    }

}



/* =========================================================
   27. CLOSE ACCOUNT
   ========================================================= */

function closeAccount() {

    const accountModal =
        document.getElementById(
            "accountModal"
        );


    if (accountModal) {

        accountModal.classList.remove(
            "open"
        );

    }

}



/* =========================================================
   28. DEMO ACCOUNT LOGIN
   ========================================================= */

function demoLogin() {

    const email =
        document.getElementById(
            "accountEmail"
        );


    const password =
        document.getElementById(
            "accountPassword"
        );


    if (
        !email ||
        !password
    ) {

        return;

    }


    if (
        email.value.trim() === "" ||
        password.value.trim() === ""
    ) {

        alert(
            "Please enter your email and password."
        );

        return;

    }


    localStorage.setItem(
        "vexaUser",
        JSON.stringify({
            email:
                email.value.trim()
        })
    );


    closeAccount();


    showToast(
        "Welcome back to VEXA"
    );

}



/* =========================================================
   29. CHECKOUT
   ========================================================= */

function openCheckout() {

    if (
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    closeCart();


    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    const checkoutSummary =
        document.getElementById(
            "checkoutSummary"
        );


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (
                    item.price *
                    item.quantity
                ),
            0
        );


    if (checkoutSummary) {

        checkoutSummary.textContent =
            "Order total: ₦" +
            total.toLocaleString();

    }


    if (checkoutModal) {

        checkoutModal.classList.add(
            "open"
        );

    }

}



/* =========================================================
   30. CLOSE CHECKOUT
   ========================================================= */

function closeCheckout() {

    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    if (checkoutModal) {

        checkoutModal.classList.remove(
            "open"
        );

    }

}



/* =========================================================
   31. PAYMENT START
   ========================================================= */

function startPayment() {

    const name =
        document.getElementById(
            "checkoutName"
        );


    const email =
        document.getElementById(
            "checkoutEmail"
        );


    const address =
        document.getElementById(
            "checkoutAddress"
        );


    if (
        !name ||
        !email ||
        !address
    ) {

        return;

    }


    if (
        name.value.trim() === "" ||
        email.value.trim() === "" ||
        address.value.trim() === ""
    ) {

        alert(
            "Please complete your delivery details."
        );

        return;

    }


    /*
       At this stage this is
       only the frontend checkout.

       A real payment provider
       will be connected through
       the backend later.
    */

    alert(
        "Order details received. " +
        "Real card payment will be connected in the payment integration stage."
    );


    closeCheckout();

}



/* =========================================================
   32. TOAST MESSAGE
   ========================================================= */

function showToast(message) {

    let toast =
        document.getElementById(
            "toast"
        );


    /*
       Create toast if it
       doesn't already exist.
    */

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.vexaToastTimer
    );


    window.vexaToastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2000
        );

}



/* =========================================================
   33. CLOSE CART BY CLICKING OUTSIDE
   ========================================================= */

const cartDrawer =
    document.getElementById(
        "cartDrawer"
    );


if (cartDrawer) {

    cartDrawer.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                cartDrawer
            ) {

                closeCart();

            }

        }
    );

}



/* =========================================================
   34. CLOSE ACCOUNT BY CLICKING OUTSIDE
   ========================================================= */

const accountModal =
    document.getElementById(
        "accountModal"
    );


if (accountModal) {

    accountModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                accountModal
            ) {

                closeAccount();

            }

        }
    );

}



/* =========================================================
   35. INITIALIZE VEXA STORE
   ========================================================= */

updateCart();


console.log(
    "================================="
);

console.log(
    "VEXA STORE READY"
);

console.log(
    "Products connected:",
    products.length
);

console.log(
    "Cart items:",
    cart.length
);

console.log(
    "Wishlist items:",
    wishlist.length
);

console.log(
    "================================="
);