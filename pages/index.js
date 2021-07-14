import { useState } from "react";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";

import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export default function Home() {
  const [comunidade, setComunidade] = useState([
    {
      id: 1245885511,
      title: "Eu Odeio Acordar Cedo",
      image:
        "https://img10.orkut.br.com/community/866b85cc7220b57e7bdcbda9de686f8e.png",
    },
  ]);

  const [comunidadeTitle, setComunidadeTitle] = useState("");
  const [comunidadeImage, setComunidadeImage] = useState("");

  const usuarioAleatorio = "ruyarmando";
  const pessoasFavoritas = [
    "badxthing",
    "LuucasAugusto",
    "peedroca",
    "WeslleyMoreira",
    "SousaFelipeD",
    "saulooliveira",
    "isabeleakemi",
    "ricardohcinfo",
  ];

  function handleCriarComunidade(event) {
    event.preventDefault();

    const rand = 1 + Math.random() * (100 - 1);

    const novaComunidade = {
      id: new Date().toISOString(),
      title: comunidadeTitle,
      image: comunidadeImage.trim() !== "" ? comunidadeImage : "https://picsum.photos/300/300?" + rand,
    };

    setComunidade([...comunidade, novaComunidade]);
    setComunidadeTitle('');
    setComunidadeImage('');
  }

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={(event) => handleCriarComunidade(event)}>
              
              <div>
                <input
                  name="title"
                  type="text"
                  autoComplete="off"
                  required
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  aria-label="Infome o nome da sua comunidade"
                  onChange={(event) => setComunidadeTitle(event.target.value)}
                  value={comunidadeTitle}
                />
              </div>

              <div>
                <input
                  name="image"
                  type="url"
                  list="images"
                  autoComplete="off"
                  required
                  placeholder="Qual vai ser a imagem de capa da sua comunidade?"
                  aria-label="Infome a URL da imagem de capa da sua comunidade"
                  onChange={(event) => setComunidadeImage(event.target.value)}
                  value={comunidadeImage}
                />
                <datalist id="images">
                  <option value="https://picsum.photos/300/300?random=1" />
                  <option value="https://placekitten.com/300/300"/>
                  <option value="http://placebacon.net/300/300?image=1"/>
                  <option value="https://baconmockup.com/300/300"/>
                </datalist>
              </div>
              <button type="submit">Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            {pessoasFavoritas.length > 6 && (
              <>
                <hr />
                <p>
                  <a className="boxLink" href="/">
                    Ver todos
                  </a>
                </p>
              </>
            )}
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Minhas comunidades ({comunidade.length})
            </h2>

            <ul>
              {comunidade.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`}>
                      <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            {comunidade.length > 6 && (
              <>
              <hr />
              <p>
                <a className="boxLink" href="/">
                  Ver todos
                </a>
              </p>
            </>
            )}
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
