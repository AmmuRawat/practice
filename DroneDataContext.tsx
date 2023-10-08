import React, { createContext, ReactNode, useState } from 'react';

type DroneData = {
    Mod: string;
    sat: string;
    ack: string;
    alt: string;
    lon: string;
    hdg: string;
    Hbt: string;
    vel: string;
    lat: string;
    cmd: string;
    con: string;
} | null;

interface DroneDataContextProps {
    data: DroneData;
    setData: React.Dispatch<React.SetStateAction<DroneData>>;
}

export const DroneDataContext = createContext<DroneDataContextProps | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export const DroneDataProvider: React.FC<Props> = ({ children }) => {
    const [data, setData] = useState<DroneData>(null);
    return (
        <DroneDataContext.Provider value={{ data, setData }}>
            {children}
        </DroneDataContext.Provider>
    );
};
