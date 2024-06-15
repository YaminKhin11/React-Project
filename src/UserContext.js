import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  addUser: () => {},
  removeUser: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const addUser = (user) => {
    const { username, email } = user?.userData;
    setUser({ username, email });
    localStorage.setItem("user", JSON.stringify({ username, email }));
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setUser(parsedData);
      } catch (error) {
        console.error("Error parsing JSON data from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, addUser, removeUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
