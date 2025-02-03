import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';


interface INavBarIcon{
    navName: string,
    icon: IconProp,
    iconclassName: string,
    whereTo: string
}


export const NavBarLink = ({navName, icon, iconclassName, whereTo}: INavBarIcon) => {

  return (
    <NavLink to={whereTo} className={({isActive}) => `flex gap-2 items-center text-center px-1  ${isActive? "border-l-2 border-white transition duration-500 ease-in-out": ""}`} >
      <FontAwesomeIcon icon={icon} className={iconclassName} />
      <p className="text-[#363538] font-bold text-xs uppercase">{navName}</p>
    </NavLink>
  )
}

