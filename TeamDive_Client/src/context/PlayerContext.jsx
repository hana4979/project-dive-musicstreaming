import React, { createContext, useState } from "react";

export const PlayerContext=createContext();

export function PlayerProvider({children}){
    const [addPlaylist,setAddPlaylist]=useState();
    const [addAndPlay,setAddAndPlay]=useState();

    return(
        <PlayerContext.Provider value={{addPlaylist,setAddPlaylist,addAndPlay,setAddAndPlay}} >
            {children}
        </PlayerContext.Provider>
    );

}