const CART_KEY = 'ellenLuxeCart';
const SHEET_BEST_URL = 'https://api.sheetbest.com/sheets/7695b621-65c6-4f5e-8b92-7c185bca7526';

const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
const summaryEl = document.getElementById('order-summary');
const totalEl = document.getElementById('checkout-total');

const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

// Render Summary
summaryEl.innerHTML = cart.map(item => `
    <p>${item.name} (${item.length}") x ${item.qty} = $${(item.price * item.qty).toFixed(2)}</p>
`).join('');

totalEl.innerText = `$${total.toFixed(2)}`;

const FORMSPREE_URL = 'https://formspree.io/f/mlgwrnej'; // 

async function submitToSheet(method, paypalId = 'N/A') {
    const email = document.getElementById('email')?.value;
    const fname = document.getElementById('fname')?.value;
    const lname = document.getElementById('lname')?.value;
    const address = document.getElementById('address')?.value;

    if (!email || !fname || !address) {
        alert("Please fill in all shipping details first.");
        return;
    }

    const orderData = {
        date: new Date().toLocaleString(),
        customerName: `${fname} ${lname}`,
        email: email,
        address: address,
        items: cart.map(i => `${i.name} x${i.qty}`).join(', '),
        totalAmount: `$${total.toFixed(2)}`,
        paymentMethod: method,
        paypalId: paypalId
    };

    // --- EXECUTE BOTH TASKS ---
    try {
        // 1. Send to Google Sheets (via Sheet.best)
        const sheetPromise = fetch(SHEET_BEST_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([orderData])
        });

        // 2. Send Email Notification (via Formspree)
        const emailPromise = fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        // Wait for both to finish
        const [sheetResponse, emailResponse] = await Promise.all([sheetPromise, emailPromise]);

        if (sheetResponse.ok || emailResponse.ok) {
            localStorage.removeItem(CART_KEY);
            window.location.href = "success.html";
        } else {
            throw new Error("Both services failed.");
        }

    } catch (err) {
        console.error("Order Error:", err);
        alert("There was a technical issue. Please take a screenshot of your cart and contact us on Instagram!");
    }
}

// --- 2. PAYPAL API INTEGRATION ---
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: { value: total.toFixed(2) }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Submit to Google Sheets AFTER PayPal success
            submitToSheet('PayPal', details.id);
        });
    }
}).render('#paypal-button-container');

// --- 3. PAY ON DELIVERY HANDLER ---
// Add this to your "Confirm Order" button in HTML: onclick="handlePOD()"
window.handlePOD = function() {
    if(confirm("Confirm your order for Pay on Delivery?")) {
        submitToSheet('Pay on Delivery');
    }
};
