function RightContainer() {
  return (
    <div className="content-stretch flex flex-col h-full items-center justify-center px-[8px] py-[9px] relative rounded-[8px] shrink-0 w-[40px]" data-name="Right Container">
      <p className="font-['Lato:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#006bff] text-[14px] tracking-[0.0962px]">IDR</p>
    </div>
  );
}

function LeftContainer() {
  return (
    <div className="bg-[#006bff] content-stretch flex flex-col h-full items-center justify-center px-[10px] py-[9px] relative rounded-[8px] shrink-0 w-[40px]" data-name="Left Container">
      <p className="font-['Lato:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[14px] text-white tracking-[0.0962px]">%</p>
    </div>
  );
}

function ToggleContainer() {
  return (
    <div className="content-stretch flex items-center p-[4px] relative rounded-[10px] shrink-0" data-name="Toggle Container">
      <div aria-hidden="true" className="absolute border border-[#006bff] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center self-stretch">
        <RightContainer />
      </div>
      <div className="flex flex-row items-center self-stretch">
        <LeftContainer />
      </div>
    </div>
  );
}

function PercentageEmptyFieldContainer() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[10px]" data-name="Percentage Empty Field Container">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex font-['Lato:Regular',sans-serif] gap-[10px] items-center justify-end leading-[22px] not-italic px-[16px] py-[12px] relative text-[16px] text-right tracking-[0.11px] w-full">
          <p className="relative shrink-0 text-[#a9a9a9]">0</p>
          <p className="relative shrink-0 text-[#282828]">%</p>
        </div>
      </div>
    </div>
  );
}

export default function FieldContainer() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative size-full" data-name="Field Container">
      <ToggleContainer />
      <PercentageEmptyFieldContainer />
    </div>
  );
}