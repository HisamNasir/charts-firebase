import React from 'react';
import CreateUserAccount from '@/components/createUserAccount';

const Register = () => {
  const handleRegistration = async () => {
    // Data for the user account
    const userData = {
      UserName: 'JohnDoe',
      Age: 30,
      Gender: 'Male',
      NumberOfUploads: 0,
      ProfilePicture: 'profile.jpg',
      email: 'johndoe@example.com',
    };

    const userDocRef = await CreateUserAccount(userData);

    if (userDocRef) {
      // Account created successfully
      console.log('User ID:', userDocRef.id);
    }
  };

  return (
    <div>
      {/* Your registration form */}
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
};

export default Register;
