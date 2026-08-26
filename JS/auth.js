const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@cjluxurycars.com";

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

    // Alternância entre telas de Login e Cadastro
    if (showRegister && showLogin) {
        showRegister.addEventListener("click", (e) => {
            e.preventDefault();
            loginSection.classList.add("hidden");
            registerSection.classList.remove("hidden");
        });

        showLogin.addEventListener("click", (e) => {
            e.preventDefault();
            registerSection.classList.add("hidden");
            loginSection.classList.remove("hidden");
        });
    }

    // --- AUTENTICAÇÃO / LOGIN ---
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", async (e) => {
            e.preventDefault();

            const usuarioInput = document.getElementById("login-usuario").value.trim().toLowerCase();
            const senhaInput = document.getElementById("login-senha").value.trim();
            const msg = document.getElementById("login-message");

            msg.style.color = "#aaa";
            msg.textContent = "Entrando...";

            // Acesso direto de Admin
            if (usuarioInput === ADMIN_USERNAME && senhaInput === " ") {
                sessionStorage.setItem("usuarioLogado", JSON.stringify({ usuario: ADMIN_USERNAME, role: "admin" }));
                window.location.href = "Admin.html";
                return;
            }

            try {
                const email = usuarioInput.includes("@") ? usuarioInput : `${usuarioInput}@cjluxurycars.com`;
                const userCredential = await auth.signInWithEmailAndPassword(email, senhaInput);
                const user = userCredential.user;

                const sessionData = {
                    usuario: usuarioInput,
                    role: usuarioInput === ADMIN_USERNAME ? "admin" : "cliente",
                    uid: user.uid
                };

                sessionStorage.setItem("usuarioLogado", JSON.stringify(sessionData));
                window.location.href = usuarioInput === ADMIN_USERNAME ? "Admin.html" : "index.html";

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
            const username = document.getElementById("register-username").value.trim().toLowerCase();
            const password = document.getElementById("register-password").value;
            const msg = document.getElementById("register-message");

            if (username === ADMIN_USERNAME) {
                msg.style.color = "#ff4d4d";
                msg.textContent = "Nome de usuário reservado.";
                return;
            }

            if (!/^[a-z0-9._-]+$/.test(username)) {
                msg.style.color = "#ff4d4d";
                msg.textContent = "Use apenas letras, números, ponto ou underline no usuário.";
                return;
            }

            msg.style.color = "#aaa";
            msg.textContent = "Criando conta...";

            try {
                const email = `${username}@cjluxurycars.com`;
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Salva perfil do usuário no Realtime Database
                await db.ref("usuarios/" + user.uid).set({
                    nome: name,
                    usuario: username,
                    tipo: "membro",
                    criadoEm: new Date().toISOString()
                });

                // Inicia sessão automática e redireciona
                const sessionData = { usuario: username, role: "cliente", uid: user.uid };
                sessionStorage.setItem("usuarioLogado", JSON.stringify(sessionData));

                msg.style.color = "#28a745";
                msg.textContent = "Conta criada com sucesso! Redirecionando...";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);

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

function fazerLogout() {
    if (typeof auth !== "undefined" && auth.signOut) {
        auth.signOut();
    }
    sessionStorage.removeItem("usuarioLogado");
    window.location.replace("login.html");
}