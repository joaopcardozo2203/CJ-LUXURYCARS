/* ===============================================================
   CJ LUXURY CARS - ENGINE UNIFICADA (CATÁLOGO & DETALHES)
   =============================================================== */

const frotaLuxo = [
  {
    id: "porsche-911",
    categoria: "Porsche",
    nome: "Porsche 911 Carrera",
    descricao:
      "O ícone dos esportivos com desempenho lendário, aceleração precisa e design inconfundível.",
    imagem:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
    potencia: "385 CV",
    motor: "3.0 Boxer Turbo",
    cambio: "PDK 8 marchas",
  },
  {
    id: "bmw-serie-5",
    categoria: "BMW",
    nome: "BMW Série 5 Executive",
    descricao:
      "Elegância e conforto absoluto para viagens executivas com dinâmica de condução impecável.",
    imagem:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
    potencia: "340 CV",
    motor: "3.0 TwinPower",
    cambio: "Steptronic 8 marchas",
  },
  {
    id: "mercedes-c63",
    categoria: "Mercedes-AMG",
    nome: "Mercedes-Benz C63 AMG",
    descricao:
      "Luxo alemão com alma pura e esportiva, aliando potência bruta a um acabamento artesanal.",
    imagem:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
    potencia: "510 CV",
    motor: "4.0 V8 Biturbo",
    cambio: "AMG Speedshift 9 marchas",
  },
  {
    id: "audi-rs5",
    categoria: "Audi Sport",
    nome: "Audi RS5",
    descricao:
      "Precisão alemã e tração Quattro em cada detalhe de engenharia e sofisticação.",
    imagem:
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80",
    potencia: "450 CV",
    motor: "2.9 V6 Biturbo",
    cambio: "Tiptronic 8 marchas",
  },
  {
    id: "range-rover-sport",
    categoria: "Range Rover",
    nome: "Range Rover Sport",
    descricao:
      "Presença marcante e exclusividade off-road de alto padrão com interior em couro nobre.",
    imagem:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80",
    potencia: "400 CV",
    motor: "3.0 MHEV Turbo",
    cambio: "Automático 8 marchas",
  },
  {
    id: "lamborghini-huracan",
    categoria: "Lamborghini",
    nome: "Lamborghini Huracán",
    descricao:
      "Uma experiência superesportiva impossível de ignorar, acelerando emoções extremas.",
    imagem:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80",
    potencia: "640 CV",
    motor: "5.2 V10 Aspirado",
    cambio: "LDF 7 marchas",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  // 1. CARREGAR CATÁLOGO (index.html)
  const gridFrota = document.querySelector(".grid-fleet");
  if (gridFrota) {
    gridFrota.innerHTML = frotaLuxo
      .map(
        (carro) => `
            <article class="card">
                <div class="img-wrapper">
                    <img 
                        src="${carro.imagem}" 
                        alt="${carro.nome}" 
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'"
                    />
                </div>
                <div class="card-content">
                    <span class="card-category">${carro.categoria}</span>
                    <h3>${carro.nome}</h3>
                    <p>${carro.descricao}</p>
                    <a href="veiculo.html?carro=${carro.id}" class="btn-card">Explorar Veículo</a>
                </div>
            </article>
        `
      )
      .join("");
  }

  // 2. CARREGAR PÁGINA DE DETALHES (veiculo.html)
  const vehiclePage = document.querySelector(".vehicle-page");
  if (vehiclePage) {
    const urlParams = new URLSearchParams(window.location.search);
    const carroId = urlParams.get("carro") || "porsche-911";
    const carro = frotaLuxo.find((c) => c.id === carroId) || frotaLuxo[0];

    // Atualiza Imagem
    const directImg =
      document.getElementById("vehicle-image") ||
      document.getElementById("imgVeiculo");
    const mainCarImageContainer = document.querySelector(".main-car-image");

    if (directImg) {
      directImg.src = carro.imagem;
      directImg.alt = carro.nome;
    } else if (mainCarImageContainer) {
      mainCarImageContainer.innerHTML = `
                <img 
                    id="vehicle-image"
                    src="${carro.imagem}" 
                    alt="${carro.nome}" 
                    style="width:100%; height:100%; object-fit:cover; border-radius:18px; border:1px solid rgba(212,175,55,0.4);"
                    onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'"
                />
            `;
    }

    // Textos descritivos
    const eyebrow =
      document.getElementById("vehicle-category") ||
      document.querySelector(".eyebrow");
    const title =
      document.getElementById("vehicle-title") ||
      document.querySelector(".vehicle-content h1");
    const desc =
      document.getElementById("vehicle-description") ||
      document.querySelector(".vehicle-description");

    if (eyebrow) eyebrow.textContent = carro.categoria;
    if (title) title.textContent = carro.nome;
    if (desc) desc.textContent = carro.descricao;

    // Ficha Técnica
    const powerEl = document.getElementById("vehicle-power");
    const engineEl = document.getElementById("vehicle-engine");
    const transEl = document.getElementById("vehicle-transmission");
    const specsContainer = document.querySelector(".vehicle-specs");

    if (powerEl && engineEl && transEl) {
      powerEl.textContent = carro.potencia;
      engineEl.textContent = carro.motor;
      transEl.textContent = carro.cambio;
    } else if (specsContainer) {
      specsContainer.innerHTML = `
                <div><span>Potência</span><strong>${carro.potencia}</strong></div>
                <div><span>Motor</span><strong>${carro.motor}</strong></div>
                <div><span>Câmbio</span><strong>${carro.cambio}</strong></div>
            `;
    }

    // Link dinâmico do WhatsApp
    const btnOrcamento =
      document.getElementById("whatsapp-button") ||
      document.getElementById("btnOrcamento") ||
      document.querySelector(".btn-whatsapp-large, .btn-primary");
    if (btnOrcamento) {
      btnOrcamento.href = `https://wa.me/?text=${encodeURIComponent(
        "Olá! Gostaria de solicitar um orçamento exclusivo para o " + carro.nome
      )}`;
      btnOrcamento.target = "_blank";
    }
  }
});
