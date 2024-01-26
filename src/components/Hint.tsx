import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface IProps {
    children : React.ReactNode
    description:string
    side? : "top" | "bottom" | "right" | "left"
    align? : "start" | "center" | "end"
    sideOffset? : number
}

const Hint = ({children,side = "bottom",align,description,sideOffset = 0}:IProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent align={align} side={side} sideOffset={sideOffset}
        className="text-xs max-w-[220px] break-words"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Hint;
