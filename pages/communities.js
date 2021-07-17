import Head from "next/head";
import nookies from "nookies";
import jwt from "jsonwebtoken";
import styled from "styled-components";

import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";

import { ProfileSidebar } from "../src/components/ProfileSidebar";
import { AlurakutMenu } from "../src/lib/AlurakutCommons";

const DetailLink = styled.h3`
  font-size: 14px;
  font-weight: normal;
  color: #2e7bb4;
  margin-bottom: 20px;

  strong {
    font-weight: normal;
    color: #999999;
  }
`;

const DetailGrid = styled(MainGrid)`
  @media (min-width: 860px) {
    display: grid;
    grid-template-areas: "profileArea welcomeArea";
    grid-template-columns: 160px auto;
    max-width: 1110px;
    /* vertical | horizontal */
    margin: auto;

    .profileArea {
      display: flex;
    }
  }
`;

const CardBox = styled(Box)`
  background: #d9e6f6;

  border-radius: 0px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  padding: 10px;
  margin: 0px;
  max-width: 100%;

  &:nth-child(even) {
    background: #f1f9fe;
  }

  .user {
    display: flex;
    align-items: center;

    img {
      width: 98.57px;
      height: 98.57px;
      border-radius: 20%;
    }
  }

  .userinfo {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    gap: 2px;

    span {
      margin-left: 14px;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      color: #2e7bb4;
    }

    a {
      margin-left: 12px;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      color: #999999;
      text-decoration: none;
    }
  }
`;
export default function CommunityPage({ githubUser, communityData }) {
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
              <h2 className="smallTitle">Minhas comunidades</h2>
              <DetailLink>
                Início &gt; <strong>Minhas comunidades</strong>
              </DetailLink>
              {communityData.map((data) => {
                return (
                  <CardBox key={data.id}>
                    <div className="user">
                      <img src={data.imageUrl} alt="logo" />
                      <div className="userinfo">
                        <span>{data.title}</span>
                        <a>{data.link}</a>
                      </div>
                    </div>
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
        allCommunities(filter: {creatorSlug: {eq: ${githubUser}}}, orderBy: createdAt_ASC){
        id,
        title,
        imageUrl,
        link,
        creatorSlug
      }
    }`,
    }),
  }).then((res) => res.json());

  return {
    props: {
      communityData: data.allCommunities,
      githubUser,
    },
  };
}
