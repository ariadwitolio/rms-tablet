export default function TabMobile() {
  return (
    <div className="content-stretch flex items-start p-[3px] relative rounded-[8px] size-full" data-name="Tab Mobile">
      <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      <div className="bg-[#f3f7fe] flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[5px]" data-name="Component 1">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
            <p className="font-['Lato:Bold',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#006bff] text-[14px] text-center tracking-[0.0962px]">Tab 1</p>
          </div>
        </div>
      </div>
      <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[5px]" data-name="Component 2">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
            <p className="font-['Lato:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#282828] text-[14px] text-center tracking-[0.0962px]">Tab 2</p>
          </div>
        </div>
      </div>
      <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[5px]" data-name="Component 3">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
            <p className="font-['Lato:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#282828] text-[14px] text-center tracking-[0.0962px]">Tab 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}