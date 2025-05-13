import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-white shadow-md">
      {/* Left side - Logo & Title */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo.png" // Replace with your logo path
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold text-gray-800">tsender</h1>
      </div>

      {/* Right side - GitHub link and Connect button */}
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/TheOnma/TSender"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-800"
        >
          <FaGithub size={24} />
        </a>
        <ConnectButton />
      </div>
    </header>
  );
}