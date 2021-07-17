import Head from "next/head";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import styled from "styled-components";

import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";

import { ProfileSidebar } from "../src/components/ProfileSidebar";
import { CardBox } from "../src/components/BoxMensagem";

import { AlurakutMenu } from "../src/lib/AlurakutCommons";

const DetailGrid = styled(MainGrid)`
  @media (min-width: 860px) {
    display: grid;
    grid-template-areas: "profileArea welcomeArea";
    grid-template-columns: 160px auto;
    max-width: 1110px;
    margin: auto;

    .profileArea {
      display: flex;
    }
  }
`;

export default function TestimonialPage({ githubUser, testimonialData }) {
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
      <main
        style={{
          width: "100%",
        }}
      >
        <DetailGrid>
          <div className="profileArea" style={{ gridArea: "profileArea" }}>
            <ProfileSidebar githubUser={githubUser} />
          </div>
          <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
            <Box>
              <h2 className="smallTitle">Meus depoimentos</h2>
              {testimonialData.map((data) => {
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
        </DetailGrid>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const apitoken = process.env.DATOCMS_READ_API_TOKEN;

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
  const { data } = await fetch(`https://graphql.datocms.com`, {
    method: "POST",
    headers: {
      Authorization: `${apitoken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query {
      allTestimonials(filter: {ownerSlug: {eq: ${githubUser}}}, orderBy: createdAt_DESC){
        id,
        content,
        imageUrl,
        creatorSlug
      }
    }`,
    }),
  }).then((res) => res.json());

  return {
    props: {
      testimonialData: data.allTestimonials,
      githubUser,
    },
  };
}
