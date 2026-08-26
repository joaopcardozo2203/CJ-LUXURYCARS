const ADMIN_USERNAME = "joaoecarlos";

const ADMIN_EMAIL = "joaoecarlos@cjluxurycars.com";


// ===============================
// TROCAR ENTRE LOGIN E CADASTRO
// ===============================

const loginSection =
    document.getElementById("login-section");

const registerSection =
    document.getElementById("register-section");


document
    .getElementById("show-register")
    .addEventListener("click", () => {

        loginSection.classList.add("hidden");

        registerSection.classList.remove("hidden");

    });


document
    .getElementById("show-login")
    .addEventListener("click", () => {

        registerSection.classList.add("hidden");

        loginSection.classList.remove("hidden");

    });


// ===============================
// LOGIN
// ===============================

document
    .getElementById("login-form")
    .addEventListener("submit", async (event) => {

        event.preventDefault();

        const username =
            document
                .getElementById("login-username")
                .value
                .trim()
                .toLowerCase();

        const password =
            document
                .getElementById("login-password")
                .value;


        const message =
            document.getElementById("login-message");


        message.textContent = "Entrando...";


        try {

            let email;


            /*
             * O administrador possui um e-mail técnico.
             */

            if (username === ADMIN_USERNAME) {

                email = ADMIN_EMAIL;

            } else {

                /*
                 * Usuários normais utilizam um e-mail
                 * técnico criado automaticamente.
                 */

                email =
                    `${username}@cjluxurycars.com`;

            }


            await auth.signInWithEmailAndPassword(
                email,
                password
            );


            if (username === ADMIN_USERNAME) {

                window.location.href = "admin.html";

            } else {

                window.location.href = "index.html";

            }


        } catch (error) {

            console.error(error);

            message.textContent =
                "Usuário ou senha incorretos.";

        }

    });


// ===============================
// CRIAR CONTA DE MEMBRO
// ===============================

document
    .getElementById("register-form")
    .addEventListener("submit", async (event) => {

        event.preventDefault();


        const name =
            document
                .getElementById("register-name")
                .value
                .trim();


        const username =
            document
                .getElementById("register-username")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("register-password")
                .value;


        const message =
            document.getElementById("register-message");


        if (username === ADMIN_USERNAME) {

            message.textContent =
                "Esse usuário não está disponível.";

            return;

        }


        if (!/^[a-z0-9._-]+$/.test(username)) {

            message.textContent =
                "Use apenas letras, números, ponto, hífen ou underline.";

            return;

        }


        message.textContent =
            "Criando sua conta...";


        try {

            const email =
                `${username}@cjluxurycars.com`;


            const userCredential =
                await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );


            const user =
                userCredential.user;


            /*
             * Salva os dados adicionais do membro
             * no Realtime Database.
             */

            await db
                .ref("usuarios/" + user.uid)
                .set({

                    nome: name,

                    usuario: username,

                    tipo: "membro",

                    criadoEm:
                        new Date().toISOString()

                });


            message.textContent =
                "Conta criada com sucesso!";


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1000);


        } catch (error) {

            console.error(error);


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message.textContent =
                    "Esse usuário já existe.";

            } else if (
                error.code ===
                "auth/weak-password"
            ) {

                message.textContent =
                    "A senha precisa ter pelo menos 6 caracteres.";

            } else {

                message.textContent =
                    "Não foi possível criar a conta.";

            }

        }

    });