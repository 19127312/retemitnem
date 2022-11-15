import styled from "styled-components";
import { Color } from '../../Constants/Constant'

export const StyledButton = styled.button`
  background: ${Color.primary};
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  width: 50%;
  height: 3rem;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Public Sans', sans-serif;
  
  margin: ${props => props.marginSize || 0}rem 0 1rem 0;
`;
export const StyledRadioItem = styled.label`
  font-family: 'Public Sans', sans-serif;
  font-weight: 200;
  font-style: thin;
  font-size: 1rem;
  margin: 0 1rem 0 0.5rem;
`
export const StyledInputPasswordIcon = styled.span`
  padding: 0.5rem;
  cursor: pointer;
`
export const StyledInputRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const StyledLabel = styled.label`
  font-size: 1rem;
  font-family: 'Public Sans', sans-serif;
  font-weight: 600;
  font-style: bold;
  margin: 0 0 0.1rem 0;
  padding-left: 1rem;
  padding-top: 0.5rem;
`

export const StyledErrorBox = styled.div`
  border-style: solid;
  border-width: 2px;
  border-color: ${props => props.hasError ? "red" : "rgb(248, 244, 244)"} ;
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
`
export const StyledErrorMessage = styled.p`
  color: ${Color.error100};
  background-color: ${Color.error300};
  padding-left: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Public Sans', sans-serif;
  font-size: 0.80rem;
`

export const StyledInput = styled.input`
  background: rgba(243,244,246,1);
  border-radius: 6px;
  
  height: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  width: 100%;
  
  border-width: 0px;
  outline: none;
  font-size: 1rem;
  font-family: 'Public Sans', sans-serif;
  font-style: normal;
  color: rgba(155,155,155,255);

  &:focus {
    color: rgba(188,193,202,1);
  }
  &::placeholder {
    color: rgba(155,155,155,255);
    font-weight: 10;
    font-size: 1rem;
  }
  &:hover {
    color: rgba(188,193,202,1);
    background: rgba(243,244,246,1);
  }
`;
export const StyledInputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: 0.5rem 0;
  background: rgba(243,244,246,255);
  border-radius: 6px;
  @media (max-width: 768px) {
    width:80%;
  }
`


export const StyledLogoContainer = styled.div`
    position: absolute;
    top: 30px;
    left: 30px;
    display: flex;
    align-items: center;
`

export const StyledLogoName = styled.h1`
    font-size: 1.5rem;
    font-family: 'Sora', sans-serif;
    line-height: 2rem;
    margin-left: 10px;
`

export const StyledQuestion = styled.p`
    font-size: 1rem;
    font-family: 'Public Sans', sans-serif;
    font-weight: 600;
    font-style: bold;
    margin: 1rem 2rem;
`
export const StyledError = styled.p`
    font-size: 1rem;
    font-family: 'Public Sans', sans-serif;
    color: ${Color.error100};
`

export const AuthContainer = styled.div`
    height: 100vh;
    display: flex;
    align-content: stretch;

    @media (max-width: 768px) {
        flex-direction: column;
    }

`;
export const AuthFormWrapper = styled.div`
    flex:1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;

`
export const AuthFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    width: 100%;
    
`
export const AuthContainerImage = styled.div`
    flex:1;
    background-color: ${Color.secondary};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        display: none;
  }
`
export const StyledImagePhrase = styled.p`
    color: white;
    font-size: 1.5rem;
    line-height: 1.5rem;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-style: bold;
    margin: 0.5rem 0;
`
export const StyledImageSecondPhrase = styled(StyledImagePhrase)`
    font-size: 1.2rem;
    font-weight: 400;
    font-family: 'Public Sans', sans-serif;
`
export const StyledHeadline = styled.h1`
    font-size: 2rem;
    font-family: 'Sora', sans-serif;
    line-height: 2rem;
    margin: 0 0 2rem 0;
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
`
export const StyledQuestionSignUp = styled.p`
    font-size: 0.9rem;
    font-family: 'Public Sans', sans-serif;
    font-weight: 400;
    margin: 0.5rem 0;
`
export const StyledSignMode = styled(StyledQuestionSignUp)`
    color: ${Color.primary};
    cursor: pointer;
    margin: 0;
    text-decoration: underline;
`