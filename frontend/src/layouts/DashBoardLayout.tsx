import { Outlet } from "react-router-dom";
import {Sidebar} from "../components/Sidebar"
import {AnimationWrapper} from "../common/page-animation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,  } from "@fortawesome/free-regular-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faSearch, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useTeamsContext } from '../hooks/useTeamsContext';
import {useSelector} from 'react-redux';
import { RootState } from '../state/store';
import { useStandupContext } from '../hooks/useStandupContext';
// import { SidebarLink } from "../components/SidebarLink";
// import { NavBarLink } from "../components/NavBarLink";
// import {  faUserGroup } from '@fortawesome/free-solid-svg-icons';
// import {  faHouse } from '@fortawesome/free-solid-svg-icons';


const DashBoardLayout = () => {
  const userId = useSelector((state: RootState) => state.authState.id);
  const {members} = useTeamsContext();
  const {standups} = useStandupContext();

  const user = members?.find(member=> member.id === userId)
  const user_standups = standups.filter(standup => user?.teams.includes(standup.teamId) && standup.standup.length)

  console.log("standups", standups)
  console.log(user);

    return (
    <>
    <div className="flex w-full mb-2 bg-transparent backdrop-blur-sm">
      <div className="w-full py-4   ">
          <h1 className=" font-bold text-3xl text-[#1F2937] text-left ml-6 ">THE DAILY GRIND</h1>
      </div>

      {/* <div className="w-5/6 [#363538] bg-[#1F2937] ">
        <div className=" flex gap-10 rounded-none justify-center items-center  px-4 py-4 bg-[#363538] ">
          <div className="flex gap-5 justify-center items-center text-[#363538] bg-white rounded-lg px-4 py-2">
           <NavBarLink whereTo={"standupdashboard"} icon={faHouse} iconclassName={"text-black"} navName={"Dash"}/>
           <NavBarLink whereTo={"teams"} icon={faUserGroup} iconclassName={"text-black"} navName={"Teams"}/>
          </div>
        </div>
      </div> */}
      <div className="flex items-center gap-6">
      {/* Search Icon */}
      <button className="text-gray-500 hover:text-gray-600 transition-colors">
        <FontAwesomeIcon icon={faSearch} size="lg" />
      </button>

      {/* Notification Icon */}
      <button className="relative text-gray-500 hover:text-gray-600 transition-colors">
        <FontAwesomeIcon icon={faBell} size="lg" />
        {/* Notification Badge */}
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center -translate-y-1/2 translate-x-1/2">
          3
        </span>
      </button>

      {/* User Profile */}
      <div className="flex items-center gap-2">
        <img
          src="https://via.placeholder.com/40"
          alt="User avatar"
          className="w-8 h-8 rounded-full bg-gray-100"
        />
        <span className="text-gray-400 font-medium flex">{user? user.memberName : 'John Doe' }</span>
        <FontAwesomeIcon icon={faAngleDown} className="text-gray-400" />
      </div>
    </div>
    </div>
    
    <div className="flex h-screen ">
      <Sidebar />

      <div className="flex flex-col flex-grow ml-20 px-10 py-8">
        <AnimationWrapper key={"outlets"} transition={{duration: 3}}>
         <Outlet/>
        </AnimationWrapper>
      </div>

      <div className="mt-6 mr-2 rounded-2xl h-screen bg-white border-2 border-[#5fb0bc] w-70 flex flex-col">
        <div className="flex justify-end gap-2 m-4">
          <div className="rounded-full py-2 px-[9px] bg-white border-2 border-[#5fb0bc] ">
            <FontAwesomeIcon icon={faMessage} size="lg"/>
          </div>
          <div className="rounded-full py-2 px-[9px] bg-white border-2 border-[#5fb0bc]">
            <FontAwesomeIcon icon={faUser} size="lg"/>
          </div>
        </div>


        <div className="mb-10 mt-auto">

          <div className="py-4 px-2 w-full mb-12">
            <div className="rounded-lg mx-2 mb-2 py-4 text-center justify-center items-center bg-gray-100 space-y-8">

            <h2 className="">Your Standups</h2>
            
            <div className="flex justify-start items-start ml-2">
              {/* <div className=" text-center h-8 w-8  rounded-full py-2 px-4 bg-fuchsia-500"> */}
                <FontAwesomeIcon icon={faBell} size="sm" className="rounded-full py-2 px-3 mt-1 bg-black text-white"/>

              {/* </div> */}
              {
                user_standups.length?
                user_standups.map(standup=>{
                  return(
                    <div className="text-left ml-2 ">
                    <h3>Respond To {standup.teamName} standup</h3>
                    <p className="text-sm text-gray-500">Keep watch for reminders to answer questions</p>
                  </div>
                  )
                })

                :
                <div className="text-left ml-2 ">
                      <p className='text-gray-400 text-center'>No standups to display</p>
                </div>
              }
            

            </div>

            </div>
          </div>

          <div className="rounded-lg mx-4 bg-gray-100 flex gap-2 p-4 items-center">
            <div>
                <FontAwesomeIcon icon={faCircle} size="xs"/>
            </div>
            <div className="ml-2">
              <p className="text-sm font-normal">Board Meeting</p>
              <p className="text-xs text-gray-500">Feb 22 at 6:00PM</p>
              <p className="text-xs text-gray-500">You've been added to the board meeting team</p>
            </div>

          </div>

        </div>

      </div>
    </div>
    </>
    )
}

export default DashBoardLayout;