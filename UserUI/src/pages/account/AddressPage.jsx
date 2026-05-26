import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Address management is part of the Profile page.
// This redirect keeps the /address route working.
const AddressPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/profile", { replace: true });
  }, [navigate]);
  return null;
};

export default AddressPage;
