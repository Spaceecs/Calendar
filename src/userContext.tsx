import React, { createContext, useContext, useState, ReactNode } from 'react';

// Тип для користувача
type User = { id: number; name: string } | null;

// Тип для контексту
type UserContextType = {
    user: User;
    setUser: (user: User) => void;
};

// Створення контексту з дефолтним значенням
const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

// Тип для пропсів провайдера
type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Кастомний хук
export const useUser = () => useContext(UserContext);
