import { useState, useEffect } from "react";

import Head from "next/head";
import NextLink from "next/link";

import nookies from "nookies";
import jwt from "jsonwebtoken";

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

export default function Home({ apitoken, githubUser }) {
  const [etapa, setEtapa] = useState(0);

  const [community, setCommunity] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [scraps, setScraps] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const formularios = [
    <ComunidadeForm handleSend={handleSendCommunity} />,
    <RecadoForm
      tilte={`O que você tem a dizer sobre ${githubUser}?`}
      handleSend={handleSendTestimonial}
    />,
    <RecadoForm
      tilte={`Deixe um recado para ${githubUser}...`}
      handleSend={handleSendScrap}
    />,
  ];

  useEffect(() => {
    // Github - Seguindo (Amigos)
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then(async (res) => {
        const result = await res.json();

        const parsedFollowing = result.map((data) => {
          return {
            id: data.login,
            title: data.login,
            imageUrl: data.avatar_url,
            link: `/users/${data.login}`,
            creatorSlug: githubUser,
          };
        });

        setFollowing(parsedFollowing);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });

    // Github - Seguidores (Fãs)
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(async (res) => {
        const result = await res.json();

        const parsedFollowers = result.map((data) => {
          return {
            id: data.login,
            title: data.login,
            imageUrl: data.avatar_url,
            link: `/users/${data.login}`,
            creatorSlug: githubUser,
          };
        });

        setFollowers(parsedFollowers);
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
        allCommunities(filter: {creatorSlug: {eq: ${githubUser}}}, orderBy: createdAt_ASC) {
          id,
          title,
          imageUrl,
          creatorSlug
        }
        allScraps(filter: {ownerSlug: {eq: ${githubUser}}}, orderBy: createdAt_DESC){
          id,
          content,
          imageUrl,
          creatorSlug
        }
        allTestimonials(filter: {ownerSlug: {eq: ${githubUser}}}, orderBy: createdAt_DESC){
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
        creatorSlug: githubUser,
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
        ownerSlug: githubUser,
        content: recado,
        creatorSlug: githubUser,
        imageUrl: `https://github.com/${githubUser}.png`,
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
        ownerSlug: githubUser,
        content: recado,
        creatorSlug: githubUser,
        imageUrl: `https://github.com/${githubUser}.png`,
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
      <Head>
        <link rel="icon" href="https://alurakut.vercel.app/logo.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="X-UA-Compatible" content="ie=edge" />
        <title>Alurakut</title>
      </Head>
      <AlurakutMenu githubUser={githubUser} />
      <div
        style={{
          width: "100%",
        }}
      >
        <MainGrid>
          <div className="profileArea" style={{ gridArea: "profileArea" }}>
            <ProfileSidebar githubUser={githubUser} />
          </div>
          <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
            <Box>
              <h1 className="title">Bem vindo(a) {githubUser}</h1>
              <OrkutNostalgicIconSet
                fas={followers.length}
                recados={scraps.length}
                mensagens={testimonials.length}
              />
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
                Depoimentos (
                <NextLink href="/testimonials">
                  <a className="boxLink">{testimonials.length}</a>
                </NextLink>
                )
              </h2>
              {testimonials.slice(0, 3).map((data) => {
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
            </Box>
            <Box>
              <h2 className="smallTitle">
                Recados (
                <NextLink href="/scraps">
                  <a className="boxLink">{scraps.length}</a>
                </NextLink>
                )
              </h2>
              {scraps.slice(0, 3).map((data) => {
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
            </Box>
          </div>
          <div
            className="profileRelationsArea"
            style={{ gridArea: "profileRelationsArea" }}
          >
            <ProfileRelationsBox
              title="Meus amigos"
              slug="/friends"
              items={following}
            />
            <ProfileRelationsBox
              title="Meus fãs"
              slug="/followers"
              items={followers}
            />
            <ProfileRelationsBox
              title="Minhas comunidades"
              slug="/communities"
              items={community}
            />
          </div>
        </MainGrid>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((res) => res.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);
  const apitoken = process.env.DATOCMS_READ_API_TOKEN;

  return {
    props: {
      apitoken,
      githubUser,
    },
  };
}
