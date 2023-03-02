import React from "react";

const AuthModalInputs = () => {
  return (
    <>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="First Name"
          name="firstName"
        />
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="Last Name"
          name="lastName"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-full"
          placeholder="Email"
          name="email"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="Phone"
          name="phone"
        />
        <input
          type="text"
          className="border rounded p-2 py-3 w-[49%]"
          placeholder="City"
          name="city"
        />
      </div>
      <div className="my-3 flex justify-between text-sm">
        <input
          type="password"
          className="border rounded p-2 py-3 w-full"
          placeholder="Password"
          name="password"
        />
      </div>
    </>
  );
};

export default AuthModalInputs;
