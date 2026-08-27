import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ADMIN_USERNAME = "admin";

// Trava imediata de navegação
(function checarAcessoImediato() {
  const paginaAtual = window.location.pathname;
  const ehPaginaLogin = paginaAtual.includes("login.html");
  const usuarioSessao = sessionStorage.getItem("usuarioLogado");

  if (!ehPaginaLogin && !usuarioSessao) {
    window.location.replace("login.html");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");

  // Alternância entre telas de Login e Cadastro + Ajuste visual da aba ativa
  if (showRegister && showLogin) {
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginSection.classList.add("hidden");
      registerSection.classList.remove("hidden");
      showRegister.classList.add("active-tab");
      showLogin.classList.remove("active-tab");
    });

    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerSection.classList.add("hidden");
      loginSection.classList.remove("hidden");
      showLogin.classList.add("active-tab");
      showRegister.classList.remove("active-tab");
    });
  }

  // --- AUTENTICAÇÃO / LOGIN ---
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const usuarioInput = document
        .getElementById("login-usuario")
        .value.trim()
        .toLowerCase();
      const senhaInput = document.getElementById("login-senha").value.trim();
      const msg = document.getElementById("login-message");

      msg.style.color = "#aaa";
      msg.textContent = "Entrando...";

      if (usuarioInput === ADMIN_USERNAME && senhaInput === "admin123") {
        sessionStorage.setItem(
          "usuarioLogado",
          JSON.stringify({
            usuario: ADMIN_USERNAME,
            role: "admin",
            tipo: "admin",
          })
        );
        window.location.href = "Admin.html";
        return;
      }

      try {
        const email = usuarioInput.includes("@")
          ? usuarioInput
          : `${usuarioInput}@cjluxurycars.com`;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          senhaInput
        );
        const user = userCredential.user;

        const sessionData = {
          usuario: usuarioInput,
          role: usuarioInput === ADMIN_USERNAME ? "admin" : "vip",
          tipo: "membro",
          uid: user.uid,
        };

        sessionStorage.setItem("usuarioLogado", JSON.stringify(sessionData));
        window.location.href =
          usuarioInput === ADMIN_USERNAME ? "Admin.html" : "vip.html";
      } catch (error) {
        console.error(error);
        msg.style.color = "#ff4d4d";
        msg.textContent = "Usuário ou senha incorretos.";
      }
    });
  }

  // --- CADASTRO DE NOVO MEMBRO ---
  const formRegister = document.getElementById("form-register");
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("register-name").value.trim();
      const username = document
        .getElementById("register-username")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("register-password").value;
      const msg = document.getElementById("register-message");

      if (username === ADMIN_USERNAME) {
        msg.style.color = "#ff4d4d";
        msg.textContent = "Nome de usuário reservado.";
        return;
      }

      if (!/^[a-z0-9._-]+$/.test(username)) {
        msg.style.color = "#ff4d4d";
        msg.textContent =
          "Use apenas letras, números, ponto ou underline no usuário.";
        return;
      }

      msg.style.color = "#aaa";
      msg.textContent = "Criando conta...";

      try {
        const email = `${username}@cjluxurycars.com`;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Salva perfil no Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
          nome: name,
          usuario: username,
          tipo: "membro",
          criadoEm: serverTimestamp(),
        });

        // Encerra sessão automática para forçar login manual
        await signOut(auth);
        sessionStorage.removeItem("usuarioLogado");

        msg.style.color = "#28a745";
        msg.textContent =
          "Conta criada com sucesso! Redirecionando para o login...";

        setTimeout(() => {
          formRegister.reset();
          msg.textContent = "";

          const loginInput = document.getElementById("login-usuario");
          if (loginInput) loginInput.value = username;

          loginSection.classList.remove("hidden");
          registerSection.classList.add("hidden");
          showLogin.classList.add("active-tab");
          showRegister.classList.remove("active-tab");
        }, 1500);
      } catch (error) {
        console.error(error);
        msg.style.color = "#ff4d4d";

        if (error.code === "auth/email-already-in-use") {
          msg.textContent = "Este nome de usuário já está cadastrado.";
        } else if (error.code === "auth/weak-password") {
          msg.textContent = "A senha deve ter pelo menos 6 caracteres.";
        } else {
          msg.textContent = "Erro ao criar conta. Tente novamente.";
        }
      }
    });
  }
});

// Logout Global Interceptável
window.logout = window.fazerLogout = async function (e) {
  if (e && e.preventDefault) e.preventDefault();

  sessionStorage.removeItem("usuarioLogado");

  try {
    await signOut(auth);
  } catch (err) {
    console.error("Erro ao encerrar sessão Firebase:", err);
  }

  window.location.replace("login.html");
};

// Alternar Visibilidade de Senha
window.toggleVisibilidadeSenha = function (inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    btn.classList.add("visible");
  } else {
    input.type = "password";
    btn.classList.remove("visible");
  }
};
