import React from "react";
// import Draggable from "react-draggable";
import { Modal } from "antd";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { LikeOutlined } from "@ant-design/icons";
// import * as SC from "./StyledSlideComponent";
// import { Color } from "../../Constants/Constant";

// const { TextArea } = Input;

function ModalQuestionMember({ open, handleCancel }) {
  // const [data, setData] = useState([
  //   {
  //     content: "Who are u",
  //     countLike: 0,
  //     _id: 0,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 1,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 2,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 3,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 4,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 5,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 6,
  //   },
  //   {
  //     content: "What are u",
  //     countLike: 0,
  //     _id: 7,
  //   },
  // ]);
  // const [askState, setAskState] = useState(false);
  // const [question, setQuestion] = useState("");
  // // const [disabledMove, setDisabledMove] = useState(false);
  // const [disabledSubmit, setDisabledSubmit] = useState(true);
  // const [bounds, setBounds] = useState({
  //   left: 0,
  //   top: 0,
  //   bottom: 0,
  //   right: 0,
  // });
  // const draggleRef = useRef(null);
  // const onStart = (_event, uiData) => {
  //   const { clientWidth, clientHeight } = window.document.documentElement;
  //   const targetRect = draggleRef.current?.getBoundingClientRect();
  //   if (!targetRect) {
  //     return;
  //   }
  //   setBounds({
  //     left: -targetRect.left + uiData.x,
  //     right: clientWidth - (targetRect.right - uiData.x),
  //     top: -targetRect.top + uiData.y,
  //     bottom: clientHeight - (targetRect.bottom - uiData.y),
  //   });
  // };
  // const handleSetQuestion = (e) => {
  //   setQuestion(e.target.value);
  //   if (e.target.value.length > 0) {
  //     setDisabledSubmit(false);
  //   } else {
  //     setDisabledSubmit(true);
  //   }
  // };
  // const handleClickLike = (id) => {
  //   const newData = [...data];
  //   const index = newData.findIndex((item) => item._id === id);
  //   newData[index].countLike += 1;
  //   setData(newData);
  // };
  // const listRender = (
  //   <div
  //     id="scrollableDiv"
  //     style={{
  //       width: "100%",
  //       minHeight: "100px",
  //       maxHeight: "250px",
  //       overflow: "auto",
  //       padding: "0 10px",
  //       backgroundColor: "white",
  //       marginBottom: "10px",
  //       display: "flex",
  //       flexDirection: "column",
  //     }}
  //   >
  //     <InfiniteScroll dataLength={data.length} scrollableTarget="scrollableDiv">
  //       {data.map((item) => {
  //         return (
  //           <SC.StyledModalQuestionItemContainer>
  //             <SC.StyledModalQuestionItemContent>
  //               {item.content}
  //             </SC.StyledModalQuestionItemContent>
  //             <SC.StyledLikeContainer>
  //               <LikeOutlined
  //                 style={{ fontSize: "25px" }}
  //                 onClick={handleClickLike(item._id)}
  //               />
  //               {item.countLike}
  //             </SC.StyledLikeContainer>
  //           </SC.StyledModalQuestionItemContainer>
  //         );
  //       })}
  //     </InfiniteScroll>
  //   </div>
  // );
  // // console.log(askState);
  // console.log(listRender);
  // const contentModalRender = () => {
  //   if (askState) {
  //     return (
  //       <>
  //         <SC.StyledTitleModal
  //           style={{
  //             color: Color.blue400,
  //             cursor: "pointer",
  //             display: "inline",
  //           }}
  //           onClick={() => setAskState(false)}
  //         >
  //           Back
  //         </SC.StyledTitleModal>
  //         <SC.StyledModalQuestionContainer>
  //           <SC.StyledNoQuestion>Write your question here</SC.StyledNoQuestion>
  //           <TextArea
  //             style={{ width: "100%" }}
  //             maxLength={500}
  //             autoSize={{ minRows: 5, maxRows: 100 }}
  //             placeholder="Your question for presenter"
  //             value={question}
  //             showCount
  //             onChange={(e) => handleSetQuestion(e)}
  //           />
  //           <SC.StyledButtonModalQuestion
  //             onClick={() => setAskState(true)}
  //             disabled={disabledSubmit}
  //           >
  //             Submit
  //           </SC.StyledButtonModalQuestion>
  //         </SC.StyledModalQuestionContainer>
  //       </>
  //     );
  //   }
  //   return (
  //     <>
  //       <SC.StyledTitleModal>Questions from audience</SC.StyledTitleModal>
  //       <SC.StyledModalQuestionContainer>
  //         {data.length === 0 ? (
  //           <SC.StyledNoQuestion>
  //             Do you have a question for the presenter? Be the first one to ask!
  //           </SC.StyledNoQuestion>
  //         ) : (
  //           listRender
  //         )}
  //         <SC.StyledButtonModalQuestion onClick={() => setAskState(true)}>
  //           Ask
  //         </SC.StyledButtonModalQuestion>
  //       </SC.StyledModalQuestionContainer>
  //     </>
  //   );
  // };
  // console.log(contentModalRender);
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      // title={
      //   <div
      //     style={{
      //       width: "100%",
      //       cursor: "move",
      //     }}
      //     onMouseOver={() => {
      //       if (disabledMove) {
      //         setDisabledMove(false);
      //       }
      //     }}
      //     onMouseOut={() => {
      //       setDisabledMove(true);
      //     }}
      //     // fix eslintjsx-a11y/mouse-events-have-key-events
      //     // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
      //     onFocus={() => {}}
      //     onBlur={() => {}}
      //     // end
      //   >
      //     Q&A
      //   </div>
      // }
      // modalRender={(modal) => (
      //   <Draggable
      //     disabled={disabledMove}
      //     bounds={bounds}
      //     onStart={(event, uiData) => onStart(event, uiData)}
      //   >
      //     <div ref={draggleRef}>{modal}</div>
      //   </Draggable>
      // )}
    >
      Hello
    </Modal>
  );
}

export default ModalQuestionMember;
