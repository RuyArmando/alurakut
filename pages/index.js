import { useState, useEffect } from "react";

import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";

import { ProfileRelationsBox } from "../src/components/ProfileRelations";
import { ProfileSidebar } from "../src/components/ProfileSidebar";
import { CardBox } from "../src/components/BoxMensagem";

import ComunidadeForm from "../src/components/Formulario/ComunidadeForm";
import RecadoForm from "../src/components/Formulario/RecadoForm";

import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

export async function getStaticProps() {
  const apitoken = process.env.DATOCMS_READ_API_TOKEN;
  const usuarioGitHub = "ruyarmando";
  return { props: { apitoken, usuarioGitHub } };
}

export default function Home({ apitoken, usuarioGitHub }) {
  const [etapa, setEtapa] = useState(0);

  const [community, setCommunity] = useState([]);
  const [following, setFollowing] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const formularios = [
    <ComunidadeForm handleSend={handleSendCommunity} />,
    <RecadoForm
      tilte={`O que você tem a dizer sobre ${usuarioGitHub}?`}
      handleSend={handleSendTestimonial}
    />,
    <RecadoForm
      tilte={`Deixe um recado para ${usuarioGitHub}...`}
      handleSend={handleSendScrap}
    />,
  ];

  useEffect(() => {
    // Github - Seguidores
    fetch(`https://api.github.com/users/${usuarioGitHub}/following`)
      .then(async (res) => {
        const result = await res.json();

        const parsedFollowers = result.map((data) => {
          return {
            id: data.login,
            title: data.login,
            imageUrl: data.avatar_url,
            link: `/users/${data.login}`,
            creatorSlug: usuarioGitHub,
          };
        });

        setFollowing(parsedFollowers);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });

    // Graphql - Comunidades, Recados e Depoimentos
    fetch(`https://graphql.datocms.com`, {
      method: "POST",
      headers: {
        Authorization: `${apitoken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: `query {
        allCommunities(orderBy: createdAt_ASC) {
          id,
          title,
          imageUrl,
          creatorSlug
        }
        allScraps(orderBy: createdAt_DESC){
          id,
          content,
          imageUrl,
          creatorSlug
        }
        allTestimonials(orderBy: createdAt_DESC){
          id,
          content,
          imageUrl,
          creatorSlug
        }
      }`,
      }),
    })
      .then(async (res) => {
        const result = await res.json();

        const parsedCommunities = result.data.allCommunities.map((data) => {
          return {
            id: data.id,
            title: data.title,
            imageUrl: data.imageUrl,
            link: `/communities/${data.id}`,
            creatorSlug: data.creatorSlug,
          };
        });

        setCommunity(parsedCommunities);
        setScraps(result.data.allScraps);
        setTestimonials(result.data.allTestimonials);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }, []);

  function handleSendCommunity({ comunidadeTitle, comunidadeImage }) {
    if (comunidadeTitle.trim() !== "" && comunidadeImage.trim() !== "") {
      const createCommunity = {
        title: comunidadeTitle,
        imageUrl: comunidadeImage,
        creatorSlug: usuarioGitHub,
      };

      // Comunidades
      fetch(`/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createCommunity),
      })
        .then(async (res) => {
          const result = await res.json();

          const newCommunity = {
            id: result.data.id,
            title: result.data.title,
            imageUrl: result.data.imageUrl,
            link: `/communities/${result.data.id}`,
            creatorSlug: result.data.creatorSlug,
          };

          setCommunity([...community, newCommunity]);
        })
        .catch(function (error) {
          console.log(
            "There has been a problem with your fetch operation: " +
              error.message
          );
        });
    }
  }

  function handleSendScrap({ recado }) {
    if (recado.trim() !== "") {
      const createScrap = {
        content: recado,
        creatorSlug: "Anônimo",
        imageUrl:
          "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-vector-id1018999828?k=6&m=1018999828&s=170667a&w=0&h=kHLjWmbp64ztmv46lOyZUaTYKd9mWEoNyknzyP5h2y4=",
      };

      // Recado
      fetch(`/api/scrap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createScrap),
      })
        .then(async (res) => {
          const result = await res.json();
          setScraps([...scraps, result.data]);
        })
        .catch(function (error) {
          console.log(
            "There has been a problem with your fetch operation: " +
              error.message
          );
        });
    }
  }

  function handleSendTestimonial({ recado }) {
    if (recado.trim() !== "") {
      const createTestimonial = {
        content: recado,
        creatorSlug: "Anônimo",
        imageUrl:
          "https://media.istockphoto.com/vectors/default-avatar-profile-icon-grey-photo-placeholder-vector-id1018999828?k=6&m=1018999828&s=170667a&w=0&h=kHLjWmbp64ztmv46lOyZUaTYKd9mWEoNyknzyP5h2y4=",
      };

      // Depoimento
      fetch(`/api/testimonial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createTestimonial),
      })
        .then(async (res) => {
          const result = await res.json();
          setTestimonials([...testimonials, result.data]);
        })
        .catch(function (error) {
          console.log(
            "There has been a problem with your fetch operation: " +
              error.message
          );
        });
    }
  }

  return (
    <>
      <AlurakutMenu githubUser={usuarioGitHub} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioGitHub} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <div className="buttonChoice">
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setEtapa(0);
                }}
              >
                Criar comunidade
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setEtapa(1);
                }}
              >
                Escrever depoimento
              </button>
              <button
                type="button"
                secondary
                onClick={(event) => {
                  event.preventDefault();
                  setEtapa(2);
                }}
              >
                Deixar um scrap
              </button>
            </div>
            {formularios[etapa]}
          </Box>
          <Box>
            <h2 className="smallTitle">
              {`Depoimentos (${testimonials.length})`}
            </h2>
            {testimonials.slice(0, 6).map((data) => {
              return (
                <CardBox key={data.id}>
                  <p>{data.content}</p>
                  <footer>
                    <div className="userinfo">
                      <img src={data.imageUrl} alt="logo" />
                      <span>{data.creatorSlug}</span>
                    </div>
                  </footer>
                </CardBox>
              );
            })}
            {testimonials.length > 6 && (
              <>
                <hr />
                <p>
                  <a className="boxLink" href="/">
                    Ver todos
                  </a>
                </p>
              </>
            )}
          </Box>
          <Box>
            <h2 className="smallTitle">{`Recados (${scraps.length})`}</h2>
            {scraps.slice(0, 6).map((data) => {
              return (
                <CardBox key={data.id}>
                  <p>{data.content}</p>
                  <footer>
                    <div className="userinfo">
                      <img src={data.imageUrl} alt="logo" />
                      <span>{data.creatorSlug}</span>
                    </div>
                  </footer>
                </CardBox>
              );
            })}
            {scraps.length > 6 && (
              <>
                <hr />
                <p>
                  <a className="boxLink" href="/">
                    Ver todos
                  </a>
                </p>
              </>
            )}
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="Meus amigos" items={following} />
          <ProfileRelationsBox title="Minhas comunidades" items={community} />
        </div>
      </MainGrid>
    </>
  );
}
