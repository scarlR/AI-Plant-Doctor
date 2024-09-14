import React from 'react'
import { FaLeaf} from "react-icons/fa";

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white bg-opacity-90 z-10 relative">
      <a className="flex items-center justify-center" href="#">
        <FaLeaf className="h-6 w-6 text-green-600" />
        <span className="ml-2 text-lg font-semibold">AI Plant Doctor</span>
      </a>
    </header>
  );
}

export default Header