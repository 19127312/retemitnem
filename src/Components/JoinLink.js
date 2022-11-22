import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";

export default function JoinLink() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(auth);
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    auth?.user
      ? navigate(`/group/${id}`)
      : navigate("/login", { replace: true, state: { message: "" } });
  }, []);
  return <div>JoinLink</div>;
}
