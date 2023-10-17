import React from "react";
import CreateUserAccount from "@/components/createUserAccount";

const Register = () => {
  const handleRegistration = async () => {
    const userData = {
      UserName: "JohnDoe",
      Age: 30,
      Gender: "Male",
      NumberOfUploads: 0,
      ProfilePicture: "profile.jpg",
      email: "johndoe@example.com",
    };

    const userDocRef = await CreateUserAccount(userData);

    if (userDocRef) {
      console.log("User ID:", userDocRef.id);
    }
  };

  return (
    <div>
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
};

export default Register;
