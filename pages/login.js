import React, { useState } from "react";
import { useRouter } from "next/router";
import { setCookie, destroyCookie } from "nookies";

export default function LoginPage() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState("");

  async function BulkPublish() {
    const BASE_URL = `https://api.github.com/users/${githubUser}`;

    // Github - Usuário
    const result = await fetch(`${BASE_URL}`).then((res) => res.json());

    // Usuário não encontrado
    if (!result.hasOwnProperty("login")) {
      return;
    }

    // DatoCMS - Usuário
    const resultUser = await fetch(`/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: result.login,
        name: result.name,
        imageUrl: result.avatar_url,
        bio: result.bio == null ? "" : result.bio.trim(),
        githubUrl: result.html_url,
      }),
    }).then((res) => res.json());

    if (resultUser.created) {
      // Github - Seguindo (Amigos)
      const following = await fetch(`${BASE_URL}/following`).then((res) =>
        res.json()
      );

      const parsedFollowing = following.map((data) => {
        return {
          login: data.login,
          imageUrl: data.avatar_url,
          githubUrl: data.html_url,
          creatorSlug: githubUser,
        };
      });

      await fetch(`/api/following`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedFollowing }),
      });

      // Github - Seguidores (Fãs)
      const followers = await fetch(`${BASE_URL}/followers`).then((res) =>
        res.json()
      );

      const parsedFollowers = followers.map((data) => {
        return {
          login: data.login,
          imageUrl: data.avatar_url,
          githubUrl: data.html_url,
          creatorSlug: githubUser,
        };
      });

      await fetch(`/api/follower`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedFollowers }),
      });
    }

    return resultUser.data;
  }

  async function handelSubmit(event) {
    event.preventDefault();

    const { token } = await fetch("https://alurakut.vercel.app/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ githubUser: githubUser }),
    }).then((res) => res.json());

    await BulkPublish();

    setCookie(null, "USER_TOKEN", token, {
      maxAge: 2 * 24 * 60 * 60,
      path: "/",
    });

    router.push("/");
  }

  return (
    <main
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p>
            <strong>Conecte-se</strong> aos seus amigos e familiares usando
            recados e mensagens instantâneas
          </p>
          <p>
            <strong>Conheça</strong> novas pessoas através de amigos de seus
            amigos e comunidades
          </p>
          <p>
            <strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só
            lugar
          </p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(event) => handelSubmit(event)}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Usuário"
              required
              value={githubUser}
              onChange={(event) => setGithubUser(event.target.value)}
            />
            <button type="submit">Login</button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>ENTRAR JÁ</strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> -{" "}
            <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> -{" "}
            <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
