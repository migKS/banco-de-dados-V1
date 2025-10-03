import { supabase } from "./supabaseClient.js";

// ===== Função para mostrar mensagens =====
function showMsg(el, text, type = "success") {
  el.textContent = text;
  el.className = msg ${type};
}

// ===== CADASTRO =====
const cadastroForm = document.getElementById("cadastroForm");
const cadastroMsg = document.getElementById("cadastroMsg");

if (cadastroForm) {
  cadastroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("cadastroEmail").value.trim().toLowerCase();
    const password = document.getElementById("cadastroPass").value;
    const name = document.getElementById("cadastroName").value.trim();

    try {
      // Cria usuário com user_metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;

      // Cria perfil na tabela profiles (opcional)
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          { user_id: data.user.id, name: name, avatar_url: 'default-user.png' }
        ]);
        if (profileError) throw profileError;
      }

      showMsg(cadastroMsg, "Cadastro realizado! Verifique seu email.", "success");
      cadastroForm.reset();

    } catch (err) {
      showMsg(cadastroMsg, "Erro: " + err.message, "error");
      console.error("Cadastro erro:", err);
    }
  });
}

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPass").value;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) throw new Error("Sessão não iniciada. Verifique suas credenciais.");

      showMsg(loginMsg, "Login realizado com sucesso!", "success");

      // Redireciona após login
      setTimeout(() => window.location.href = "home.html", 500);

    } catch (err) {
      showMsg(loginMsg, "Erro: " + err.message, "error");
      console.error("Login erro:", err);
    }
  });
}

// ===== VERIFICAÇÃO DE SESSÃO =====
supabase.auth.onAuthStateChange((event, session) => {
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");

  if (!session || !session.user) {
    if (!window.location.pathname.endsWith("index.html")) {
      window.location.href = "index.html";
    }
  } else if (userNameEl && userEmailEl) {
    // Preenche dados do usuário
    userNameEl.textContent = session.user.user_metadata?.full_name || "Usuário";
    userEmailEl.textContent = session.user.email;
  }
});

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "index.html";
    } catch (err) {
      console.error("Erro ao deslogar:", err);
      alert("Não foi possível sair. Tente novamente.");
    }
  });
}
