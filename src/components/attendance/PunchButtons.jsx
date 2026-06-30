import { LogIn, LogOut } from "lucide-react";
import Button from "../common/Button";

export default function PunchButtons({ today, onPunchIn, onPunchOut, punching }) {
  const hasPunchIn = Boolean(today?.punchIn);
  const hasPunchOut = Boolean(today?.punchOut);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          icon={LogIn}
          loading={punching === "in"}
          disabled={hasPunchIn || punching === "out"}
          onClick={onPunchIn}
          className="h-16 bg-[#10b65c] shadow-[0_8px_18px_rgba(16,182,92,0.22)] hover:bg-[#0da04f]"
        >
          <span className="flex flex-col leading-tight">
            <span>Punch In</span>
            <span className="text-xs font-bold">(Start Work)</span>
          </span>
        </Button>
        <Button
          icon={LogOut}
          loading={punching === "out"}
          disabled={!hasPunchIn || hasPunchOut || punching === "in"}
          onClick={onPunchOut}
          className="h-16 bg-[#f3303d] shadow-[0_8px_18px_rgba(243,48,61,0.22)] hover:bg-[#d92733]"
        >
          <span className="flex flex-col leading-tight">
            <span>Punch Out</span>
            <span className="text-xs font-bold">(End Work)</span>
          </span>
        </Button>
      </div>
      <p className="text-sm font-medium leading-6 text-[#51608f]">Note: Please ensure you punch in at the start and punch out at the end of your work day.</p>
    </div>
  );
}
