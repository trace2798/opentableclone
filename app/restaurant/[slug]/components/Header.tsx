import React from "react";

export default function Header({ name }: { name: string }) {
  const renderTitle = () => {
    //declares a variable named "nameArray" by calling the "split" method on a variable named "name".
    const nameArray = name.split("-");
    //modifies the last element of the "nameArray" by adding parentheses around it
    nameArray[nameArray.length - 1] = `(${nameArray[nameArray.length - 1]})`;
    //returns a new string by joining all the elements of the "nameArray" array together with a space separator using the "join" method.
    return nameArray.join(" ")
  };

  return (
    <div className="h-96 overflow-hidden">
      <div className="bg-center bg-gradient-to-r from-[#0f1f47] to-[#5f6984] h-full flex justify-center items-center">
        <h1 className="text-7xl text-white capitalize text-shadow text-center">
          {renderTitle()}
        </h1>
      </div>
    </div>
  );
}
