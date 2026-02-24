// إعداد الصفقة
let dealEnd = new Date("2026-12-31 23:59:59").getTime();
let minDeal = 100;
let maxDeal = 500;

// مشتريات المستخدمين
let current = localStorage.getItem("deal_qty") || 120;
current = parseInt(current);
document.getElementById("current")?.innerText = current;

// صفقات البائع
let sellerDeals = JSON.parse(localStorage.getItem("sellerDeals")) || [
  { name: "كرتون ماء", price: 40, bought: 120, max: 500, img:"assets/images/placeholder.png"},
  { name: "رز 10 كيلو", price: 120, bought: 300, max: 800, img:"assets/images/placeholder.png"}
];

function renderDeals(){
  const grid = document.querySelector(".deals-grid");
  if(!grid) return;
  grid.innerHTML = "";
  sellerDeals.forEach(deal=>{
    const card = document.createElement("div");
    card.classList.add("deal-card");
    card.innerHTML = `
      <img src="${deal.img}">
      <h3>${deal.name}</h3>
      <p class="price">${deal.price} ريال</p>
      <p>تم شراء ${deal.bought} / ${deal.max}</p>
      <progress value="${deal.bought}" max="${deal.max}"></progress>
      <a href="deal.html" class="btn">انضم للصفقة</a>
    `;
    grid.appendChild(card);
  });
}
renderDeals();

// تحديث شريط التقدم
function updateProgress(){
  let bar = document.getElementById("progress-bar");
  if(bar) bar.style.width = (current/maxDeal*100)+"%";
}
updateProgress();

// عداد الوقت
setInterval(()=>{
  let now = new Date().getTime();
  let diff = dealEnd - now;
  if(diff<0){ document.getElementById("countdown")?.innerHTML="❌ انتهت الصفقة"; return; }
  let d=Math.floor(diff/(1000*60*60*24));
  let h=Math.floor((diff/(1000*60*60))%24);
  let m=Math.floor((diff/(1000*60))%60);
  let s=Math.floor((diff/1000)%60);
  document.getElementById("countdown")?.innerHTML=`${d}ي ${h}:${m}:${s}`;
},1000);

// تغيير الكمية
function changeQty(val){
  let input = document.getElementById("qty");
  if(!input) return;
  let newVal = parseInt(input.value)+val;
  if(newVal>=1 && newVal<=20) input.value=newVal;
}

// الانضمام للصفقة
function joinDeal(){
  let qty = parseInt(document.getElementById("qty")?.value) || 1;
  current+=qty;
  if(current>maxDeal){ alert("❌ الصفقة وصلت الحد الأقصى"); return; }
  localStorage.setItem("deal_qty",current);
  document.getElementById("current")?.innerText=current;
  updateProgress();
  if(current>=minDeal) alert("🎉 الصفقة تم تفعيلها!");
  else alert(`باقي ${minDeal-current} قطعة لتفعيل الصفقة`);
}

// السلة
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function addToCart(){
  const name=document.querySelector(".deal-info h2")?.innerText;
  const price=parseInt(document.querySelector(".deal-info .price")?.innerText) || 0;
  const qty=parseInt(document.getElementById("qty")?.value)||1;
  if(!name) return;
  cart.push({name,price,qty});
  localStorage.setItem("cart",JSON.stringify(cart));
  alert("✅ تم إضافة المنتج للسلة!");
}

// تحميل السلة
let cartTable=document.querySelector("table");
if(cartTable){
  let cartItems=JSON.parse(localStorage.getItem("cart")) || [];
  cartItems.forEach(item=>{
    let row=cartTable.insertRow();
    row.innerHTML=`<td>${item.name}</td><td>${item.qty}</td><td>${item.price} ريال</td><td>${item.price*item.qty} ريال</td>`;
  });
}

// إضافة صفقة من لوحة البائع
function addDeal(){
  let name=document.getElementById("deal-name")?.value;
  let price=parseInt(document.getElementById("deal-price")?.value);
  let max=parseInt(document.getElementById("deal-max")?.value);
  if(!name || !price || !max){ alert("الرجاء تعبئة كل الحقول"); return; }
  sellerDeals.push({name,price,bought:0,max,img:"assets/images/placeholder.png"});
  localStorage.setItem("sellerDeals",JSON.stringify(sellerDeals));
  alert("✅ تم إضافة الصفقة!");
  renderDeals();
}
