import styled from "styled-components";

const NumberIndicator = styled.div`
  top: -6px;
  flex: 0 auto;
  padding: 0 5px;
  position: absolute;
  font-size: 10px;
  align-self: center;
  background: #ffff;
`;
const Container = styled.div`
  border: none;
  height: 1px;
  margin: 10px 0;
  display: flex;
  position: relative;
  flex-direction: column;

  background-image: linear-gradient(to right, #fff, #8f8f8f, #fff);
`;

export const FilterIndicator = ({
  filteredPapersCount,
  totalPapersCount,
}: {
  filteredPapersCount: number;
  totalPapersCount: number;
}) => {
  return (
    <Container>
      <NumberIndicator>{`${filteredPapersCount} of ${totalPapersCount}`}</NumberIndicator>
    </Container>
  );
};
