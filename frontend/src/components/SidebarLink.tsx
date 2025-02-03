import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core';


interface ISidebarIcon{
    navName: string,
    icon: IconProp,
    iconclassName: string,
    whereTo: string
}


export const SidebarLink = ({navName, icon, iconclassName, whereTo}: ISidebarIcon) => {

  return (
    <NavLink to={whereTo} className={({isActive}) => ` text-center px-1  ${isActive? "border-l-2 border-white transition duration-500 ease-in-out": ""}`} >
      <FontAwesomeIcon icon={icon} className={iconclassName} />
      <p className="text-white font-normal text-xs uppercase">{navName}</p>
    </NavLink>
  )
}

