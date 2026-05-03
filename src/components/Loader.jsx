import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <Wrapper>
      <div className="bars">
        <div className="bar l1" />
        <div className="bar l2" />
        <div className="bar l3" />
        <div className="bar l4" />
        <div className="bar l5" />
        <div className="bar l6" />
        <div className="bar l7" />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .bars {
    display: flex;
    align-items: center;
  }

  .bar {
    width: 6px;
    height: 30px;
    margin-left: 4px;
    border-radius: 4px;
    background-color: rgb(53, 235, 29);
    transform-origin: center;
    animation: smoothPulse 1.2s infinite;
  }

  .l1 { animation-delay: 0s; }
  .l2 { animation-delay: 0.1s; }
  .l3 { animation-delay: 0.2s; }
  .l4 { animation-delay: 0.3s; }
  .l5 { animation-delay: 0.4s; }
  .l6 { animation-delay: 0.5s; }
  .l7 { animation-delay: 0.6s; }

  @keyframes smoothPulse {
    0% {
      transform: scale(0.7, 0.7);
      opacity: 0.5;
    }

    25% {
      transform: scale(0.9, 1.1);
      opacity: 0.7;
    }

    50% {
      transform: scale(1.1, 1.4);
      opacity: 1;
    }

    75% {
      transform: scale(0.9, 1.1);
      opacity: 0.7;
    }

    100% {
      transform: scale(0.7, 0.7);
      opacity: 0.5;
    }
  }
`;

export default Loader;