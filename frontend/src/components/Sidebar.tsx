
import React from "react";
import { SidebarLink } from "./SidebarLink";
import {  faUserGroup } from '@fortawesome/free-solid-svg-icons';
import {  faHouse, faSmile, faStar } from '@fortawesome/free-solid-svg-icons';


export const Sidebar: React.FC =() => {

    // bg-[#363538] 
    return (
        <div className="rounded-full fixed z-10 left-4 h-auto w-18  flex flex-col justify-center items-center px-6 py-8 space-y-6 bg-[#1F2937]  text-white ">
            <SidebarLink whereTo={"standupdashboard"} icon={faHouse} iconclassName={"text-white"} navName={"Dash"}/>
            <SidebarLink whereTo={"teams"} icon={faUserGroup} iconclassName={"text-white"} navName={"Teams"}/>
            <SidebarLink whereTo={"kudos"} icon={faStar} iconclassName={"text-white"} navName={"Kudos"}/>
            <SidebarLink whereTo={"team-mood"} icon={faSmile} iconclassName={"text-white"} navName={"Mood"}/>
        </div>
    )
}