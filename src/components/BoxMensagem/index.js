import styled from "styled-components";
import Box from "../Box";

export const CardBox = styled(Box)`
  background: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  padding: 10px;

  p {
    color: #29292e;
    font-size: 12px;
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    .userinfo {
      display: flex;
      align-items: center;

      img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }

      span {
        margin-left: 8px;
        color: #737380;
        font-size: 12px;
      }
    }
  }
`;
