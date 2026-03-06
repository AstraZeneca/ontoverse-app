import styled from "@emotion/styled";


const ImgContainer = styled.div`
  // background: white;
  padding: 4px;
  margin-right: 8px;
  display: flex;
  // border-radius: 8px 8px 0px 8px;
`;

const Logo = () => {
  return (
      <ImgContainer>
        <img style={{height:'30px'}}
          src='ONTOVERSE.svg'
          alt='Ontoverse Logo'
        />
      </ImgContainer>
  )
}

export default Logo;