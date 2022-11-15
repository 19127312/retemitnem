import styled from "styled-components";

export const StyledPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
`;

export const StyledIconContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

export const StyledUpperBarContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px 25px;
`;

export const StyledUserInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
`;

export const StyledImageContainer = styled.img`
    padding: 10px 10px;
`

export const StyledUtilitiesContainer = styled.div`
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StyledSearchSortContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const StyledItemMarginHorizonalRightContainer = styled.div`
    margin: 0px 25px 0px 0px;
`;

export const StyledItemMarginHorizonalLeftContainer = styled.div`
    margin: 0px 0px 0px 25px;
`;

export const StyledGroupTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 25px 25px;
`;

// text

export const StyledLogoName = styled.h1`
    font-family: Sora; /* Heading */
    font-size: 18px; 
    line-height: 28px; 
    color: #171A1FFF;
`;

export const StyledUserName = styled.h1`
    font-family: Public Sans;
    font-size: 14px; 
    line-height: 22px; 
    color: #171A1FFF;
`;

export const StyledEmailName = styled.h1`
    font-family: Public Sans; /* Body */
    font-size: 12px; 
    line-height: 20px; 
    color: #565E6CFF;
`;

export const StyledGroupTitle = styled.h1`
    font-family: Public Sans; /* Body */
    font-size: 20px; 
    line-height: 30px; 
    color: #171A1FFF; 
`