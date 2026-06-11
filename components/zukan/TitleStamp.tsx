type Props = {
  title: string;
};

export function TitleStamp({ title }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="relative rotate-[-2deg] rounded-2xl border-2 border-dashed border-wood/50 bg-white/80 px-8 py-5 shadow-sm">
        <p className="text-center text-xs text-ink/40">最近のあなた</p>
        <p className="mt-1 text-center font-rounded text-xl font-bold text-ink">
          {title}
        </p>
      </div>
    </div>
  );
}
