import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JoinLink() {
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    localStorage.setItem("groupID", id);
    navigate("/", { replace: true });
  }, []);
  return <div>JoinLink</div>;
}
