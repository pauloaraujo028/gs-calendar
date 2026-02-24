"use client";

import { Logo } from "./logo";
import UserAvatar from "./user-avatar";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
