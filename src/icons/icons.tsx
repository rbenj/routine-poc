import {
  LuArrowLeft,
  LuMinus,
  LuPencil,
  LuPlus,
  LuMoveRight,
  LuTimer,
  LuTrophy,
  LuX,
} from 'react-icons/lu';

interface IconProps {
  className?: string;
}

export function BackIcon({ className }: IconProps) {
  return <LuArrowLeft className={className} color="currentColor" />
}

export function CelebrationIcon({ className }: IconProps) {
  return <LuTrophy className={className} color="currentColor" />
}

export function CloseIcon({ className }: IconProps) {
  return <LuX className={className} color="currentColor" />
}

export function EditIcon({ className }: IconProps) {
  return <LuPencil className={className} color="currentColor" />
}

export function GoIcon({ className }: IconProps) {
  return <LuMoveRight className={className} color="currentColor" />
}

export function MinusIcon({ className }: IconProps) {
  return <LuMinus className={className} color="currentColor" />
}

export function TimerIcon({ className }: IconProps) {
  return <LuTimer className={className} color="currentColor" />
}

export function PlusIcon({ className }: IconProps) {
  return <LuPlus className={className} color="currentColor" />
}
