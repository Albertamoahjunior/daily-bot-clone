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
      <FontAwesomeIcon icon={icon} className={iconclassName} size='lg'/>
      <p className="text-white font-semibold text-xs uppercase flex-wrap">{navName}</p>
    </NavLink>
  )
}

