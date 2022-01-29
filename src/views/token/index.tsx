
import { FC } from "react";

export const TokenView: FC = ({ }) => {

  return (
    <div className="hero mx-auto p-4 min-h-16 py-4">
      <div className="hero-content flex flex-col max-w-lg">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          SPL-Token
        </h1>
        <div className="p-2">
          {<p>&lt; your content &gt;</p>}
        </div>
      </div>
    </div>
  );
};
