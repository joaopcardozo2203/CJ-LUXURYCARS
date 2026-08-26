import { db, ref, get, child } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.getElementById('leads-table-body');

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'orcamentos'));

    tableBody.innerHTML = "";

    if (!snapshot.exists()) {
      tableBody.innerHTML = `<tr><td colspan="5" class="loading-td">Nenhum orçamento cadastrado até o momento.</td></tr>`;
      return;
    }

    const data = snapshot.val();
    
    // Converte os registros em array e exibe em ordem decrescente
    Object.keys(data).reverse().forEach(key => {
      const item = data[key];
      const row = `
        <tr>
          <td><strong>${item.cliente}</strong></td>
          <td>${item.whatsapp}</td>
          <td><span style="color:#d4af37;">${item.veiculo}</span></td>
          <td>${item.dataEvento}</td>
          <td>${new Date(item.criadoEm).toLocaleString('pt-BR')}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });

  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="5" class="loading-td" style="color:red !important;">Erro ao carregar dados do Firebase: ${error.message}</td></tr>`;
  }
});